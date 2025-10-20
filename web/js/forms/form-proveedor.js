// web/js/forms/form-proveedor.js
import { db } from "../db.js";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { closeSlidePanel } from "../../components/SlidePanel/slide-panel.js";

let isSubmittingProveedor = false;

export function initProveedorForm() {
  const form = document.getElementById("form-proveedor");
  if (!form) {
    console.warn("⚠️ No se encontró el formulario de proveedor en el DOM.");
    return;
  }

  if (form.dataset.initialized === "true") return;
  form.dataset.initialized = "true";

  const submitButton = form.querySelector('button[type="submit"]');
  const idField = form.querySelector("#id_proveedor");
  if (idField) idField.value = "";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmittingProveedor) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const nombre = form.nombre_proveedor?.value.trim() || "";
    const correo = form.correo?.value.trim() || "";
    const telefono = form.telefono?.value.trim() || "";

    if (!nombre || !correo || !telefono) {
      alert("⚠️ Completa los campos obligatorios del proveedor.");
      return;
    }

    const restoreButton = prepareSubmitState(submitButton);
    isSubmittingProveedor = true;

    const payload = {
      nombre_proveedor: nombre,
      tipo_proveedor: form.tipo_proveedor?.value || null,
      correo,
      telefono,
      nit: form.nit?.value.trim() || null,
      contacto: form.contacto?.value.trim() || null,
      ciudad: form.ciudad?.value.trim() || null,
      notas: form.notas?.value.trim() || null,
      fecha_registro: serverTimestamp(),
    };

    sanitizePayload(payload);
    console.log("🏪 Guardando proveedor en Firestore:", payload);

    try {
      const docRef = await addDoc(collection(db, "proveedores"), payload);
      console.log(`✅ Proveedor registrado con ID: ${docRef.id}`);
      if (idField) idField.value = docRef.id;
      alert("✅ Registro guardado correctamente");
      form.reset();
      await closeSlidePanel();
    } catch (error) {
      console.error("❌ Error al guardar proveedor:", error);
      alert("❌ No se pudo guardar el proveedor. Intenta nuevamente.");
    } finally {
      restoreButton();
      isSubmittingProveedor = false;
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
