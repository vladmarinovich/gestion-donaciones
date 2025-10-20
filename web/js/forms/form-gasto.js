// web/js/forms/form-gasto.js
import { db } from "../db.js";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { closeSlidePanel } from "../../components/SlidePanel/slide-panel.js";

let isSubmittingGasto = false;

export function initGastoForm() {
  const form = document.getElementById("form-gasto");
  if (!form) {
    console.warn("⚠️ No se encontró el formulario de gasto en el DOM.");
    return;
  }

  if (form.dataset.initialized === "true") return;
  form.dataset.initialized = "true";

  const submitButton = form.querySelector('button[type="submit"]');
  const idField = form.querySelector("#id_gasto");
  if (idField) idField.value = "";

  populateCasos(form.querySelector("#id_caso"));
  populateProveedores(form.querySelector("#id_proveedor"));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmittingGasto) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const montoRaw = form.monto?.value.trim() || "";
    const monto = Number.parseFloat(montoRaw);
    if (Number.isNaN(monto) || monto <= 0) {
      alert("⚠️ El monto debe ser un número mayor que cero.");
      return;
    }

    const descripcion = form.nombre_gasto?.value.trim() || "";
    const idProveedor = form.id_proveedor?.value || "";
    const idCaso = form.id_caso?.value || "";
    const fechaPago = form.fecha_pago?.value || "";

    if (!descripcion || !idProveedor || !idCaso || !fechaPago) {
      alert("⚠️ Completa los campos obligatorios del gasto.");
      return;
    }

    const restoreButton = prepareSubmitState(submitButton);
    isSubmittingGasto = true;

    const payload = {
      descripcion,
      nombre_gasto: descripcion,
      id_proveedor: idProveedor,
      id_caso: idCaso,
      fecha_gasto: fechaPago,
      fecha_pago: fechaPago,
      monto,
      medio_pago: form.medio_pago?.value || null,
      estado: form.estado?.value || "pendiente",
      comprobante_url: form.comprobante_url?.value.trim() || null,
      notas: form.notas?.value.trim() || null,
      fecha_registro: serverTimestamp(),
    };

    sanitizePayload(payload);
    console.log("💸 Guardando gasto en Firestore:", payload);

    try {
      const docRef = await addDoc(collection(db, "gastos"), payload);
      console.log(`✅ Gasto registrado con ID: ${docRef.id}`);
      if (idField) idField.value = docRef.id;
      alert("✅ Registro guardado correctamente");
      form.reset();
      await closeSlidePanel();
    } catch (error) {
      console.error("❌ Error al guardar gasto:", error);
      alert("❌ No se pudo guardar el gasto. Intenta nuevamente.");
    } finally {
      restoreButton();
      isSubmittingGasto = false;
    }
  });
}

async function populateCasos(select) {
  if (!select) return;
  select.disabled = true;
  select.innerHTML = '<option value="">Cargando casos...</option>';

  try {
    const snapshot = await getDocs(query(collection(db, "casos"), orderBy("nombre_caso", "asc")));
    const options = ['<option value="">Seleccionar caso</option>'];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      options.push(
        `<option value="${docSnap.id}">${data.nombre_caso || "Caso sin nombre"}</option>`
      );
    });

    select.innerHTML = options.join("");
  } catch (error) {
    console.error("❌ Error al cargar casos:", error);
    select.innerHTML = '<option value="">No se pudieron cargar</option>';
  } finally {
    select.disabled = false;
  }
}

async function populateProveedores(select) {
  if (!select) return;
  select.disabled = true;
  select.innerHTML = '<option value="">Cargando proveedores...</option>';

  try {
    const snapshot = await getDocs(
      query(collection(db, "proveedores"), orderBy("nombre_proveedor", "asc"))
    );
    const options = ['<option value="">Seleccionar proveedor</option>'];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      options.push(
        `<option value="${docSnap.id}">${data.nombre_proveedor || "Proveedor sin nombre"}</option>`
      );
    });

    select.innerHTML = options.join("");
  } catch (error) {
    console.error("❌ Error al cargar proveedores:", error);
    select.innerHTML = '<option value="">No se pudieron cargar</option>';
  } finally {
    select.disabled = false;
  }
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
