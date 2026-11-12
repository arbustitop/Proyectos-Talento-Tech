// Regresión: con BrowserRouter, al cambiar de página el navegador quedaba
// a la misma altura (venías del pie de /productos y el Inicio abría por la
// mitad). ScrollArriba vuelve arriba en cada cambio de ruta.
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route, Link } from 'react-router-dom'
import { ScrollArriba } from './ScrollArriba'

describe('ScrollArriba', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('sube al principio cada vez que cambia la ruta', () => {
    // jsdom no implementa scrollTo: se reemplaza por un espía.
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    render(
      <MemoryRouter initialEntries={['/productos']}>
        <ScrollArriba />
        <Routes>
          <Route path="/productos" element={<Link to="/contacto">Contacto</Link>} />
          <Route path="/contacto" element={<p>Página de contacto</p>} />
        </Routes>
      </MemoryRouter>,
    )
    scrollTo.mockClear()

    fireEvent.click(screen.getByRole('link', { name: 'Contacto' }))

    expect(screen.getByText('Página de contacto')).toBeTruthy()
    expect(scrollTo).toHaveBeenCalledWith(0, 0)
  })
})
