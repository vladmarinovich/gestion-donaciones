// web/js/main.js
// ===================================================
// 🔹 APP PRINCIPAL: Gestión de Donaciones - Salvando Patitas 🐾
// ===================================================

// ===== 🔹 IMPORTS =====
import { auth, onAuthStateChanged } from "./auth.js";

// Componentes principales
import { SpHeader } from "../components/Header/header.js";
import { SpSidebar } from "../components/Sidebar/sidebar.js";
import { initFAB } from "../components/FAB/fab.js";

// Carga dinámica de vistas
import { loadView as loadDynamicView } from "./views.js";

// ===== 🔹 MAPA DE RUTAS =====
const routes = {
  "#/dashboard": (container) => loadDynamicView("dashboard", container),
  "#/donaciones": (container) => loadDynamicView("donaciones", container),
  "#/donantes": (container) => loadDynamicView("donantes", container),
  "#/gastos": (container) => loadDynamicView("gastos", container),
  "#/hogares": (container) => loadDynamicView("hogares", container),
  "#/proveedores": (container) => loadDynamicView("proveedores", container),
  "#/casos": (container) => loadDynamicView("casos", container),
};

// ===================================================
// 🔹 FUNCIÓN DE ENRUTAMIENTO SPA
// ===================================================
function loadRoute() {
  const hash = window.location.hash || "#/dashboard";
  const view = routes[hash];
  const container = document.getElementById("app");
  container.innerHTML = "";

  if (view) view(container);
  else container.innerHTML = "<p>⚠️ Vista no encontrada.</p>";
}

// ===================================================
// 🔹 INICIALIZACIÓN DE LA APLICACIÓN
// ===================================================
function initializeApp(user) {
  console.log("✅ Usuario autenticado:", user?.email || "Sin email");

  const sidebarRoot = document.getElementById("sidebar");
  const headerRoot = document.getElementById("header");
  const fabRoot = document.getElementById("fab-root");

  if (!sidebarRoot || !headerRoot || !fabRoot) {
    console.error("❌ No se encontraron elementos base en el DOM.");
    return;
  }

  // Sidebar
  const sidebar = new SpSidebar();
  sidebar.mount(sidebarRoot, { user });

  // Header
  const header = new SpHeader();
  header.mount(headerRoot, { title: "Dashboard" });

  // ===== 🧩 FAB =====
  requestAnimationFrame(() => {
    initFAB(); // Usa el FAB modular
  });

  // Enrutamiento SPA
  window.addEventListener("hashchange", loadRoute);
  loadRoute();
}

// ===================================================
// 🔹 CONTROL DE SESIÓN Y ARRANQUE DE APP
// ===================================================
window.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    const path = window.location.pathname;
    const isAppPage =
      path.endsWith("index.html") || path === "/" || path === "";
    const isLoginPage = path.includes("login.html");

    if (user) {
      // ✅ Usuario autenticado
      if (isLoginPage) {
        window.location.replace("/index.html#/dashboard");
      } else if (isAppPage) {
        initializeApp(user);
      }
    } else {
      // 🚫 Usuario NO autenticado
      if (isAppPage) {
        console.warn("⚠️ Usuario no autenticado, redirigiendo a login...");
        window.location.replace("/login.html");
      }
    }
  });
});
