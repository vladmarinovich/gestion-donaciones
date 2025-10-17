// /web/js/db.js
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js';
import { app } from './firebase-config.js';

const db = getFirestore(app);

/**
 * Obtiene todos los documentos de una colección.
 * @param {string} collectionName - El nombre de la colección.
 * @returns {Promise<Array>} - Un array de documentos, cada uno con su ID.
 */
export async function getAll(collectionName) {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Aquí puedes añadir más funciones genéricas para Firestore
// export const create = (collectionName, data) => addDoc(collection(db, collectionName), data);
// export const update = (collectionName, id, data) => updateDoc(doc(db, collectionName, id), data);
// export const remove = (collectionName, id) => deleteDoc(doc(db, collectionName, id));

console.log('✅ Módulo de base de datos cargado.');