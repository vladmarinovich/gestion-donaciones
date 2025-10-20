// web/js/forms/form-hogar.js
import { db } from "../db.js";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { closeSlidePanel } from "../../components/SlidePanel/slide-panel.js";

let isSubmittingHogar = false;

export function initHogarForm() {
  const form = document.getElementById("form-hogar");
  if (!form) {
    console.warn("⚠️ No se encontró el formulario de hogar en el DOM.");
    return;
  }

  if (form.dataset.initialized === "true") return;
  form.dataset.initialized = "true";

  // Aseguramos los campos obligatorios requeridos por la especificación
  form.contacto?.setAttribute("required", "true");
  form.cupo_maximo?.setAttribute("required", "true");

  const submitButton = form.querySelector('button[type="submit"]');
  const idField = form.querySelector("#id_hogar");
  if (idField) idField.value = "";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmittingHogar) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const nombre = form.nombre_hogar?.value.trim() || "";
    const responsable = form.contacto?.value.trim() || "";
    const capacidadRaw = form.cupo_maximo?.value.trim() || "";
    const disponibleField = form.disponible;
    const disponible = disponibleField
      ? disponibleField.type === "checkbox"
        ? disponibleField.checked
        : disponibleField.value === "true" || disponibleField.value === "1"
      : true;

    if (!nombre || !responsable || !capacidadRaw) {
      alert("⚠️ Completa los campos obligatorios del hogar.");
      return;
    }

    const capacidad = Number.parseInt(capacidadRaw, 10);
    if (Number.isNaN(capacidad) || capacidad < 0) {
      alert("⚠️ La capacidad debe ser un número válido mayor o igual a 0.");
      return;
    }

    const restoreButton = prepareSubmitState(submitButton);
    isSubmittingHogar = true;

    const payload = {
      nombre_hogar: nombre,
      tipo_hogar: form.tipo_hogar?.value || null,
      responsable,
      capacidad,
      disponible,
      telefono: form.telefono?.value.trim() || null,
      correo: form.correo?.value.trim() || null,
      ciudad: form.ciudad?.value.trim() || null,
      pais: form.pais?.value.trim() || null,
      tarifa_diaria: parseFloatValue(form.tarifa_diaria?.value),
      desempeno: form.desempeno?.value || null,
      notas: form.notas?.value.trim() || null,
      fecha_registro: serverTimestamp(),
    };

    sanitizePayload(payload);
    console.log("🏠 Guardando hogar de paso en Firestore:", payload);

    try {
      const docRef = await addDoc(collection(db, "hogares_paso"), payload);
      console.log(`✅ Hogar registrado con ID: ${docRef.id}`);
      if (idField) idField.value = docRef.id;
      alert("✅ Registro guardado correctamente");
      form.reset();
      await closeSlidePanel();
    } catch (error) {
      console.error("❌ Error al guardar hogar de paso:", error);
      alert("❌ No se pudo guardar el hogar. Intenta nuevamente.");
    } finally {
      restoreButton();
      isSubmittingHogar = false;
    }
  });
}

function parseFloatValue(value) {
  if (!value) return null;
  const parsed = Number.parseFloat(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function prepareSubmitState(button) {
  if (!button) return () => {};
  const originalText = button.textContent;
  button.disabled = true;
  button.textContent = "Guardando...";
  return () => {
    button.disabled = false;
    button.textContent = originalText || "Guardar";
  };
}

function sanitizePayload(payload) {
  Object.keys(payload).forEach((key) => {
    const value = payload[key];
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed === "") {
        delete payload[key];
      } else {
        payload[key] = trimmed;
      }
    } else if (value === null || value === undefined) {
      delete payload[key];
    }
  });
}
