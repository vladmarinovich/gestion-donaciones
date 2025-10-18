// web/views/donantes.js
import { SpTable } from '../components/Table/table.js';
import { SpModal } from '../components/Modal/modal.js';
import { getAll, create, update, remove } from '../js/db.js';

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
  table.mount(tableSection, {
    columns: [
      { key: 'nombre_donante', label: 'Nombre' },
      { key: 'tipo_donante', label: 'Tipo' },
      { key: 'correo', label: 'Correo' },
      { key: 'telefono', label: 'Teléfono' },
    ],
    data: [], // Se llenará dinámicamente
  });

  // 🔹 Modal
  const modalRoot = document.getElementById('modal-root');
  const modal = new SpModal();
  modal.mount(modalRoot, { title: 'Nuevo Donante' });

  // =============================================
  // 🔹 Lógica Principal y Flujo de Datos
  // =============================================

  /** Carga o recarga los donantes de Firestore y los renderiza en la tabla. */
  async function loadDonantes() {
    try {
      const donantes = await getAll('donantes');
      table.setData(donantes);
    } catch (error) {
      console.error('Error al cargar donantes:', error);
      table.setData([]); // Muestra la tabla vacía en caso de error
    }
  }

  /** Abre el modal para crear o editar un donante. */
  async function openModal(row = null) {
    try {
      const res = await fetch('./forms/form-donante.html');
      if (!res.ok) throw new Error(`No se pudo cargar el formulario: ${res.status}`);
      const html = await res.text();
      const wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      const form = wrapper.firstElementChild;

      if (row) {
        // Modo Edición: Llenar el formulario con datos existentes
        modal.setTitle('Editar Donante');
        Object.keys(row).forEach(k => {
          if (form.elements[k]) form.elements[k].value = row[k];
        });
      } else {
        // Modo Creación
        modal.setTitle('Nuevo Donante');
      }

      modal.setContent(form);
      modal.open();

      // Escuchar el evento 'submit' del modal una sola vez
      modal.on('submit', async (formData) => {
        try {
          if (row && row.id) {
            // Actualizar donante existente
            await update('donantes', row.id, formData);
          } else {
            // Crear nuevo donante
            await create('donantes', formData);
          }
          modal.close();
          await loadDonantes(); // Recargar la tabla
        } catch (error) {
          console.error('Error al guardar el donante:', error);
        }
      });
    } catch (error) {
      console.error('Error al abrir el modal:', error);
    }
  }

  // =============================================
  // 🔹 Conexión de Eventos
  // =============================================
  container.querySelector('#btn-crear-donante').addEventListener('click', () => openModal());
  table.on('edit', (row) => openModal(row));
  table.on('delete', async (row) => {
    if (confirm(`¿Estás seguro de que quieres eliminar a "${row.nombre_donante}"?`)) {
      await remove('donantes', row.id);
      await loadDonantes(); // Recargar la tabla
    }
  });

  // Carga inicial de datos
  loadDonantes();
}
