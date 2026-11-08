import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
// Clase 13: el CSS de Bootstrap va PRIMERO y el nuestro después. Con dos
// reglas igual de específicas gana la última que se cargó, así que la
// paleta BuBus pisa a Bootstrap y no al revés.
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App'

// HelmetProvider: lo pide react-helmet-async (en React 19 es un "pasamanos",
// pero sin él Helmet tira error en versiones anteriores de React).
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)
