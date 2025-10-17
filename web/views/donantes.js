// web/views/donantes.js
import { SpTable } from '../components/Table/table.js';
import { SpModal } from '../components/Modal/modal.js';
import { getAll } from '../js/db.js'; // 👈 Importamos la función de DB

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

  // Leemos los donantes desde Firestore
  const donantes = await getAll('donantes');

  // Montamos la tabla con los datos reales
  table.mount(tableSection, {
    columns: [
      { key: 'nombre_donante', label: 'Nombre' },
      { key: 'tipo_donante', label: 'Tipo' },
      { key: 'correo', label: 'Correo' },
      { key: 'telefono', label: 'Teléfono' },
    ],
    data: donantes,
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
    const res = await fetch('./forms/form-donante.html');
    if (!res.ok) {
      throw new Error(`No se pudo cargar el formulario: ${res.status}`);
    }
    const html = await res.text();
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
