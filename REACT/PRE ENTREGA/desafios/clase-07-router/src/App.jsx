import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Inicio from './paginas/Inicio/Inicio'
import DetalleProducto from './paginas/DetalleProducto/DetalleProducto'

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/producto/:id" element={<DetalleProducto />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
