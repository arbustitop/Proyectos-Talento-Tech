import { ItemListContainer } from '../../componentes/ItemListContainer/ItemListContainer'

function Inicio() {
  return (
    <div>
      <section className="hero">
        <h1>BuBus Originals</h1>
        <p>
          Estampados DTF con presentación profesional: remeras, buzos,
          camperas y accesorios personalizados a tu gusto.
        </p>
        <a href="#catalogo" className="btn-hero-cta">Ver Catálogo</a>
      </section>

      <div id="catalogo">
        <ItemListContainer Mensaje="Productos Destacados" />
      </div>
    </div>
  )
}

export default Inicio
