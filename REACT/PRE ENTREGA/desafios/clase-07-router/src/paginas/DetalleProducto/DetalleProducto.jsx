import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

// Paso 3 del obligatorio: vista de detalle de un producto puntual.
// El :id viene de la URL (/producto/:id) via useParams. Traemos el
// catálogo completo desde productos.json y buscamos el que matchea,
// así el detalle tiene datos (imagen, categoría) que el listado
// resumido de ItemListContainer no necesita mostrar.
function DetalleProducto() {
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setCargando(true)
    setError(null)

    fetch('/productos.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error('No se pudo cargar el catálogo')
        }
        return res.json()
      })
      .then((data) => {
        const encontrado = data.find((prod) => prod.id === id)
        if (!encontrado) {
          throw new Error('Producto no encontrado')
        }
        setProducto(encontrado)
      })
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [id])

  if (cargando) {
    return <p>Cargando producto...</p>
  }

  if (error) {
    return (
      <div>
        <p style={{ color: 'red' }}>{error}</p>
        <Link to="/">Volver al inicio</Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
      <Link to="/">&larr; Volver</Link>
      <img
        src={producto.imagen}
        alt={producto.nombre}
        style={{ width: '100%', borderRadius: '8px', margin: '16px 0' }}
      />
      <h2>{producto.nombre}</h2>
      <p style={{ color: '#7C3AED', fontWeight: 'bold' }}>{producto.categoria}</p>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>${producto.precio}</p>
      <p>Stock disponible: {producto.stock}</p>
    </div>
  )
}

export default DetalleProducto
