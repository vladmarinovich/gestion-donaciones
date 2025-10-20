// web/views/casos.js
// Vista base para la sección de Casos (sin lógica de datos)

export function initCasosView(container = document.getElementById("app")) {
  if (!container) return;

  container.innerHTML = `
    <section class="sp-casos-view">
      <h1 class="sp-view-title">📋 Casos</h1>
      <p class="sp-placeholder">
        Aquí se mostrarán los registros de casos próximamente.
      </p>
    </section>
  `;
}
