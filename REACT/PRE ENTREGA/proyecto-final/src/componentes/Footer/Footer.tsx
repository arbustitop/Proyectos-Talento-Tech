import type { FormEvent } from 'react'
import logo from '../../assets/bubus_header_logo.png'

// Requerimiento #1 de la pre-entrega: info de empresa (propiedad
// intelectual, políticas, contacto, newsletter) + al menos 3 tarjetas
// de persona. BuBus Originals es un negocio 100% online (sin
// sucursales físicas), por eso no hay sección de direcciones.
const equipo = [
  {
    nombre: 'Augusto Vila',
    rol: 'Fundador & Diseño DTF',
  },
  {
    nombre: 'Facundo Luna',
    rol: 'Diseño y Producción',
  },
  {
    nombre: 'Uri Broit',
    rol: 'Líder Comercial',
  },
]

function avatarUrl(nombre: string) {
  const iniciales = encodeURIComponent(nombre)
  return `https://ui-avatars.com/api/?name=${iniciales}&background=8b5cf6&color=fff&bold=true&size=128`
}

function Footer() {
  const suscribirse = (e: FormEvent<HTMLFormElement>) => {
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
            Estampados DTF con presentación profesional: remeras, buzos,
            camperas y accesorios personalizados a tu gusto.
          </p>
        </div>

        <div className="footer-col">
          <h4>Contacto</h4>
          <ul>
            <li><a href="mailto:bubusogventas@gmail.com">bubusogventas@gmail.com</a></li>
            <li><a href="https://wa.me/5491162767836" target="_blank" rel="noopener noreferrer">+54 11 6276-7836</a></li>
            <li><a href="https://instagram.com/BubusOG.AR" target="_blank" rel="noopener noreferrer">@BubusOG.AR</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Política de Privacidad</a></li>
            <li><a href="#">Términos y Condiciones</a></li>
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
        <div className="team-grid">
          {equipo.map((persona, i) => (
            <div className="team-card" key={`${persona.nombre}-${i}`}>
              <img src={avatarUrl(persona.nombre)} alt={persona.nombre} className="team-avatar" />
              <p className="team-nombre">{persona.nombre}</p>
              <p className="team-rol">{persona.rol}</p>
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
