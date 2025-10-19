import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { closeSlidePanel } from "../components/SlidePanel/slide-panel.js";

export function initDonanteForm() {
  const form = document.querySelector("#form-donante");

  if (!form) {
    console.warn("⚠️ Formulario de donante no encontrado en el DOM.");
    return;
  }

  console.log("✅ Listener del formulario de donante activo.");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data.consentimiento = formData.has("consentimiento");
    data.fecha_registro = Timestamp.now();

    if (!data.nombre_donante || data.nombre_donante.trim() === "") {
      alert("⚠️ El nombre del donante es obligatorio.");
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
      const docRef = await addDoc(collection(db, "donantes"), data);
      console.log("✅ Donante agregado con ID:", docRef.id);

      alert(`✅ Donante agregado con éxito (ID: ${docRef.id})`);
      form.reset();
      const idField = form.querySelector("#id_donante");
      if (idField) {
        idField.value = docRef.id;
      }
      closeSlidePanel();
    } catch (error) {
      console.error("❌ Error al guardar donante:", error);
      alert("❌ Error al guardar el donante. Revisa la consola para más detalles.");
    }
  });
}
