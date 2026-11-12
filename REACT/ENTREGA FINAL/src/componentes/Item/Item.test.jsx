// Tarjeta rediseñada: un solo botón que suma de a una unidad, sin selector
// de cantidad ni favorito, y con la categoría arriba del nombre.
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CarritoProvider } from '../../context/CarritoProvider'
import { useCarrito } from '../../context/useCarrito'
import { Item } from './Item'

let carrito
function Espia() {
  carrito = useCarrito()
  return null
}

function montarCard(producto) {
  return render(
    <MemoryRouter>
      <CarritoProvider>
        <Item {...producto} />
        <Espia />
      </CarritoProvider>
    </MemoryRouter>,
  )
}

const buzo = { id: '4', nombre: 'Buzo Canguro', categoria: 'Buzos DTF', precio: 40000, stock: 2, imagen: '' }

describe('Item: tarjeta de producto', () => {
  afterEach(() => {
    cleanup()
    localStorage.clear()
  })

  it('muestra categoría, nombre y precio, sin selector de cantidad ni favorito', () => {
    montarCard(buzo)
    expect(screen.getByText('Buzos')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Buzo Canguro' }).getAttribute('href')).toBe('/producto/4')
    expect(screen.getByText('$40.000')).toBeTruthy()
    expect(screen.queryByLabelText('Sumar una unidad')).toBeNull()
    expect(screen.queryByLabelText(/favoritos/)).toBeNull()
  })

  it('suma de a una unidad y se apaga al llegar al stock', () => {
    montarCard(buzo)
    const boton = screen.getByRole('button', { name: 'Agregar Buzo Canguro al carrito' })

    fireEvent.click(boton)
    expect(carrito.cantidadTotal).toBe(1)
    expect(boton.textContent).toContain('Agregado')

    fireEvent.click(boton)
    expect(carrito.cantidadTotal).toBe(2)
    expect(boton.disabled).toBe(true)
  })

  it('avisa sobre la foto cuando quedan pocas unidades', () => {
    montarCard(buzo)
    expect(screen.getByText('¡Últimas 2 unidades!')).toBeTruthy()
  })
})
