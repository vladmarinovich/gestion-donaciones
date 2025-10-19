import { db } from "./firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Función genérica para guardar cualquier formulario
export async function saveFormData(formId, collectionName) {
  const form = document.getElementById(formId);
  if (!form) return console.error(`❌ Formulario ${formId} no encontrado.`);

  // Obtener los datos
  const formData = new FormData(form);
  const data = {};

  formData.forEach((value, key) => {
    data[key] = value.trim ? value.trim() : value;
  });

  // Agregar timestamp automático
  data.fecha_creacion = serverTimestamp();

  try {
    await addDoc(collection(db, collectionName), data);
    alert("✅ Registro guardado con éxito");
    form.reset();
  } catch (error) {
    console.error("❌ Error al guardar:", error);
    alert("Error al guardar los datos.");
  }
}