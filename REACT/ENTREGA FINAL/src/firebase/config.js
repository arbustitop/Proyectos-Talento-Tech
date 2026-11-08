// Clase 09: conexión con Firebase. Este archivo inicializa la app una sola
// vez y exporta `db` (la base de Firestore) y, desde la Clase 12, `auth`
// (Firebase Authentication) para que cualquier componente o util los
// importe: `import { db, auth } from '../firebase/config'`.
//
// Los valores salen de la consola de Firebase (Configuración del proyecto →
// Tus apps → app web) y viven en .env, igual que la key de Imgbb. La config
// web de Firebase no es un secreto (viaja igual al navegador); lo que
// protege los datos son las reglas de Firestore. La sacamos a .env para no
// hardcodear valores por entorno y para seguir el mismo patrón del proyecto.
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)

// Clase 12: sesión de usuario. Requiere Authentication → Método de acceso →
// "Correo electrónico/contraseña" activado en la consola. Desde la Entrega
// Final cualquiera puede registrarse en /registro.
export const auth = getAuth(app)

// UID del dueño de la tienda (Authentication → Usuarios, columna "UID de
// usuario"). Solo esa cuenta ve el panel de administración. No es un
// secreto: lo que de verdad protege los datos son las reglas de Firestore,
// que piden este mismo UID para escribir. Esto es para que un cliente
// registrado ni siquiera vea pantallas que no puede usar.
export const ADMIN_UID = import.meta.env.VITE_ADMIN_UID
