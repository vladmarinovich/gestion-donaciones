export class SpSidebar {
  async mount(container) {
    try {
      // Cargar el template desde sidebar.html
      const res = await fetch('./components/Sidebar/sidebar.html');
      const html = await res.text();

      // Insertar en el contenedor
      container.innerHTML = html;

      // Buscar y clonar el template
      const template = container.querySelector('#sp-sidebar-template');
      if (!template) throw new Error('Template sp-sidebar-template no encontrado');
      const node = template.content.cloneNode(true);

      // Montar en el DOM
      container.innerHTML = '';
      container.appendChild(node);

      // Activar la navegación
      const links = container.querySelectorAll('.sp-sidebar__link');
      links.forEach(link => {
        link.addEventListener('click', e => {
          links.forEach(l => l.classList.remove('sp-sidebar__link--active'));
          e.target.classList.add('sp-sidebar__link--active');
        });
      });
    } catch (err) {
      console.error('Error al montar el sidebar:', err);
    }
  }
}