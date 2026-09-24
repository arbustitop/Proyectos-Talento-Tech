// ItemListContainer — "El Cerebro" (Clase 04, Nivel 1). Consigue los
// datos y se los pasa a ItemList; no le importa cómo se muestran.
// Clase 08: carga el catálogo desde /productos.json (carpeta public/)
// con fetch en vez de tenerlo hardcodeado.

import { useState, useEffect } from 'react'
import { ItemList, type DatoItem } from '../ItemList/ItemList'
import { obtenerCatalogo } from '../../utils/catalogo'

interface ItemListContainerProps {
  Mensaje: string
}

export function ItemListContainer({ Mensaje }: ItemListContainerProps) {
  const [products, setProducts] = useState<DatoItem[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // "ignore" evita setState si el componente se desmontó antes de que
    // resuelva el fetch (ej. el usuario navega a otra página).
    let ignore = false

    obtenerCatalogo()
      .then((data) => {
        if (!ignore) setProducts(data)
      })
      .catch((err: Error) => {
        if (!ignore) setError(err.message)
      })
      .finally(() => {
        if (!ignore) setCargando(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  if (cargando) {
    return (
      <div>
        <h2 className="section-title">{Mensaje}</h2>
        <p style={{ textAlign: 'center' }}>Cargando productos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h2 className="section-title">{Mensaje}</h2>
        <p style={{ textAlign: 'center', color: 'var(--color-error, red)' }}>Error: {error}</p>
      </div>
    )
  }

  // Filtramos antes de pasarle la lista a ItemList: solo se muestran los
  // productos que tienen stock disponible.
  const productosConStock = products.filter((prod) => prod.stock > 0)

  return (
    <div>
      <h2 className="section-title">{Mensaje}</h2>
      <div className="products-grid">
        <ItemList productos={productosConStock} />
      </div>
    </div>
  )
}
