// Entrega Final, Requerimiento 1.1: contexto del carrito de compras.
// Partido en tres archivos (este, CarritoProvider y useCarrito), igual que
// el de la sesión (AuthContext), por la regla only-export-components de
// oxlint: un archivo que exporta componentes no debería exportar otras
// cosas, o el recargado en caliente (HMR) de Vite deja de funcionar bien.
import { createContext } from 'react'

// Arranca en null: el valor real lo pone <CarritoProvider>. useCarrito avisa
// si alguien lo usa fuera del Provider. El valor que reparte es:
//   carrito             lista de { id, nombre, precio, imagen, stock, cantidad }
//   agregarAlCarrito(producto, cantidad)
//   incrementarCantidad(id) / decrementarCantidad(id)   +1 / -1 en el carrito
//   eliminarDelCarrito(id)
//   vaciarCarrito()
//   cantidadEnCarrito(id)   cuántas unidades de ese producto ya hay
//   cantidadTotal           unidades en total (el número del nav)
//   precioTotal             suma de precio × cantidad
//   aviso / cerrarAviso()   el último agregado ({ id, nombre, cantidad }),
//                           para el aviso flotante de AvisoCarrito
export const CarritoContext = createContext(null)
