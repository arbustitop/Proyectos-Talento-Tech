// Item — "El Exhibidor" (Clase 04, Nivel 3 del patrón contenedor/
// presentacional). Muestra un producto, deja elegir cantidad respetando
// el stock, agregarlo al carrito y marcarlo como favorito.
// Clase 07: la imagen y el nombre ahora son un Link al detalle del producto.
// Clase 13: íconos de React Icons en los botones (favorito, cantidad y
// carrito) y carga diferida de la foto.
// Entrega Final, Requerimiento 1.1: "Agregar al Carrito" ya no es un alert,
// guarda el producto en el CarritoContext.

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaStar, FaRegStar, FaMinus, FaPlus, FaShoppingCart, FaCheck, FaTshirt } from 'react-icons/fa'
import { useCarrito } from '../../context/useCarrito'
import { avisoPocoStock } from '../../utils/stock'

export function Item({ id, nombre, precio, stock, imagen, categoria }) {
  // Los pliegos DTF (insumo para revendedores/diseñadores) se marcan
  // distinto de las prendas terminadas para que no se confundan en la
  // grilla.
  const esInsumo = categoria === 'Diseños DTF'
  const { agregarAlCarrito, cantidadEnCarrito } = useCarrito()

  // Lo que todavía se puede agregar: el stock menos lo que ya está en el
  // carrito. Si ya están todas las unidades adentro, no se puede sumar más.
  const disponible = stock - cantidadEnCarrito(id)

  // "cantidad" arranca en 1 (la compra mínima posible), no en 0.
  const [cantidad, setCantidad] = useState(1)

  // true durante un momento después de agregar: el botón muestra
  // "¡Agregado!" como confirmación (además del número del nav que sube).
  const [agregado, setAgregado] = useState(false)

  // Design review: si la URL de la foto no carga, el navegador mostraba el
  // texto alternativo en letra gigante. Con onError se cambia por un
  // recuadro con ícono, igual que cuando el producto no tiene foto.
  const [fotoRota, setFotoRota] = useState(false)

  useEffect(() => {
    if (!agregado) return
    const timer = setTimeout(() => setAgregado(false), 1500)
    // Si la tarjeta desaparece antes (cambio de página, búsqueda), se
    // cancela el timer para no actualizar un componente que ya no está.
    return () => clearTimeout(timer)
  }, [agregado])

  // Estado independiente por instancia: cada Item se acuerda de si ES
  // favorito sin afectar a los demás productos de la lista.
  const [esFavorito, setEsFavorito] = useState(false)

  const incrementar = () => {
    if (cantidad < disponible) {
      setCantidad(cantidad + 1)
    }
  }

  const decrementar = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1)
    }
  }

  const handleAgregar = () => {
    agregarAlCarrito({ id, nombre, precio, stock, imagen }, cantidad)
    // Vuelve a 1 para la próxima, y así nunca queda una cantidad mayor a
    // lo que sigue disponible.
    setCantidad(1)
    setAgregado(true)
  }

  // Texto del botón según el caso. "¡Agregado!" va antes que "todo el
  // stock" para que, si se agregaron las últimas unidades, igual se vea la
  // confirmación.
  let textoBoton = 'Agregar al carrito'
  if (stock === 0) textoBoton = 'Sin stock'
  else if (agregado) textoBoton = '¡Agregado!'
  else if (disponible <= 0) textoBoton = 'Ya tenés todo el stock'

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
          {/* Clase 13, rendimiento: loading="lazy" baja la foto recién
               cuando la card se acerca con el scroll; width/height le dicen
               al navegador la proporción antes de que llegue, así la grilla
               no "salta" mientras cargan. */}
          {imagen && !fotoRota ? (
            <img
              src={imagen}
              alt={nombre}
              className="product-image"
              loading="lazy"
              decoding="async"
              width="400"
              height="400"
              onError={() => setFotoRota(true)}
            />
          ) : (
            <span className="product-image product-image--sin-foto">
              <FaTshirt aria-hidden="true" />
              <span className="visually-hidden">{nombre}, sin foto</span>
            </span>
          )}
        </Link>

        {esInsumo && <span className="insumo-badge">Insumo / Pliego</span>}

        <button
          className={`fav-btn-floating${esFavorito ? ' is-active' : ''}`}
          onClick={marcarComoFavorito}
          aria-label={esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          {/* Clase 13: estrella llena o vacía según el estado (antes era un
               <svg> escrito a mano). aria-hidden: el aria-label del botón ya
               dice qué hace. */}
          {esFavorito ? (
            <FaStar size={18} aria-hidden="true" />
          ) : (
            <FaRegStar size={18} aria-hidden="true" />
          )}
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
        {/* Solo avisa cuando queda poco (ver utils/stock.js). El <span> va
             siempre, aunque esté vacío, para que todas las tarjetas tengan
             el botón a la misma altura. */}
        <span className="stock-tag stock-tag--poco">{avisoPocoStock(stock)}</span>

        <div className="quantity-controls">
          {/* Un botón que solo tiene un ícono necesita aria-label: si no, el
               lector de pantalla dice solo "botón". */}
          <button
            onClick={decrementar}
            disabled={cantidad <= 1 || disponible <= 0}
            aria-label="Restar una unidad"
          >
            <FaMinus aria-hidden="true" />
          </button>
          <span>{cantidad}</span>
          <button
            onClick={incrementar}
            disabled={cantidad >= disponible}
            aria-label="Sumar una unidad"
          >
            <FaPlus aria-hidden="true" />
          </button>
        </div>

        <button className="btn-add-cart" onClick={handleAgregar} disabled={disponible <= 0}>
          {agregado ? <FaCheck aria-hidden="true" /> : <FaShoppingCart aria-hidden="true" />}
          {textoBoton}
        </button>
      </div>
    </div>
  )
}
