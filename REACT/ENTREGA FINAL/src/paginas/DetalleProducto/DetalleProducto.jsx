import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaShoppingCart, FaMinus, FaPlus, FaArrowLeft } from 'react-icons/fa'
import { obtenerCatalogo } from '../../utils/catalogo'
import { avisoPocoStock } from '../../utils/stock'
import { Seo } from '../../componentes/Seo/Seo'
import { Boton } from '../../componentes/ui/Boton/Boton'
import { ItemList } from '../../componentes/ItemList/ItemList'
import { useCarrito } from '../../context/useCarrito'
import styles from './DetalleProducto.module.css'

// Cuántos productos mostrar en "También te puede gustar" (una fila).
const CANTIDAD_RELACIONADOS = 3

// Vista de detalle de un producto puntual (Clase 07, paso 3). El :id
// viene de la URL vía useParams; traemos el catálogo completo (desde
// Firestore, Clase 09, cacheado en utils/catalogo.js) y buscamos el que
// matchea. El :id coincide con el ID del documento ("1".."20").
// Entrega Final: el catálogo también sirve para los productos relacionados
// (misma categoría), sin otra lectura a Firestore.
function DetalleProducto() {
  const { id } = useParams()
  const [catalogo, setCatalogo] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // "ignore" evita que una respuesta vieja (de un :id anterior) pise
    // el producto que corresponde al :id actual si llega fuera de orden.
    let ignore = false

    setCargando(true)
    setError(null)

    obtenerCatalogo()
      .then((data) => {
        if (!ignore) setCatalogo(data)
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

  // Al pasar a un producto relacionado la página no se recarga: sin esto
  // quedarías mirando la parte de abajo del producto nuevo.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  // Derivados del catálogo: no son estados aparte.
  const producto = catalogo.find((prod) => prod.id === id)
  const relacionados = producto
    ? catalogo
        .filter((p) => p.id !== producto.id && p.stock > 0 && p.categoria === producto.categoria)
        .slice(0, CANTIDAD_RELACIONADOS)
    : []

  if (cargando) {
    return <p className="cargando-pagina">Cargando producto...</p>
  }

  if (error || !producto) {
    return (
      <div style={{ textAlign: 'center' }}>
        <Seo
          titulo="Producto no encontrado"
          descripcion="El producto que buscás no existe o ya no está en el catálogo."
          noIndexar
        />
        <p style={{ color: 'var(--color-error, red)' }}>{error ?? 'Producto no encontrado'}</p>
        <Link to="/">Volver al inicio</Link>
      </div>
    )
  }

  return (
    <>
      {/* key: al cambiar de producto, React arma la ficha de cero y la
           cantidad elegida vuelve a 1 (si no, quedaría la del anterior). */}
      <FichaProducto key={producto.id} producto={producto} />

      {relacionados.length > 0 && (
        <section className="container catalogo-productos">
          <h2 className="section-title">También te puede gustar</h2>
          <div className="row g-4">
            <ItemList productos={relacionados} />
          </div>
        </section>
      )}
    </>
  )
}

function FichaProducto({ producto }) {
  const { agregarAlCarrito, cantidadEnCarrito } = useCarrito()
  const [cantidad, setCantidad] = useState(1)

  const enCarrito = cantidadEnCarrito(producto.id)
  // Lo que todavía se puede agregar (igual que en las tarjetas).
  const disponible = producto.stock - enCarrito
  const pocoStock = avisoPocoStock(producto.stock)

  const handleAgregar = () => {
    agregarAlCarrito(producto, cantidad)
    setCantidad(1)
  }

  let textoBoton = 'Agregar al carrito'
  if (producto.stock === 0) textoBoton = 'Sin stock'
  else if (disponible <= 0) textoBoton = 'Ya tenés todo el stock'

  return (
    <article className={styles.ficha}>
      {/* Clase 13: título y descripción armados con los datos del
           producto, así cada detalle tiene los suyos en Google y al
           compartirlo por WhatsApp. */}
      <Seo
        titulo={producto.nombre}
        descripcion={
          producto.descripcion ||
          `${producto.nombre}${producto.categoria ? ` (${producto.categoria})` : ''} a $${producto.precio.toLocaleString('es-AR')}. Estampado DTF de BuBus Originals, pedidos por WhatsApp.`
        }
      />

      <Link to="/productos" className={styles.volver}>
        <FaArrowLeft aria-hidden="true" />
        Volver al catálogo
      </Link>

      <div className={styles.grilla}>
        <div className={styles.foto}>
          {producto.imagen && <img src={producto.imagen} alt={producto.nombre} />}
        </div>

        <div className={styles.info}>
          {producto.categoria && <p className={styles.categoria}>{producto.categoria}</p>}
          <h1 className={styles.nombre}>{producto.nombre}</h1>

          <div className="price-container">
            <span className="currency">$</span>
            <span className="price-amount">{producto.precio.toLocaleString('es-AR')}</span>
          </div>
          {pocoStock && <p className="stock-tag stock-tag--poco">{pocoStock}</p>}

          {/* La descripción es opcional: se carga desde el panel. */}
          {producto.descripcion && <p className={styles.descripcion}>{producto.descripcion}</p>}

          {/* Mismo selector de cantidad que las tarjetas del catálogo. */}
          <div className={styles.compra}>
            <div className="quantity-controls">
              <button
                type="button"
                onClick={() => setCantidad(cantidad - 1)}
                disabled={cantidad <= 1 || disponible <= 0}
                aria-label="Restar una unidad"
              >
                <FaMinus aria-hidden="true" />
              </button>
              <span aria-live="polite">{cantidad}</span>
              <button
                type="button"
                onClick={() => setCantidad(cantidad + 1)}
                disabled={cantidad >= disponible}
                aria-label="Sumar una unidad"
              >
                <FaPlus aria-hidden="true" />
              </button>
            </div>

            <Boton type="button" onClick={handleAgregar} disabled={disponible <= 0}>
              <FaShoppingCart aria-hidden="true" />
              {textoBoton}
            </Boton>
          </div>

          {enCarrito > 0 && (
            <p className={styles.enCarrito}>
              Ya tenés {enCarrito} en el carrito. <Link to="/carrito">Ver carrito</Link>
            </p>
          )}
        </div>
      </div>
    </article>
  )
}

export default DetalleProducto
