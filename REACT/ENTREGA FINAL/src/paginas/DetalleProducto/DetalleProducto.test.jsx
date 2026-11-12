// Detalle de producto: las pantallas de carga, error (con reintento) y
// producto que no existe, además del caso normal.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { CarritoProvider } from '../../context/CarritoProvider'
import { obtenerCatalogo } from '../../utils/catalogo'
import DetalleProducto from './DetalleProducto'

// obtenerCatalogo es un espía: cada test decide qué responde Firestore.
vi.mock('../../utils/catalogo', () => ({ obtenerCatalogo: vi.fn() }))

const buzo = {
  id: '4',
  nombre: 'Buzo Canguro Estampado',
  categoria: 'Buzos DTF',
  precio: 40000,
  stock: 5,
  imagen: '',
}

function montarDetalle(id) {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[`/producto/${id}`]}>
        <CarritoProvider>
          <Routes>
            <Route path="/producto/:id" element={<DetalleProducto />} />
          </Routes>
        </CarritoProvider>
      </MemoryRouter>
    </HelmetProvider>,
  )
}

describe('DetalleProducto', () => {
  beforeEach(() => obtenerCatalogo.mockReset())
  afterEach(cleanup)

  it('muestra el esqueleto mientras carga y después la ficha', async () => {
    obtenerCatalogo.mockResolvedValue([buzo])
    montarDetalle('4')

    expect(screen.getByRole('status').textContent).toContain('Cargando producto')

    const titulo = await screen.findByRole('heading', { level: 1 })
    expect(titulo.textContent).toBe('Buzo Canguro Estampado')
    // La categoría se muestra sin el " DTF" del final.
    expect(screen.getByText('Buzos')).toBeTruthy()
  })

  it('si el producto no existe ofrece el catálogo y WhatsApp', async () => {
    obtenerCatalogo.mockResolvedValue([buzo])
    montarDetalle('999')

    expect((await screen.findByRole('heading', { level: 1 })).textContent).toBe(
      'Este producto ya no está',
    )
    expect(screen.getByRole('link', { name: 'Ver el catálogo' }).getAttribute('href')).toBe(
      '/productos',
    )
    expect(
      screen.getByRole('link', { name: /Preguntar por WhatsApp/ }).getAttribute('href'),
    ).toMatch(/^https:\/\/wa\.me\//)
  })

  it('si falla la carga deja reintentar, y el reintento muestra la ficha', async () => {
    obtenerCatalogo
      .mockRejectedValueOnce(new Error('No se pudo cargar el catálogo'))
      .mockResolvedValue([buzo])
    montarDetalle('4')

    const alerta = await screen.findByRole('alert')
    expect(alerta.textContent).toContain('No pudimos cargar este producto')

    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }))

    expect((await screen.findByRole('heading', { level: 1 })).textContent).toBe(
      'Buzo Canguro Estampado',
    )
    expect(obtenerCatalogo).toHaveBeenCalledTimes(2)
  })

  it('pide talle y color antes de agregar una prenda', async () => {
    obtenerCatalogo.mockResolvedValue([buzo])
    montarDetalle('4')
    const agregar = await screen.findByRole('button', { name: /Agregar al carrito/ })

    // Sin elegir: avisa qué falta y no agrega nada.
    fireEvent.click(agregar)
    expect(screen.getByRole('alert').textContent).toBe('Elegí talle y color antes de agregarlo.')
    expect(screen.queryByText(/Ya tenés/)).toBeNull()

    // Los talles son radio buttons: se elige uno por grupo.
    fireEvent.click(screen.getByRole('radio', { name: 'M' }))
    expect(screen.getByRole('alert').textContent).toBe('Elegí color antes de agregarlo.')
    fireEvent.click(screen.getByRole('radio', { name: 'Negro' }))
    fireEvent.click(agregar)

    expect(screen.queryByRole('alert')).toBeNull()
    expect(screen.getByText(/Ya tenés 1 en el carrito/)).toBeTruthy()
  })

  it('con una sola foto no muestra miniaturas; con varias, cambian la foto grande', async () => {
    obtenerCatalogo.mockResolvedValue([
      { ...buzo, imagen: 'https://x.test/frente.jpg', fotos: ['https://x.test/espalda.jpg'] },
    ])
    montarDetalle('4')
    await screen.findByRole('heading', { level: 1 })

    const grande = screen.getByAltText('Buzo Canguro Estampado, foto 1 de 2')
    fireEvent.click(screen.getByRole('button', { name: 'Ver foto 2 de 2' }))
    expect(grande.getAttribute('src')).toBe('https://x.test/espalda.jpg')
    expect(screen.getByRole('button', { name: 'Ver foto 2 de 2' }).getAttribute('aria-pressed')).toBe(
      'true',
    )
  })
})
