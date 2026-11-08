import { Link } from 'react-router-dom'
import logo from '../../assets/bubus_header_logo.png'
import { FaUser, FaSignInAlt, FaBoxOpen, FaTicketAlt } from 'react-icons/fa'
import { useAuth } from '../../context/useAuth'
import { CartWidget } from '../CartWidget/CartWidget'

function Header() {
  // Clase 12: "Mi perfil" solo aparece con sesión abierta; sin sesión,
  // "Ingresar". Entrega Final: Panel y Cupones, solo para el admin.
  // Clase 13: los links con acción (carrito, panel, cuenta) llevan ícono
  // además del texto. El texto se queda porque un ícono solo no siempre se
  // entiende; aria-hidden porque el texto ya lo dice.
  const { usuario, cargando, esAdmin } = useAuth()

  return (
    <header className="main-header">
      <div className="header-brand">
        <img src={logo} alt="BuBus Originals" className="header-logo" />
        <span className="brand-name">BuBus Originals</span>
      </div>

      <nav className="header-nav">
        <ul>
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/productos">Productos</Link>
          </li>
          {/* Contacto no es una ruta propia (no la pide la consigna):
               ancla a la sección de contacto del Footer. */}
          <li>
            <a href="#contacto">Contacto</a>
          </li>
          {/* Entrega Final: el link al carrito con el contador de
               unidades, que lee el CarritoContext. */}
          <li>
            <CartWidget />
          </li>
          {/* Mientras Firebase revisa la sesión no mostramos ninguno, así
               no parpadea "Ingresar" a alguien ya logueado. */}
          {!cargando &&
            (usuario ? (
              <>
                {/* Clase 10: enlace a la ruta de administración de cupones.
                     Solo el admin los ve: un cliente registrado no puede
                     usar el panel. */}
                {esAdmin && (
                  <>
                    <li>
                      <Link to="/admin/productos">
                        <FaBoxOpen aria-hidden="true" />
                        Panel
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/cupones">
                        <FaTicketAlt aria-hidden="true" />
                        Cupones
                      </Link>
                    </li>
                  </>
                )}
                <li>
                  <Link to="/perfil">
                    <FaUser aria-hidden="true" />
                    Mi perfil
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">
                  <FaSignInAlt aria-hidden="true" />
                  Ingresar
                </Link>
              </li>
            ))}
        </ul>
      </nav>
    </header>
  )
}

export default Header
