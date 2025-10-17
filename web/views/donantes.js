// web/views/donantes.js
import { SpTable } from '../components/Table/table.js';
import { SpModal } from '../components/Modal/modal.js';

export async function renderDonantes(container) {
  // 🔹 Limpiar contenido
  container.innerHTML = `
    <section class="sp-donantes-view">
      <h1 class="sp-view-title">Donantes</h1>

      <div class="sp-table-section" id="table-section"></div>

      <button id="btn-crear-donante" class="sp-btn sp-btn--primary sp-btn--add">
        + Crear Donante
      </button>
    </section>
  `;

  // 🔹 Tabla
  const tableSection = container.querySelector('#table-section');
  const table = new SpTable();

  const mockData = [
    {
      nombre_donante: 'Juan Pérez',
      tipo_donante: 'Persona',
      correo: 'juan@example.com',
      telefono: '+57 3001234567',
    },
    {
      nombre_donante: 'Mascotas Felices S.A.',
      tipo_donante: 'Empresa',
      correo: 'contacto@mascotasfelices.co',
      telefono: '+57 3109876543',
    },
  ];

  table.mount(tableSection, {
    columns: [
      { key: 'nombre_donante', label: 'Nombre' },
      { key: 'tipo_donante', label: 'Tipo' },
      { key: 'correo', label: 'Correo' },
      { key: 'telefono', label: 'Teléfono' },
    ],
    data: mockData,
  });

  // 🔹 Acciones tabla
  table.on('edit', row => {
    console.log('Editar donante:', row);
    openModal(row);
  });

  table.on('delete', row => {
    console.log('Eliminar donante:', row);
    if (confirm(`¿Eliminar donante "${row.nombre_donante}"?`)) {
      alert('Registro eliminado (simulado)');
    }
  });

  // 🔹 Modal
  const modalRoot = document.getElementById('modal-root');
  const modal = new SpModal();
  modal.mount(modalRoot, { title: 'Nuevo Donante' });

  // 🔹 Botón crear
  container.querySelector('#btn-crear-donante').addEventListener('click', async () => {
    openModal();
  });

  // 🔹 Función abrir modal
  async function openModal(row = null) {
    const html = await fetch('/web/forms/form-donante.html').then(r => r.text());
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    const form = wrapper.firstElementChild;

    if (row) {
      Object.keys(row).forEach(k => {
        if (form[k]) form[k].value = row[k];
      });
      modal.setTitle('Editar Donante');
    } else {
      modal.setTitle('Nuevo Donante');
    }

    modal.setContent(form);
    modal.open();

    modal.on('submit', formData => {
      console.log('Datos enviados:', formData);
      alert('✅ Donante guardado (simulado)');
      modal.close();
    });
  }
}
