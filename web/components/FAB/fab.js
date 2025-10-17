// web/components/FAB/fab.js
export class SpFAB {
  constructor() {
    this.template = document.getElementById('sp-fab-template');
    this.el = null;
    this.menu = null;
    this.listeners = {};
  }

  mount(container) {
    if (!this.template) {
      console.error('Template sp-fab-template no encontrado');
      return;
    }

    const node = this.template.content.cloneNode(true);
    container.innerHTML = '';
    container.appendChild(node);

    this.el = container.querySelector('.sp-fab');
    this.menu = container.querySelector('.sp-fab-menu');

    this.el.addEventListener('click', () => this.toggleMenu());

    this.menu.querySelectorAll('li').forEach(item => {
      item.addEventListener('click', () => {
        const type = item.dataset.type;
        this.emit('create', { type });
        this.closeMenu();
      });
    });
  }

  toggleMenu() {
    const isOpen = this.el.getAttribute('aria-expanded') === 'true';
    if (isOpen) this.closeMenu();
    else this.openMenu();
  }

  openMenu() {
    this.menu.hidden = false;
    this.el.setAttribute('aria-expanded', 'true');
  }

  closeMenu() {
    this.menu.hidden = true;
    this.el.setAttribute('aria-expanded', 'false');
  }

  on(event, fn) {
    this.listeners[event] = fn;
  }

  emit(event, detail = null) {
    if (this.listeners[event]) this.listeners[event](detail);
    const evt = new CustomEvent(`sp:fab:${event}`, { detail });
    this.el?.dispatchEvent(evt);
  }

  destroy() {
    if (this.el) this.el.remove();
    this.listeners = {};
  }
}
