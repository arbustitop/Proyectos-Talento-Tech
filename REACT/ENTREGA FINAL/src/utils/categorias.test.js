// Nombres de categoría que ve el cliente (tarjeta, detalle y filtros) y la
// lista de categorías que arma los filtros del catálogo. Son funciones
// puras: se prueban solas, sin montar componentes.
import { describe, expect, it } from 'vitest'
import { categoriasDe, nombreCategoria } from './categorias'

describe('nombreCategoria', () => {
  it('saca el " DTF" del final', () => {
    expect(nombreCategoria('Buzos DTF')).toBe('Buzos')
  })

  it('muestra "Diseños DTF" como pliegos', () => {
    expect(nombreCategoria('Diseños DTF')).toBe('Pliegos DTF')
  })

  it('deja igual una categoría sin " DTF" y no rompe sin categoría', () => {
    expect(nombreCategoria('Gorras')).toBe('Gorras')
    expect(nombreCategoria(undefined)).toBe('')
  })
})

describe('categoriasDe', () => {
  // Un producto sin categoría (cargado a medias desde el panel) no tiene
  // que generar un filtro vacío.
  it('lista cada categoría una vez, en el orden del catálogo', () => {
    const productos = [
      { categoria: 'Remeras DTF' },
      { categoria: 'Buzos DTF' },
      { categoria: 'Remeras DTF' },
      { categoria: '' },
    ]
    expect(categoriasDe(productos)).toEqual(['Remeras DTF', 'Buzos DTF'])
  })
})
