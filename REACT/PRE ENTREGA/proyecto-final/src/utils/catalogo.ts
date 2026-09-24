import type { DatoItem } from '../componentes/ItemList/ItemList'

// Fetch de productos.json cacheado a nivel de módulo: Inicio, Productos y
// cada visita a un DetalleProducto pedían el mismo JSON estático por
// separado. Con esto, la primera llamada dispara el fetch y las
// siguientes reusan la misma promesa (misma sesión de navegación).
let catalogoPromise: Promise<DatoItem[]> | null = null

export function obtenerCatalogo(): Promise<DatoItem[]> {
  if (!catalogoPromise) {
    catalogoPromise = fetch('/productos.json').then((res) => {
      if (!res.ok) {
        throw new Error('No se pudo cargar el catálogo')
      }
      return res.json()
    })
  }
  return catalogoPromise
}
