// Regression: FINDING-005 — una foto que no carga mostraba el texto
// alternativo en letra gigante dentro de la card.
// Found by /design-review on 2026-11-08
import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { CarritoProvider } from '../../context/CarritoProvider'
import { Item } from './Item'

const remera = {
  id: '1',
  nombre: 'Remera Básica Estampada DTF',
  precio: 25000,
  stock: 15,
  categoria: 'Remeras DTF',
}

function montarCard(imagen) {
  return render(
    <MemoryRouter>
      <CarritoProvider>
        <Item {...remera} imagen={imagen} />
      </CarritoProvider>
    </MemoryRouter>,
  )
}

describe('Item: foto que no carga', () => {
  afterEach(cleanup)

  it('cambia la foto rota por el recuadro "sin foto"', () => {
    const { container } = montarCard('https://ejemplo.com/no-existe.jpg')
    const foto = container.querySelector('img.product-image')
    expect(foto).not.toBeNull()

    fireEvent.error(foto)

    expect(container.querySelector('img.product-image')).toBeNull()
    expect(container.querySelector('.product-image--sin-foto')).not.toBeNull()
  })

  it('un producto sin foto también muestra el recuadro', () => {
    const { container } = montarCard('')
    expect(container.querySelector('img.product-image')).toBeNull()
    expect(container.querySelector('.product-image--sin-foto')).not.toBeNull()
  })
})
