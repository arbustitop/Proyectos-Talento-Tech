import { Link } from 'react-router-dom'

// Ruta catch-all: cualquier URL que no matchee ninguna de las rutas
// definidas en App.tsx cae acá, en vez de dejar el área central en
// blanco (con Header/Footer igual visibles, ya que viven en Layout).
function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h2 className="section-title">Página no encontrada</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        La página que buscás no existe o se movió.
      </p>
      <Link to="/" className="btn-hero-cta">Volver al Inicio</Link>
    </div>
  )
}

export default NotFound
