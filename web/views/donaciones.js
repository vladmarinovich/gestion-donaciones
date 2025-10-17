// web/views/donaciones.js
import { SpCard } from '../components/Card/card.js';
import { SpTable } from '../components/Table/table.js';
import { SpModal } from '../components/Modal/modal.js';

export async function renderDonaciones(container) {
  // 🔹 Limpia el contenedor principal
  container.innerHTML = `
    <section class="sp-donaciones-view">
      <h1 class="sp-view-title">Donaciones</h1>

      <div class="sp-kpi-grid" id="kpi-grid"></div>
      <div class="sp-table-section" id="table-section"></div>

      <button id="btn-crear-donacion" class="sp-btn sp-btn--primary sp-btn--add">
        + Crear Donación
      </button>
    </section>
  `;

  // 🔹 Renderizar KPIs (por ahora en 0)
  const kpiGrid = container.querySelector('#kpi-grid');
  const kpis = [
    { label: 'Total Donaciones', value: 0 },
    { label: 'Confirmadas', value: 0 },
    { label: 'Pendientes', value: 0 },
    { label: 'En Billetera', value: 0 },
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
  const mockData = [
    {
      fecha_donacion: '2025-10-10',
      monto: '120.000',
      medio_pago: 'Nequi',
      estado: 'Confirmado',
    },
    {
      fecha_donacion: '2025-10-14',
      monto: '50.000',
      medio_pago: 'Transferencia',
      estado: 'Pendiente',
    },
  ];

  table.mount(tableSection, {
    columns: [
      { key: 'fecha_donacion', label: 'Fecha' },
      { key: 'monto', label: 'Monto (COP)' },
      { key: 'medio_pago', label: 'Medio de Pago' },
      { key: 'estado', label: 'Estado' },
    ],
    data: mockData,
  });

  // 🔹 Escucha de eventos (editar / eliminar)
  table.on('edit', row => {
    console.log('Editar registro:', row);
    openModal(row);
  });

  table.on('delete', row => {
    console.log('Eliminar registro:', row);
    if (confirm(`¿Eliminar donación de ${row.monto}?`)) {
      // TODO: luego eliminar desde Firebase
      alert('Registro eliminado (simulado)');
    }
  });

  // 🔹 Modal
  const modalRoot = document.getElementById('modal-root');
  const modal = new SpModal();
  modal.mount(modalRoot, { title: 'Nueva Donación' });

  // 🔹 Botón Crear Donación
  container.querySelector('#btn-crear-donacion').addEventListener('click', async () => {
    openModal();
  });

  // 🔹 Función para abrir modal (crear o editar)
  async function openModal(row = null) {
    const html = await fetch('/web/forms/form-donacion.html').then(r => r.text());
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    const form = wrapper.firstElementChild;

    // Si estamos editando, llenamos datos
    if (row) {
      Object.keys(row).forEach(k => {
        if (form[k]) form[k].value = row[k];
      });
      modal.setTitle('Editar Donación');
    } else {
      modal.setTitle('Nueva Donación');
    }

    modal.setContent(form);
    modal.open();

    modal.on('submit', formData => {
      console.log('Datos enviados:', formData);
      alert('✅ Donación guardada (simulada)');
      modal.close();
    });
  }
}
