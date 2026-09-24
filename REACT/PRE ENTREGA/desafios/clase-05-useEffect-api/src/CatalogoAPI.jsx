import { useState, useEffect, useRef } from 'react'

// OBLIGATORIO Clase 5: catálogo de productos desde una API real
// API: https://fakestoreapi.com/products

function CatalogoAPI() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Guardamos el controller en una ref (no en el closure del useEffect)
  // para que tanto la carga inicial como cada "Reintentar" queden
  // atados al mismo AbortController que el cleanup puede cancelar.
  const controllerRef = useRef(null)

  const cargarProductos = () => {
    setCargando(true)
    setError(null)

    controllerRef.current = new AbortController()

    fetch('https://fakestoreapi.com/products', {
      signal: controllerRef.current.signal,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('No se pudieron cargar los productos')
        }
        return res.json()
      })
      .then((data) => {
        setProductos(data)
      })
      .catch((err) => {
        // Ignoramos el error si fue porque se canceló el fetch
        if (err.name === 'AbortError') return
        setError(err.message)
      })
      .finally(() => {
        setCargando(false)
      })
  }

  useEffect(() => {
    cargarProductos()

    // Cleanup: si el componente se desmonta (o se vuelve a montar
    // el efecto), cancelamos el fetch que esté en vuelo en ese momento,
    // sea el inicial o uno disparado por "Reintentar".
    return () => {
      controllerRef.current?.abort()
    }
  }, [])

  // --- Render condicional ---

  if (cargando) {
    return (
      <div>
        <h2>Obligatorio: Catálogo desde API</h2>
        <p>Cargando productos...</p>

        {/* Tarjetas esqueleto (opcional, mejora la UX) */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              style={{
                width: '200px',
                height: '280px',
                backgroundColor: '#e0e0e0',
                borderRadius: '8px',
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h2>Obligatorio: Catálogo desde API</h2>
        <p style={{ color: 'red' }}>Error: {error}</p>
        <button onClick={cargarProductos}>
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div>
      <h2>Obligatorio: Catálogo desde API</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {productos.map((prod) => (
          <article
            key={prod.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center',
            }}
          >
            <img
              src={prod.image}
              alt={prod.title}
              style={{
                width: '120px',
                height: '120px',
                objectFit: 'contain',
              }}
            />
            <h3 style={{ fontSize: '1rem' }}>{prod.title}</h3>
            <p style={{ fontWeight: 'bold' }}>${prod.price}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export default CatalogoAPI