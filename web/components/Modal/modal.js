// web/components/Modal/modal.js
export class SpModal {
  constructor() {
    this.template = document.getElementById('sp-modal-template');
    this.el = null;
    this.listeners = {};
  }

  mount(container, props = {}) {
    if (!this.template) {
      console.error('Template sp-modal-template no encontrado');
      return;
    }

    const node = this.template.content.cloneNode(true);
    container.innerHTML = '';
    container.appendChild(node);

    this.el = container.querySelector('.sp-modal');
    this.titleEl = this.el.querySelector('.sp-modal__title');
    this.bodyEl = this.el.querySelector('.sp-modal__body');
    this.saveBtn = this.el.querySelector('[data-action="submit"]');

    if (props.title) this.setTitle(props.title);

    // Eventos de cierre
    this.el.querySelectorAll('[data-close]').forEach(btn =>
      btn.addEventListener('click', () => this.close())
    );

    // Botón Guardar
    this.saveBtn.addEventListener('click', () => {
      const form = this.bodyEl.querySelector('form');
      if (form) {
        const formData = Object.fromEntries(new FormData(form));
        this.emit('submit', formData);
      } else {
        this.emit('submit', null);
      }
    });

    // Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.close();
    });
  }

  /** Inserta contenido dinámico (por ej. un formulario) */
  setContent(element) {
    if (this.bodyEl) {
      this.bodyEl.innerHTML = '';
      this.bodyEl.appendChild(element);
    }
  }

  open() {
    if (this.el) {
      this.el.classList.add('sp-modal--open');
      this.trapFocus();
      this.emit('open');
    }
  }

  close() {
    if (this.el) {
      this.el.classList.remove('sp-modal--open');
      this.emit('close');
    }
  }

  setTitle(title) {
    if (this.titleEl) this.titleEl.textContent = title;
  }

  trapFocus() {
    const focusable = this.el.querySelectorAll('button, [href], input, select, textarea');
    if (focusable.length) focusable[0].focus();
  }

  on(event, fn) {
    this.listeners[event] = fn;
  }

  emit(event, detail = null) {
    if (this.listeners[event]) this.listeners[event](detail);
    const evt = new CustomEvent(`sp:modal:${event}`, { detail });
    this.el?.dispatchEvent(evt);
  }

  destroy() {
    if (this.el) this.el.remove();
    this.listeners = {};
  }
}
