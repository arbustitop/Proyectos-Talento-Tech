import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Layout from './componentes/layout/Layout'
import Inicio from './paginas/Inicio/Inicio'
import Productos from './paginas/Productos/Productos'
import DetalleProducto from './paginas/DetalleProducto/DetalleProducto'
import Carrito from './paginas/Carrito/Carrito'
import NotFound from './paginas/NotFound/NotFound'

// Nota: los componentes-demo de clases anteriores (TarjetaUsuario,
// Contenedor, PerfilDeUsuarioContainer, Asistente, Contador, EfectoTitulo,
// ListaUsuarios, CatalogoAPI, NewProductContainer) siguen en
// src/componentes/ como evidencia de cada clase, pero ya no se muestran
// acá: el sitio real que ve el cliente son las páginas con rutas.

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
