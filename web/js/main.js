// web/js/main.js
import { SpHeader } from '../components/Header/header.js';
import { SpSidebar } from '../components/Sidebar/sidebar.js';
import { SpFAB } from '../components/FAB/fab.js';

// Vistas
import { renderDashboard } from '../views/dashboard.js';
import { renderDonaciones } from '../views/donaciones.js';
import { renderDonantes } from '../views/donantes.js';
import { renderGastos } from '../views/gastos.js';
import { renderHogares } from '../views/hogares.js';
import { renderProveedores } from '../views/proveedores.js';

const routes = {
  '#/dashboard': renderDashboard,
  '#/donaciones': renderDonaciones,
  '#/donantes': renderDonantes,
  '#/gastos': renderGastos,
  '#/hogares': renderHogares,
  '#/proveedores': renderProveedores,
};

function loadView() {
  const hash = window.location.hash || '#/dashboard';
  const view = routes[hash];
  const container = document.getElementById('app');
  container.innerHTML = '';

  if (view) view(container);
  else container.innerHTML = '<p>Vista no encontrada</p>';
}

// Inicializar app
window.addEventListener('DOMContentLoaded', () => {
  // Header
  const header = new SpHeader();
  header.mount(document.getElementById('header'), { title: 'Salvando Patitas' });

  // Sidebar
  const sidebar = new SpSidebar();
  sidebar.mount(document.getElementById('sidebar'), {
    items: [
      { label: 'Dashboard', route: '#/dashboard' },
      { label: 'Donaciones', route: '#/donaciones' },
      { label: 'Donantes', route: '#/donantes' },
      { label: 'Gastos', route: '#/gastos' },
      { label: 'Hogares', route: '#/hogares' },
      { label: 'Proveedores', route: '#/proveedores' },
    ],
  });

  // FAB global
  const fab = new SpFAB();
  fab.mount(document.getElementById('fab-root'));

  fab.on('create', ({ type }) => {
    window.location.hash = `#/${type}s`; // ej: donacion → #/donaciones
  });

  // Router
  window.addEventListener('hashchange', loadView);
  loadView();
});
