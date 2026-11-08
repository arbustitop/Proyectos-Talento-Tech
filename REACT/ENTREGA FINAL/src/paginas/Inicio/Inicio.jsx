import { Link } from 'react-router-dom'
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
        <Link to="/productos" className="btn-hero-cta">
          Ver catálogo
        </Link>
      </section>

      {/* Entrega Final: el Inicio muestra solo 6 destacados (dos filas); el
           catálogo completo, con buscador y paginador, está en /productos. */}
      <div id="catalogo">
        <ItemListContainer Mensaje="Productos destacados" limite={6} />
      </div>
    </div>
  )
}

export default Inicio
