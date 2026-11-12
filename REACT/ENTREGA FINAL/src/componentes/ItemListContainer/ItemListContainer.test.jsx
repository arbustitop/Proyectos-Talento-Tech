// Filtros por categoría del catálogo: se combinan con la búsqueda, el
// contador dice cuántos quedan y "Ver todos" saca los dos filtros.
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CarritoProvider } from '../../context/CarritoProvider'
import { ItemListContainer } from './ItemListContainer'

// El catálogo real sale de Firestore; en el test se reemplaza por una
// lista fija (vi.mock cambia el módulo entero, así Firebase ni se carga).
vi.mock('../../utils/catalogo', () => ({
  obtenerCatalogo: () =>
    Promise.resolve([
      { id: '1', nombre: 'Remera Básica', categoria: 'Remeras DTF', precio: 25000, stock: 5, imagen: '' },
      { id: '2', nombre: 'Remera Oversize', categoria: 'Remeras DTF', precio: 30000, stock: 5, imagen: '' },
      { id: '3', nombre: 'Buzo Canguro', categoria: 'Buzos DTF', precio: 40000, stock: 5, imagen: '' },
      // Sin stock: no se muestra ni cuenta, y su categoría no aparece sola.
      { id: '4', nombre: 'Gorra Trucker', categoria: 'Gorras DTF', precio: 9000, stock: 0, imagen: '' },
    ]),
}))

function montarCatalogo() {
  return render(
    <MemoryRouter>
      <CarritoProvider>
        <ItemListContainer Mensaje="Catálogo" />
      </CarritoProvider>
    </MemoryRouter>,
  )
}

const tarjetas = () => document.querySelectorAll('.product-card')

describe('ItemListContainer: filtros por categoría', () => {
  afterEach(cleanup)

  it('muestra un filtro por categoría con stock, sin las vacías', async () => {
    montarCatalogo()
    await screen.findByRole('button', { name: 'Buzos' })

    expect(screen.getByRole('button', { name: 'Todo' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByRole('button', { name: 'Remeras' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Gorras' })).toBeNull()
    expect(tarjetas()).toHaveLength(3)
  })

  it('filtra por categoría y el contador dice cuántos quedan', async () => {
    montarCatalogo()
    fireEvent.click(await screen.findByRole('button', { name: 'Buzos' }))

    expect(tarjetas()).toHaveLength(1)
    expect(screen.getByText('1 de 3 productos')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Buzos' }).getAttribute('aria-pressed')).toBe('true')
  })

  it('combina categoría y búsqueda, y "Ver todos" saca los dos filtros', async () => {
    montarCatalogo()
    fireEvent.click(await screen.findByRole('button', { name: 'Remeras' }))
    fireEvent.change(screen.getByLabelText('Buscar productos por nombre'), {
      target: { value: 'buzo' },
    })

    // "buzo" dentro de Remeras no da nada: estado vacío con salida.
    expect(tarjetas()).toHaveLength(0)
    expect(screen.getByText(/No encontramos "buzo" en Remeras/)).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'Ver todos los productos' }))
    expect(tarjetas()).toHaveLength(3)
    expect(screen.getByRole('button', { name: 'Todo' }).getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByLabelText('Buscar productos por nombre').value).toBe('')
  })
})
