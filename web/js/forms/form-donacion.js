import { db } from "../firebase-config.js";
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  doc,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { closeSlidePanel } from "../../components/SlidePanel/slide-panel.js";

export async function initDonacionForm() {
  const form = document.querySelector("#form-donacion");
  if (!form) {
    console.warn("⚠️ Formulario de donación no encontrado en el DOM.");
    return;
  }

  const donanteSelect = form.querySelector("#id_donante");
  const casoSelect = form.querySelector("#id_caso");

  await populateSelects({ donanteSelect, casoSelect });

  console.log("✅ Formulario de donación inicializado correctamente.");

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

    const medioPagoField = formData.has("medio_pago") ? "medio_pago" : "metodo_pago";

    const requiredFields = ["monto", medioPagoField, "id_donante", "id_caso", "fecha_donacion"];
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

    const donanteId = data.id_donante;
    const casoId = data.id_caso;

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
    data.id_donante = doc(db, "donantes", donanteId);
    data.id_caso = doc(db, "casos", casoId);
    data.fecha_creacion = serverTimestamp();
    data.fecha_donacion = serverTimestamp();

    delete data.id_donacion;

    try {
      const docRef = await addDoc(collection(db, "donaciones"), data);
      console.log("✅ Donación agregada con ID:", docRef.id);
      alert("✅ Donación registrada correctamente.");

      form.reset();
      if (donanteSelect) donanteSelect.value = "";
      if (casoSelect) casoSelect.value = "";
      const idField = form.querySelector("#id_donacion");
      if (idField) {
        idField.value = docRef.id;
      }
      closeSlidePanel();
    } catch (error) {
      console.error("❌ Error al guardar la donación:", error);
      alert("❌ Error al guardar la donación.");
    } finally {
      resetButtonState();
    }
  });
}

async function populateSelects({ donanteSelect, casoSelect }) {
  try {
    await Promise.all([
      populateSelect(donanteSelect, "donantes", "nombre_donante"),
      populateSelect(casoSelect, "casos", "nombre_caso"),
    ]);
  } catch (error) {
    console.error("❌ Error al cargar opciones del formulario de donación:", error);
  }
}

async function populateSelect(selectElement, collectionName, labelKey) {
  if (!selectElement) return;

  const placeholderText =
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
    selectElement.options[0].textContent = placeholderText;
    return;
  }

  const fragment = document.createDocumentFragment();
  snapshot.forEach((documentSnapshot) => {
    const option = document.createElement("option");
    option.value = documentSnapshot.id;
    const data = documentSnapshot.data() ?? {};
    option.textContent = data[labelKey] || data.nombre || documentSnapshot.id;
    fragment.appendChild(option);
  });

  selectElement.appendChild(fragment);
  selectElement.value = "";
  selectElement.options[0].textContent = placeholderText;
  selectElement.disabled = false;
}
