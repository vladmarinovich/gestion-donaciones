// /web/components/FAB/fab.js
export function initFAB() {
  console.log("✅ FAB inicializado correctamente");

  // Busca el template
  const template = document.getElementById("sp-fab-template");
  if (!template) {
    console.error("❌ Template sp-fab-template no encontrado.");
    return;
  }

  // Clona el contenido
  const fabEl = template.content.cloneNode(true);
  document.body.appendChild(fabEl);

  // Referencias
  const fabButton = document.querySelector(".sp-fab__button");
  const fabMenu = document.querySelector(".sp-fab__menu");

  // Toggle del menú
  fabButton.addEventListener("click", () => {
    fabMenu.classList.toggle("is-active");
  });

  // Manejar clicks en los ítems del menú
  fabMenu.querySelectorAll("li").forEach((item) => {
    item.addEventListener("click", () => {
      const type = item.dataset.type;
      console.log(`🧩 FAB: clic en ${type}`);

      // Emitir evento personalizado
      const event = new CustomEvent("fab:create", {
        detail: { type },
      });
      document.dispatchEvent(event);

      // Cierra el menú
      fabMenu.classList.remove("is-active");
    });
  });
}