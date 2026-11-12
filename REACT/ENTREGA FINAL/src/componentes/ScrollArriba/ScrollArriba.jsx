import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Con <BrowserRouter> React Router no restaura el scroll: al pasar de una
// página a otra el navegador se quedaba a la misma altura. Si venías del pie
// de /productos, el Inicio abría por la mitad. Este componente no dibuja nada:
// cada vez que cambia la ruta vuelve arriba de todo.
// (ScrollRestoration de React Router solo existe con RouterProvider, no con
// el BrowserRouter que usa esta app.)
//
// Excepción: si la URL trae un ancla (#), como /legales#privacidad desde el
// footer, se baja hasta esa sección en vez de ir arriba. El navegador lo
// haría solo en una carga completa, pero no al navegar dentro de la app.
export function ScrollArriba() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // hash viene con el "#" adelante ("#privacidad"); el id es sin él.
    const destino = hash ? document.getElementById(hash.slice(1)) : null
    if (destino) {
      destino.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}
