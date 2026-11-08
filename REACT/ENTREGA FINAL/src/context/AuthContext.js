// Clase 12: contexto de la sesión. Partido en tres archivos (este, el
// Provider y el hook) por la regla only-export-components de oxlint: un
// archivo que exporta componentes no debería exportar otras cosas, o el
// recargado en caliente (HMR) de Vite deja de funcionar bien. El carrito
// sigue el mismo criterio (CarritoContext / CarritoProvider / useCarrito).
import { createContext } from 'react'

// Arranca en null: el valor real lo pone <AuthProvider>. useAuth avisa si
// alguien lo usa fuera del Provider. El valor que reparte es:
//   usuario   null si no hay nadie logueado; si no, el usuario de Firebase
//             (email, uid...)
//   cargando  true hasta que Firebase confirma si había una sesión guardada
//   esAdmin   true si el usuario logueado es el dueño de la tienda
//   login(email, password), registro(email, password), logout() y
//   recuperarPassword(email), que devuelven promesas
export const AuthContext = createContext(null)
