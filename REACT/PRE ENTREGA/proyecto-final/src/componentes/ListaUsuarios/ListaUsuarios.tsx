// ListaUsuarios — Clase 05, demo de useEffect + fetch con estados de
// carga/error. Tampoco es una feature real de la tienda, es la prueba
// de que el patrón "fetch dentro de un useEffect" funciona antes de
// aplicarlo al catálogo real (ver CatalogoAPI).

import { useState, useEffect } from 'react'

interface Usuario {
  id: number
  name: string
  email: string
}

function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error('Error al cargar los usuarios')
        }
        return respuesta.json()
      })
      .then((data: Usuario[]) => {
        setUsuarios(data)
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      })
      .finally(() => {
        setCargando(false)
      })
  }, [])

  return (
    <div>
      <h2>Demo: useEffect + fetch</h2>

      {cargando && <p>Cargando usuarios...</p>}

      {error && <p style={{ color: 'var(--color-error, red)' }}>Error: {error}</p>}

      {!cargando && !error && (
        <ul>
          {usuarios.map((usuario) => (
            <li key={usuario.id}>
              <strong>{usuario.name}</strong> — {usuario.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ListaUsuarios
