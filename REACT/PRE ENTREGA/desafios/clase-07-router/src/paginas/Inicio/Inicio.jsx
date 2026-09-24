import { ItemListContainer } from '../../componentes/ItemListContainer/ItemListContainer'

// Paso 1 del obligatorio: página de inicio con diseño propio (hero +
// bienvenida), usando la paleta de marca BuBus Originals.
function Inicio() {
  return (
    <div>
      <section
        style={{
          background: 'linear-gradient(135deg, #4C1D95, #7C3AED)',
          color: '#fff',
          padding: '64px 24px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '2.25rem' }}>BuBus Originals</h1>
        <p style={{ margin: '12px auto 0', maxWidth: '520px', opacity: 0.9 }}>
          Estampados DTF con presentación profesional: remeras, buzos,
          camperas y accesorios personalizados a tu gusto.
        </p>
      </section>

      {/* Paso 2: reutilizamos la lógica de listado que ya teníamos de
          clases anteriores. */}
      <ItemListContainer Mensaje="Productos Destacados" />
    </div>
  )
}

export default Inicio
