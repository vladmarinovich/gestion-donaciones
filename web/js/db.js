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
export { db };

/**
 * Obtiene todos los documentos de una colección.
 */
export async function getAll(collectionName) {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`❌ Error al obtener ${collectionName}:`, error);
    return [];
  }
}

/**
 * Crea un nuevo documento.
 */
export async function create(collectionName, data) {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log(`✅ Documento creado en ${collectionName}:`, docRef.id);
    return docRef.id;
  } catch (error) {
    console.error(`❌ Error al crear documento en ${collectionName}:`, error);
  }
}

/**
 * Actualiza un documento existente.
 */
export async function update(collectionName, id, data) {
  try {
    await updateDoc(doc(db, collectionName, id), data);
    console.log(`✏️ Documento actualizado (${collectionName}/${id})`);
  } catch (error) {
    console.error(`❌ Error al actualizar documento:`, error);
  }
}

/**
 * Elimina un documento por ID.
 */
export async function remove(collectionName, id) {
  try {
    await deleteDoc(doc(db, collectionName, id));
    console.log(`🗑️ Documento eliminado (${collectionName}/${id})`);
  } catch (error) {
    console.error(`❌ Error al eliminar documento:`, error);
  }
}

console.log('✅ Módulo de base de datos cargado.');
window.getAll = getAll;

window.createDonacion = async () => {
  const nuevaDonacion = {
    id_donacion: "DON-TEST-001",
    monto: 50000,
    medio_pago: "Nequi",
    fecha: new Date(),
    estado: "confirmado",
    notas: "Donación de prueba desde consola"
  };

  const docRef = await addDoc(collection(db, "donaciones"), nuevaDonacion);
  console.log("✅ Donación creada con ID:", docRef.id);
};