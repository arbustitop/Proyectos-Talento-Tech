import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaShoppingCart, FaMinus, FaPlus, FaArrowLeft, FaWhatsapp } from 'react-icons/fa'
import { useCatalogo } from '../../hooks/useCatalogo'
import { avisoPocoStock } from '../../utils/stock'
import { nombreCategoria } from '../../utils/categorias'
import { linkWhatsApp } from '../../utils/contacto'
import { Seo } from '../../componentes/Seo/Seo'
import { Boton } from '../../componentes/ui/Boton/Boton'
import { EstadoCatalogo } from '../../componentes/ui/EstadoCatalogo/EstadoCatalogo'
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
// Rediseño: la carga vive en el hook useCatalogo (la comparte con el
// catálogo) y los tres estados que no son "producto encontrado" tienen su
// propia pantalla: cargando, error y producto que no existe.
// (Volver arriba al pasar a un relacionado lo hace ScrollArriba, en Layout.)
function DetalleProducto() {
  const { id } = useParams()
  const { productos: catalogo, cargando, error, reintentar } = useCatalogo()

  // Derivados del catálogo: no son estados aparte.
  const producto = catalogo.find((prod) => prod.id === id)
  const relacionados = producto
    ? catalogo
        .filter((p) => p.id !== producto.id && p.stock > 0 && p.categoria === producto.categoria)
        .slice(0, CANTIDAD_RELACIONADOS)
    : []

  if (cargando) {
    return <FichaCargando />
  }

  // Falló la lectura (sin conexión, Firestore caído): se puede reintentar.
  if (error) {
    return (
      <div className={styles.estado}>
        <Seo titulo="Producto" descripcion="No pudimos cargar este producto." noIndexar />
        <EstadoCatalogo error role="alert">
          <p>No pudimos cargar este producto. Revisá tu conexión y probá de nuevo.</p>
          <Boton type="button" variante="contorno" onClick={reintentar}>
            Reintentar
          </Boton>
        </EstadoCatalogo>
      </div>
    )
  }

  // El catálogo cargó pero ese :id no está (link viejo o producto borrado
  // desde el panel). Dos salidas: el catálogo o preguntar por WhatsApp.
  if (!producto) {
    return (
      <div className={styles.estado}>
        <Seo
          titulo="Producto no encontrado"
          descripcion="El producto que buscás no existe o ya no está en el catálogo."
          noIndexar
        />
        <EstadoCatalogo>
          <h1 className={styles.estadoTitulo}>Este producto ya no está</h1>
          <p>Puede que lo hayamos sacado del catálogo. Fijate si hay algo parecido o preguntanos.</p>
          <div className={styles.estadoAcciones}>
            <Boton como={Link} to="/productos">
              Ver el catálogo
            </Boton>
            <Boton
              como="a"
              variante="contorno"
              href={linkWhatsApp('Hola BuBus! Buscaba un producto que ya no está en la web.')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp aria-hidden="true" />
              Preguntar por WhatsApp
            </Boton>
          </div>
        </EstadoCatalogo>
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
          {producto.categoria && (
            <p className={styles.categoria}>{nombreCategoria(producto.categoria)}</p>
          )}
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

// Mientras carga: la misma grilla de la ficha con bloques grises donde van
// a ir la foto, el nombre, el precio y el botón ("skeleton"). La página no
// salta cuando llegan los datos, y se nota que algo está por aparecer en
// vez de un "Cargando..." suelto.
function FichaCargando() {
  return (
    <div className={styles.ficha} role="status">
      <span className="visually-hidden">Cargando producto</span>
      <div className={styles.grilla} aria-hidden="true">
        <div className={`${styles.esqueleto} ${styles.esqueletoFoto}`} />
        <div className={styles.info}>
          <div className={styles.esqueleto} style={{ width: '25%', height: '1.5rem' }} />
          <div className={styles.esqueleto} style={{ width: '80%', height: '2.4rem' }} />
          <div className={styles.esqueleto} style={{ width: '35%', height: '2rem' }} />
          <div className={styles.esqueleto} style={{ width: '60%', height: '3rem' }} />
        </div>
      </div>
    </div>
  )
}

export default DetalleProducto
