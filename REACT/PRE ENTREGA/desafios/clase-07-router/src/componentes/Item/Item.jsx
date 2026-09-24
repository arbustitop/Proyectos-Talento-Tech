import { useState } from 'react'
import { Link } from 'react-router-dom'

export function Item({ id, nombre, precio, stock, imagen }) {
  const [cantidad, setCantidad] = useState(1)
  const [esFavorito, setEsFavorito] = useState(false)

  const incrementar = () => {
    if (cantidad < stock) {
      setCantidad(cantidad + 1)
    }
  }

  const decrementar = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1)
    }
  }

  const agregarAlCarrito = () => {
    alert(`Agregaste ${cantidad} unidades de ${nombre} al carrito.`)
  }

  const marcarComoFavorito = () => {
    setEsFavorito((prev) => !prev)
  }

  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '16px',
      margin: '12px',
      textAlign: 'center',
      maxWidth: '300px',
    }}>
      {/* Solo la imagen y el nombre llevan al detalle: los controles de
          abajo (cantidad, carrito, favorito) tienen que poder clickearse
          sin disparar la navegación. */}
      <Link to={`/producto/${id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
        {imagen && <img src={imagen} alt={nombre} style={{ width: '100%', maxWidth: '200px', borderRadius: '6px' }} />}
        <h3>{nombre}</h3>
      </Link>
      <p>Precio: ${precio}</p>
      <p>Stock disponible: {stock}</p>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', margin: '12px 0' }}>
        <button onClick={decrementar} disabled={cantidad <= 1}>-</button>
        <span>{cantidad}</span>
        <button onClick={incrementar} disabled={cantidad >= stock}>+</button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px' }}>
        <button onClick={agregarAlCarrito} disabled={stock === 0}>
          Agregar al Carrito
        </button>

        <span
          onClick={marcarComoFavorito}
          style={{ fontSize: '24px', cursor: 'pointer', userSelect: 'none' }}
          title={esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          {esFavorito ? '⭐' : '☆'}
        </span>
      </div>
    </div>
  )
}
