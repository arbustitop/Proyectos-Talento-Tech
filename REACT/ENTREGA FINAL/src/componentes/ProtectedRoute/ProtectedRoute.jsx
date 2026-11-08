import { Link, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

// Clase 12: envuelve las páginas que solo ve un usuario logueado:
//   <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
// Entrega Final: con el registro abierto, "estar logueado" ya no alcanza
// para el panel. Con soloAdmin, además tiene que ser el dueño de la tienda:
//   <ProtectedRoute soloAdmin><GestionProductos /></ProtectedRoute>
export function ProtectedRoute({ children, soloAdmin = false }) {
  const { usuario, cargando, esAdmin } = useAuth()
  const location = useLocation()

  // Mientras Firebase revisa la sesión guardada no decidimos nada: si
  // redirigiéramos ya, recargar /perfil con sesión abierta terminaría en
  // el login.
  if (cargando) {
    return <p className="auth-estado">Verificando sesión...</p>
  }

  if (!usuario) {
    // `state.desde`: el Login vuelve acá después de entrar. `replace`: con
    // "atrás" no se vuelve a la ruta bloqueada.
    return <Navigate to="/login" replace state={{ desde: location.pathname }} />
  }

  // Logueado pero sin permiso: en vez de mandarlo al login (ya entró), se
  // explica por qué no puede ver la página.
  if (soloAdmin && !esAdmin) {
    return (
      <section className="auth-estado" role="alert">
        <p>Esta sección es solo para la administración de la tienda.</p>
        <Link to="/perfil">Ir a mi perfil</Link>
      </section>
    )
  }

  return children
}
