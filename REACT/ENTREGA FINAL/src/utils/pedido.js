// Arma el texto del pedido que se manda por WhatsApp desde el carrito.
// Es una función pura (recibe datos, devuelve texto): no sabe nada de
// React ni del carrito, así se puede probar sola.

import { describirVariante } from './variantes'

const formatear = (numero) => numero.toLocaleString('es-AR')

// carrito: [{ nombre, precio, cantidad, talle?, color? }], total: number
// Talle y color van entre paréntesis después del nombre, así el pedido que
// llega por WhatsApp ya dice qué estampar: "2 × Buzo (Talle M · Negro)".
export function mensajePedido(carrito, total) {
  const lineas = carrito.map((linea) => {
    const variante = describirVariante(linea)
    const nombre = variante ? `${linea.nombre} (${variante})` : linea.nombre
    return `• ${linea.cantidad} × ${nombre}: $${formatear(linea.precio * linea.cantidad)}`
  })

  return [
    '¡Hola BuBus Originals! Quiero hacer este pedido:',
    '',
    ...lineas,
    '',
    `Total: $${formatear(total)}`,
  ].join('\n')
}
