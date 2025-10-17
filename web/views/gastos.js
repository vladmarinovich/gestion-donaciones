// web/views/gastos.js
import { SpCard } from '../components/Card/card.js';
import { SpTable } from '../components/Table/table.js';
import { SpModal } from '../components/Modal/modal.js';

export async function renderGastos(container) {
  // 🔹 Limpiar vista
  container.innerHTML = `
    <section class="sp-gastos-view">
      <h1 class="sp-view-title">Gastos</h1>

      <div class="sp-kpi-grid" id="kpi-grid"></div>
      <div class="sp-table-section" id="table-section"></div>

      <button id="btn-crear-gasto" class="sp-btn sp-btn--primary sp-btn--add">
        + Crear Gasto
      </button>
    </section>
  `;

  // 🔹 KPIs (placeholder)
  const kpiGrid = container.querySelector('#kpi-grid');
  const kpis = [
    { label: 'Total Gastos', value: 0 },
    { label: 'Pagados', value: 0 },
    { label: 'Pendientes', value: 0 },
  ];

  kpis.forEach(kpi => {
    const cardWrapper = document.createElement('div');
    const card = new SpCard();
    card.mount(cardWrapper, { title: kpi.label, value: kpi.value });
    kpiGrid.appendChild(cardWrapper);
  });

  // 🔹 Configurar tabla
  const tableSection = container.querySelector('#table-section');
  const table = new SpTable();

  // Datos simulados
  const mockData = [
    {
      nombre_gasto: 'Consulta veterinaria',
      monto: '80.000',
      medio_pago: 'Nequi',
      estado: 'Pagado',
      fecha_pago: '2025-10-10',
    },
    {
      nombre_gasto: 'Medicamentos',
      monto: '40.000',
      medio_pago: 'Transferencia',
      estado: 'Pendiente',
      fecha_pago: '2025-10-12',
    },
  ];

  table.mount(tableSection, {
    columns: [
      { key: 'nombre_gasto', label: 'Nombre' },
      { key: 'monto', label: 'Monto (COP)' },
      { key: 'medio_pago', label: 'Medio de Pago' },
      { key: 'estado', label: 'Estado' },
      { key: 'fecha_pago', label: 'Fecha de Pago' },
    ],
    data: mockData,
  });

  // 🔹 Acciones
  table.on('edit', row => {
    console.log('Editar gasto:', row);
    openModal(row);
  });

  table.on('delete', row => {
    console.log('Eliminar gasto:', row);
    if (confirm(`¿Eliminar gasto "${row.nombre_gasto}"?`)) {
      alert('Registro eliminado (simulado)');
    }
  });

  // 🔹 Modal
  const modalRoot = document.getElementById('modal-root');
  const modal = new SpModal();
  modal.mount(modalRoot, { title: 'Nuevo Gasto' });

  // 🔹 Botón crear
  container.querySelector('#btn-crear-gasto').addEventListener('click', async () => {
    openModal();
  });

  // 🔹 Abrir modal (crear/editar)
  async function openModal(row = null) {
    const html = await fetch('/web/forms/form-gasto.html').then(r => r.text());
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    const form = wrapper.firstElementChild;

    if (row) {
      Object.keys(row).forEach(k => {
        if (form[k]) form[k].value = row[k];
      });
      modal.setTitle('Editar Gasto');
    } else {
      modal.setTitle('Nuevo Gasto');
    }

    modal.setContent(form);
    modal.open();

    modal.on('submit', formData => {
      console.log('Datos enviados:', formData);
      alert('✅ Gasto guardado (simulado)');
      modal.close();
    });
  }
}
