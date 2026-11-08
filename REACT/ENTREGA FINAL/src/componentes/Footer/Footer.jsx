import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { FaEnvelope, FaWhatsapp, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { db } from '../../firebase/config'
import logo from '../../assets/bubus_header_logo.png'
import { linkWhatsApp } from '../../utils/contacto'

// Requerimiento #1 de la pre-entrega: info de empresa (propiedad
// intelectual, políticas, contacto, newsletter) + al menos 3 tarjetas
// de persona. BuBus Originals es un negocio 100% online (sin
// sucursales físicas), por eso no hay sección de direcciones.
// Clase 09, Parte 2: el equipo ya no está escrito acá; se lee de la
// colección `equipo` de Firestore al montar el footer. Cada documento
// trae { nombre, rol, linkedinURL, fotoURL }; el `id` no es un campo, es
// el ID del documento (doc.id).

// Avatar con las iniciales sobre el violeta de la marca. Se usa como
// respaldo cuando un integrante no tiene fotoURL cargada en Firestore.
function avatarUrl(nombre) {
  const iniciales = encodeURIComponent(nombre)
  return `https://ui-avatars.com/api/?name=${iniciales}&background=8b5cf6&color=fff&bold=true&size=128`
}

function Footer() {
  const [equipo, setEquipo] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Una sola lectura al montar ([]). Mismo patrón que ItemListContainer.
  useEffect(() => {
    // "ignore" evita setState si el footer se desmonta antes de que
    // responda Firestore (en la práctica pasa con StrictMode en dev).
    let ignore = false

    getDocs(collection(db, 'equipo'))
      .then((snapshot) => {
        // doc.data() trae los campos del documento; el ID va aparte
        // (doc.id), así que lo sumamos a mano.
        const integrantes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        // Firestore ordena los IDs como texto; los queremos 1, 2, 3.
        integrantes.sort((a, b) => Number(a.id) - Number(b.id))
        if (!ignore) setEquipo(integrantes)
      })
      .catch((err) => {
        // Detalle técnico a la consola; en pantalla, un mensaje claro.
        console.error('Error al leer el equipo de Firestore:', err)
        if (!ignore) setError('No pudimos cargar el equipo.')
      })
      .finally(() => {
        if (!ignore) setCargando(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  const suscribirse = (e) => {
    e.preventDefault()
    alert('¡Gracias por suscribirte! Pronto vas a recibir novedades de BuBus Originals.')
    e.currentTarget.reset()
  }

  return (
    <footer id="contacto" className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <img src={logo} alt="BuBus Originals" className="footer-logo" />
          <p>
            Estampados DTF con presentación profesional: remeras, buzos, camperas y accesorios
            personalizados a tu gusto.
          </p>
        </div>

        <div className="footer-col">
          <h4>Contacto</h4>
          {/* Clase 13: ícono de cada canal (React Icons) delante del dato. */}
          <ul>
            <li>
              <a href="mailto:bubusogventas@gmail.com">
                <FaEnvelope aria-hidden="true" />
                bubusogventas@gmail.com
              </a>
            </li>
            <li>
              <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer">
                <FaWhatsapp aria-hidden="true" />
                +54 11 6276-7836
              </a>
            </li>
            <li>
              <a href="https://instagram.com/BubusOG.AR" target="_blank" rel="noopener noreferrer">
                <FaInstagram aria-hidden="true" />
                @BubusOG.AR
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Legal</h4>
          <ul>
            <li>
              <a href="#">Política de Privacidad</a>
            </li>
            <li>
              <a href="#">Términos y Condiciones</a>
            </li>
          </ul>
        </div>

        <div className="footer-col footer-newsletter">
          <h4>Newsletter</h4>
          <p>Enterate primero de nuevos diseños y promociones.</p>
          <form onSubmit={suscribirse}>
            <input type="email" placeholder="tu@email.com" required />
            <button type="submit">Suscribirme</button>
          </form>
        </div>
      </div>

      <div className="footer-team">
        <h4>Nuestro Equipo</h4>
        {/* El resto del footer se muestra siempre; solo esta sección
             depende de la carga del equipo. */}
        {cargando && <p className="team-estado">Cargando equipo...</p>}
        {error && <p className="team-estado">{error}</p>}
        <div className="team-grid">
          {equipo.map((persona) => (
            // key con el ID del documento: único y estable.
            <div className="team-card" key={persona.id}>
              {/* Si fotoURL viene vacía, || cae en el avatar de iniciales:
                 nunca queda una imagen rota. */}
              <img
                src={persona.fotoURL || avatarUrl(persona.nombre)}
                alt={`Foto de ${persona.nombre}`}
                className="team-avatar"
              />

              <p className="team-nombre">{persona.nombre}</p>
              <p className="team-rol">{persona.rol}</p>
              {/* Sin linkedinURL no mostramos un link que no lleva a nada.
                 rel="noopener noreferrer": la pestaña nueva no puede
                 controlar la nuestra (igual que los links de Contacto). */}
              {persona.linkedinURL && (
                <a
                  href={persona.linkedinURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-linkedin"
                  aria-label={`LinkedIn de ${persona.nombre}`}
                >
                  <FaLinkedin aria-hidden="true" />
                  LinkedIn
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 BuBus Originals — Todos los derechos reservados</p>
      </div>
    </footer>
  )
}

export default Footer
