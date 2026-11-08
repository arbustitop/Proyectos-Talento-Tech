import { useContext } from 'react'
import { AuthContext } from './AuthContext'

// Hook propio: useAuth() en vez de useContext(AuthContext) en cada
// componente. El chequeo de null avisa enseguida si alguien lo usa fuera
// del Provider, en vez de fallar más adelante con un error confuso.
export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth tiene que usarse dentro de <AuthProvider>')
  }
  return contexto
}
