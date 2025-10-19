// /web/components/FAB/fab.js
import { openSlidePanel } from "../SlidePanel/slide-panel.js";

export function initFAB() {
  console.log("✅ FAB inicializado correctamente");

  // Busca el template
  const template = document.getElementById("sp-fab-template");
  if (!template) {
    console.error("❌ Template sp-fab-template no encontrado.");
    return;
  }

  // Clona el contenido
  const fragment = template.content.cloneNode(true);
  const fabRoot = fragment.querySelector(".sp-fab");
  document.body.appendChild(fragment);

  if (!fabRoot) {
    console.error("❌ No se pudo inicializar el FAB: plantilla inválida.");
    return;
  }

  // Referencias
  const fabButton = fabRoot.querySelector(".sp-fab__button");
  const fabMenu = fabRoot.querySelector(".sp-fab__menu");

  // Toggle del menú
  if (fabButton && fabMenu) {
    fabButton.addEventListener("click", () => {
      fabMenu.classList.toggle("is-active");
    });
  }

  // Manejar clicks en los ítems del menú
  const formButtons = fabRoot.querySelectorAll("[data-form]");
  formButtons.forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      const formType = event.currentTarget.dataset.form;
      if (!formType) {
        console.warn("⚠️ No se encontró el tipo de formulario en el elemento seleccionado.");
        return;
      }

      // Cierra el menú antes de abrir el panel
      fabMenu?.classList.remove("is-active");

      try {
        await openSlidePanel(formType);
      } catch (error) {
        console.error(`❌ No se pudo abrir el panel deslizante para ${formType}:`, error);
      }
    });
  });
}
