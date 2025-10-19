import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { closeSlidePanel } from "../components/SlidePanel/slide-panel.js";

export function initCasoForm() {
  const form = document.querySelector("#form-caso");
  if (!form) {
    console.warn("⚠️ Formulario de caso no encontrado en el DOM.");
    return;
  }

  console.log("✅ Listener del formulario de caso activo.");

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

    data.fecha_creacion = Timestamp.now();

    if (!data.nombre_caso || data.nombre_caso.trim() === "") {
      alert("⚠️ El nombre del caso es obligatorio.");
      resetButtonState();
      return;
    }

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

    try {
      const docRef = await addDoc(collection(db, "casos"), data);
      console.log("✅ Caso agregado con ID:", docRef.id);
      alert(`✅ Caso agregado con éxito (ID: ${docRef.id})`);
      form.reset();
      const idField = form.querySelector("#id_caso");
      if (idField) {
        idField.value = docRef.id;
      }
      closeSlidePanel();
    } catch (error) {
      console.error("❌ Error al guardar caso:", error);
      alert("❌ Error al guardar el caso. Revisa la consola para más detalles.");
    } finally {
      resetButtonState();
    }
  });
}
