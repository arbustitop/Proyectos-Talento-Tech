// EfectoTitulo — Clase 05, demo mínima de useEffect (sin API todavía).
// No es una feature real de la tienda: es la prueba de que el patrón
// "efecto que corre después del render, solo cuando cambia una
// dependencia" funciona, análoga al Contador de la Clase 04.

import { useState, useEffect } from 'react'

function EfectoTitulo() {
  const [contador, setContador] = useState(0)

  useEffect(() => {
    document.title = `Contador: ${contador}`
  }, [contador])

  return (
    <div>
      <h2>Demo: useEffect + document.title</h2>
      <p>Mirá la pestaña del navegador al hacer click.</p>
      <button onClick={() => setContador(contador + 1)}>
        Sumar ({contador})
      </button>
    </div>
  )
}

export default EfectoTitulo
