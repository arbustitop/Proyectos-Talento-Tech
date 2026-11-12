// Talles y colores de las prendas.
//
// Las remeras, buzos y camperas vienen en S a XXL y en blanco o negro. En
// vez de cargarlo producto por producto en Firestore, sale de la categoría.
// Si algún día una prenda tiene otros talles o colores, alcanza con
// guardarle un campo `talles` o `colores` (lista) en Firestore: lo del
// producto le gana a lo de la categoría.
// Mochilas, carteras, gorras y pliegos no llevan talle ni color.

export const TALLES = ['S', 'M', 'L', 'XL', 'XXL']
export const COLORES = ['Blanco', 'Negro']

const CATEGORIAS_CON_TALLE_Y_COLOR = ['Remeras DTF', 'Buzos DTF', 'Camperas DTF']

export function opcionesDe(producto) {
  const esPrenda = CATEGORIAS_CON_TALLE_Y_COLOR.includes(producto.categoria)
  return {
    talles: producto.talles ?? (esPrenda ? TALLES : []),
    colores: producto.colores ?? (esPrenda ? COLORES : []),
  }
}

// true si hay que elegir talle o color antes de agregar al carrito.
export function tieneVariantes(producto) {
  const { talles, colores } = opcionesDe(producto)
  return talles.length > 0 || colores.length > 0
}

// Identifica una línea del carrito: el mismo producto en otro talle o color
// es otra línea ("Remera M negra" y "Remera L blanca" van separadas). Sin
// talle ni color, la clave es el id solo, como antes de que existieran.
export function claveLinea(id, talle, color) {
  return [id, talle, color].filter(Boolean).join('|')
}

// Texto corto para mostrar en el carrito y en el mensaje de WhatsApp.
export function describirVariante({ talle, color }) {
  return [talle && `Talle ${talle}`, color].filter(Boolean).join(' · ')
}
