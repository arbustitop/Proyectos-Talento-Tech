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

  // El link "Política de privacidad" del footer va a /legales#privacidad:
  // tiene que bajar hasta esa sección, no quedarse arriba.
  it('con un # en la URL baja hasta esa sección en vez de ir arriba', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    // jsdom tampoco implementa scrollIntoView: se agrega un espía al
    // prototipo de los elementos.
    const scrollIntoView = vi.fn()
    Element.prototype.scrollIntoView = scrollIntoView

    render(
      <MemoryRouter initialEntries={['/']}>
        <ScrollArriba />
        <Routes>
          <Route path="/" element={<Link to="/legales#privacidad">Privacidad</Link>} />
          <Route path="/legales" element={<h2 id="privacidad">Privacidad</h2>} />
        </Routes>
      </MemoryRouter>,
    )
    scrollTo.mockClear()

    fireEvent.click(screen.getByRole('link', { name: 'Privacidad' }))

    expect(scrollIntoView).toHaveBeenCalledTimes(1)
    expect(scrollIntoView.mock.contexts[0].id).toBe('privacidad')
    expect(scrollTo).not.toHaveBeenCalled()

    delete Element.prototype.scrollIntoView
  })
})
