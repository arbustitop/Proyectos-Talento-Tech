import { FaSearch, FaTimes } from 'react-icons/fa'

// Clase 13: barra de búsqueda. Es presentacional: no guarda el texto, lo
// recibe del padre (`valor`) y le avisa cada cambio (`alCambiar`). El
// estado vive en ItemListContainer, que es quien filtra. Así el input es
// CONTROLADO: lo que se ve siempre es lo que dice el estado.
//
// Estilos de Bootstrap: input-group pega el ícono, el input y el botón de
// borrar en una sola pieza; form-control le da el look de Bootstrap. Los
// retoques de color (foco violeta) están en App.css → .barra-busqueda.

export function BarraBusqueda({ valor, alCambiar, total, encontrados }) {
  return (
    <div className="barra-busqueda">
      {/* Label real para lectores de pantalla; visually-hidden (Bootstrap)
           lo oculta a la vista sin sacarlo del HTML. El placeholder no
           alcanza como label: desaparece al escribir. */}
      <label htmlFor="buscar-producto" className="visually-hidden">
        Buscar productos por nombre
      </label>
      <div className="input-group input-group-lg">
        {/* aria-hidden: el ícono es decoración, el label ya dice qué es. */}
        <span className="input-group-text">
          <FaSearch aria-hidden="true" />
        </span>
        <input
          id="buscar-producto"
          type="search"
          className="form-control"
          placeholder="Buscar por nombre (ej: remera, buzo, pack)"
          value={valor}
          onChange={(e) => alCambiar(e.target.value)}
          autoComplete="off"
        />

        {/* El botón de borrar aparece solo si hay algo escrito. */}
        {valor && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => alCambiar('')}
            aria-label="Borrar búsqueda"
          >
            <FaTimes aria-hidden="true" />
          </button>
        )}
      </div>
      {/* aria-live="polite": el lector de pantalla anuncia cuántos quedan
           cada vez que cambia el número, sin interrumpir. */}
      <p className="form-text mt-2 mb-0" aria-live="polite">
        {valor.trim() ? `${encontrados} de ${total} productos` : `${total} productos`}
      </p>
    </div>
  )
}
