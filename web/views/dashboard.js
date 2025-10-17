// /web/views/dashboard.js

export function renderDashboard(container) {
  container.innerHTML = `
    <section class="sp-dashboard">
      <header class="sp-dashboard__header">
        <h1>Resumen del negocio</h1>
        <button class="sp-btn sp-btn--primary">Agregar gráfica</button>
      </header>

      <div class="sp-dashboard__grid">
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

      <div class="sp-dashboard__chart">
        <h3>Total de ventas</h3>
        <p>La gráfica muestra el valor total con impuestos incluidos.</p>
        <div class="sp-chart-placeholder">
          📊 Aquí irá el gráfico de donaciones y gastos
        </div>
      </div>
    </section>
  `;
}