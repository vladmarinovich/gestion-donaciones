// web/js/metrics/dashboard-metrics.js

import { db } from "../db.js";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

/* ======================================================
   📊 FUNCIONES FINANCIERAS
====================================================== */

export async function getMontoTotalDonado() {
  const snapshot = await getDocs(collection(db, "donaciones"));
  let total = 0;
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.monto) total += Number(data.monto);
  });
  return total;
}

export async function getMontoTotalGastado() {
  const snapshot = await getDocs(collection(db, "gastos"));
  let total = 0;
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.monto) total += Number(data.monto);
  });
  return total;
}

export async function getBalanceActual() {
  const totalDonado = await getMontoTotalDonado();
  const totalGastado = await getMontoTotalGastado();
  return totalDonado - totalGastado;
}

export async function getTotalRecaudar() {
  const snapshot = await getDocs(collection(db, "casos"));
  let total = 0;
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.monto_meta) total += Number(data.monto_meta);
  });
  return total;
}

/* ======================================================
   🐾 FUNCIONES OPERATIVAS
====================================================== */

// Casos Activos
export async function getCasosActivos() {
  const q = query(collection(db, "casos"), where("estado", "==", "activo"));
  const snapshot = await getDocs(q);
  return snapshot.size;
}

// Casos Cerrados
export async function getCasosCerrados() {
  const q = query(collection(db, "casos"), where("estado", "==", "cerrado"));
  const snapshot = await getDocs(q);
  return snapshot.size;
}

// Hogares disponibles
export async function getHogaresDisponibles() {
  const q = query(collection(db, "hogares_paso"), where("disponible", "==", true));
  const snapshot = await getDocs(q);
  
  // 🔹 Si quieres contar hogares:
  // return snapshot.size;

  // 🔹 Si quieres sumar cupos:
  let total = 0;
  snapshot.forEach((doc) => {
    total += Number(doc.data().cupo_maximo || 0);
  });
  return total;
}

// Animales en hogares
export async function getAnimalesEnHogares() {
  const snapshot = await getDocs(collection(db, "hogares_paso"));
  let total = 0;
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.animales_actuales) total += Number(data.animales_actuales);
  });
  return total;
}

/* ======================================================
   💎 TOP 5 DONANTES (SUM, COUNT, AVG)
====================================================== */

export async function getTopDonantes() {
  const snapshot = await getDocs(collection(db, "donaciones"));
  const acumulados = {};

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    if (data.id_donante && data.monto) {
      const donanteId =
        typeof data.id_donante === "object" && data.id_donante.id
          ? data.id_donante.id
          : data.id_donante;

      if (!acumulados[donanteId]) {
        acumulados[donanteId] = { total: 0, count: 0 };
      }
      acumulados[donanteId].total += Number(data.monto);
      acumulados[donanteId].count++;
    }
  });

  // Calcular promedio
  const donantesCalc = Object.entries(acumulados).map(([donanteId, stats]) => ({
    donanteId,
    total: stats.total,
    count: stats.count,
    avg: stats.total / stats.count,
  }));

  // Ordenar y limitar a Top 5
  const ordenado = donantesCalc.sort((a, b) => b.total - a.total).slice(0, 5);

  // Obtener nombres
  const resultados = [];
  for (const item of ordenado) {
    let nombre = "Desconocido";
    try {
      const donanteRef = doc(db, "donantes", item.donanteId);
      const donanteDoc = await getDoc(donanteRef);
      if (donanteDoc.exists()) {
        const data = donanteDoc.data();
        nombre =
          data.nombre_donante || data.donante || data.nombre || "Desconocido";
      }
    } catch (err) {
      console.warn(`⚠️ Error obteniendo nombre de donante ${item.donanteId}:`, err);
    }
    resultados.push({
      nombre,
      total: item.total,
      count: item.count,
      avg: item.avg,
    });
  }

  return resultados;
}

/* ======================================================
   ⚙️ FUNCIÓN GENERAL PARA CARGAR TODOS LOS INDICADORES
====================================================== */

export async function getAllDashboardMetrics() {
  try {
    const [
      totalDonado,
      totalGastado,
      balance,
      casosActivos,
      casosCerrados,
      hogaresDisp,
      animales,
      topDonantes,
      totalRecaudar, // ✅ Agregado aquí
    ] = await Promise.all([
      getMontoTotalDonado(),
      getMontoTotalGastado(),
      getBalanceActual(),
      getCasosActivos(),
      getCasosCerrados(),
      getHogaresDisponibles(),
      getAnimalesEnHogares(),
      getTopDonantes(),
      getTotalRecaudar(), // ✅ Incluido también aquí
    ]);

    return {
      financieros: {
        totalDonado,
        totalGastado,
        balance,
        totalRecaudar,
      },
      operativos: {
        casosActivos,
        casosCerrados,
        hogaresDisp,
        animales,
      },
      topDonantes,
    };
  } catch (error) {
    console.error("❌ Error obteniendo métricas del dashboard:", error);
    return null;
  }
}