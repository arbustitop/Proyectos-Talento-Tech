import { describe, expect, it } from 'vitest'
import { mensajePedido } from './pedido'
import { avisoPocoStock, POCO_STOCK } from './stock'
import { linkWhatsApp, WHATSAPP_NUMERO } from './contacto'

describe('mensajePedido', () => {
  it('lista cada línea con cantidad y subtotal, y cierra con el total', () => {
    const carrito = [
      { nombre: 'Remera Básica Estampada DTF', precio: 25000, cantidad: 2 },
      { nombre: 'Buzo Canguro Estampado', precio: 40000, cantidad: 1 },
    ]
    expect(mensajePedido(carrito, 90000)).toBe(
      [
        '¡Hola BuBus Originals! Quiero hacer este pedido:',
        '',
        '• 2 × Remera Básica Estampada DTF: $50.000',
        '• 1 × Buzo Canguro Estampado: $40.000',
        '',
        'Total: $90.000',
      ].join('\n'),
    )
  })
})

describe('avisoPocoStock', () => {
  it('no avisa cuando hay stock de sobra ni cuando no hay nada', () => {
    expect(avisoPocoStock(POCO_STOCK + 1)).toBeNull()
    expect(avisoPocoStock(15)).toBeNull()
    expect(avisoPocoStock(0)).toBeNull()
  })

  it('avisa en el límite y usa singular con una sola unidad', () => {
    expect(avisoPocoStock(POCO_STOCK)).toBe(`¡Últimas ${POCO_STOCK} unidades!`)
    expect(avisoPocoStock(1)).toBe('¡Última unidad!')
  })
})

describe('linkWhatsApp', () => {
  it('sin texto, abre el chat de la tienda', () => {
    expect(linkWhatsApp()).toBe(`https://wa.me/${WHATSAPP_NUMERO}`)
  })

  it('codifica el mensaje para que entre en la URL', () => {
    const url = linkWhatsApp('Total: $50.000\nGracias')
    expect(url).toBe(`https://wa.me/${WHATSAPP_NUMERO}?text=Total%3A%20%2450.000%0AGracias`)
  })
})
