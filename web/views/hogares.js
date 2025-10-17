// web/views/hogares.js
import { SpTable } from '../components/Table/table.js';
import { SpModal } from '../components/Modal/modal.js';

export async function renderHogares(container) {
  // 🔹 Estructura base
  container.innerHTML = `
    <section class="sp-hogares-view">
      <h1 class="sp-view-title">Hogares de Paso</h1>

      <div class="sp-table-section" id="table-section"></div>

      <button id="btn-crear-hogar" class="sp-btn sp-btn--primary sp-btn--add">
        + Crear Hogar
      </button>
    </section>
  `;

  // 🔹 Datos simulados
  const mockData = [
    {
      nombre_hogar: 'Hogar Patitas Felices',
      tipo_hogar: 'Temporal',
      ciudad: 'Bogotá',
      cupo_maximo: 5,
      desempeno: '5',
    },
    {
      nombre_hogar: 'Refugio Animalitos del Alma',
      tipo_hogar: 'Permanente',
      ciudad: 'Medellín',
      cupo_maximo: 8,
      desempeno: '4',
    },
  ];

  // 🔹 Crear tabla
  const tableSection = container.querySelector('#table-section');
  const table = new SpTable();

  table.mount(tableSection, {
    columns: [
      { key: 'nombre_hogar', label: 'Nombre' },
      { key: 'tipo_hogar', label: 'Tipo' },
      { key: 'ciudad', label: 'Ciudad' },
      { key: 'cupo_maximo', label: 'Cupo Máximo' },
      { key: 'desempeno', label: 'Desempeño' },
    ],
    data: mockData,
  });

  // 🔹 Eventos tabla
  table.on('edit', row => {
    console.log('Editar hogar:', row);
    openModal(row);
  });

  table.on('delete', row => {
    console.log('Eliminar hogar:', row);
    if (confirm(`¿Eliminar hogar "${row.nombre_hogar}"?`)) {
      alert('Registro eliminado (simulado)');
    }
  });

  // 🔹 Modal
  const modalRoot = document.getElementById('modal-root');
  const modal = new SpModal();
  modal.mount(modalRoot, { title: 'Nuevo Hogar' });

  // 🔹 Botón crear
  container.querySelector('#btn-crear-hogar').addEventListener('click', async () => {
    openModal();
  });

  // 🔹 Función abrir modal
  async function openModal(row = null) {
    const html = await fetch('/web/forms/form-hogar.html').then(r => r.text());
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    const form = wrapper.firstElementChild;

    if (row) {
      Object.keys(row).forEach(k => {
        if (form[k]) form[k].value = row[k];
      });
      modal.setTitle('Editar Hogar');
    } else {
      modal.setTitle('Nuevo Hogar');
    }

    modal.setContent(form);
    modal.open();

    modal.on('submit', formData => {
      console.log('Datos enviados:', formData);
      alert('✅ Hogar guardado (simulado)');
      modal.close();
    });
  }
}
