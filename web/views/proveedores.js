// web/views/proveedores.js
import { SpTable } from '../components/Table/table.js';
import { SpModal } from '../components/Modal/modal.js';

export async function renderProveedores(container) {
  // 🔹 Estructura base
  container.innerHTML = `
    <section class="sp-proveedores-view">
      <h1 class="sp-view-title">Proveedores</h1>

      <div class="sp-table-section" id="table-section"></div>

      <button id="btn-crear-proveedor" class="sp-btn sp-btn--primary sp-btn--add">
        + Crear Proveedor
      </button>
    </section>
  `;

  // 🔹 Datos simulados
  const mockData = [
    {
      nombre_proveedor: 'Veterinaria AnimalCare',
      tipo_proveedor: 'Veterinaria',
      ciudad: 'Bogotá',
      telefono: '+57 3106543210',
      correo: 'contacto@animalcare.co',
    },
    {
      nombre_proveedor: 'PetStore Tienda',
      tipo_proveedor: 'Tienda',
      ciudad: 'Medellín',
      telefono: '+57 3019876543',
      correo: 'ventas@petstore.com',
    },
  ];

  // 🔹 Crear tabla
  const tableSection = container.querySelector('#table-section');
  const table = new SpTable();

  table.mount(tableSection, {
    columns: [
      { key: 'nombre_proveedor', label: 'Nombre' },
      { key: 'tipo_proveedor', label: 'Tipo' },
      { key: 'ciudad', label: 'Ciudad' },
      { key: 'telefono', label: 'Teléfono' },
      { key: 'correo', label: 'Correo' },
    ],
    data: mockData,
  });

  // 🔹 Eventos tabla
  table.on('edit', row => {
    console.log('Editar proveedor:', row);
    openModal(row);
  });

  table.on('delete', row => {
    console.log('Eliminar proveedor:', row);
    if (confirm(`¿Eliminar proveedor "${row.nombre_proveedor}"?`)) {
      alert('Registro eliminado (simulado)');
    }
  });

  // 🔹 Modal
  const modalRoot = document.getElementById('modal-root');
  const modal = new SpModal();
  modal.mount(modalRoot, { title: 'Nuevo Proveedor' });

  // 🔹 Botón crear
  container.querySelector('#btn-crear-proveedor').addEventListener('click', async () => {
    openModal();
  });

  // 🔹 Función abrir modal
  async function openModal(row = null) {
    const html = await fetch('/web/forms/form-proveedor.html').then(r => r.text());
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    const form = wrapper.firstElementChild;

    if (row) {
      Object.keys(row).forEach(k => {
        if (form[k]) form[k].value = row[k];
      });
      modal.setTitle('Editar Proveedor');
    } else {
      modal.setTitle('Nuevo Proveedor');
    }

    modal.setContent(form);
    modal.open();

    modal.on('submit', formData => {
      console.log('Datos enviados:', formData);
      alert('✅ Proveedor guardado (simulado)');
      modal.close();
    });
  }
}
