// Talles y colores: qué prendas los tienen, cómo separa el carrito cada
// variante (con el stock compartido) y cómo llegan al mensaje de WhatsApp.
import { afterEach, describe, expect, it } from 'vitest'
import { act, cleanup, render } from '@testing-library/react'
import { CarritoProvider } from '../context/CarritoProvider'
import { useCarrito } from '../context/useCarrito'
import { claveLinea, describirVariante, opcionesDe, tieneVariantes, TALLES } from './variantes'
import { mensajePedido } from './pedido'

describe('opcionesDe', () => {
  it('remeras, buzos y camperas van de S a XXL en blanco o negro', () => {
    expect(opcionesDe({ categoria: 'Buzos DTF' })).toEqual({
      talles: ['S', 'M', 'L', 'XL', 'XXL'],
      colores: ['Blanco', 'Negro'],
    })
  })

  it('mochilas y pliegos no tienen talle ni color', () => {
    expect(tieneVariantes({ categoria: 'Mochilas DTF' })).toBe(false)
    expect(tieneVariantes({ categoria: 'Diseños DTF' })).toBe(false)
  })

  it('los talles o colores del producto le ganan a los de la categoría', () => {
    const remeraDama = { categoria: 'Remeras DTF', colores: ['Lila'] }
    expect(opcionesDe(remeraDama)).toEqual({ talles: TALLES, colores: ['Lila'] })
  })
})

describe('claveLinea y describirVariante', () => {
  it('sin talle ni color la clave es el id, como antes', () => {
    expect(claveLinea('8')).toBe('8')
    expect(claveLinea('4', 'M', 'Negro')).toBe('4|M|Negro')
  })

  it('describe la variante para el carrito y WhatsApp', () => {
    expect(describirVariante({ talle: 'M', color: 'Negro' })).toBe('Talle M · Negro')
    expect(describirVariante({})).toBe('')
  })
})

describe('Carrito con talles', () => {
  let carrito
  function Espia() {
    carrito = useCarrito()
    return null
  }

  afterEach(() => {
    cleanup()
    localStorage.clear()
  })

  const buzo = { id: '4', nombre: 'Buzo Canguro', precio: 40000, imagen: '', stock: 3 }

  it('separa el mismo producto en otro talle o color, y suma si es el mismo', () => {
    render(
      <CarritoProvider>
        <Espia />
      </CarritoProvider>,
    )
    act(() => carrito.agregarAlCarrito(buzo, 1, { talle: 'M', color: 'Negro' }))
    act(() => carrito.agregarAlCarrito(buzo, 1, { talle: 'L', color: 'Blanco' }))
    act(() => carrito.agregarAlCarrito(buzo, 1, { talle: 'M', color: 'Negro' }))

    expect(carrito.carrito.map((l) => [l.clave, l.cantidad])).toEqual([
      ['4|M|Negro', 2],
      ['4|L|Blanco', 1],
    ])
    expect(carrito.cantidadEnCarrito('4')).toBe(3)
  })

  it('el stock es uno solo por producto: entre todas las variantes no pasan de 3', () => {
    render(
      <CarritoProvider>
        <Espia />
      </CarritoProvider>,
    )
    act(() => carrito.agregarAlCarrito(buzo, 2, { talle: 'M', color: 'Negro' }))
    act(() => carrito.agregarAlCarrito(buzo, 5, { talle: 'L', color: 'Blanco' }))

    // Quedaba 1 sola unidad para el talle L.
    expect(carrito.cantidadEnCarrito('4')).toBe(3)
    expect(carrito.puedeSumar('4|M|Negro')).toBe(false)

    act(() => carrito.incrementarCantidad('4|M|Negro'))
    expect(carrito.cantidadEnCarrito('4')).toBe(3)

    // Al sacar el talle L se libera lugar para el M.
    act(() => carrito.eliminarDelCarrito('4|L|Blanco'))
    expect(carrito.puedeSumar('4|M|Negro')).toBe(true)
  })

  it('una línea guardada antes de los talles (sin clave) se sigue pudiendo editar', () => {
    localStorage.setItem(
      'carrito',
      JSON.stringify([{ id: '8', nombre: 'Mochila', precio: 40000, imagen: '', stock: 5, cantidad: 1 }]),
    )
    render(
      <CarritoProvider>
        <Espia />
      </CarritoProvider>,
    )
    act(() => carrito.incrementarCantidad('8'))
    expect(carrito.cantidadEnCarrito('8')).toBe(2)
  })
})

describe('mensajePedido con talles', () => {
  it('pone talle y color entre paréntesis después del nombre', () => {
    const texto = mensajePedido(
      [
        { nombre: 'Buzo Canguro', precio: 40000, cantidad: 2, talle: 'M', color: 'Negro' },
        { nombre: 'Mochila', precio: 40000, cantidad: 1 },
      ],
      120000,
    )
    expect(texto).toContain('• 2 × Buzo Canguro (Talle M · Negro): $80.000')
    expect(texto).toContain('• 1 × Mochila: $40.000')
  })
})
