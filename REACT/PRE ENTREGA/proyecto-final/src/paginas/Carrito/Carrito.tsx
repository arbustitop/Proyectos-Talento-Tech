import { Link } from 'react-router-dom'

// Requerimiento #3 de la pre-entrega: la ruta /carrito tiene que
// existir. La funcionalidad real (Context API, addToCart, contador en
// el nav) es Requerimiento #4, que la consigna deja explícitamente
// FUERA de la pre-entrega — se suma en la Entrega Final. Por ahora es
// un estado vacío.
function Carrito() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h2 className="section-title">Tu Carrito</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
        Todavía no agregaste productos al carrito.
      </p>
      <Link to="/productos" className="btn-hero-cta">Ver Catálogo</Link>
    </div>
  )
}

export default Carrito
