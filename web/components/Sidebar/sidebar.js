// web/components/Sidebar/sidebar.js

export class SpSidebar {
  constructor() {
    this.container = null;
  }

  async mount(container, props = {}) {
    this.container = container;

    try {
      // 1. Cargar el HTML de la plantilla
      const res = await fetch('./components/Sidebar/sidebar.html');
      const html = await res.text();

      if (!res.ok) {
        throw new Error(`Error al cargar la plantilla: ${res.status} ${res.statusText}`);
      }

      // 2. Crear un elemento temporal para encontrar el template
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const template = tempDiv.querySelector('#sp-sidebar-template');

      if (!template) {
        throw new Error('Template #sp-sidebar-template no encontrado en sidebar.html');
      }

      // 3. Clonar el contenido del template y añadirlo al contenedor real
      const node = template.content.cloneNode(true);
      container.innerHTML = '';
      container.appendChild(node);

      // 4. Configurar eventos y datos
      this.setupEventListeners();
      if (props.user) this.updateUserData(props.user);

    } catch (err) {
      console.error('Error al montar el sidebar:', err);
      // Mostramos un mensaje discreto y dejamos el contenedor vacío.
      container.innerHTML = '<!-- Error al cargar sidebar -->';
    }
  }

  setupEventListeners() {
    // Lógica para activar el link actual
    const links = this.container.querySelectorAll('.sp-sidebar__link[data-route]');
    const currentHash = window.location.hash || '#/dashboard';

    links.forEach(link => {
      link.classList.toggle('sp-sidebar__link--active', link.dataset.route === currentHash);
    });

    // Actualizar en cada cambio de hash
    window.addEventListener('hashchange', () => {
      const newHash = window.location.hash || '#/dashboard';
      links.forEach(link => {
        link.classList.toggle('sp-sidebar__link--active', link.dataset.route === newHash);
      });
    });

    // Botón de logout
    const logoutButton = this.container.querySelector('#logout-button');
    if (logoutButton) {
      logoutButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.logout) {
          window.logout();
        } else {
          console.error('La función de logout no está disponible.');
        }
      });
    }
  }

  updateUserData(user) {
    if (!user) return;

    const userNameEl = this.container.querySelector('#user-name');
    const userEmailEl = this.container.querySelector('#user-email');
    const userAvatarEl = this.container.querySelector('#user-avatar');

    if (userNameEl) userNameEl.textContent = user.displayName || 'Usuario';
    if (userEmailEl) userEmailEl.textContent = user.email;
    if (userAvatarEl) {
      userAvatarEl.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=cccccc&color=000000`;
      userAvatarEl.alt = `Avatar de ${user.displayName || user.email}`;
    }
  }
}