import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Con <BrowserRouter> React Router no restaura el scroll: al pasar de una
// página a otra el navegador se quedaba a la misma altura. Si venías del pie
// de /productos, el Inicio abría por la mitad. Este componente no dibuja nada:
// cada vez que cambia la ruta (pathname) vuelve arriba de todo.
// (ScrollRestoration de React Router solo existe con RouterProvider, no con
// el BrowserRouter que usa esta app.)
export function ScrollArriba() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
