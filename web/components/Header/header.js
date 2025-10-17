export class SpHeader {
  async mount(container, { title }) {
    try {
      // Cargar el template desde header.html
      const res = await fetch('./components/Header/header.html');
      const html = await res.text();

      // Insertar en el contenedor
      container.innerHTML = html;

      // Buscar el template y clonarlo
      const template = container.querySelector('#sp-header-template');
      if (!template) throw new Error('Template sp-header-template no encontrado');
      const node = template.content.cloneNode(true);

      // Reemplazar contenido del header
      const titleEl = node.querySelector('.sp-header__title');
      if (titleEl) titleEl.textContent = title || 'CRM Fundación Salvando Patitas';

      // Montar en el DOM
      container.innerHTML = '';
      container.appendChild(node);
    } catch (err) {
      console.error('Error al montar el header:', err);
    }
  }
}