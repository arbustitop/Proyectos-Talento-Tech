import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { FirebaseError } from 'firebase/app'
import { useAuth } from '../../context/useAuth'
import { Seo } from '../../componentes/Seo/Seo'

// Entrega Final, Requerimiento 1.2: formulario de registro que se comunica
// con Firebase Authentication (createUserWithEmailAndPassword, a través de
// registro() del AuthContext). Mismo diseño que el Login.

// Firebase pide como mínimo 6 caracteres; lo validamos antes de mandar
// para avisar sin esperar la respuesta del servidor.
const MINIMO_PASSWORD = 6

// Códigos de error de Firebase traducidos a mensajes claros.
const MENSAJES = {
  'auth/email-already-in-use': 'Ya existe una cuenta con ese correo. Probá iniciar sesión.',
  'auth/invalid-email': 'El correo no tiene un formato válido.',
  'auth/weak-password': `La contraseña tiene que tener al menos ${MINIMO_PASSWORD} caracteres.`,
  'auth/network-request-failed': 'No hay conexión. Revisá tu internet.',
  'auth/operation-not-allowed': 'El registro con correo no está activado en Firebase.',
}

function Registro() {
  const { usuario, registro } = useAuth()
  const navigate = useNavigate()

  // Formulario controlado: cada input lee su valor del estado y lo
  // actualiza en onChange.
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repetir, setRepetir] = useState('')
  const [error, setError] = useState(null)
  const [enviando, setEnviando] = useState(false)

  // Con sesión abierta no tiene sentido registrarse: directo al perfil.
  if (usuario) {
    return <Navigate to="/perfil" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Validaciones propias antes de llamar a Firebase.
    if (password.length < MINIMO_PASSWORD) {
      setError(MENSAJES['auth/weak-password'])
      return
    }
    if (password !== repetir) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setEnviando(true)
    try {
      await registro(email.trim(), password)
      // Firebase deja la sesión abierta al crear la cuenta.
      navigate('/perfil', { replace: true })
    } catch (err) {
      const codigo = err instanceof FirebaseError ? err.code : ''
      setError(MENSAJES[codigo] ?? 'No se pudo crear la cuenta. Probá de nuevo.')
      console.error('Error al registrarse:', err)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="auth">
      <Seo titulo="Crear cuenta" descripcion="Creá tu cuenta en BuBus Originals." noIndexar />
      <form className="auth-card" onSubmit={handleSubmit}>
        <h1 className="section-title">Crear cuenta</h1>
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
          {/* autoComplete="new-password": el navegador ofrece generar una
               contraseña segura en vez de autocompletar una guardada. */}
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            minLength={MINIMO_PASSWORD}
            required
          />
        </label>
        <label>
          Repetir contraseña
          <input
            type="password"
            value={repetir}
            onChange={(e) => setRepetir(e.target.value)}
            autoComplete="new-password"
            required
          />
        </label>
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn-admin" disabled={enviando}>
          {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
        <p className="auth-alternativa">
          ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
        </p>
      </form>
    </section>
  )
}

export default Registro
