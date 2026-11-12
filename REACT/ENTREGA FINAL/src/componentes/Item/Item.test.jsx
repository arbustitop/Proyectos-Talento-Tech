// Tarjeta rediseñada: categoría arriba del nombre, sin selector de cantidad
// ni favorito. Si el producto no tiene talle (mochila, pliego) el botón suma
// de a una unidad; si es una prenda, lleva al detalle a elegir talle y color.
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CarritoProvider } from '../../context/CarritoProvider'
import { useCarrito } from '../../context/useCarrito'
import { Item } from './Item'

// "Espía": componente que no dibuja nada y guarda el valor del contexto en
// una variable, así el test puede leer el carrito sin depender de la
// página /carrito.
let carrito
function Espia() {
  carrito = useCarrito()
  return null
}

// La tarjeta usa <Link> (necesita un Router) y el carrito (necesita el
// Provider): se monta con los dos, igual que en la app.
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
// Una mochila no tiene talle ni color: se agrega directo desde la tarjeta.
const mochila = { id: '8', nombre: 'Mochila Estampada', categoria: 'Mochilas DTF', precio: 40000, stock: 2, imagen: '' }

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

  it('una prenda con talle lleva al detalle a elegirlo en vez de agregar', () => {
    montarCard(buzo)
    const elegir = screen.getByRole('link', { name: 'Elegir talle y color de Buzo Canguro' })
    expect(elegir.getAttribute('href')).toBe('/producto/4')
    expect(screen.queryByRole('button', { name: /Agregar/ })).toBeNull()
  })

  it('sin talle suma de a una unidad y se apaga al llegar al stock', () => {
    montarCard(mochila)
    const boton = screen.getByRole('button', { name: 'Agregar Mochila Estampada al carrito' })

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
