import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { Seo } from '../../componentes/Seo/Seo'

// Clase 12 (obligatorio): sección "Mi Perfil". Solo se llega a través de
// ProtectedRoute, así que `usuario` nunca es null acá.
function Perfil() {
  // La info del usuario sale directo del AuthContext, como pide la consigna.
  const { usuario, esAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [saliendo, setSaliendo] = useState(false)

  const cerrarSesion = async () => {
    setSaliendo(true)
    try {
      // Bonus: primero al inicio y después cerramos la sesión. Al revés,
      // al quedar usuario=null ProtectedRoute nos mandaría al login antes
      // de que llegue el navigate('/').
      navigate('/', { replace: true })
      await logout()
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
      alert('No se pudo cerrar la sesión. Probá de nuevo.')
      setSaliendo(false)
    }
  }

  return (
    <section className="auth">
      <Seo
        titulo="Mi perfil"
        descripcion="Tu cuenta de BuBus Originals."
        noIndexar
      />
      <div className="auth-card">
        <h1 className="section-title">Mi perfil</h1>
        <p className="perfil-saludo">¡Hola de nuevo, {usuario?.email}!</p>
        {usuario?.metadata.lastSignInTime && (
          <p className="perfil-dato">
            Último ingreso: {new Date(usuario.metadata.lastSignInTime).toLocaleString('es-AR')}
          </p>
        )}

        {/* Atajos al panel, solo para la cuenta del admin. Un cliente
             registrado ve un acceso al catálogo. */}
        <div className="perfil-accesos">
          {esAdmin ? (
            <>
              <Link to="/admin/productos" className="btn-admin btn-admin--secundario">
                Gestionar productos
              </Link>
              <Link to="/admin/cupones" className="btn-admin btn-admin--secundario">
                Gestionar cupones
              </Link>
            </>
          ) : (
            <Link to="/productos" className="btn-admin btn-admin--secundario">
              Ver productos
            </Link>
          )}
        </div>

        <button type="button" className="btn-admin" onClick={cerrarSesion} disabled={saliendo}>
          {saliendo ? 'Cerrando...' : 'Cerrar Sesión'}
        </button>
      </div>
    </section>
  )
}

export default Perfil
