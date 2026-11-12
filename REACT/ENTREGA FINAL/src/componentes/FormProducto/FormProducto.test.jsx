// Formulario del panel: las fotos extra (una URL por renglón) se guardan en
// Firestore como lista, sin renglones vacíos, y se vuelven a mostrar al
// editar.
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { addDoc } from 'firebase/firestore'
import { FormProducto } from './FormProducto'

vi.mock('../../firebase/config', () => ({ db: {} }))
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  addDoc: vi.fn(() => Promise.resolve()),
  updateDoc: vi.fn(() => Promise.resolve()),
}))

const campo = (texto) => screen.getByLabelText(texto, { exact: false })

describe('FormProducto: fotos de la galería', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('guarda las fotos extra como lista, sin renglones vacíos', async () => {
    const alTerminar = vi.fn()
    render(<FormProducto productoAEditar={null} alTerminar={alTerminar} categorias={[]} />)

    fireEvent.change(campo('Nombre'), { target: { value: 'Buzo Canguro' } })
    fireEvent.change(campo('Precio'), { target: { value: '40000' } })
    fireEvent.change(campo('Stock'), { target: { value: '5' } })
    fireEvent.change(campo('Fotos extra'), {
      target: { value: 'https://x.test/espalda.jpg\n\n  https://x.test/detalle.jpg  \n' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Agregar Producto' }))

    await waitFor(() => expect(alTerminar).toHaveBeenCalled())
    const datos = addDoc.mock.calls[0][1]
    expect(datos.fotos).toEqual(['https://x.test/espalda.jpg', 'https://x.test/detalle.jpg'])
  })

  it('al editar muestra las fotos guardadas, una por renglón', () => {
    const producto = {
      id: '4',
      nombre: 'Buzo Canguro',
      precio: 40000,
      stock: 5,
      fotos: ['https://x.test/a.jpg', 'https://x.test/b.jpg'],
    }
    render(<FormProducto productoAEditar={producto} alTerminar={() => {}} categorias={[]} />)
    expect(campo('Fotos extra').value).toBe('https://x.test/a.jpg\nhttps://x.test/b.jpg')
  })
})
