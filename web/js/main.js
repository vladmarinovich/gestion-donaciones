// web/js/main.js

import { auth, onAuthStateChanged } from './auth.js';
// Componentes base
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

// Mapa de rutas
const routes = {
  '#/dashboard': renderDashboard,
  '#/donaciones': renderDonaciones,
  '#/donantes': renderDonantes,
  '#/gastos': renderGastos,
  '#/hogares': renderHogares,
  '#/proveedores': renderProveedores,
};

/**
 * Carga la vista correspondiente al hash actual
 */
function loadView() {
  const hash = window.location.hash || '#/dashboard';
  const view = routes[hash];
  const container = document.getElementById('app');
  container.innerHTML = '';

  if (view) view(container);
  else container.innerHTML = '<p>Vista no encontrada</p>';
}

/**
 * Inicialización de la aplicación
 */
function initializeApp(user) {
  if (!document.querySelector('.sp-app')) return; // No hacer nada si no estamos en la app principal

  // Componentes principales que dependen del usuario
  const sidebar = new SpSidebar();
  sidebar.mount(document.getElementById('sidebar'), { user });

  const header = new SpHeader();
  header.mount(document.getElementById('header'), { title: 'Dashboard' });

  // FAB global (botón de acción flotante)
  // const fab = new SpFAB();
  // fab.mount(document.getElementById('fab-root'));

  // Carga inicial + enrutamiento
  window.addEventListener('hashchange', loadView);
  loadView();
}

/**
 * Punto de entrada principal
 * Verifica la autenticación antes de inicializar la app.
 */
window.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, (user) => {
    const isAppPage = window.location.pathname.includes('index.html') || window.location.pathname === '/';
    const isLoginPage = window.location.pathname.includes('login.html');
  
    if (user) {
      // Si el usuario está autenticado...
      if (isLoginPage) {
        // y está en la página de login, lo redirigimos a la app.
        window.location.replace('/index.html#/dashboard');
      } else if (isAppPage) {
        // y está en la página de la app, inicializamos los componentes.
        initializeApp(user);
      }
    } else {
      // Si el usuario NO está autenticado...
      if (isAppPage) {
        // y está tratando de acceder a la app, lo redirigimos al login.
        console.log('Usuario no autenticado, redirigiendo a login...');
        window.location.replace('/login.html');
      }
      // Si ya está en login.html, no hacemos nada.
    }
  });
});