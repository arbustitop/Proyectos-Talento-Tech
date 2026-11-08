import { useState } from 'react'
import { CarritoContext } from './CarritoContext'

// Entrega Final, Requerimiento 1.1: estado global del carrito con Context
// API. Envuelve la app (ver App.jsx), así cualquier componente puede
// agregar productos (Item, DetalleProducto), mostrar el contador (CartWidget)
// o listar el pedido (página Carrito) sin pasar props de mano en mano.
export function CarritoProvider({ children }) {
  // Cada línea guarda los datos que necesita la vista del carrito más la
  // cantidad elegida. Se guarda el stock para no dejar pasar de ahí.
  const [carrito, setCarrito] = useState([])

  // Agregar: si el producto ya está, se le suma la cantidad a esa línea en
  // vez de repetirlo. Nunca pasa del stock disponible.
  //
  // setCarrito recibe una función (prev => ...) porque el nuevo carrito
  // depende del anterior: así, si se agregan dos cosas seguidas, la segunda
  // parte del carrito ya actualizado y no de uno viejo.
  //
  // Nunca se modifica `prev` (ni con push ni cambiando una línea): se arma
  // un array nuevo. React compara por referencia; si fuera el mismo array,
  // no se daría cuenta de que cambió y no volvería a dibujar.
  const agregarAlCarrito = (producto, cantidad = 1) => {
    setCarrito((prev) => {
      const existente = prev.find((linea) => linea.id === producto.id)

      if (existente) {
        return prev.map((linea) =>
          linea.id === producto.id
            ? { ...linea, cantidad: Math.min(linea.cantidad + cantidad, linea.stock) }
            : linea,
        )
      }

      const { id, nombre, precio, imagen, stock } = producto
      return [...prev, { id, nombre, precio, imagen, stock, cantidad: Math.min(cantidad, stock) }]
    })
  }

  // +1 / -1 desde la página del carrito. Mismos topes que en las tarjetas:
  // no pasa del stock ni baja de 1 (para sacar el producto entero está
  // "Eliminar", así nadie lo borra sin querer apretando "-").
  const incrementarCantidad = (id) => {
    setCarrito((prev) =>
      prev.map((linea) =>
        linea.id === id ? { ...linea, cantidad: Math.min(linea.cantidad + 1, linea.stock) } : linea,
      ),
    )
  }

  const decrementarCantidad = (id) => {
    setCarrito((prev) =>
      prev.map((linea) =>
        linea.id === id ? { ...linea, cantidad: Math.max(linea.cantidad - 1, 1) } : linea,
      ),
    )
  }

  // Eliminar: saca la línea entera de ese producto (todas sus unidades).
  const eliminarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((linea) => linea.id !== id))
  }

  const vaciarCarrito = () => {
    setCarrito([])
  }

  // Lo usa Item para saber cuántas unidades puede agregar todavía.
  const cantidadEnCarrito = (id) => carrito.find((linea) => linea.id === id)?.cantidad ?? 0

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
        cantidadTotal,
        precioTotal,
      }}
    >
      {children}
    </CarritoContext.Provider>
  )
}
