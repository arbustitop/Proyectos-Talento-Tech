// Arma el texto del pedido que se manda por WhatsApp desde el carrito.
// Es una función pura (recibe datos, devuelve texto): no sabe nada de
// React ni del carrito, así se puede probar sola.

const formatear = (numero) => numero.toLocaleString('es-AR')

// carrito: [{ nombre, precio, cantidad }], total: number
export function mensajePedido(carrito, total) {
  const lineas = carrito.map(
    (linea) => `• ${linea.cantidad} × ${linea.nombre}: $${formatear(linea.precio * linea.cantidad)}`,
  )

  return [
    '¡Hola BuBus Originals! Quiero hacer este pedido:',
    '',
    ...lineas,
    '',
    `Total: $${formatear(total)}`,
  ].join('\n')
}
