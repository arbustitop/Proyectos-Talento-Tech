// Componente presentacional — Asistente
//
// Muestra los datos de una persona (usado dentro de un .map() en App.tsx).

interface AsistenteProps {
  nombre: string
  tarea: string
  emoji: string
}

function Asistente({ nombre, tarea, emoji }: AsistenteProps) {
  return (
    <div>
      <h3>{nombre}</h3>
      <p>
        {tarea} {emoji}
      </p>
    </div>
  )
}

export default Asistente
