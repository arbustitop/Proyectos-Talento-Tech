import { useCallback, useEffect, useState } from 'react'
import { obtenerCatalogo } from '../utils/catalogo'

// Hook propio: carga el catálogo y devuelve en qué estado está.
//
// Antes ItemListContainer y DetalleProducto repetían el mismo bloque
// (useState de productos, cargando y error + useEffect con "ignore").
// Ahora los dos lo piden así:
//
//   const { productos, cargando, error, reintentar } = useCatalogo()
//
// `reintentar` vuelve a pedir el catálogo después de un error (por ejemplo
// si se cortó internet). obtenerCatalogo ya borra su caché cuando falla,
// así que el nuevo pedido va de verdad a Firestore.
export function useCatalogo() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  // Cada reintento suma 1; como está en las dependencias del efecto, el
  // efecto vuelve a correr y pide el catálogo otra vez.
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    // "ignore" evita setState si el componente se desmontó (o se pidió un
    // reintento) antes de que responda Firestore.
    let ignore = false

    obtenerCatalogo()
      .then((data) => {
        if (!ignore) setProductos(data)
      })
      .catch((err) => {
        if (!ignore) setError(err.message)
      })
      .finally(() => {
        if (!ignore) setCargando(false)
      })

    return () => {
      ignore = true
    }
  }, [intento])

  // useCallback: la función es la misma en cada render, así se puede pasar
  // a un botón sin que cambie de identidad.
  const reintentar = useCallback(() => {
    setError(null)
    setCargando(true)
    setIntento((n) => n + 1)
  }, [])

  return { productos, cargando, error, reintentar }
}
