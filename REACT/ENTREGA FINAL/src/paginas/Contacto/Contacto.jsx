import { FaWhatsapp, FaEnvelope, FaInstagram } from 'react-icons/fa'
import { Seo } from '../../componentes/Seo/Seo'
import { Boton } from '../../componentes/ui/Boton/Boton'
import {
  linkWhatsApp,
  MENSAJE_CONSULTA,
  WHATSAPP_VISIBLE,
  EMAIL,
  INSTAGRAM_URL,
  INSTAGRAM_USUARIO,
} from '../../utils/contacto'
import styles from './Contacto.module.css'

// Página de contacto. Antes "Contacto" era un ancla al pie de la página; acá
// tiene su propia ruta (/contacto), así se puede compartir el link y el menú
// lleva a un lugar en vez de hacer scroll.
//
// WhatsApp va primero y grande porque es por donde se cierran los pedidos
// (el botón "Finalizar compra" del carrito también abre WhatsApp). Mail e
// Instagram quedan como alternativas, más chicos.
function Contacto() {
  return (
    <section className={styles.contacto}>
      <Seo
        titulo="Contacto"
        descripcion="Escribinos por WhatsApp para cotizar tu estampado DTF. También por mail o Instagram."
      />

      <h1 className={styles.titulo}>Hablemos de tu diseño</h1>
      <p className={styles.bajada}>
        Los pedidos los cerramos por WhatsApp: nos contás qué prenda querés, nos pasás el diseño y
        te confirmamos precio y entrega.
      </p>

      <Boton
        como="a"
        href={linkWhatsApp(MENSAJE_CONSULTA)}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.cta}
      >
        <FaWhatsapp aria-hidden="true" />
        Escribinos por WhatsApp
      </Boton>
      <p className={styles.numero}>{WHATSAPP_VISIBLE}</p>

      {/* Lista de definiciones: cada canal con su dato. */}
      <dl className={styles.canales}>
        <div>
          <dt>
            <FaEnvelope aria-hidden="true" /> Mail
          </dt>
          <dd>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </dd>
        </div>
        <div>
          <dt>
            <FaInstagram aria-hidden="true" /> Instagram
          </dt>
          <dd>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
              @{INSTAGRAM_USUARIO}
            </a>
          </dd>
        </div>
      </dl>

      <h2 className={styles.subtitulo}>¿Qué nos mandás?</h2>
      <ul className={styles.lista}>
        <li>La prenda y el talle (o el pliego, si es para estampar vos).</li>
        <li>El diseño en la mejor calidad que tengas. Si todavía es una idea, contanos igual.</li>
        <li>Cuántas unidades y para cuándo las necesitás.</li>
      </ul>
    </section>
  )
}

export default Contacto
