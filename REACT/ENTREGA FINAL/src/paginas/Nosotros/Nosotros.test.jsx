// Nosotros: el equipo (que antes estaba en el footer) se lee de Firestore y
// se muestra en su propia página.
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { getDocs } from 'firebase/firestore'
import Nosotros from './Nosotros'

// Firestore se reemplaza por una respuesta fija: el test no sale a internet.
vi.mock('../../firebase/config', () => ({ db: {} }))
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  getDocs: vi.fn(),
}))

function documento(id, datos) {
  return { id, data: () => datos }
}

function montar() {
  return render(
    <HelmetProvider>
      <Nosotros />
    </HelmetProvider>,
  )
}

describe('Nosotros', () => {
  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
  })

  it('lista el equipo en orden, con LinkedIn solo si lo tiene', async () => {
    getDocs.mockResolvedValue({
      // Desordenados a propósito: Firestore ordena los IDs como texto.
      docs: [
        documento('2', { nombre: 'Facundo Luna', rol: 'Diseño y Producción' }),
        documento('1', {
          nombre: 'Augusto Vila',
          rol: 'Fundador',
          linkedinURL: 'https://www.linkedin.com/in/ejemplo',
        }),
      ],
    })
    montar()

    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Quiénes somos')

    const nombres = await screen.findAllByText(/Augusto Vila|Facundo Luna/)
    expect(nombres.map((n) => n.textContent)).toEqual(['Augusto Vila', 'Facundo Luna'])
    expect(screen.getAllByRole('link', { name: /LinkedIn de/ })).toHaveLength(1)
  })

  it('si Firestore falla muestra un mensaje en vez de la lista', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    getDocs.mockRejectedValue(new Error('permission-denied'))
    montar()

    expect((await screen.findByRole('alert')).textContent).toContain('No pudimos cargar el equipo')
  })
})
