// /web/components/SlidePanel/slide-panel.js

let activePanel = null;
const PANEL_ANIMATION_MS = 300;

export async function openSlidePanel(formType) {
  if (!formType) throw new Error("openSlidePanel requiere un formType válido.");

  // Limpieza de paneles previos
  document.querySelectorAll(".sp-slide-panel").forEach((el) => el.remove());

  if (activePanel) await closeSlidePanel(activePanel);

  let html = "";
  try {
    const response = await fetch(`./forms/form-${formType}.html`);
    if (!response.ok) throw new Error(`No se encontró el formulario: form-${formType}.html`);
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

  requestAnimationFrame(() => panel.classList.add("is-active"));

  initializeFormLogic(formType);

  return panel;
}

export async function closeSlidePanel(panel = activePanel) { // ✅ nuevo
  if (!panel) return;
  panel.classList.remove("is-active");
  await new Promise((resolve) => setTimeout(resolve, PANEL_ANIMATION_MS));
  panel.remove();
  if (activePanel === panel) activePanel = null;
}

async function initializeFormLogic(formType) {
  const type = formType;
  const basePath = "../../js/forms";
  try {
    console.log(`📦 Cargando módulo de formulario: ${type}`);

    let initialized = false;

    if (type === "donante") {
      const module = await import(`${basePath}/form-donante.js`);
      module.initDonanteForm?.();
      initialized = typeof module.initDonanteForm === "function";
    } else if (type === "hogar") {
      const module = await import(`${basePath}/form-hogar.js`);
      module.initHogarForm?.();
      initialized = typeof module.initHogarForm === "function";
    } else if (type === "proveedor") {
      const module = await import(`${basePath}/form-proveedor.js`);
      module.initProveedorForm?.();
      initialized = typeof module.initProveedorForm === "function";
    } else if (type === "caso") {
      const module = await import(`${basePath}/form-caso.js`);
      module.initCasoForm?.();
      initialized = typeof module.initCasoForm === "function";
    } else if (type === "donacion") {
      const module = await import(`${basePath}/form-donacion.js`);
      module.initDonacionForm?.();
      initialized = typeof module.initDonacionForm === "function";
    } else if (type === "gasto") {
      const module = await import(`${basePath}/form-gasto.js`);
      module.initGastoForm?.();
      initialized = typeof module.initGastoForm === "function";
    } else {
      console.warn(`⚠️ No se encontró lógica específica para el formulario: ${formType}`);
      return;
    }

    if (initialized) {
      console.log(`✅ ${type} inicializado correctamente`);
    } else {
      console.warn(`⚠️ No se encontró inicializador para el formulario: ${type}`);
    }
  } catch (error) {
    console.error(`❌ Error al inicializar el formulario ${formType}:`, error);
  }
}
