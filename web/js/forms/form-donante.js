// web/js/forms/form-donante.js
import { db } from "../db.js";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { closeSlidePanel } from "../../components/SlidePanel/slide-panel.js";

let isSubmittingDonante = false;

export function initDonanteForm() {
  const form = document.getElementById("form-donante");
  if (!form) {
    console.warn("⚠️ No se encontró el formulario de donante en el DOM.");
    return;
  }

  if (form.dataset.initialized === "true") return;
  form.dataset.initialized = "true";

  const submitButton = form.querySelector('button[type="submit"]');
  const idField = form.querySelector("#id_donante");
  if (idField) idField.value = "";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmittingDonante) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const nombre = form.nombre_donante?.value.trim() || "";
    const tipoDonante = form.tipo_donante?.value.trim() || "";
    const correo = form.correo?.value.trim() || "";
    const telefono = form.telefono?.value.trim() || "";

    if (!nombre || !tipoDonante || !correo || !telefono) {
      alert("⚠️ Completa los campos obligatorios del donante.");
      return;
    }

    if (!form.consentimiento?.checked) {
      alert("⚠️ Debes aceptar el uso de datos personales.");
      return;
    }

    const restoreButton = prepareSubmitState(submitButton);
    isSubmittingDonante = true;

    const payload = {
      nombre_donante: nombre,
      tipo_donante: tipoDonante,
      correo,
      telefono,
      tipo_id: form.tipo_id?.value?.trim() || null,
      identificacion: form.identificacion?.value?.trim() || null,
      ciudad: form.ciudad?.value?.trim() || null,
      pais: form.pais?.value?.trim() || null,
      canal_origen: form.canal_origen?.value || null,
      consentimiento: true,
      archivo_url: form.archivo_url?.value?.trim() || null,
      notas: form.notas?.value?.trim() || null,
      fecha_registro: serverTimestamp(),
    };

    sanitizePayload(payload);
    console.log("📝 Guardando donante en Firestore:", payload);

    try {
      const docRef = await addDoc(collection(db, "donantes"), payload);
      console.log(`✅ Donante registrado con ID: ${docRef.id}`);
      if (idField) idField.value = docRef.id;
      alert("✅ Registro guardado correctamente");
      form.reset();
      await closeSlidePanel();
    } catch (error) {
      console.error("❌ Error al guardar donante:", error);
      alert("❌ No se pudo guardar el donante. Intenta nuevamente.");
    } finally {
      restoreButton();
      isSubmittingDonante = false;
    }
  });
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
