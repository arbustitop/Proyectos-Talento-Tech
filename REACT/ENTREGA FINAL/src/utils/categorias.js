// Categorías del catálogo. En Firestore se guardan como "Remeras DTF",
// "Buzos DTF", etc. Para mostrarlas, el " DTF" del final sobra (toda la
// tienda es DTF) y "Diseños DTF" son en realidad pliegos para estampar.
// La tarjeta, el detalle y los filtros usan este mismo nombre.

const NOMBRES_ESPECIALES = {
  'Diseños DTF': 'Pliegos DTF',
}

export function nombreCategoria(categoria) {
  if (!categoria) return ''
  return NOMBRES_ESPECIALES[categoria] ?? categoria.replace(/\s+DTF$/, '')
}

// Lista de categorías que tienen al menos un producto, en el orden en que
// aparecen en el catálogo (que ya viene ordenado). Así un filtro nunca
// lleva a una grilla vacía, y si el admin crea una categoría nueva desde
// el panel aparece sola.
export function categoriasDe(productos) {
  return [...new Set(productos.map((p) => p.categoria).filter(Boolean))]
}
