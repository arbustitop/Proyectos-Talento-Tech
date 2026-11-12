import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/bubus_header_logo.png'
import { FaUser, FaSignInAlt, FaBoxOpen, FaTicketAlt, FaBars, FaTimes } from 'react-icons/fa'
import { useAuth } from '../../context/useAuth'
import { CartWidget } from '../CartWidget/CartWidget'

function Header() {
  // Entrega Final, celular: el menú se esconde detrás de un botón (☰) para
  // que no ocupe dos renglones. En pantallas anchas este estado no se usa:
  // el CSS muestra el menú siempre.
  const [menuAbierto, setMenuAbierto] = useState(false)
  const cerrarMenu = () => setMenuAbierto(false)

  // Con el menú abierto, Escape lo cierra (lo que se espera de un menú
  // desplegable con teclado).
  useEffect(() => {
    if (!menuAbierto) return
    const alApretar = (e) => {
      if (e.key === 'Escape') setMenuAbierto(false)
    }
    document.addEventListener('keydown', alApretar)
    return () => document.removeEventListener('keydown', alApretar)
  }, [menuAbierto])

  // Clase 12: "Mi perfil" solo aparece con sesión abierta; sin sesión,
  // "Ingresar". Entrega Final: Panel y Cupones, solo para el admin.
  // Clase 13: los links con acción (carrito, panel, cuenta) llevan ícono
  // además del texto. El texto se queda porque un ícono solo no siempre se
  // entiende; aria-hidden porque el texto ya lo dice.
  const { usuario, cargando, esAdmin } = useAuth()

  return (
    <header className="main-header">
      {/* La marca lleva al Inicio, como en casi cualquier tienda. alt vacío:
           el nombre ya está escrito al lado. */}
      <Link to="/" className="header-brand" onClick={cerrarMenu}>
        <img src={logo} alt="" className="header-logo" />
        <span className="brand-name">BuBus Originals</span>
      </Link>

      {/* Solo en celular: el carrito queda siempre a mano, afuera del menú.
           En pantallas anchas este div está oculto (display: none, que
           también lo saca del lector de pantalla), así no hay dos carritos. */}
      <div className="header-carrito-movil">
        <CartWidget />
      </div>

      <button
        type="button"
        className="menu-toggle"
        onClick={() => setMenuAbierto(!menuAbierto)}
        aria-expanded={menuAbierto}
        aria-controls="menu-principal"
        aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
      >
        {menuAbierto ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
      </button>

      <nav id="menu-principal" className={`header-nav${menuAbierto ? ' is-open' : ''}`}>
        {/* Cualquier link que se toque cierra el menú (el clic sube desde el
             link hasta la lista). Enter con el teclado también genera clic. */}
        <ul
          onClick={(e) => {
            if (e.target.closest('a')) cerrarMenu()
          }}
        >
          <li>
            <Link to="/">Inicio</Link>
          </li>
          <li>
            <Link to="/productos">Productos</Link>
          </li>
          {/* Contacto es una página propia. Antes era un ancla (#contacto)
               que tiraba al pie de la página en la que estuvieras y dejaba
               la URL como /producto/4#contacto. */}
          <li>
            <Link to="/contacto">Contacto</Link>
          </li>
          {/* Entrega Final: el link al carrito con el contador de
               unidades, que lee el CarritoContext. */}
          {/* En celular este se oculta: está el de header-carrito-movil. */}
          <li className="nav-carrito">
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
