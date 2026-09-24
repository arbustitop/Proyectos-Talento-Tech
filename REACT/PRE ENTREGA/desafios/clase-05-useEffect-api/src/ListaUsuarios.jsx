import { useState, useEffect } from 'react'

// Ejercicio 2: consumir una API con useEffect + estados de carga/error
//
// API a usar: https://jsonplaceholder.typicode.com/users

function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((respuesta) => {
        if (!respuesta.ok) {
          throw new Error('Error al cargar los usuarios')
        }
        return respuesta.json()
      })
      .then((data) => {
        setUsuarios(data)
      })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setCargando(false)
      })
  }, []) // ← se ejecuta solo una vez, al montar el componente

  return (
    <div>
      <h2>Ejercicio: Lista de Usuarios (API)</h2>

      {cargando && <p>Cargando usuarios...</p>}

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

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
