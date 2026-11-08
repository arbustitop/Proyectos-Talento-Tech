import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { FirebaseError } from 'firebase/app'
import { useAuth } from '../../context/useAuth'
import { Seo } from '../../componentes/Seo/Seo'

// Clase 12: pantalla de ingreso con Firebase Authentication.
// Entrega Final: las cuentas nuevas se crean en /registro (link abajo).

// Firebase devuelve códigos en inglés ("auth/invalid-credential"): los
// traducimos a mensajes que entienda el usuario.
const MENSAJES = {
  'auth/invalid-credential': 'El correo o la contraseña no son correctos.',
  'auth/invalid-email': 'El correo no tiene un formato válido.',
  'auth/too-many-requests': 'Demasiados intentos. Esperá unos minutos y probá de nuevo.',
  'auth/network-request-failed': 'No hay conexión. Revisá tu internet.',
  'auth/operation-not-allowed': 'El ingreso con correo no está activado en Firebase.',
}

function Login() {
  const { usuario, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  // Adónde volver: la ruta protegida que nos mandó acá (ProtectedRoute la
  // guarda en state.desde) o, si no hay, el perfil. El ?. cubre el caso de
  // entrar directo a /login, sin state.
  const destino = location.state?.desde ?? '/perfil'

  // Con sesión abierta, el login no tiene sentido: directo al destino.
  if (usuario) {
    return <Navigate to={destino} replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      await login(email.trim(), password)
      navigate(destino, { replace: true })
    } catch (err) {
      // Solo los errores de Firebase traen `code`; cualquier otro cae en
      // el mensaje genérico.
      const codigo = err instanceof FirebaseError ? err.code : ''
      setError(MENSAJES[codigo] ?? 'No se pudo iniciar sesión. Probá de nuevo.')
      console.error('Error al iniciar sesión:', err)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="auth">
      {/* noIndexar: una pantalla de ingreso no aporta nada en Google. */}
      <Seo titulo="Iniciar sesión" descripcion="Ingresá a tu cuenta de BuBus Originals." noIndexar />
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="section-title">Iniciar sesión</h1>
        <label>
          Correo electrónico
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {/* role="alert": los lectores de pantalla leen el error apenas aparece. */}
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn-admin" disabled={enviando}>
          {enviando ? 'Ingresando...' : 'Ingresar'}
        </button>
        <p className="auth-alternativa">
          ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
        </p>
      </form>
    </section>
  )
}

export default Login
