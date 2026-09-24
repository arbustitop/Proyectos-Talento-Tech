import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import type { DatoItem } from '../../componentes/ItemList/ItemList'
import { obtenerCatalogo } from '../../utils/catalogo'

// Vista de detalle de un producto puntual (Clase 07, paso 3). El :id
// viene de la URL vía useParams; traemos el catálogo completo desde
// productos.json y buscamos el que matchea.
function DetalleProducto() {
  const { id } = useParams()
  const [producto, setProducto] = useState<DatoItem | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // "ignore" evita que una respuesta vieja (de un :id anterior) pise
    // el producto que corresponde al :id actual si llega fuera de orden.
    let ignore = false

    setCargando(true)
    setError(null)

    obtenerCatalogo()
      .then((data) => {
        const encontrado = data.find((prod) => prod.id === id)
        if (!encontrado) {
          throw new Error('Producto no encontrado')
        }
        if (!ignore) setProducto(encontrado)
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
  }, [id])

  if (cargando) {
    return <p style={{ textAlign: 'center' }}>Cargando producto...</p>
  }

  if (error || !producto) {
    return (
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--color-error, red)' }}>{error}</p>
        <Link to="/">Volver al inicio</Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
      <Link to="/">&larr; Volver</Link>
      {producto.imagen && (
        <img
          src={producto.imagen}
          alt={producto.nombre}
          style={{ width: '100%', borderRadius: '8px', margin: '16px 0' }}
        />
      )}
      <h2 className="product-title">{producto.nombre}</h2>
      {producto.categoria && (
        <p style={{ color: 'var(--accent-purple)', fontWeight: 'bold' }}>{producto.categoria}</p>
      )}
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${producto.precio.toLocaleString('es-AR')}</p>
      <p>Stock disponible: {producto.stock}</p>
    </div>
  )
}

export default DetalleProducto
