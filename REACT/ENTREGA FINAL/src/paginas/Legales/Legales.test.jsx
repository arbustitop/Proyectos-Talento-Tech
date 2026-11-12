// Términos y condiciones + privacidad: el índice lleva a cada sección y no
// queda ningún dato sin completar (el borrador original traía campos entre
// corchetes, como "[completar email de contacto]").
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import Legales from './Legales'
import { EMAIL, WHATSAPP_VISIBLE } from '../../utils/contacto'

// HelmetProvider: lo pide el componente Seo.
function montar() {
  return render(
    <HelmetProvider>
      <Legales />
    </HelmetProvider>,
  )
}

describe('Legales', () => {
  afterEach(cleanup)

  it('el índice tiene los 10 puntos y cada uno apunta a una sección que existe', () => {
    montar()
    const links = within(screen.getByRole('navigation', { name: 'Índice' })).getAllByRole('link')
    expect(links).toHaveLength(10)

    for (const link of links) {
      const id = link.getAttribute('href').slice(1)
      expect(document.getElementById(id)).not.toBeNull()
    }
    // El footer enlaza directo a la privacidad: esa sección tiene que estar.
    expect(document.getElementById('privacidad').textContent).toContain('Política de Privacidad')
  })

  it('no quedan campos sin completar y los datos de contacto son los de la tienda', () => {
    const { container } = montar()
    expect(container.textContent).not.toMatch(/\[[^\]]*\]/)

    expect(container.textContent).toContain('transferencia bancaria y Mercado Pago')
    expect(container.textContent).toContain('Vía Cargo')
    expect(screen.getAllByRole('link', { name: EMAIL }).length).toBeGreaterThan(0)
    expect(screen.getByRole('link', { name: WHATSAPP_VISIBLE })).toBeTruthy()
  })
})
