import { auth } from "./firebase-config.js";
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut }
  from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

// Botones (si aún no los tienes en el HTML no pasa nada)
window.loginWithGoogle = async () => {
  const prov = new GoogleAuthProvider();
  await signInWithPopup(auth, prov);
};

window.logout = () => signOut(auth);

// Log rápido para verificar que Auth responde
onAuthStateChanged(auth, (u) => {
  console.log("auth state:", u ? u.email : "no autenticado");
});