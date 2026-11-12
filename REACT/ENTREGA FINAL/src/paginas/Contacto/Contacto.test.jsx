// Contacto es una página propia y su botón principal abre WhatsApp con un
// mensaje ya escrito.
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import Contacto from './Contacto'
import { EMAIL, WHATSAPP_NUMERO, MENSAJE_CONSULTA } from '../../utils/contacto'

describe('Contacto', () => {
  afterEach(cleanup)

  it('el botón principal abre WhatsApp con el mensaje escrito', () => {
    render(
      <HelmetProvider>
        <Contacto />
      </HelmetProvider>,
    )
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('Hablemos de tu diseño')

    const whatsapp = screen.getByRole('link', { name: /Escribinos por WhatsApp/ })
    const url = new URL(whatsapp.getAttribute('href'))
    expect(url.origin + url.pathname).toBe(`https://wa.me/${WHATSAPP_NUMERO}`)
    expect(url.searchParams.get('text')).toBe(MENSAJE_CONSULTA)
    // Se abre en otra pestaña sin darle acceso a la nuestra.
    expect(whatsapp.getAttribute('rel')).toBe('noopener noreferrer')

    expect(screen.getByRole('link', { name: EMAIL }).getAttribute('href')).toBe(`mailto:${EMAIL}`)
  })
})
