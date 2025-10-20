// web/js/views.js
// Sistema centralizado para la carga dinámica de vistas

function toPascalCase(viewName) {
  return viewName
    .split(/[-_/]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join("");
}

export async function loadView(viewName, container) {
  const target = container || document.getElementById("app");
  if (!viewName) {
    console.error("❌ loadView requiere un nombre de vista válido.");
    return;
  }
  if (!target) {
    console.error("❌ No se encontró el contenedor principal para renderizar la vista.");
    return;
  }

  const normalized = toPascalCase(viewName);
  const candidates = [
    `init${normalized}View`,
    `init${normalized}`,
    `render${normalized}View`,
    `render${normalized}`,
  ];

  try {
    const module = await import(`../views/${viewName}.js`);
    let initializer = null;

    for (const name of candidates) {
      if (typeof module[name] === "function") {
        initializer = module[name];
        break;
      }
    }

    if (!initializer && typeof module.default === "function") {
      initializer = module.default;
    }

    if (initializer) {
      await initializer(target);
      console.log(`✅ Vista ${viewName} cargada correctamente`);
    } else {
      console.warn(`⚠️ No se encontró función de inicialización para ${viewName}`);
    }
  } catch (error) {
    console.error(`❌ Error al cargar vista ${viewName}:`, error);
  }
}

export function loadCasosView(container) {
  return loadView("casos", container);
}

if (typeof window !== "undefined") {
  window.loadView = loadView;
  window.loadCasosView = loadCasosView;
}
