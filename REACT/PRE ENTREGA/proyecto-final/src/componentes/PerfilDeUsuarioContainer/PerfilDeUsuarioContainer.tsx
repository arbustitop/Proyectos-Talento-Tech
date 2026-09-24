// Componente contenedor — PerfilDeUsuarioContainer
//
// Guarda los datos del usuario y se los pasa a TarjetaUsuario (presentacional).

import TarjetaUsuario from '../TarjetaUsuario/TarjetaUsuario'

export function PerfilDeUsuarioContainer() {
  const usuario = {
    nombre: 'BuBus Originals',
    profesion: 'Estampados DTF personalizados',
  }

  return <TarjetaUsuario nombre={usuario.nombre} profesion={usuario.profesion} />
}
