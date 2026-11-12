// Página del carrito con talles: cada línea muestra su variante, el "+"
// respeta el stock compartido y "Eliminar" saca solo esa línea.
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { CarritoProvider } from '../../context/CarritoProvider'
import Carrito from './Carrito'

// El mismo buzo (stock 3) en dos variantes que ya ocupan las 3 unidades.
const guardado = [
  { clave: '4|M|Negro', id: '4', nombre: 'Buzo Canguro', precio: 40000, imagen: '', stock: 3, cantidad: 2, talle: 'M', color: 'Negro' },
  { clave: '4|L|Blanco', id: '4', nombre: 'Buzo Canguro', precio: 40000, imagen: '', stock: 3, cantidad: 1, talle: 'L', color: 'Blanco' },
]

function montar() {
  return render(
    <HelmetProvider>
      <MemoryRouter>
        <CarritoProvider>
          <Carrito />
        </CarritoProvider>
      </MemoryRouter>
    </HelmetProvider>,
  )
}

describe('Carrito con talles', () => {
  beforeEach(() => localStorage.setItem('carrito', JSON.stringify(guardado)))
  afterEach(() => {
    cleanup()
    localStorage.clear()
  })

  it('muestra cada variante en su línea y el pedido de WhatsApp la incluye', () => {
    montar()
    expect(screen.getByText('Talle M · Negro')).toBeTruthy()
    expect(screen.getByText('Talle L · Blanco')).toBeTruthy()

    const whatsapp = screen.getByRole('link', { name: /Finalizar compra por WhatsApp/ })
    const texto = new URL(whatsapp.getAttribute('href')).searchParams.get('text')
    expect(texto).toContain('2 × Buzo Canguro (Talle M · Negro)')
  })

  it('el "+" se apaga cuando las variantes ya ocupan todo el stock, y se libera al eliminar una', () => {
    montar()
    const sumarM = screen.getByRole('button', { name: 'Sumar una unidad de Buzo Canguro (Talle M · Negro)' })
    expect(sumarM.disabled).toBe(true)

    fireEvent.click(
      screen.getByRole('button', { name: 'Eliminar Buzo Canguro (Talle L · Blanco) del carrito' }),
    )

    expect(screen.queryByText('Talle L · Blanco')).toBeNull()
    expect(screen.getByText('Talle M · Negro')).toBeTruthy()
    expect(
      screen.getByRole('button', { name: 'Sumar una unidad de Buzo Canguro (Talle M · Negro)' })
        .disabled,
    ).toBe(false)
  })
})
