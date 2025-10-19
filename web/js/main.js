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

// Vistas
import { renderDashboard } from "../views/dashboard.js";
import { renderDonaciones } from "../views/donaciones.js";
import { renderDonantes } from "../views/donantes.js";
import { renderGastos } from "../views/gastos.js";
import { renderHogares } from "../views/hogares.js";
import { renderProveedores } from "../views/proveedores.js";

// ===== 🔹 MAPA DE RUTAS =====
const routes = {
  "#/dashboard": renderDashboard,
  "#/donaciones": renderDonaciones,
  "#/donantes": renderDonantes,
  "#/gastos": renderGastos,
  "#/hogares": renderHogares,
  "#/proveedores": renderProveedores,
};

// ===================================================
// 🔹 FUNCIÓN DE ENRUTAMIENTO SPA
// ===================================================
function loadView() {
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
  window.addEventListener("hashchange", loadView);
  loadView();
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
