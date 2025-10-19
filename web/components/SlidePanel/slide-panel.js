// /web/components/SlidePanel/slide-panel.js
let activePanel = null;
const PANEL_ANIMATION_MS = 300;

/**
 * Abre un panel deslizante y carga dinámicamente el formulario solicitado.
 * @param {string} formType - Identificador del formulario (ej. "donante", "donacion").
 */
export async function openSlidePanel(formType) {
  if (!formType) {
    throw new Error("openSlidePanel requiere un formType válido.");
  }

  // Cierra un panel activo antes de abrir otro
  if (activePanel) {
    await closeSlidePanel(activePanel);
  }

  let html = "";
  try {
    const response = await fetch(`/forms/form-${formType}.html`);
    if (!response.ok) {
      throw new Error(`No se encontró el formulario: form-${formType}.html`);
    }
    html = await response.text();
  } catch (error) {
    console.error(`❌ Error cargando el formulario ${formType}:`, error);
    html = `<p class="sp-slide-panel__error">No se pudo cargar el formulario solicitado.</p>`;
  }

  const panel = document.createElement("div");
  panel.classList.add("sp-slide-panel");
  panel.innerHTML = `
    <div class="sp-slide-panel__overlay"></div>
    <div class="sp-slide-panel__content">
      <button class="sp-slide-panel__close" aria-label="Cerrar panel">×</button>
      ${html}
    </div>
  `;

  document.body.appendChild(panel);
  activePanel = panel;

  const closeHandler = () => closeSlidePanel(panel);
  panel.querySelector(".sp-slide-panel__close")?.addEventListener("click", closeHandler);
  panel.querySelector(".sp-slide-panel__overlay")?.addEventListener("click", closeHandler);

  // Dispara animación de entrada
  requestAnimationFrame(() => panel.classList.add("is-active"));

  return panel;
}

/**
 * Cierra y elimina el panel deslizante.
 * @param {HTMLElement} panel - Panel a cerrar.
 */
export async function closeSlidePanel(panel) {
  if (!panel) return;

  panel.classList.remove("is-active");

  await new Promise((resolve) => {
    setTimeout(resolve, PANEL_ANIMATION_MS);
  });

  panel.remove();
  if (activePanel === panel) {
    activePanel = null;
  }
}
