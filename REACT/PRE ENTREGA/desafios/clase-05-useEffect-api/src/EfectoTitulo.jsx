import { useState, useEffect } from 'react'

function EfectoTitulo() {
  const [contador, setContador] = useState(0)

  useEffect(() => {
    // Se ejecuta después de que el componente se renderiza
    // y cada vez que cambia "contador"
    document.title = `Contador: ${contador}`
  }, [contador]) // ← solo se dispara cuando cambia contador

  return (
    <div>
      <h2>Ejercicio: useEffect + document.title</h2>
      <p>Mirá la pestaña del navegador al hacer click.</p>
      <button onClick={() => setContador(contador + 1)}>
        Sumar ({contador})
      </button>
    </div>
  )
}

export default EfectoTitulo