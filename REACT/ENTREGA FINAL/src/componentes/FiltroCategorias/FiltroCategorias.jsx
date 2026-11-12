import { nombreCategoria } from '../../utils/categorias'
import styles from './FiltroCategorias.module.css'

// Filtros por categoría del catálogo: una fila de botones ("chips").
// Componente presentacional: no guarda estado propio. La categoría activa y
// qué hacer al cambiarla vienen de ItemListContainer, que es el que filtra.
//
// Son <button> con aria-pressed (y no links ni radios) porque cambian lo que
// se ve en la misma página: el lector de pantalla anuncia "presionado" en
// el filtro activo.
export function FiltroCategorias({ categorias, activa, alCambiar }) {
  // Con una sola categoría no hay nada que filtrar.
  if (categorias.length < 2) return null

  return (
    <div className={styles.filtros} role="group" aria-label="Filtrar por categoría">
      <button
        type="button"
        className={styles.chip}
        aria-pressed={activa === ''}
        onClick={() => alCambiar('')}
      >
        Todo
      </button>
      {categorias.map((cat) => (
        <button
          key={cat}
          type="button"
          className={styles.chip}
          aria-pressed={activa === cat}
          onClick={() => alCambiar(cat)}
        >
          {nombreCategoria(cat)}
        </button>
      ))}
    </div>
  )
}
