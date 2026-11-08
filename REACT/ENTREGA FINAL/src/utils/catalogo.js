// Clase 09: el catálogo sale de la colección `productos` de Firestore.
// (public/productos.json queda solo como fuente del script de carga
// inicial, scripts/seed-productos.mjs: la app ya no lo lee.)
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'

// Catálogo cacheado a nivel de módulo: Inicio, Productos y cada visita a un
// DetalleProducto piden el mismo catálogo. Con esto, la primera llamada
// dispara la lectura a Firestore y las siguientes reusan la misma promesa
// (misma sesión de navegación). Es la única puerta de entrada a los
// productos: si cambia de dónde vienen, solo se toca este archivo.
let catalogoPromise = null

// Clase 11: el panel de administración crea, edita y borra productos. Sin
// esto, la tienda seguiría mostrando el catálogo cacheado de antes del
// cambio hasta recargar la página. El panel la llama después de cada
// escritura y la próxima visita al catálogo vuelve a leer Firestore.
export function invalidarCatalogo() {
  catalogoPromise = null
}

// Orden del catálogo. Firestore ordena los IDs como TEXTO ("1", "10",
// "2"...). Los productos cargados a mano tienen IDs numéricos ("1".."20"),
// pero los que crea el panel con addDoc (Clase 10/11) tienen IDs
// automáticos ("aB3xK..."), y Number() de esos da NaN, lo que rompe el
// sort. Van primero los numéricos como números y al final los
// automáticos, por nombre. La usa también el panel de productos.
export function compararProductos(a, b) {
  const na = Number(a.id)
  const nb = Number(b.id)
  const aEsNumero = Number.isFinite(na)
  const bEsNumero = Number.isFinite(nb)
  if (aEsNumero && bEsNumero) return na - nb
  if (aEsNumero) return -1
  if (bEsNumero) return 1
  return a.nombre.localeCompare(b.nombre)
}

export function obtenerCatalogo() {
  if (!catalogoPromise) {
    catalogoPromise = getDocs(collection(db, 'productos'))
      .then((snapshot) => {
        // Cada documento trae su ID por un lado (doc.id) y sus campos por
        // otro (doc.data()): los juntamos en un solo objeto.
        const productos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        // Firestore ordena por ID como texto: ver compararProductos.
        return productos.sort(compararProductos)
      })
      .catch((error) => {
        // Si falló, borramos la promesa cacheada: así la próxima visita
        // vuelve a intentar en lugar de reusar el error para siempre.
        catalogoPromise = null
        // El detalle técnico (ej. "Missing or insufficient permissions")
        // va a la consola; la pantalla muestra un mensaje entendible.
        console.error('Error al leer productos de Firestore:', error)
        throw new Error('No se pudo cargar el catálogo')
      })
  }
  return catalogoPromise
}
