// Componente presentacional — TarjetaUsuario
//
// Muestra nombre y profesión recibidos por props.

interface TarjetaUsuarioProps {
  nombre: string
  profesion: string
}

function TarjetaUsuario({ nombre, profesion }: TarjetaUsuarioProps) {
  return (
    <div>
      <h2>{nombre}</h2>
      <p>{profesion}</p>
    </div>
  )
}

export default TarjetaUsuario
