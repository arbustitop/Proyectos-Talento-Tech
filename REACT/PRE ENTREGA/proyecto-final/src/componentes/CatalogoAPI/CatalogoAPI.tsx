// CatalogoAPI — Clase 05 (obligatorio): catálogo de productos consumiendo
// una API real con useEffect, con loading/error y un AbortController que
// cancela el fetch en vuelo (tanto el inicial como el de "Reintentar") si
// el componente se desmonta. Usa fakestoreapi.com como API de práctica;
// en la Clase 9-10, con Firebase, este mismo patrón se va a aplicar para
// traer los productos reales de BuBus Originals desde la base de datos.

import { useState, useEffect, useRef } from 'react'
import TarjetaProducto from '../TarjetaProducto/TarjetaProducto'

interface ProductoAPI {
  id: number
  title: string
  price: number
  image: string
}

function CatalogoAPI() {
  const [productos, setProductos] = useState<ProductoAPI[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Guardamos el controller en una ref (no en el closure del useEffect)
  // para que tanto la carga inicial como cada "Reintentar" queden
  // atados al mismo AbortController que el cleanup puede cancelar.
  const controllerRef = useRef<AbortController | null>(null)

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
      .then((data: ProductoAPI[]) => {
        setProductos(data)
      })
      .catch((err: unknown) => {
        // Ignoramos el error si fue porque se canceló el fetch
        if (err instanceof DOMException && err.name === 'AbortError') return
        setError(err instanceof Error ? err.message : 'Error desconocido')
      })
      .finally(() => {
        setCargando(false)
      })
  }

  useEffect(() => {
    cargarProductos()

    // Cleanup: cancela el fetch que esté en vuelo (inicial o retry)
    // si el componente se desmonta.
    return () => {
      controllerRef.current?.abort()
    }
  }, [])

  if (cargando) {
    return (
      <section className="catalogo-seccion">
        <h2>Catálogo desde API (demo Clase 05)</h2>
        <p>Cargando productos...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="catalogo-seccion">
        <h2>Catálogo desde API (demo Clase 05)</h2>
        <p style={{ color: 'var(--color-error, red)' }}>Error: {error}</p>
        <button onClick={cargarProductos}>Reintentar</button>
      </section>
    )
  }

  return (
    <section className="catalogo-seccion">
      <h2>Catálogo desde API (demo Clase 05)</h2>
      <div className="catalogo">
        {productos.map((prod) => (
          <TarjetaProducto
            key={prod.id}
            imagen={prod.image}
            nombre={prod.title}
            precio={prod.price}
          />
        ))}
      </div>
    </section>
  )
}

export default CatalogoAPI
