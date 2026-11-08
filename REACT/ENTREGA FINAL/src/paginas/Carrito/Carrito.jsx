import { Link } from 'react-router-dom'
import { FaTrashAlt, FaMinus, FaPlus } from 'react-icons/fa'
import { Seo } from '../../componentes/Seo/Seo'
import { Boton } from '../../componentes/ui/Boton/Boton'
import { useCarrito } from '../../context/useCarrito'
import styles from './Carrito.module.css'

// Entrega Final, Requerimiento 1.1: la vista del carrito. Lee el estado
// global del CarritoContext: lista cada producto agregado con su subtotal,
// permite cambiar la cantidad (+/-), eliminar uno y vaciar el carrito.
// (En la pre-entrega esta ruta era solo un estado vacío.)
function Carrito() {
  const {
    carrito,
    incrementarCantidad,
    decrementarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    precioTotal,
  } = useCarrito()

  // Precio con separador de miles argentino: 12000 → "12.000".
  const formatear = (numero) => numero.toLocaleString('es-AR')

  // Vaciar borra todo de una: se pide confirmación, igual que al eliminar
  // un producto en el panel (un clic sin querer no debería costar el pedido).
  const confirmarVaciar = () => {
    if (confirm('¿Vaciar el carrito? Se van a quitar todos los productos.')) {
      vaciarCarrito()
    }
  }

  // noIndexar: un carrito no tiene nada que mostrar en Google.
  const seo = <Seo titulo="Tu carrito" descripcion="Revisá tu pedido de BuBus Originals." noIndexar />

  if (carrito.length === 0) {
    return (
      <section className={styles.vacio}>
        {seo}
        <h1 className="section-title">Tu carrito</h1>
        <p>Todavía no agregaste productos al carrito.</p>
        <Link to="/productos" className="btn-hero-cta">
          Ver catálogo
        </Link>
      </section>
    )
  }

  return (
    <section className={styles.pagina}>
      {seo}
      <h1 className="section-title">Tu carrito</h1>

      <ul className={styles.lista}>
        {carrito.map((linea) => (
          <li key={linea.id} className={styles.linea}>
            {/* alt vacío: la foto repite lo que ya dice el nombre de al lado,
                 el lector de pantalla no necesita oírlo dos veces. */}
            <img src={linea.imagen} alt="" className={styles.foto} />

            <div>
              <Link to={`/producto/${linea.id}`} className={styles.nombre}>
                {linea.nombre}
              </Link>
              <p className={styles.detalle}>${formatear(linea.precio)} c/u</p>

              {/* Mismos controles (y misma clase) que las tarjetas del
                   catálogo. Los botones se deshabilitan en los topes: 1 y
                   el stock. */}
              <div className={`quantity-controls ${styles.cantidad}`}>
                <button
                  type="button"
                  onClick={() => decrementarCantidad(linea.id)}
                  disabled={linea.cantidad <= 1}
                  aria-label={`Restar una unidad de ${linea.nombre}`}
                >
                  <FaMinus aria-hidden="true" />
                </button>
                {/* aria-live: el lector de pantalla anuncia la cantidad
                     nueva después de cada clic. */}
                <span aria-live="polite">{linea.cantidad}</span>
                <button
                  type="button"
                  onClick={() => incrementarCantidad(linea.id)}
                  disabled={linea.cantidad >= linea.stock}
                  aria-label={`Sumar una unidad de ${linea.nombre}`}
                >
                  <FaPlus aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className={styles.acciones}>
              <span className={styles.subtotal}>${formatear(linea.precio * linea.cantidad)}</span>
              <Boton
                type="button"
                variante="peligro"
                onClick={() => eliminarDelCarrito(linea.id)}
                aria-label={`Eliminar ${linea.nombre} del carrito`}
              >
                <FaTrashAlt aria-hidden="true" />
                Eliminar
              </Boton>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.resumen}>
        <p className={styles.total}>
          Total: <span>${formatear(precioTotal)}</span>
        </p>
        <div className={styles.botones}>
          <Boton type="button" variante="peligro" onClick={confirmarVaciar}>
            Vaciar carrito
          </Boton>
          <Boton como={Link} to="/productos" variante="contorno">
            Seguir comprando
          </Boton>
        </div>
      </div>
    </section>
  )
}

export default Carrito
