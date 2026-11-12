import { Link } from 'react-router-dom'
import { FaWhatsapp } from 'react-icons/fa'
import { ItemListContainer } from '../../componentes/ItemListContainer/ItemListContainer'
import { Seo } from '../../componentes/Seo/Seo'
import { linkWhatsApp, MENSAJE_CONSULTA } from '../../utils/contacto'

// Foto del hero: el buzo con estampa en la espalda, el trabajo que mejor
// muestra lo que hace la marca. Es la misma foto del producto 5 del
// catálogo (está en ImgBB, igual que las demás).
const FOTO_HERO = 'https://i.ibb.co/chQP1CJv/buzo-completo.jpg'

// Los tres pasos reales de un pedido. Explicar cómo se compra (se cierra
// por WhatsApp, no con pago online) evita la duda de "¿y después qué?".
const PASOS = [
  {
    titulo: 'Elegís la prenda',
    texto: 'Remera, buzo, campera, mochila o pliego para estampar vos.',
  },
  {
    titulo: 'Nos pasás el diseño',
    texto: 'Tu logo, tu dibujo o una idea suelta. Si hace falta, lo ajustamos juntos.',
  },
  {
    titulo: 'Lo cerramos por WhatsApp',
    texto: 'Te confirmamos precio y entrega antes de estampar.',
  },
]

function Inicio() {
  return (
    <div>
      {/* Clase 13: título y descripción de la página para Google y para la
           vista previa al compartir el link. */}
      <Seo
        titulo="Estampados DTF"
        descripcion="Remeras, buzos, camperas, mochilas y pliegos con estampado DTF. Elegí tu prenda, contanos tu diseño y lo cerramos por WhatsApp."
      />

      {/* Hero en dos columnas: el texto dice qué hacemos y la foto lo
           muestra. El nombre de la marca ya está en el header; el título
           cuenta lo que gana el cliente. */}
      <section className="hero">
        <div className="hero-texto">
          <p className="hero-etiqueta">Estampado DTF</p>
          <h1>
            Vos traés la idea.
            <br />
            Nosotros la estampamos.
          </h1>
          <p className="hero-bajada">
            Remeras, buzos, camperas y mochilas con tu diseño. Colores vivos que aguantan los
            lavados.
          </p>
          <div className="hero-acciones">
            <Link to="/productos" className="btn-hero-cta">
              Ver prendas
            </Link>
            <a
              href={linkWhatsApp(MENSAJE_CONSULTA)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-hero-secundario"
            >
              <FaWhatsapp aria-hidden="true" />
              Escribinos
            </a>
          </div>
        </div>

        {/* fetchPriority="high": es la imagen más grande de la primera
             pantalla, conviene que el navegador la pida antes que las
             fotos de las tarjetas. */}
        <img
          src={FOTO_HERO}
          alt="Buzo negro con estampa de BuBus Originals en la espalda"
          className="hero-foto"
          width="560"
          height="560"
          fetchPriority="high"
        />
      </section>

      <section className="pasos" aria-labelledby="titulo-pasos">
        <h2 id="titulo-pasos" className="visually-hidden">
          Cómo se hace un pedido
        </h2>
        <ol>
          {PASOS.map((paso, i) => (
            <li key={paso.titulo}>
              <span className="paso-numero" aria-hidden="true">
                {i + 1}
              </span>
              <h3>{paso.titulo}</h3>
              <p>{paso.texto}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Entrega Final: el Inicio muestra solo 6 destacados (dos filas); el
           catálogo completo, con buscador y paginador, está en /productos. */}
      <div id="catalogo">
        <ItemListContainer Mensaje="Lo que más sale" limite={6} />
      </div>
    </div>
  )
}

export default Inicio
