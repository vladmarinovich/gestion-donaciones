// /web/views/dashboard.js

import { getAllDashboardMetrics } from "../js/metrics/dashboard-metrics.js";

export async function renderDashboard(container) {
  container.innerHTML = `
    <div class="sp-dashboard-view">
      <div class="sp-view-header">
        <h1 class="sp-view-title">Resumen del Negocio</h1>
        <button class="sp-btn sp-btn--secondary">Agregar Gráfica</button>
      </div>

      <!-- Indicadores Financieros -->
      <section class="sp-section">
        <h2>Indicadores Financieros</h2>
        <div class="sp-kpi-grid">
          <div class="sp-card sp-card--green">
            <h3>Total Donado</h3>
            <p id="totalDonado" class="sp-card__value">—</p>
          </div>
          <div class="sp-card sp-card--red">
            <h3>Total Gastado</h3>
            <p id="totalGastado" class="sp-card__value">—</p>
          </div>
          <div class="sp-card sp-card--blue">
            <h3>Balance Actual</h3>
            <p id="balanceActual" class="sp-card__value">—</p>
          </div>
          <div class="sp-card sp-card--yellow">
            <h3>Total a Recaudar</h3>
            <p id="totalRecaudar" class="sp-card__value">—</p>
          </div>
        </div>
      </section>

      <!-- Indicadores Operativos -->
      <section class="sp-section">
        <h2>Indicadores Operativos</h2>
        <div class="sp-kpi-grid">
          <div class="sp-card">
            <h3>Casos Activos</h3>
            <p id="casosActivos" class="sp-card__value">—</p>
          </div>
          <div class="sp-card">
            <h3>Casos Cerrados</h3>
            <p id="casosCerrados" class="sp-card__value">—</p>
          </div>
          <div class="sp-card">
            <h3>Hogares Disponibles</h3>
            <p id="hogaresDisp" class="sp-card__value">—</p>
          </div>
          <div class="sp-card">
            <h3>Animales en Hogares</h3>
            <p id="animalesHogar" class="sp-card__value">—</p>
          </div>
        </div>
      </section>

      <!-- Top 5 Donantes -->
      <section class="sp-section">
        <h2>🏆 Top 5 Donantes</h2>
        <table class="sp-table">
          <thead>
            <tr>
              <th>Donante</th>
              <th>Monto Total</th>
              <th># Donaciones</th>
              <th>Promedio</th>
            </tr>
          </thead>
          <tbody id="tablaTopDonantes">
            <tr><td colspan="4">Cargando...</td></tr>
          </tbody>
        </table>
      </section>
    </div>
  `;

  // ====== Cargar los datos del dashboard ======
  try {
    const data = await getAllDashboardMetrics();

    // Financieros
    document.getElementById("totalDonado").textContent =
      "$" + data.financieros.totalDonado.toLocaleString("es-CO");
    document.getElementById("totalGastado").textContent =
      "$" + data.financieros.totalGastado.toLocaleString("es-CO");
    document.getElementById("balanceActual").textContent =
      "$" + data.financieros.balance.toLocaleString("es-CO");

    // Operativos
    document.getElementById("casosActivos").textContent = data.operativos.casosActivos;
    document.getElementById("casosCerrados").textContent = data.operativos.casosCerrados;
    document.getElementById("hogaresDisp").textContent = data.operativos.hogaresDisp;
    document.getElementById("animalesHogar").textContent = data.operativos.animales;

    // Top Donantes
    const tabla = document.getElementById("tablaTopDonantes");
    tabla.innerHTML = "";
    if (data.topDonantes.length > 0) {
      data.topDonantes.forEach((donante) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${donante.nombre}</td>
          <td>$${donante.total.toLocaleString("es-CO")}</td>
          <td>${donante.count}</td>
          <td>$${donante.avg.toFixed(0).toLocaleString("es-CO")}</td>
        `;
        tabla.appendChild(row);
      });
    } else {
      tabla.innerHTML = `<tr><td colspan="4">No hay donaciones registradas</td></tr>`;
    }

    console.log("✅ Dashboard actualizado:", data);
  } catch (error) {
    console.error("❌ Error al cargar el dashboard:", error);
  }
}