import { useState, useEffect } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth, ADMIN_UID } from '../firebase/config'
import { AuthContext } from './AuthContext'

// Clase 12: envuelve la app y le da a cualquier componente (vía useAuth)
// quién está logueado y las funciones para entrar y salir.
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)

  // Sin este flag, al recargar una ruta protegida ProtectedRoute vería
  // usuario=null por un instante y mandaría al login a alguien que sigue
  // con la sesión abierta.
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    // Se llama una vez al arrancar (con la sesión que Firebase guardó en
    // el navegador, o null) y después en cada login/logout. Es la única
    // fuente de verdad: login y logout no tocan `usuario` a mano.
    const desuscribir = onAuthStateChanged(auth, (user) => {
      setUsuario(user)
      setCargando(false)
    })
    return desuscribir
  }, [])

  // Devuelven la promesa de Firebase para que la pantalla que las llama
  // pueda esperar con await y mostrar el error si falla.
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password)
  const logout = () => signOut(auth)

  // Entrega Final, Requerimiento 1.2: registro. Firebase crea la cuenta y
  // además deja la sesión abierta, así que onAuthStateChanged actualiza
  // `usuario` solo, igual que en el login.
  const registro = (email, password) => createUserWithEmailAndPassword(auth, email, password)

  // Derivado del usuario: no hace falta otro estado. `Boolean(ADMIN_UID)`
  // evita que, si faltara la variable en .env, un undefined === undefined
  // convierta en admin a cualquiera.
  const esAdmin = Boolean(ADMIN_UID) && usuario?.uid === ADMIN_UID

  return (
    <AuthContext.Provider value={{ usuario, cargando, esAdmin, login, registro, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
