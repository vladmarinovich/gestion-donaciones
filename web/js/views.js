// web/js/views.js
// Helpers para cargar vistas bajo demanda

export function loadCasosView(container) {
  const target = container || document.getElementById("app");
  if (!target) return;

  import("../views/casos.js")
    .then(({ initCasosView }) => {
      if (typeof initCasosView === "function") {
        initCasosView(target);
      }
    })
    .catch((error) => {
      console.error("No se pudo cargar la vista de Casos:", error);
    });
}

if (typeof window !== "undefined") {
  window.loadCasosView = loadCasosView;
}
