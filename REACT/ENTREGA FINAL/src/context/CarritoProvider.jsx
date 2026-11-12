import { useState, useEffect, useCallback } from 'react'
import { CarritoContext } from './CarritoContext'
import { claveLinea } from '../utils/variantes'

// Clave con la que el carrito se guarda en el navegador.
const CLAVE_STORAGE = 'carrito'

// Lee el carrito guardado. try/catch: si el JSON está roto o el navegador
// bloquea localStorage (modo privado), la tienda arranca con el carrito
// vacío en vez de romperse.
function leerCarritoGuardado() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_STORAGE))
    return Array.isArray(guardado) ? guardado : []
  } catch {
    return []
  }
}

// Entrega Final, Requerimiento 1.1: estado global del carrito con Context
// API. Envuelve la app (ver App.jsx), así cualquier componente puede
// agregar productos (Item, DetalleProducto), mostrar el contador (CartWidget)
// o listar el pedido (página Carrito) sin pasar props de mano en mano.
export function CarritoProvider({ children }) {
  // Cada línea guarda los datos que necesita la vista del carrito más la
  // cantidad elegida. Se guarda el stock para no dejar pasar de ahí.
  //
  // useState(leerCarritoGuardado) recibe la función, no su resultado: React
  // la llama una sola vez al montar, así no se lee localStorage en cada render.
  const [carrito, setCarrito] = useState(leerCarritoGuardado)

  // Cada vez que cambia el carrito, se guarda. Así sobrevive a un F5 o a
  // cerrar la pestaña (antes vivía solo en memoria y se perdía al recargar).
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(carrito))
    } catch {
      // Sin acceso a localStorage el carrito sigue andando, solo que no se
      // guarda entre recargas.
    }
  }, [carrito])

  // Aviso flotante "Agregaste ... al carrito" (lo muestra AvisoCarrito en
  // el Layout). Guarda qué se agregó y un id que cambia en cada agregado,
  // así dos agregados seguidos del mismo producto reinician el aviso.
  const [aviso, setAviso] = useState(null)
  // useCallback: la misma función en cada render, así AvisoCarrito puede
  // usarla en su useEffect sin que el timer se reinicie a cada rato.
  const cerrarAviso = useCallback(() => setAviso(null), [])

  // Cada línea del carrito es un producto en un talle y color (ver
  // claveLinea en utils/variantes.js): "Remera M negra" y "Remera L blanca"
  // son dos líneas aunque sean el mismo producto. El stock, en cambio, es
  // uno solo por producto, así que el tope de una línea descuenta lo que ya
  // ocupan las otras variantes del mismo producto.
  //
  // Las líneas guardadas antes de que existieran los talles no tienen
  // `clave`: se usa el id, que es justo la clave de un producto sin talle.
  const claveDe = (linea) => linea.clave ?? linea.id

  // Unidades del producto `id` que ya están en OTRAS líneas (no en `clave`).
  const ocupadasPorOtras = (lineas, id, clave) =>
    lineas
      .filter((linea) => linea.id === id && claveDe(linea) !== clave)
      .reduce((total, linea) => total + linea.cantidad, 0)

  // Agregar: si esa variante ya está, se le suma la cantidad a su línea en
  // vez de repetirla. Nunca pasa del stock disponible.
  //
  // setCarrito recibe una función (prev => ...) porque el nuevo carrito
  // depende del anterior: así, si se agregan dos cosas seguidas, la segunda
  // parte del carrito ya actualizado y no de uno viejo.
  //
  // Nunca se modifica `prev` (ni con push ni cambiando una línea): se arma
  // un array nuevo. React compara por referencia; si fuera el mismo array,
  // no se daría cuenta de que cambió y no volvería a dibujar.
  const agregarAlCarrito = (producto, cantidad = 1, { talle, color } = {}) => {
    const clave = claveLinea(producto.id, talle, color)

    setCarrito((prev) => {
      const tope = producto.stock - ocupadasPorOtras(prev, producto.id, clave)
      const existente = prev.find((linea) => claveDe(linea) === clave)

      if (existente) {
        return prev.map((linea) =>
          claveDe(linea) === clave
            ? { ...linea, cantidad: Math.min(linea.cantidad + cantidad, tope) }
            : linea,
        )
      }

      const { id, nombre, precio, imagen, stock } = producto
      const nueva = { clave, id, nombre, precio, imagen, stock, cantidad: Math.min(cantidad, tope) }
      // talle y color solo se guardan si existen (un pliego no tiene).
      if (talle) nueva.talle = talle
      if (color) nueva.color = color
      return [...prev, nueva]
    })
    setAviso({ id: Date.now(), nombre: producto.nombre, cantidad })
  }

  // +1 / -1 desde la página del carrito. No pasa del stock (contando las
  // otras variantes) ni baja de 1 (para sacar la línea entera está
  // "Eliminar", así nadie la borra sin querer apretando "-").
  const incrementarCantidad = (clave) => {
    setCarrito((prev) =>
      prev.map((linea) => {
        if (claveDe(linea) !== clave) return linea
        const tope = linea.stock - ocupadasPorOtras(prev, linea.id, clave)
        return { ...linea, cantidad: Math.min(linea.cantidad + 1, tope) }
      }),
    )
  }

  const decrementarCantidad = (clave) => {
    setCarrito((prev) =>
      prev.map((linea) =>
        claveDe(linea) === clave ? { ...linea, cantidad: Math.max(linea.cantidad - 1, 1) } : linea,
      ),
    )
  }

  // Eliminar: saca la línea entera (todas sus unidades).
  const eliminarDelCarrito = (clave) => {
    setCarrito((prev) => prev.filter((linea) => claveDe(linea) !== clave))
  }

  const vaciarCarrito = () => {
    setCarrito([])
  }

  // Unidades de un producto en el carrito, sumando todas sus variantes. Lo
  // usan Item y el detalle para saber cuánto se puede agregar todavía.
  const cantidadEnCarrito = (id) =>
    carrito.filter((linea) => linea.id === id).reduce((total, linea) => total + linea.cantidad, 0)

  // Para el botón "+" del carrito: si esa línea todavía puede sumar una.
  const puedeSumar = (clave) => {
    const linea = carrito.find((l) => claveDe(l) === clave)
    return Boolean(linea) && linea.cantidad < linea.stock - ocupadasPorOtras(carrito, linea.id, clave)
  }

  // Totales derivados: se calculan del carrito en cada render en vez de
  // guardarlos en otro estado, así nunca quedan desfasados.
  const cantidadTotal = carrito.reduce((total, linea) => total + linea.cantidad, 0)
  const precioTotal = carrito.reduce((total, linea) => total + linea.precio * linea.cantidad, 0)

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        incrementarCantidad,
        decrementarCantidad,
        eliminarDelCarrito,
        vaciarCarrito,
        cantidadEnCarrito,
        puedeSumar,
        cantidadTotal,
        precioTotal,
        aviso,
        cerrarAviso,
      }}
    >
      {children}
    </CarritoContext.Provider>
  )
}
