import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Separa las librerías grandes (node_modules) en archivos propios.
//
// Antes todo salía en un solo index-*.js de ~800 kB. Partido:
//  - el navegador baja varios archivos en paralelo, y
//  - las librerías cambian poco: cuando publicamos un cambio nuestro, el
//    hash de esos archivos no cambia y el navegador los reusa de la caché.
//    Solo se vuelve a bajar el archivo chico con el código de la tienda.
//
// Cada grupo se lleva también las dependencias de lo que captura. Por eso
// el núcleo de Firebase (@firebase/app, util, logger...) viaja dentro de
// `firebase`: no hace falta un grupo aparte para él.
//
// `priority`: si un módulo coincide con dos grupos, gana el de número más
// alto. Las rutas se escriben con [\\/] para que funcione con las barras
// de Windows (\) y de Linux/Vercel (/).
const grupos = [
  // Firestore (catálogo, cupones, equipo) + el núcleo de Firebase.
  // webchannel-wrapper es la conexión en tiempo real que usa Firestore.
  // Ojo: no capturar el paquete `firebase/` entero, porque reexporta también
  // Auth y el grupo se lo llevaría todo a un solo archivo.
  { name: 'firebase', test: /node_modules[\\/]@firebase[\\/](firestore|webchannel-wrapper)[\\/]/, priority: 30 },
  // Authentication (login, registro, sesión).
  { name: 'firebase-auth', test: /node_modules[\\/]@firebase[\\/]auth[\\/]/, priority: 20 },
  { name: 'react', test: /node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/, priority: 10 },
]

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: { groups: grupos },
      },
    },
  },
  // Tests (npm test): Vitest usa esta misma config. jsdom simula el
  // navegador (document, localStorage) para poder renderizar componentes.
  test: {
    environment: 'jsdom',
  },
})
