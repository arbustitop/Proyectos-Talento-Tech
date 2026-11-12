// Item — "El Exhibidor" (Clase 04, Nivel 3 del patrón contenedor/
// presentacional). Muestra un producto y deja agregarlo al carrito.
// Clase 07: la imagen y el nombre son un Link al detalle del producto.
// Clase 13: íconos de React Icons y carga diferida de la foto.
// Entrega Final, Requerimiento 1.1: "Agregar al carrito" guarda el producto
// en el CarritoContext.
//
// Rediseño de la tarjeta: antes cada una tenía selector de cantidad (− 1 +),
// estrella de favorito y botón grande. Seis tarjetas por pantalla eran seis
// selectores iguales, y el favorito no se guardaba en ningún lado (se
// perdía al cambiar de página). Ahora la tarjeta muestra foto, categoría,
// nombre y precio, y suma de a una unidad. La cantidad se elige en el
// detalle del producto o en el carrito, donde sí se está decidiendo la
// compra.

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaPlus, FaCheck, FaTshirt } from 'react-icons/fa'
import { useCarrito } from '../../context/useCarrito'
import { avisoPocoStock } from '../../utils/stock'
import { nombreCategoria } from '../../utils/categorias'
import { tieneVariantes } from '../../utils/variantes'

export function Item({ id, nombre, precio, stock, imagen, categoria, talles, colores }) {
  const { agregarAlCarrito, cantidadEnCarrito } = useCarrito()

  // Lo que todavía se puede agregar: el stock menos lo que ya está en el
  // carrito. Si ya están todas las unidades adentro, no se puede sumar más.
  const disponible = stock - cantidadEnCarrito(id)

  // true durante un momento después de agregar: el botón muestra
  // "Agregado" como confirmación (además del aviso flotante y del número
  // del carrito que sube).
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

  const handleAgregar = () => {
    agregarAlCarrito({ id, nombre, precio, stock, imagen }, 1)
    setAgregado(true)
  }

  // Texto del botón según el caso. "Agregado" va antes que "todo el stock"
  // para que, si se agregó la última unidad, igual se vea la confirmación.
  let textoBoton = 'Agregar'
  if (stock === 0) textoBoton = 'Sin stock'
  else if (agregado) textoBoton = 'Agregado'
  else if (disponible <= 0) textoBoton = 'Ya está todo en tu carrito'

  const etiqueta = nombreCategoria(categoria)
  const pocoStock = avisoPocoStock(stock)
  // Remeras, buzos y camperas necesitan talle y color: desde la tarjeta no
  // se pueden agregar, el botón lleva al detalle a elegirlos.
  const conTalle = tieneVariantes({ categoria, talles, colores })

  return (
    <article className="product-card">
      <Link to={`/producto/${id}`} className="product-image-container">
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
        {/* El aviso de poco stock va sobre la foto: se ve sin agrandar la
             tarjeta, y las tarjetas sin aviso no dejan un hueco. */}
        {pocoStock && <span className="stock-badge">{pocoStock}</span>}
      </Link>

      <div className="product-info">
        {etiqueta && <p className="product-categoria">{etiqueta}</p>}
        <h3 className="product-title">
          <Link to={`/producto/${id}`}>{nombre}</Link>
        </h3>

        <div className="product-pie">
          <p className="product-precio">${precio.toLocaleString('es-AR')}</p>
          {conTalle && stock > 0 ? (
            <Link
              to={`/producto/${id}`}
              className="btn-add-cart"
              aria-label={`Elegir talle y color de ${nombre}`}
            >
              Elegir talle
            </Link>
          ) : (
          <button
            type="button"
            className="btn-add-cart"
            onClick={handleAgregar}
            disabled={disponible <= 0}
            // El texto visible es corto ("Agregar"); para el lector de
            // pantalla se aclara qué se agrega.
            aria-label={disponible > 0 && !agregado ? `Agregar ${nombre} al carrito` : undefined}
          >
            {agregado ? <FaCheck aria-hidden="true" /> : <FaPlus aria-hidden="true" />}
            {textoBoton}
          </button>
          )}
        </div>
      </div>
    </article>
  )
}
