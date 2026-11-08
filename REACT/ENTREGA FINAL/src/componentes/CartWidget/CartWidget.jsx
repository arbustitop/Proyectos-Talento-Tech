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
      Carrito
      {/* Sin productos no se muestra el globito (un "0" es ruido). */}
      {cantidadTotal > 0 && (
        <span className={styles.contador} aria-hidden="true">
          {cantidadTotal}
        </span>
      )}
    </Link>
  )
}
