import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { FaShoppingCart, FaMinus, FaPlus, FaArrowLeft, FaWhatsapp } from 'react-icons/fa'
import { useCatalogo } from '../../hooks/useCatalogo'
import { avisoPocoStock } from '../../utils/stock'
import { nombreCategoria } from '../../utils/categorias'
import { opcionesDe } from '../../utils/variantes'
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

  // Talle y color: arrancan sin elegir. Si el producto no los usa (mochila,
  // pliego) las listas vienen vacías y no se muestra ningún selector.
  const { talles, colores } = opcionesDe(producto)
  const [talle, setTalle] = useState('')
  const [color, setColor] = useState('')
  // Se muestra el aviso "Elegí talle y color" recién cuando intentan
  // agregar sin elegir, no apenas entran a la ficha.
  const [intentoSinElegir, setIntentoSinElegir] = useState(false)

  // Galería: la foto principal más las extra que se cargan desde el panel.
  // Con una sola foto no hay miniaturas.
  const fotos = [producto.imagen, ...(producto.fotos ?? [])].filter(Boolean)
  const [fotoActual, setFotoActual] = useState(0)

  // En el carrito: todas las variantes de este producto (el stock es uno
  // solo por producto, no por talle).
  const enCarrito = cantidadEnCarrito(producto.id)
  const disponible = producto.stock - enCarrito
  const pocoStock = avisoPocoStock(producto.stock)

  const faltaTalle = talles.length > 0 && !talle
  const faltaColor = colores.length > 0 && !color

  const handleAgregar = () => {
    if (faltaTalle || faltaColor) {
      setIntentoSinElegir(true)
      return
    }
    agregarAlCarrito(producto, cantidad, { talle, color })
    setCantidad(1)
    setIntentoSinElegir(false)
  }

  let textoBoton = 'Agregar al carrito'
  if (producto.stock === 0) textoBoton = 'Sin stock'
  else if (disponible <= 0) textoBoton = 'Ya tenés todo el stock'

  // Qué falta elegir, para el aviso.
  const faltan = [faltaTalle && 'talle', faltaColor && 'color'].filter(Boolean).join(' y ')

  return (
    <article className={styles.ficha}>
      {/* Clase 13: título y descripción armados con los datos del
           producto, así cada detalle tiene los suyos en Google y al
           compartirlo por WhatsApp. */}
      <Seo
        titulo={producto.nombre}
        descripcion={
          producto.descripcion ||
          `${producto.nombre}${producto.categoria ? ` (${nombreCategoria(producto.categoria)})` : ''} a $${producto.precio.toLocaleString('es-AR')}. Estampado DTF de BuBus Originals, pedidos por WhatsApp.`
        }
      />

      <Link to="/productos" className={styles.volver}>
        <FaArrowLeft aria-hidden="true" />
        Volver al catálogo
      </Link>

      <div className={styles.grilla}>
        <div>
          <div className={styles.foto}>
            {fotos.length > 0 && (
              <img
                src={fotos[fotoActual]}
                alt={
                  fotos.length > 1
                    ? `${producto.nombre}, foto ${fotoActual + 1} de ${fotos.length}`
                    : producto.nombre
                }
              />
            )}
          </div>

          {/* Miniaturas: cada una es un botón que cambia la foto grande.
               aria-pressed marca cuál se está viendo. */}
          {fotos.length > 1 && (
            <div className={styles.miniaturas}>
              {fotos.map((url, i) => (
                <button
                  key={url}
                  type="button"
                  className={styles.miniatura}
                  aria-pressed={i === fotoActual}
                  aria-label={`Ver foto ${i + 1} de ${fotos.length}`}
                  onClick={() => setFotoActual(i)}
                >
                  <img src={url} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.info}>
          {producto.categoria && (
            <p className={styles.categoria}>{nombreCategoria(producto.categoria)}</p>
          )}
          <h1 className={styles.nombre}>{producto.nombre}</h1>

          <p className={styles.precio}>${producto.precio.toLocaleString('es-AR')}</p>
          {pocoStock && <p className="stock-tag stock-tag--poco">{pocoStock}</p>}

          {/* La descripción es opcional: se carga desde el panel. */}
          {producto.descripcion && <p className={styles.descripcion}>{producto.descripcion}</p>}

          {talles.length > 0 && (
            <SelectorOpciones
              titulo="Talle"
              nombre={`talle-${producto.id}`}
              opciones={talles}
              elegida={talle}
              alElegir={setTalle}
              falta={intentoSinElegir && faltaTalle}
            />
          )}
          {colores.length > 0 && (
            <SelectorOpciones
              titulo="Color"
              nombre={`color-${producto.id}`}
              opciones={colores}
              elegida={color}
              alElegir={setColor}
              falta={intentoSinElegir && faltaColor}
            />
          )}

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

          {/* Aviso si intentaron agregar sin elegir. role="alert": el
               lector de pantalla lo lee apenas aparece. */}
          {intentoSinElegir && faltan && (
            <p className={styles.falta} role="alert">
              Elegí {faltan} antes de agregarlo.
            </p>
          )}

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

// Grupo de opciones (talles o colores) como botones redondeados.
// Por dentro son radio buttons de verdad (fieldset + input type="radio"):
// se elige uno solo, se navega con las flechas del teclado y el lector de
// pantalla anuncia "Talle, M, 2 de 5". El input queda invisible y se ve la
// etiqueta con forma de botón.
function SelectorOpciones({ titulo, nombre, opciones, elegida, alElegir, falta }) {
  return (
    <fieldset className={`${styles.selector} ${falta ? styles.selectorFalta : ''}`}>
      <legend className={styles.selectorTitulo}>
        {titulo}
        {elegida && <span className={styles.selectorElegida}>: {elegida}</span>}
      </legend>
      <div className={styles.opciones}>
        {opciones.map((opcion) => (
          <label key={opcion} className={styles.opcion}>
            <input
              type="radio"
              name={nombre}
              value={opcion}
              checked={elegida === opcion}
              onChange={() => alElegir(opcion)}
            />
            <span>{opcion}</span>
          </label>
        ))}
      </div>
    </fieldset>
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
