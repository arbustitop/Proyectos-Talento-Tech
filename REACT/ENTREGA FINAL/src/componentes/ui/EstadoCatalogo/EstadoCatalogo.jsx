import styles from './EstadoCatalogo.module.css'

// El bloque que ocupa el lugar de la grilla cuando no hay productos para
// mostrar: cargando, error o búsqueda sin resultados (Requerimiento 2.2).
//   <EstadoCatalogo>Cargando...</EstadoCatalogo>
//   <EstadoCatalogo error>No se pudo cargar</EstadoCatalogo>
//
// ...resto deja pasar role="status" / role="alert", que hacen que el lector
// de pantalla anuncie el mensaje apenas aparece.
export function EstadoCatalogo({ error = false, children, ...resto }) {
  const clases = error ? `${styles.estado} ${styles.error}` : styles.estado
  return (
    <div className={clases} {...resto}>
      {children}
    </div>
  )
}
