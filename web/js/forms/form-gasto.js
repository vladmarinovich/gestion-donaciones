// ✅ nuevo web/js/forms/form-gasto.js
import { db } from "../firebase-config.js"; // ✅ nuevo
import { collection, addDoc, Timestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js"; // ✅ nuevo
import { closeSlidePanel } from "../components/SlidePanel/slide-panel.js"; // ✅ nuevo

export function initGastoForm() { // ✅ nuevo
  const form = document.getElementById("form-gasto"); // ✅ nuevo

  if (!form) { // ✅ nuevo
    console.warn("⚠️ Formulario de gasto no encontrado en el DOM."); // ✅ nuevo
    return; // ✅ nuevo
  } // ✅ nuevo

  console.log("✅ Listener del formulario de gasto activo."); // ✅ nuevo

  form.addEventListener("submit", async (event) => { // ✅ nuevo
    event.preventDefault(); // ✅ nuevo

    const formData = new FormData(form); // ✅ nuevo
    const data = Object.fromEntries(formData.entries()); // ✅ nuevo

    if (!data.fecha_pago) { // ✅ nuevo
      alert("⚠️ Debes seleccionar una fecha de pago."); // ✅ nuevo
      return; // ✅ nuevo
    } // ✅ nuevo

    data.fecha_pago = Timestamp.fromDate(new Date(`${data.fecha_pago}T00:00:00`)); // ✅ nuevo
    data.monto = data.monto ? Number(data.monto) : undefined; // ✅ nuevo
    data.fecha_registro = Timestamp.now(); // ✅ nuevo

    if (!data.id_caso?.trim()) { // ✅ nuevo
      alert("⚠️ Debes seleccionar un caso asociado."); // ✅ nuevo
      return; // ✅ nuevo
    } // ✅ nuevo

    if (!data.id_proveedor?.trim()) { // ✅ nuevo
      alert("⚠️ Debes seleccionar un proveedor."); // ✅ nuevo
      return; // ✅ nuevo
    } // ✅ nuevo

    Object.keys(data).forEach((key) => { // ✅ nuevo
      if (data[key] === undefined || (typeof data[key] === "string" && data[key].trim() === "")) { // ✅ nuevo
        delete data[key]; // ✅ nuevo
      } // ✅ nuevo
    }); // ✅ nuevo

    try { // ✅ nuevo
      const docRef = await addDoc(collection(db, "gastos"), data); // ✅ nuevo
      console.log("✅ Gasto agregado con ID:", docRef.id); // ✅ nuevo

      const idField = document.getElementById("id_gasto"); // ✅ nuevo
      if (idField) idField.value = docRef.id; // ✅ nuevo

      alert(`✅ Gasto agregado con éxito (ID: ${docRef.id})`); // ✅ nuevo
      form.reset(); // ✅ nuevo
      closeSlidePanel(); // ✅ nuevo
    } catch (error) { // ✅ nuevo
      console.error("❌ Error al guardar gasto:", error); // ✅ nuevo
      alert("❌ Error al guardar el gasto. Revisa la consola para más detalles."); // ✅ nuevo
    } // ✅ nuevo
  }); // ✅ nuevo
} // ✅ nuevo
