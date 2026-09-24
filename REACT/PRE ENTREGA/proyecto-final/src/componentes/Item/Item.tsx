// Item — "El Exhibidor" (Clase 04, Nivel 3 del patrón contenedor/
// presentacional). Muestra un producto, deja elegir cantidad respetando
// el stock, agregarlo al carrito y marcarlo como favorito.
// Clase 07: la imagen y el nombre ahora son un Link al detalle del producto.

import { useState } from 'react'
import { Link } from 'react-router-dom'

interface ItemProps {
  id: string
  nombre: string
  precio: number
  stock: number
  imagen?: string
  categoria?: string
}

export function Item({ id, nombre, precio, stock, imagen, categoria }: ItemProps) {
  // Los pliegos DTF (insumo para revendedores/diseñadores) se marcan
  // distinto de las prendas terminadas para que no se confundan en la
  // grilla.
  const esInsumo = categoria === 'Diseños DTF'
  // "cantidad" arranca en 1 (la compra mínima posible), no en 0.
  const [cantidad, setCantidad] = useState(1)

  // Estado independiente por instancia: cada Item se acuerda de si ES
  // favorito sin afectar a los demás productos de la lista.
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

  // Actualiza el estado en base al valor anterior: forma recomendada
  // cuando el nuevo valor depende del actual (evita condiciones de carrera
  // si React agrupa varias actualizaciones).
  const marcarComoFavorito = () => {
    setEsFavorito((prev) => !prev)
  }

  return (
    <div className="product-card">
      {/* El favorito flota sobre la imagen (patrón Mercado Libre) en vez
          de ir al lado del precio, así el precio queda limpio. Es un
          hermano del Link, no un hijo, para no anidar un <button>
          dentro de un elemento clickeable. */}
      <div className="product-image-container">
        <Link to={`/producto/${id}`}>
          {imagen && <img src={imagen} alt={nombre} className="product-image" />}
        </Link>

        {esInsumo && <span className="insumo-badge">Insumo / Pliego</span>}

        <button
          className={`fav-btn-floating${esFavorito ? ' is-active' : ''}`}
          onClick={marcarComoFavorito}
          aria-label={esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={esFavorito ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </button>
      </div>

      <div className="product-info">
        <Link to={`/producto/${id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
          <h3 className="product-title">{nombre}</h3>
        </Link>

        <div className="price-container">
          <span className="currency">$</span>
          <span className="price-amount">{precio.toLocaleString('es-AR')}</span>
        </div>
        <span className="stock-tag">Stock disponible: {stock}</span>

        <div className="quantity-controls">
          <button onClick={decrementar} disabled={cantidad <= 1}>-</button>
          <span>{cantidad}</span>
          <button onClick={incrementar} disabled={cantidad >= stock}>+</button>
        </div>

        <button className="btn-add-cart" onClick={agregarAlCarrito} disabled={stock === 0}>
          Agregar al Carrito
        </button>
      </div>
    </div>
  )
}
