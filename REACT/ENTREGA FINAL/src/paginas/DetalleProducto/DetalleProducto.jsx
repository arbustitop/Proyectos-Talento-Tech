import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { obtenerCatalogo } from '../../utils/catalogo'
import { FaShoppingCart } from 'react-icons/fa'
import { Seo } from '../../componentes/Seo/Seo'
import { Boton } from '../../componentes/ui/Boton/Boton'
import { useCarrito } from '../../context/useCarrito'

// Vista de detalle de un producto puntual (Clase 07, paso 3). El :id
// viene de la URL vía useParams; traemos el catálogo completo (desde
// Firestore, Clase 09, cacheado en utils/catalogo.js) y buscamos el que
// matchea. El :id coincide con el ID del documento ("1".."20").
function DetalleProducto() {
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  // Entrega Final: el detalle también agrega al carrito (de a una unidad;
  // para elegir cantidad están las tarjetas del catálogo).
  const { agregarAlCarrito, cantidadEnCarrito } = useCarrito()

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
      .catch((err) => {
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
        <Seo
          titulo="Producto no encontrado"
          descripcion="El producto que buscás no existe o ya no está en el catálogo."
          noIndexar
        />
        <p style={{ color: 'var(--color-error, red)' }}>{error}</p>
        <Link to="/">Volver al inicio</Link>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', textAlign: 'center' }}>
      {/* Clase 13: título y descripción armados con los datos del
           producto, así cada detalle tiene los suyos en Google y al
           compartirlo por WhatsApp. */}
      <Seo
        titulo={producto.nombre}
        descripcion={`${producto.nombre}${producto.categoria ? ` (${producto.categoria})` : ''} a $${producto.precio.toLocaleString('es-AR')}. Estampado DTF de BuBus Originals, pedidos por WhatsApp.`}
      />

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
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        ${producto.precio.toLocaleString('es-AR')}
      </p>
      <p>Stock disponible: {producto.stock}</p>

      {/* Se deshabilita si ya están todas las unidades en el carrito. */}
      <Boton
        type="button"
        onClick={() => agregarAlCarrito(producto, 1)}
        disabled={cantidadEnCarrito(producto.id) >= producto.stock}
      >
        <FaShoppingCart aria-hidden="true" />
        {cantidadEnCarrito(producto.id) > 0
          ? `Agregar otro (ya tenés ${cantidadEnCarrito(producto.id)})`
          : 'Agregar al carrito'}
      </Boton>
    </div>
  )
}

export default DetalleProducto
