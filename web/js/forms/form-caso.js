// web/js/forms/form-caso.js
import { db } from "../db.js";
import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { closeSlidePanel } from "../../components/SlidePanel/slide-panel.js";

let isSubmittingCaso = false;

export function initCasoForm() {
  const form = document.getElementById("form-caso");
  if (!form) {
    console.warn("⚠️ No se encontró el formulario de caso en el DOM.");
    return;
  }

  if (form.dataset.initialized === "true") return;
  form.dataset.initialized = "true";

  const submitButton = form.querySelector('button[type="submit"]');
  const idField = form.querySelector("#id_caso");
  if (idField) idField.value = "";

  populateVeterinarias(form.querySelector("#veterinaria_asignada"));
  populateHogares(form.querySelector("#id_hogar_de_paso"));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmittingCaso) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const nombre = form.nombre_caso?.value.trim() || "";
    const estado = form.estado?.value || "";
    const descripcion = form.diagnostico?.value.trim() || "";
    const montoMetaRaw = form.monto_meta?.value.trim() || "";

    if (!nombre || !estado || !descripcion || !montoMetaRaw) {
      alert("⚠️ Completa los campos obligatorios del caso.");
      return;
    }

    const montoMeta = Number.parseFloat(montoMetaRaw);
    if (Number.isNaN(montoMeta) || montoMeta < 0) {
      alert("⚠️ El monto meta debe ser un número válido.");
      return;
    }

    const restoreButton = prepareSubmitState(submitButton);
    isSubmittingCaso = true;

    const payload = {
      nombre_caso: nombre,
      descripcion,
      estado,
      fecha_ingreso: form.fecha_ingreso?.value || null,
      fecha_salida: form.fecha_salida?.value || null,
      veterinaria_asignada: form.veterinaria_asignada?.value || null,
      id_hogar_de_paso: form.id_hogar_de_paso?.value || null,
      monto_meta: montoMeta,
      archivo_url: form.archivo_url?.value.trim() || null,
      monto_recaudado: parseFloatValue(form.monto_recaudado?.value),
      gastos_totales: parseFloatValue(form.gastos_totales?.value),
      saldo_restante: parseFloatValue(form.saldo_restante?.value),
      fecha_creacion: serverTimestamp(),
    };

    sanitizePayload(payload);
    console.log("🐾 Guardando caso en Firestore:", payload);

    try {
      const docRef = await addDoc(collection(db, "casos"), payload);
      console.log(`✅ Caso registrado con ID: ${docRef.id}`);
      if (idField) idField.value = docRef.id;
      alert("✅ Registro guardado correctamente");
      form.reset();
      await closeSlidePanel();
    } catch (error) {
      console.error("❌ Error al guardar caso:", error);
      alert("❌ No se pudo guardar el caso. Intenta nuevamente.");
    } finally {
      restoreButton();
      isSubmittingCaso = false;
    }
  });
}

async function populateVeterinarias(select) {
  if (!select) return;
  select.disabled = true;
  select.innerHTML = '<option value="">Cargando veterinarias...</option>';

  try {
    const snapshot = await getDocs(
      query(collection(db, "proveedores"), where("tipo_proveedor", "==", "veterinaria"))
    );

    const options = ['<option value="">Seleccionar</option>'];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      options.push(
        `<option value="${docSnap.id}">${data.nombre_proveedor || "Sin nombre"}</option>`
      );
    });

    select.innerHTML = options.join("");
  } catch (error) {
    console.error("❌ Error al cargar veterinarias:", error);
    select.innerHTML = '<option value="">No se pudieron cargar</option>';
  } finally {
    select.disabled = false;
  }
}

async function populateHogares(select) {
  if (!select) return;
  select.disabled = true;
  select.innerHTML = '<option value="">Cargando hogares...</option>';

  try {
    const snapshot = await getDocs(collection(db, "hogares_paso"));
    const options = ['<option value="">Seleccionar</option>'];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      options.push(
        `<option value="${docSnap.id}">${data.nombre_hogar || "Hogar sin nombre"}</option>`
      );
    });

    select.innerHTML = options.join("");
  } catch (error) {
    console.error("❌ Error al cargar hogares de paso:", error);
    select.innerHTML = '<option value="">No se pudieron cargar</option>';
  } finally {
    select.disabled = false;
  }
}

function parseFloatValue(value) {
  if (value === undefined || value === null || `${value}`.trim() === "") return null;
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
