import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'

function Layout() {
  return (
    <div className="layout-container">
      <Header />
      <main className="main-content">
        {/* Clase 13: las páginas con lazy() (ver App.jsx) tardan un instante
             la primera vez. Suspense muestra el fallback solo en el área
             central: Header y Footer quedan quietos. */}
        <Suspense
          fallback={
            <p className="cargando-pagina" role="status">
              Cargando...
            </p>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default Layout
