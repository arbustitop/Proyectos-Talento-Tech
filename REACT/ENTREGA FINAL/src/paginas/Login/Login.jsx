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
  'auth/missing-email': 'Escribí tu correo para recuperar la contraseña.',
}

function Login() {
  const { usuario, login, recuperarPassword } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  // Mensaje positivo (por ejemplo, "te mandamos un correo"): va aparte de
  // `error` porque se muestra con otro color.
  const [aviso, setAviso] = useState(null)
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
    setAviso(null)
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

  // "Olvidé mi contraseña": usa el correo que ya está escrito arriba, así
  // no hace falta otra pantalla. Es un botón type="button" para que no
  // dispare el submit (ni la validación `required` de la contraseña).
  const handleRecuperar = async () => {
    setError(null)
    setAviso(null)
    const correo = email.trim()
    if (!correo) {
      setError(MENSAJES['auth/missing-email'])
      return
    }
    setEnviando(true)
    try {
      await recuperarPassword(correo)
      // Mensaje neutro a propósito: Firebase no avisa si el correo existe
      // o no (protección contra enumeración de cuentas), así que nosotros
      // tampoco lo afirmamos.
      setAviso(`Si ${correo} tiene una cuenta, te llega un correo para crear una contraseña nueva. Revisá también la carpeta de spam.`)
    } catch (err) {
      const codigo = err instanceof FirebaseError ? err.code : ''
      setError(MENSAJES[codigo] ?? 'No se pudo enviar el correo. Probá de nuevo.')
      console.error('Error al recuperar contraseña:', err)
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
        <button
          type="button"
          className="auth-link-boton"
          onClick={handleRecuperar}
          disabled={enviando}
        >
          ¿Olvidaste tu contraseña?
        </button>
        {/* role="alert": los lectores de pantalla leen el error apenas aparece. */}
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        {/* role="status": se anuncia igual, pero sin interrumpir como un error. */}
        {aviso && (
          <p className="auth-aviso" role="status">
            {aviso}
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
