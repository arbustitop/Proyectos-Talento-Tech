import { Link } from 'react-router-dom'
import { FaShoppingCart } from 'react-icons/fa'
import { useCarrito } from '../../context/useCarrito'
import styles from './CartWidget.module.css'

// Entrega Final, Requerimiento 1.1: el link al carrito del nav, con la
// cantidad de unidades en un globito. Lee cantidadTotal del CarritoContext,
// así se actualiza solo cada vez que alguien agrega o elimina algo.
export function CartWidget() {
  const { cantidadTotal } = useCarrito()

  return (
    // El aria-label dice la cantidad en palabras: el lector de pantalla no
    // entiende que el número suelto del globito es "productos".
    <Link
      to="/carrito"
      aria-label={`Carrito, ${cantidadTotal} ${cantidadTotal === 1 ? 'producto' : 'productos'}`}
    >
      <FaShoppingCart aria-hidden="true" />
      {/* En el span para poder ocultarlo en el header de celular (queda
           solo el ícono); el aria-label del link sigue diciendo "Carrito". */}
      <span className="cart-texto">Carrito</span>
      {/* Sin productos no se muestra el globito (un "0" es ruido). */}
      {/* key={cantidadTotal}: cada vez que cambia el número, React crea el
           globito de nuevo y la animación "pop" vuelve a correr. */}
      {cantidadTotal > 0 && (
        <span key={cantidadTotal} className={styles.contador} aria-hidden="true">
          {cantidadTotal}
        </span>
      )}
    </Link>
  )
}
