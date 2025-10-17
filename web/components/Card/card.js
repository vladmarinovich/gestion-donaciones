// web/components/Card/card.js
export class SpCard {
  constructor() {
    this.template = document.getElementById('sp-card-template');
    this.el = null;
  }

  mount(container, props = {}) {
    if (!this.template) {
      console.error('Template sp-card-template no encontrado');
      return;
    }

    const node = this.template.content.cloneNode(true);
    container.innerHTML = '';
    container.appendChild(node);

    this.el = container.querySelector('.sp-card');
    this.labelEl = this.el.querySelector('.sp-card__label');
    this.valueEl = this.el.querySelector('.sp-card__value');
    this.iconEl = this.el.querySelector('.sp-card__icon');

    if (props.label) this.setLabel(props.label);
    if (props.value) this.setValue(props.value);
    if (props.icon) this.setIcon(props.icon);
  }

  setLabel(text) {
    if (this.labelEl) this.labelEl.textContent = text;
  }

  setValue(val) {
    if (this.valueEl) this.valueEl.textContent = val;
  }

  setIcon(iconSVG) {
    if (this.iconEl && iconSVG) {
      this.iconEl.innerHTML = iconSVG;
    }
  }

  destroy() {
    if (this.el) this.el.remove();
  }
}
