import { useContext } from 'react'
import { CarritoContext } from './CarritoContext'

// Hook propio: useCarrito() en vez de useContext(CarritoContext) en cada
// componente. El chequeo de null avisa enseguida si alguien lo usa fuera
// del Provider, en vez de fallar más adelante con un error confuso.
export function useCarrito() {
  const contexto = useContext(CarritoContext)
  if (!contexto) {
    throw new Error('useCarrito tiene que usarse dentro de <CarritoProvider>')
  }
  return contexto
}
