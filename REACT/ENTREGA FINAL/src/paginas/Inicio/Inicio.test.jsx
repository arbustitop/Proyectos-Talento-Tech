// Inicio rediseñado: el título dice qué hacemos (no el nombre de la marca),
// hay dos acciones y los tres pasos de cómo se hace un pedido.
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { CarritoProvider } from '../../context/CarritoProvider'
import Inicio from './Inicio'

vi.mock('../../utils/catalogo', () => ({
  obtenerCatalogo: () =>
    Promise.resolve([
      { id: '1', nombre: 'Remera Básica', categoria: 'Remeras DTF', precio: 25000, stock: 5, imagen: '' },
    ]),
}))

describe('Inicio', () => {
  afterEach(cleanup)

  it('muestra el hero con sus dos acciones, los pasos y los destacados', async () => {
    render(
      <HelmetProvider>
        <MemoryRouter>
          <CarritoProvider>
            <Inicio />
          </CarritoProvider>
        </MemoryRouter>
      </HelmetProvider>,
    )

    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('Vos traés la idea.Nosotros la estampamos.')
    expect(screen.getByRole('link', { name: 'Ver prendas' }).getAttribute('href')).toBe('/productos')
    expect(screen.getByRole('link', { name: /Escribinos/ }).getAttribute('href')).toMatch(
      /^https:\/\/wa\.me\//,
    )

    const pasos = screen.getByRole('region', { name: 'Cómo se hace un pedido' })
    expect(within(pasos).getAllByRole('listitem')).toHaveLength(3)

    expect(await screen.findByRole('heading', { name: 'Lo que más sale' })).toBeTruthy()
  })
})
