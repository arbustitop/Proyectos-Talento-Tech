import { Link } from 'react-router-dom'
import logo from '../../assets/bubus_header_logo.png'

function Header() {
  return (
    <header className="main-header">
      <div className="header-brand">
        <img src={logo} alt="BuBus Originals" className="header-logo" />
        <span className="brand-name">BuBus Originals</span>
      </div>

      <nav className="header-nav">
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/productos">Productos</Link></li>
          {/* Contacto no es una ruta propia (no la pide la consigna):
              ancla a la sección de contacto del Footer. */}
          <li><a href="#contacto">Contacto</a></li>
          <li><Link to="/carrito">Carrito</Link></li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
