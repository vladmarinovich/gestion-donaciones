import { db } from "../firebase-config.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

export function initDonacionForm() {
  const form = document.getElementById("form-donacion");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const data = {
        nombre_donante: form.nombre_donante.value,
        id_donante: form.id_donante.value,
        id_caso: form.id_caso.value,
        monto: parseFloat(form.monto.value),
        metodo_pago: form.metodo_pago.value,
        fecha_donacion: serverTimestamp(),
        notas: form.notas.value,
      };

      await addDoc(collection(db, "donaciones"), data);
      alert("✅ Donación registrada correctamente");
      form.reset();
    } catch (err) {
      console.error("❌ Error guardando donación:", err);
      alert("Error al guardar la donación.");
    }
  });
}