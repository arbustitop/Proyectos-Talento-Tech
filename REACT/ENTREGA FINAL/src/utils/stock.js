// Cuándo avisar que queda poco stock. Mostrar "Stock disponible: 15" en
// todas las tarjetas no le dice nada al cliente; "¡Últimas 3 unidades!"
// sí, y además invita a no dejarlo para después.
export const POCO_STOCK = 3

// Devuelve el texto del aviso, o null si todavía hay stock de sobra (o si
// no hay nada: ese caso ya lo muestra el botón con "Sin stock").
export function avisoPocoStock(stock) {
  if (stock <= 0 || stock > POCO_STOCK) return null
  return stock === 1 ? '¡Última unidad!' : `¡Últimas ${stock} unidades!`
}
