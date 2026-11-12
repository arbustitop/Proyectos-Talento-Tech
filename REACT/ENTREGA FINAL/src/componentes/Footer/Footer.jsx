import { Link } from 'react-router-dom'
import { FaEnvelope, FaWhatsapp, FaInstagram } from 'react-icons/fa'
import logo from '../../assets/bubus_header_logo.png'
import {
  linkWhatsApp,
  WHATSAPP_VISIBLE,
  EMAIL,
  INSTAGRAM_URL,
  INSTAGRAM_USUARIO,
} from '../../utils/contacto'

// Requerimiento #1 de la pre-entrega: info de empresa (propiedad
// intelectual, políticas, contacto, newsletter). BuBus Originals es un
// negocio 100% online (sin sucursales físicas), por eso no hay sección de
// direcciones.
// Rediseño: las tarjetas del equipo (que se leen de Firestore) pasaron a la
// página /nosotros. En el pie de cada página se veían como un trabajo
// práctico, y obligaban a leer Firestore en todas las visitas.

function Footer() {
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
          {/* Rediseño: antes repetía la frase del hero ("presentación
               profesional"). Acá va lo que hacemos y por dónde se pide. */}
          <p>
            Estampamos con DTF remeras, buzos, camperas y mochilas con tu diseño. Pedidos y
            consultas por WhatsApp.
          </p>
        </div>

        <div className="footer-col">
          <h2>Contacto</h2>
          {/* Clase 13: ícono de cada canal (React Icons) delante del dato. */}
          <ul>
            <li>
              <a href={`mailto:${EMAIL}`}>
                <FaEnvelope aria-hidden="true" />
                {EMAIL}
              </a>
            </li>
            <li>
              <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer">
                <FaWhatsapp aria-hidden="true" />
                {WHATSAPP_VISIBLE}
              </a>
            </li>
            <li>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                <FaInstagram aria-hidden="true" />@{INSTAGRAM_USUARIO}
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h2>Legal</h2>
          {/* Antes los dos iban a "#". Ahora llevan a la página /legales:
               los términos desde el principio y la privacidad directo a su
               sección (el salto al #privacidad lo hace ScrollArriba). */}
          <ul>
            <li>
              <Link to="/legales#privacidad">Política de privacidad</Link>
            </li>
            <li>
              <Link to="/legales">Términos y condiciones</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col footer-newsletter">
          <h2>Newsletter</h2>
          <p>Enterate primero de nuevos diseños y promociones.</p>
          <form onSubmit={suscribirse}>
            <input type="email" placeholder="tu@email.com" required />
            <button type="submit">Suscribirme</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 BuBus Originals — Todos los derechos reservados</p>
      </div>
    </footer>
  )
}

export default Footer
