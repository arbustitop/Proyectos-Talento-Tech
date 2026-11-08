// Carga única: sube los 12 productos de public/productos.json a la
// colección `productos` de Firestore, usando el id del JSON ("1".."12")
// como ID del documento. Así las URLs /producto/:id siguen andando.
//
// Uso (desde proyecto-final/):
//   node --env-file=.env scripts/seed-productos.mjs
//
// Necesita que las reglas de Firestore permitan escribir (modo de prueba)
// mientras corre. Después publicá las reglas de solo lectura.
// Volver a correrlo pisa esos 12 documentos con los datos del JSON; no
// toca los productos que cargues a mano con otros IDs.
import { readFile } from 'node:fs/promises'
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, writeBatch, terminate } from 'firebase/firestore'

const env = process.env
const faltantes = ['VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_PROJECT_ID', 'VITE_FIREBASE_APP_ID']
  .filter((nombre) => !env[nombre])
if (faltantes.length > 0) {
  console.error(`Faltan en .env: ${faltantes.join(', ')}`)
  process.exit(1)
}

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
})
const db = getFirestore(app)

const productos = JSON.parse(
  await readFile(new URL('../public/productos.json', import.meta.url), 'utf8'),
)

// Un batch escribe todo junto: o se suben los 12, o ninguno.
const batch = writeBatch(db)
for (const { id, ...datos } of productos) {
  batch.set(doc(db, 'productos', id), datos)
}

// Si la base no existe o no hay conexión, el SDK reintenta en silencio
// para siempre. Cortamos a los 30 s con un error que se entienda.
const LIMITE_MS = 30_000
let temporizador
const limite = new Promise((_, rechazar) => {
  temporizador = setTimeout(
    () => rechazar(Object.assign(new Error('Firestore no respondió en 30 s'), { code: 'timeout' })),
    LIMITE_MS,
  )
})

try {
  await Promise.race([batch.commit(), limite])
  console.log(`Listo: ${productos.length} productos en Firestore (${env.VITE_FIREBASE_PROJECT_ID}).`)
} catch (error) {
  console.error('No se pudo escribir en Firestore:', error.code ?? error.message)
  if (error.code === 'permission-denied') {
    console.error('Las reglas no permiten escribir: activá el modo de prueba mientras corre el script.')
  }
  if (error.code === 'timeout') {
    console.error('Revisá que la base (default) de Firestore exista en la consola y que tengas internet.')
  }
  process.exitCode = 1
} finally {
  clearTimeout(temporizador)
  // terminate() espera las escrituras pendientes: si se cortó por
  // tiempo, no lo esperamos y salimos igual.
  if (process.exitCode) process.exit()
  await terminate(db)
}
