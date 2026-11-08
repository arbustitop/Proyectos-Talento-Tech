// Regression: ISSUE-001 — el carrito se perdía al recargar la página (F5)
// Found by /qa on 2026-11-08
// Report: .gstack/qa-reports/run-20261108T031641Z/qa-report-localhost-2026-11-08.md
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { act, cleanup, render } from '@testing-library/react'
import { CarritoProvider } from './CarritoProvider'
import { useCarrito } from './useCarrito'

const remera = { id: '1', nombre: 'Remera Básica Estampada DTF', precio: 25000, imagen: '', stock: 15 }

// Componente mínimo que expone el carrito al test.
let carrito
function Espia() {
  carrito = useCarrito()
  return null
}

// Montar el Provider desde cero es lo mismo que pasa al recargar: React
// arranca de nuevo y el estado en memoria se pierde.
function montarTienda() {
  return render(
    <CarritoProvider>
      <Espia />
    </CarritoProvider>,
  )
}

describe('CarritoProvider: el carrito sobrevive a una recarga', () => {
  beforeEach(() => localStorage.clear())
  afterEach(cleanup)

  it('conserva productos y cantidades después de volver a montar la app', () => {
    const primeraVisita = montarTienda()
    act(() => carrito.agregarAlCarrito(remera, 2))
    expect(carrito.cantidadTotal).toBe(2)

    primeraVisita.unmount() // "F5"
    montarTienda()

    expect(carrito.cantidadTotal).toBe(2)
    expect(carrito.precioTotal).toBe(50000)
  })

  it('arranca vacío si lo guardado está roto, sin romper la tienda', () => {
    localStorage.setItem('carrito', '{esto no es json')
    montarTienda()
    expect(carrito.carrito).toEqual([])
  })
})
