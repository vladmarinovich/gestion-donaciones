// /web/views/dashboard.js

export function renderDashboard(container) {
  // El contenedor ya es el <main> principal, solo añadimos el contenido del dashboard.
  container.innerHTML = `
    <div class="sp-dashboard-view">
      <div class="sp-view-header">
        <h1 class="sp-view-title">Resumen del Negocio</h1>
        <button class="sp-btn sp-btn--secondary">Agregar Gráfica</button>
      </div>

      <div class="sp-kpi-grid">
        <div class="sp-card sp-card--green">
          <h3>Cuentas por cobrar</h3>
          <p class="sp-card__value">$22,134,000</p>
          <small>Vigentes: 1 documento</small>
        </div>
        <div class="sp-card sp-card--red">
          <h3>Cuentas por pagar</h3>
          <p class="sp-card__value">$6,755,000</p>
          <small>Vencidas: 1 documento</small>
        </div>
        <div class="sp-card">
          <h3>Clientes con ventas</h3>
          <p class="sp-card__value">1</p>
        </div>
        <div class="sp-card">
          <h3>Productos vendidos</h3>
          <p class="sp-card__value">300</p>
        </div>
      </div>

      <div class="sp-chart-section">
        <h3>Total de ventas</h3>
        <p>La gráfica muestra el valor total con impuestos incluidos.</p>
        <div class="sp-chart-placeholder">
          📊 Aquí irá el gráfico de donaciones y gastos
        </div>
      </div>
    </div>
  `;
}