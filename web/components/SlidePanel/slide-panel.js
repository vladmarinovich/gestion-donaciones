// web/components/SlidePanel/slide-panel.js
export class SpSlidePanel {
  constructor() {
    this.panel = null;
    this.overlay = null;
  }

  /**
   * Crea e inserta el panel en el DOM
   * @param {string} url - Ruta del formulario HTML (por ejemplo, '/web/forms/form-donante.html')
   * @param {string} title - Título del panel
   */
  async open(url, title = "Nuevo registro") {
    // Evitar múltiples paneles abiertos
    if (this.panel) return;

    // Crear overlay
    this.overlay = document.createElement("div");
    this.overlay.classList.add("sp-slide-overlay");
    this.overlay.addEventListener("click", () => this.close());

    // Crear panel
    this.panel = document.createElement("div");
    this.panel.classList.add("sp-slide-panel");
    this.panel.innerHTML = `
      <header class="sp-slide-header">
        <h2 class="sp-slide-title">${title}</h2>
        <button class="sp-slide-close" aria-label="Cerrar panel">&times;</button>
      </header>
      <div class="sp-slide-body">
        <p class="sp-loading">Cargando...</p>
      </div>
    `;

    document.body.appendChild(this.overlay);
    document.body.appendChild(this.panel);

    // Cargar formulario dinámico
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Error cargando: ${url}`);
      const html = await res.text();
      this.panel.querySelector(".sp-slide-body").innerHTML = html;
    } catch (err) {
      this.panel.querySelector(".sp-slide-body").innerHTML = `<p>Error al cargar el formulario.</p>`;
      console.error(err);
    }

    // Escuchar botón cerrar
    this.panel.querySelector(".sp-slide-close").addEventListener("click", () => this.close());

    // Mostrar animación
    requestAnimationFrame(() => {
      this.overlay.classList.add("sp-slide-overlay--visible");
      this.panel.classList.add("sp-slide-panel--visible");
    });
  }

  /** Cierra y elimina el panel */
  close() {
    if (!this.panel) return;

    this.overlay.classList.remove("sp-slide-overlay--visible");
    this.panel.classList.remove("sp-slide-panel--visible");

    setTimeout(() => {
      this.overlay.remove();
      this.panel.remove();
      this.overlay = null;
      this.panel = null;
    }, 300);
  }
}