// ✅ /web/js/auth.js
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

import { app } from "./firebase-config.js";

// Inicializamos Auth
export const auth = getAuth(app);

// 🟣 Iniciar sesión con email y contraseña
window.loginWithEmail = async function () {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("✅ Inicio de sesión exitoso:", user.email);
    window.location.href = "./index.html"; // redirige al dashboard
  } catch (error) {
    console.error("❌ Error de inicio de sesión:", error.message);
    alert("Error: " + error.message);
  }
};

// 🟢 Iniciar sesión con Google
window.loginWithGoogle = async function () {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    console.log("✅ Inicio de sesión con Google:", result.user.email);
    window.location.href = "./index.html";
  } catch (error) {
    console.error("❌ Error al iniciar con Google:", error.message);
    alert("Error: " + error.message);
  }
};

// 🚪 Cerrar sesión
window.logout = function () {
  signOut(auth).then(() => {
    console.log("👋 Sesión cerrada");
    window.location.href = "./login.html";
  });
};

// 📡 Escuchar cambios en el estado de autenticación
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("📡 Usuario autenticado:", user.email);
  } else {
    console.log("⚠️ No autenticado");
  }
});