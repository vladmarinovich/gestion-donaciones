import { db } from "../db.js";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  doc,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { closeSlidePanel } from "../../components/SlidePanel/slide-panel.js";

export async function initGastoForm() {
  const form = document.querySelector("#form-gasto");
  if (!form) {
    console.warn("⚠️ Formulario de gasto no encontrado en el DOM.");
    return;
  }

  if (form.dataset.initialized === "true") {
    return;
  }

  const proveedorSelect = form.querySelector("#id_proveedor");
  const casoSelect = form.querySelector("#id_caso");

  await populateSelects({ proveedorSelect, casoSelect });

  console.log("✅ Formulario de gasto inicializado correctamente.");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const resetButtonState = () => {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Guardar";
      }
    };

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Guardando...";
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const requiredFields = [
      "nombre_gasto",
      "monto",
      "medio_pago",
      "estado",
      "id_proveedor",
      "id_caso",
      "fecha_pago",
    ];

    const missingField = requiredFields.find((field) => {
      const value = data[field];
      return !value || String(value).trim() === "";
    });

    if (missingField) {
      alert("⚠️ Por favor completa todos los campos obligatorios.");
      resetButtonState();
      return;
    }

    const montoNumber = Number(data.monto);
    if (Number.isNaN(montoNumber)) {
      alert("⚠️ El monto ingresado no es válido.");
      resetButtonState();
      return;
    }

    const proveedorId = data.id_proveedor;
    const casoId = data.id_caso;
    const fechaPagoInput = data.fecha_pago;

    Object.keys(data).forEach((key) => {
      if (typeof data[key] === "string") {
        const trimmed = data[key].trim();
        if (trimmed === "") {
          delete data[key];
        } else {
          data[key] = trimmed;
        }
      }
    });

    data.monto = montoNumber;
    data.id_proveedor = doc(db, "proveedores", proveedorId);
    data.id_caso = doc(db, "casos", casoId);
    data.fecha_creacion = serverTimestamp();
    data.fecha_pago = serverTimestamp();
    data.fecha_pago_input = fechaPagoInput;

    delete data.id_gasto;

    try {
      const docRef = await addDoc(collection(db, "gastos"), data);
      console.log("✅ Gasto guardado correctamente:", docRef.id);

      const idField = form.querySelector("#id_gasto");
      if (idField) {
        idField.value = docRef.id;
      }

      form.reset();
      if (proveedorSelect) proveedorSelect.value = "";
      if (casoSelect) casoSelect.value = "";
      closeSlidePanel();
    } catch (error) {
      console.error("❌ Error al guardar gasto:", error);
      alert("❌ Error al guardar gasto.");
    } finally {
      resetButtonState();
    }
  });

  form.dataset.initialized = "true";
}

async function populateSelects({ proveedorSelect, casoSelect }) {
  try {
    await Promise.all([
      populateSelect(proveedorSelect, "proveedores", "nombre_proveedor"),
      populateSelect(casoSelect, "casos", "nombre_caso"),
    ]);
  } catch (error) {
    console.error("❌ Error al cargar opciones del formulario de gasto:", error);
  }
}

async function populateSelect(selectElement, collectionName, labelKey) {
  if (!selectElement) return;

  const placeholder =
    selectElement.querySelector("option[value='']")?.textContent ??
    "Seleccionar opción";

  while (selectElement.options.length > 1) {
    selectElement.remove(1);
  }

  const snapshot = await getDocs(collection(db, collectionName));
  if (snapshot.empty) {
    const option = document.createElement("option");
    option.value = "__empty__";
    option.disabled = true;
    option.textContent = "Sin registros disponibles";
    selectElement.appendChild(option);
    selectElement.disabled = true;
    selectElement.value = "";
    selectElement.options[0].textContent = placeholder;
    return;
  }

  const fragment = document.createDocumentFragment();
  snapshot.forEach((documentSnapshot) => {
    const option = document.createElement("option");
    option.value = documentSnapshot.id;
    const itemData = documentSnapshot.data() ?? {};
    option.textContent =
      itemData[labelKey] || itemData.nombre || documentSnapshot.id;
    fragment.appendChild(option);
  });

  selectElement.appendChild(fragment);
  selectElement.value = "";
  selectElement.options[0].textContent = placeholder;
  selectElement.disabled = false;
}
