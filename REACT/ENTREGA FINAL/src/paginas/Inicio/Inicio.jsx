import { ItemListContainer } from '../../componentes/ItemListContainer/ItemListContainer'
import { Seo } from '../../componentes/Seo/Seo'

function Inicio() {
  return (
    <div>
      {/* Clase 13: título y descripción de la página para Google y para la
           vista previa al compartir el link. */}
      <Seo
        titulo="Estampados DTF"
        descripcion="Remeras, buzos, camperas, mochilas y pliegos con estampado DTF. Elegí tu prenda, contanos tu diseño y lo cerramos por WhatsApp."
      />

      <section className="hero">
        <h1>BuBus Originals</h1>
        <p>
          Estampados DTF con presentación profesional: remeras, buzos, camperas y accesorios
          personalizados a tu gusto.
        </p>
        <a href="#catalogo" className="btn-hero-cta">
          Ver Catálogo
        </a>
      </section>

      <div id="catalogo">
        <ItemListContainer Mensaje="Productos Destacados" />
      </div>
    </div>
  )
}

export default Inicio
