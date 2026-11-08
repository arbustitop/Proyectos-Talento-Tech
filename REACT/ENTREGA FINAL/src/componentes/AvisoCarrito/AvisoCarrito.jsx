import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaCheckCircle, FaTimes } from 'react-icons/fa'
import { useCarrito } from '../../context/useCarrito'
import styles from './AvisoCarrito.module.css'

// Aviso flotante "Agregaste ... al carrito". Va en el Layout (una sola vez
// para toda la app), así funciona igual desde las tarjetas del catálogo y
// desde el detalle del producto. Lee el último agregado del CarritoContext.
const DURACION_MS = 3000

export function AvisoCarrito() {
  const { aviso, cerrarAviso } = useCarrito()

  // Se cierra solo a los 3 segundos. Depende del id del aviso: si se agrega
  // otra cosa mientras está abierto, el timer arranca de nuevo.
  const idAviso = aviso?.id
  useEffect(() => {
    if (!idAviso) return
    const timer = setTimeout(cerrarAviso, DURACION_MS)
    return () => clearTimeout(timer)
  }, [idAviso, cerrarAviso])

  // role="status": el lector de pantalla lo anuncia sin interrumpir. El
  // contenedor está siempre en la página (vacío si no hay aviso) porque
  // algunos lectores solo anuncian cambios dentro de una región que ya
  // existía.
  return (
    <div role="status" className={styles.region}>
      {aviso && (
        <div key={aviso.id} className={styles.aviso}>
          <FaCheckCircle aria-hidden="true" className={styles.icono} />
          <p className={styles.texto}>
            Agregaste {aviso.cantidad > 1 ? `${aviso.cantidad} × ` : ''}
            <strong>{aviso.nombre}</strong> al carrito.
          </p>
          <Link to="/carrito" className={styles.link} onClick={cerrarAviso}>
            Ver carrito
          </Link>
          <button type="button" className={styles.cerrar} onClick={cerrarAviso} aria-label="Cerrar aviso">
            <FaTimes aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  )
}
