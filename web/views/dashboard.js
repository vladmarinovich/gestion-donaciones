// web/views/dashboard.js
import { SpCard } from '../components/Card/card.js';

export async function renderDashboard(container) {
  // 🔹 Estructura base
  container.innerHTML = `
    <section class="sp-dashboard-view">
      <h1 class="sp-view-title">Dashboard</h1>

      <div class="sp-kpi-grid" id="kpi-grid"></div>

      <div class="sp-chart-section">
        <h2 class="sp-section-title">Resumen de Actividad</h2>
        <div id="chart-placeholder" class="sp-chart-placeholder">
          📊 Aquí irá el gráfico de donaciones y gastos.
        </div>
      </div>
    </section>
  `;

  // 🔹 KPI placeholders
  const kpiData = [
    { title: 'Total Donaciones', value: 0 },
    { title: 'Gastos Totales', value: 0 },
    { title: 'Donantes Activos', value: 0 },
    { title: 'Casos Abiertos', value: 0 },
    { title: 'Hogares Disponibles', value: 0 },
    { title: 'Proveedores', value: 0 },
  ];

  const kpiGrid = container.querySelector('#kpi-grid');
  kpiData.forEach(kpi => {
    const cardWrapper = document.createElement('div');
    const card = new SpCard();
    card.mount(cardWrapper, { title: kpi.title, value: kpi.value });
    kpiGrid.appendChild(cardWrapper);
  });

  // 🔹 Placeholder gráfico
  const chartContainer = container.querySelector('#chart-placeholder');
  chartContainer.style.minHeight = '220px';
  chartContainer.style.display = 'flex';
  chartContainer.style.alignItems = 'center';
  chartContainer.style.justifyContent = 'center';
  chartContainer.style.background = '#fff';
  chartContainer.style.borderRadius = 'var(--sp-radius-md)';
  chartContainer.style.boxShadow = 'var(--sp-shadow-sm)';
}
