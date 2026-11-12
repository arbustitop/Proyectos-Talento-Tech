import { lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './context/AuthProvider'
import { CarritoProvider } from './context/CarritoProvider'
import Layout from './componentes/layout/Layout'
import { ProtectedRoute } from './componentes/ProtectedRoute/ProtectedRoute'
import Inicio from './paginas/Inicio/Inicio'
import Productos from './paginas/Productos/Productos'
import DetalleProducto from './paginas/DetalleProducto/DetalleProducto'
import Carrito from './paginas/Carrito/Carrito'
import Contacto from './paginas/Contacto/Contacto'
// Legales se importa normal (no con lazy): el link "Política de privacidad"
// salta a /legales#privacidad, y con lazy la sección todavía no existiría
// en el momento en que ScrollArriba la busca.
import Legales from './paginas/Legales/Legales'
import NotFound from './paginas/NotFound/NotFound'

// Clase 13, rendimiento: carga diferida (code splitting). Login, registro,
// perfil y el panel no los usa todo el mundo; con lazy() Vite los separa
// en archivos aparte que el navegador baja recién al entrar a esa ruta.
// Un cliente que solo mira el catálogo no los descarga nunca. El
// <Suspense> que muestra "Cargando..." mientras tanto está en Layout.
// (lazy necesita que la página se exporte con export default.)
const Login = lazy(() => import('./paginas/Login/Login'))
const Registro = lazy(() => import('./paginas/Registro/Registro'))
const Perfil = lazy(() => import('./paginas/Perfil/Perfil'))
// Nosotros también va aparte: la mira poca gente y es la única página
// pública que lee la colección `equipo` de Firestore.
const Nosotros = lazy(() => import('./paginas/Nosotros/Nosotros'))
const GestionProductos = lazy(() => import('./paginas/admin/GestionProductos/GestionProductos'))
const GestionCupones = lazy(() => import('./paginas/admin/GestionCupones/GestionCupones'))

// El sitio que ve el cliente son estas páginas con rutas; los ejercicios
// sueltos de cada clase no forman parte de la app.

function App() {
  return (
    // Clase 12: AuthProvider envuelve todo, así el Header y cualquier
    // página saben si hay sesión.
    // Entrega Final: CarritoProvider también, así el contador del Header,
    // las tarjetas y la página /carrito comparten el mismo carrito.
    <AuthProvider>
      <CarritoProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Inicio />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/producto/:id" element={<DetalleProducto />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/nosotros" element={<Nosotros />} />
              <Route path="/legales" element={<Legales />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />

              {/* Rutas protegidas (Clase 12): sin sesión, ProtectedRoute
                   manda al login. */}
              <Route
                path="/perfil"
                element={
                  <ProtectedRoute>
                    <Perfil />
                  </ProtectedRoute>
                }
              />
              {/* Panel de administración: Clase 11 (productos) y Clase 10
                   (cupones). soloAdmin: un cliente registrado no entra. */}
              <Route
                path="/admin/productos"
                element={
                  <ProtectedRoute soloAdmin>
                    <GestionProductos />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/cupones"
                element={
                  <ProtectedRoute soloAdmin>
                    <GestionCupones />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CarritoProvider>
    </AuthProvider>
  )
}

export default App
