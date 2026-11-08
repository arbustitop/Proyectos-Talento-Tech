import styles from './Paginador.module.css'

// Entrega Final, Requerimiento 4.2: paginador del catálogo. Es
// presentacional, igual que BarraBusqueda: no sabe de productos ni guarda
// la página; la recibe del padre (paginaActual) y le avisa a cuál ir
// (alCambiar). La cuenta de qué productos van en cada página la hace
// ItemListContainer.
//
// Usa el componente "pagination" de Bootstrap (ul.pagination > li.page-item
// > .page-link); el CSS Module solo le pone los colores de la marca.
export function Paginador({ paginaActual, totalPaginas, alCambiar }) {
  // Con una sola página no hay nada que paginar: no se muestra.
  if (totalPaginas <= 1) return null

  // [1, 2, ..., totalPaginas] para dibujar un botón por página.
  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1)

  return (
    // <nav> con aria-label: el lector de pantalla lo anuncia como
    // "Paginación del catálogo" y se puede saltar directo hasta acá.
    <nav aria-label="Paginación del catálogo" className={styles.paginador}>
      <ul className="pagination justify-content-center flex-wrap">
        <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
          <button
            type="button"
            className="page-link"
            onClick={() => alCambiar(paginaActual - 1)}
            disabled={paginaActual === 1}
          >
            Anterior
          </button>
        </li>

        {paginas.map((numero) => (
          <li key={numero} className={`page-item ${numero === paginaActual ? 'active' : ''}`}>
            {/* aria-current="page": el lector de pantalla dice "página
                 actual" en el botón de la página en la que estás. */}
            <button
              type="button"
              className="page-link"
              onClick={() => alCambiar(numero)}
              aria-current={numero === paginaActual ? 'page' : undefined}
              aria-label={`Página ${numero}`}
            >
              {numero}
            </button>
          </li>
        ))}

        <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
          <button
            type="button"
            className="page-link"
            onClick={() => alCambiar(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
          >
            Siguiente
          </button>
        </li>
      </ul>
    </nav>
  )
}
