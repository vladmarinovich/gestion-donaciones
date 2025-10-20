// web/js/forms/form-donacion.js
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

let isSubmittingDonacion = false;

export function initDonacionForm() {
  const form = document.getElementById("form-donacion");
  if (!form) {
    console.warn("⚠️ No se encontró el formulario de donación en el DOM.");
    return;
  }

  if (form.dataset.initialized === "true") return;
  form.dataset.initialized = "true";

  const submitButton = form.querySelector('button[type="submit"]');
  const idField = form.querySelector("#id_donacion");
  if (idField) idField.value = "";

  populateDonantes(form.querySelector("#id_donante"));
  populateCasos(form.querySelector("#id_caso"));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isSubmittingDonacion) return;

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

    const idDonante = form.id_donante?.value || "";
    const idCaso = form.id_caso?.value || "";
    const metodoPago = form.medio_pago?.value || "";
    const fechaDonacion = form.fecha_donacion?.value || "";

    if (!idDonante || !idCaso || !metodoPago || !fechaDonacion) {
      alert("⚠️ Completa todos los campos obligatorios de la donación.");
      return;
    }

    const restoreButton = prepareSubmitState(submitButton);
    isSubmittingDonacion = true;

    const payload = {
      monto,
      id_donante: idDonante,
      id_caso: idCaso,
      metodo_pago: metodoPago,
      medio_pago: metodoPago,
      fecha_donacion: fechaDonacion,
      estado: form.estado?.value || "pendiente",
      comprobante_url: form.comprobante_url?.value.trim() || null,
      notas: form.notas?.value.trim() || null,
      fecha_registro: serverTimestamp(),
    };

    sanitizePayload(payload);
    console.log("💝 Guardando donación en Firestore:", payload);

    try {
      const docRef = await addDoc(collection(db, "donaciones"), payload);
      console.log(`✅ Donación registrada con ID: ${docRef.id}`);
      if (idField) idField.value = docRef.id;
      alert("✅ Registro guardado correctamente");
      form.reset();
      await closeSlidePanel();
    } catch (error) {
      console.error("❌ Error al guardar donación:", error);
      alert("❌ No se pudo guardar la donación. Intenta nuevamente.");
    } finally {
      restoreButton();
      isSubmittingDonacion = false;
    }
  });
}

async function populateDonantes(select) {
  if (!select) return;
  select.disabled = true;
  select.innerHTML = '<option value="">Cargando donantes...</option>';

  try {
    const snapshot = await getDocs(query(collection(db, "donantes"), orderBy("nombre_donante", "asc")));
    const options = ['<option value="">Seleccionar donante</option>'];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      options.push(
        `<option value="${docSnap.id}">${data.nombre_donante || "Donante sin nombre"}</option>`
      );
    });

    select.innerHTML = options.join("");
  } catch (error) {
    console.error("❌ Error al cargar donantes:", error);
    select.innerHTML = '<option value="">No se pudieron cargar</option>';
  } finally {
    select.disabled = false;
  }
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
