import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { closeSlidePanel } from "../components/SlidePanel/slide-panel.js";

export function initProveedorForm() {
  const form = document.querySelector("#form-proveedor");
  if (!form) {
    console.warn("⚠️ Formulario de proveedor no encontrado en el DOM.");
    return;
  }

  console.log("✅ Listener del formulario de proveedor activo.");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data.fecha_registro = Timestamp.now();

    if (!data.nombre_proveedor || data.nombre_proveedor.trim() === "") {
      alert("⚠️ El nombre del proveedor es obligatorio.");
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
      const docRef = await addDoc(collection(db, "proveedores"), data);
      console.log("✅ Proveedor agregado con ID:", docRef.id);
      alert(`✅ Proveedor agregado con éxito (ID: ${docRef.id})`);
      form.reset();
      const idField = form.querySelector("#id_proveedor");
      if (idField) {
        idField.value = docRef.id;
      }
      closeSlidePanel();
    } catch (error) {
      console.error("❌ Error al guardar proveedor:", error);
      alert("❌ Error al guardar el proveedor. Revisa la consola para más detalles.");
    }
  });
}
