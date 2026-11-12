// Layout completo (Header + página + Footer): el menú lleva a Nosotros y a
// Contacto como páginas propias, y el footer ya no carga el equipo.
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { CarritoProvider } from '../../context/CarritoProvider'
import Layout from './Layout'

// Sin sesión: el Header muestra "Ingresar" y no pide nada a Firebase Auth.
vi.mock('../../context/useAuth', () => ({
  useAuth: () => ({ usuario: null, cargando: false, esAdmin: false }),
}))

describe('Layout', () => {
  afterEach(cleanup)

  it('el menú lleva a las páginas y el footer no tiene la sección del equipo', () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    render(
      <MemoryRouter>
        <CarritoProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<p>Inicio de prueba</p>} />
            </Route>
          </Routes>
        </CarritoProvider>
      </MemoryRouter>,
    )

    const menu = screen.getByRole('navigation')
    expect(within(menu).getByRole('link', { name: 'Nosotros' }).getAttribute('href')).toBe(
      '/nosotros',
    )
    expect(within(menu).getByRole('link', { name: 'Contacto' }).getAttribute('href')).toBe(
      '/contacto',
    )
    expect(within(menu).getByRole('link', { name: /Ingresar/ })).toBeTruthy()

    const pie = screen.getByRole('contentinfo')
    expect(within(pie).queryByText('Nuestro equipo')).toBeNull()
    expect(within(pie).getByText(/Estampamos con DTF/)).toBeTruthy()
  })
})
