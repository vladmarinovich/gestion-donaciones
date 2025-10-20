// web/js/metrics/metrics-casos.js
// 📊 Módulo de métricas para la vista de Casos
// Extrae, calcula y devuelve información agregada desde Firestore

import { db } from "../firebase-config.js";
import {
  collection,
  getDocs,
  query,
  where,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";

// 🟢 Obtener todos los casos
export async function getAllCasos() {
  const snapshot = await getDocs(collection(db, "casos"));
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data(),
  }));
}

// 🟢 Calcular el número de casos activos
export async function getCasosActivos() {
  const snapshot = await getDocs(query(collection(db, "casos"), where("estado", "==", "activo")));
  return snapshot.size;
}

// 🟢 Calcular el número de casos cerrados
export async function getCasosCerrados() {
  const snapshot = await getDocs(query(collection(db, "casos"), where("estado", "==", "cerrado")));
  return snapshot.size;
}

// 🟢 Calcular el monto total a recaudar (suma de monto_meta)
export async function getMontoTotalMeta() {
  const casos = await getAllCasos();
  return casos.reduce((acc, c) => acc + (parseFloat(c.monto_meta) || 0), 0);
}

// 🟢 Calcular monto recaudado por cada caso (sumando donaciones relacionadas)
async function getMontoRecaudadoPorCaso(casoId) {
  const q = query(collection(db, "donaciones"), where("id_caso", "==", casoId));
  const snapshot = await getDocs(q);
  let total = 0;
  snapshot.forEach((d) => {
    total += parseFloat(d.data().monto) || 0;
  });
  return total;
}

// 🟢 Calcular promedio general de cumplimiento (%)
export async function getPromedioCumplimiento() {
  const casos = await getAllCasos();
  let totalPorcentaje = 0;
  let casosValidos = 0;

  for (const c of casos) {
    const meta = parseFloat(c.monto_meta) || 0;
    if (meta > 0) {
      const recaudado = await getMontoRecaudadoPorCaso(c.id);
      const porcentaje = (recaudado / meta) * 100;
      totalPorcentaje += porcentaje;
      casosValidos++;
    }
  }

  return casosValidos ? totalPorcentaje / casosValidos : 0;
}

// 🟢 Obtener detalles de casos con campos calculados
export async function getDetallesCasos() {
  const casos = await getAllCasos();
  const detalles = [];

  for (const c of casos) {
    const recaudado = await getMontoRecaudadoPorCaso(c.id);
    const porcentaje = c.monto_meta > 0 ? (recaudado / c.monto_meta) * 100 : 0;

    detalles.push({
      id: c.id,
      nombre: c.nombre_caso || "Sin nombre",
      estado: c.estado || "No definido",
      monto_meta: c.monto_meta || 0,
      monto_recaudado: recaudado,
      porcentaje_cumplimiento: porcentaje.toFixed(2) + "%",
      fecha_creacion: c.fecha_creacion || "Sin fecha",
    });
  }

  return detalles;
}

// 🟢 Obtener todas las métricas consolidadas
export async function getResumenCasos() {
  const [activos, cerrados, metaTotal, cumplimientoPromedio] = await Promise.all([
    getCasosActivos(),
    getCasosCerrados(),
    getMontoTotalMeta(),
    getPromedioCumplimiento(),
  ]);

  return {
    activos,
    cerrados,
    metaTotal,
    cumplimientoPromedio: cumplimientoPromedio.toFixed(2),
  };
}