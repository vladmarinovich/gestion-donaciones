import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { closeSlidePanel } from "../components/SlidePanel/slide-panel.js";

export function initHogarForm() {
  const form = document.querySelector("#form-hogar");
  if (!form) {
    console.warn("⚠️ Formulario de hogar no encontrado en el DOM.");
    return;
  }

  console.log("✅ Listener del formulario de hogar activo.");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const nombreHogar = (data.nombre_hogar || "").trim();
    const responsableValue = (data.responsable || data.contacto || "").trim();

    if (!nombreHogar || !responsableValue) {
      alert(
        "Por favor completa los campos obligatorios: nombre del hogar y responsable."
      );
      return;
    }

    data.nombre_hogar = nombreHogar;
    data.responsable = responsableValue;
    data.fecha_registro = Timestamp.now();
    data.cupo_maximo =
      data.cupo_maximo && !Number.isNaN(Number(data.cupo_maximo))
        ? Number(data.cupo_maximo)
        : undefined;
    data.tarifa_diaria =
      data.tarifa_diaria && !Number.isNaN(Number(data.tarifa_diaria))
        ? Number(data.tarifa_diaria)
        : undefined;

    Object.keys(data).forEach((key) => {
      const value = data[key];
      if (
        value === undefined ||
        (typeof value === "string" && value.trim() === "")
      ) {
        delete data[key];
      }
    });

    try {
      const docRef = await addDoc(collection(db, "hogares_paso"), data);
      console.log("✅ Hogar agregado con ID:", docRef.id);
      alert("Hogar registrado correctamente.");
      form.reset();
      const idField = form.querySelector("#id_hogar");
      if (idField) {
        idField.value = docRef.id;
      }
      closeSlidePanel();
    } catch (error) {
      console.error("Error al guardar el hogar:", error);
      alert("Ocurrió un error al guardar el hogar. Intenta nuevamente.");
    }
  });
}
