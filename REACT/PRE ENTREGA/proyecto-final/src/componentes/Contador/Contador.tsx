// Contador — ejemplo clásico de useState (Clase 04).
// Sirve para probar el hook de forma aislada antes de usarlo en Item.

import { useState } from 'react'

export function Contador() {
  // useState nos da dos cosas: el valor actual ("contador") y la función
  // para actualizarlo ("setContador"). Nunca se modifica "contador" a mano.
  const [contador, setContador] = useState(0)

  const incrementar = () => {
    setContador(contador + 1)
  }

  const decrementar = () => {
    setContador(contador - 1)
  }

  // Cada vez que se llama a setContador, React vuelve a renderizar este
  // componente con el nuevo valor.
  return (
    <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Contador de Ejemplo</h3>
      <p>Valor actual: {contador}</p>
      <button onClick={incrementar}>Sumar +1</button>
      <button onClick={decrementar}>Restar -1</button>
    </div>
  )
}
