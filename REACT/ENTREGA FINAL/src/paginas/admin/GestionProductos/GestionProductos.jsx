import { useState, useEffect } from 'react'
import { collection, doc, deleteDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../../../firebase/config'
import { FormProducto } from '../../../componentes/FormProducto/FormProducto'
import { compararProductos, invalidarCatalogo } from '../../../utils/catalogo'
import { Seo } from '../../../componentes/Seo/Seo'

// Clase 11 (obligatorio): panel de gestión de productos. Es el contenedor:
// tiene la lista (en tiempo real) y el estado productoAEditar; el form
// crea o actualiza según ese estado. Ruta /admin/productos, protegida.
function GestionProductos() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Requerimiento técnico: null = modo creación.
  const [productoAEditar, setProductoAEditar] = useState(null)

  useEffect(() => {
    // La lista escucha la colección con onSnapshot (no pasa por
    // obtenerCatalogo, que cachea): en el panel queremos ver cada cambio
    // al instante.
    const desuscribir = onSnapshot(
      collection(db, 'productos'),
      (snapshot) => {
        const lista = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        lista.sort(compararProductos)
        setProductos(lista)
        setError(null)
        setCargando(false)
        // Cualquier cambio (de este panel o de otra pestaña) deja viejo el
        // catálogo cacheado de la tienda: lo descartamos para que la
        // próxima visita a /productos lea los datos nuevos.
        invalidarCatalogo()
      },
      (err) => {
        console.error('Error al leer productos:', err)
        setError('No se pudieron cargar los productos.')
        setCargando(false)
      },
    )
    return desuscribir
  }, [])

  const editar = (producto) => {
    setProductoAEditar(producto)
    // El form está arriba: en una lista larga quedaría fuera de la vista.
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const eliminar = async (producto) => {
    // Confirmación antes de borrar, como pide la descripción de la tarea.
    if (!confirm(`¿Eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`)) return
    try {
      await deleteDoc(doc(db, 'productos', producto.id))
      // Si era el que estábamos editando, salimos de edición: el form
      // quedaría apuntando a un documento que ya no existe.
      if (productoAEditar?.id === producto.id) setProductoAEditar(null)
    } catch (err) {
      console.error('Error al eliminar producto:', err)
      alert('No se pudo eliminar el producto.')
    }
  }

  // Categorías existentes sin repetir (Set descarta duplicados).
  const categorias = [
    ...new Set(productos.map((p) => p.categoria).filter((c) => Boolean(c))),
  ].sort()

  return (
    <section className="admin">
      <Seo
        titulo="Gestión de productos"
        descripcion="Panel de administración de productos."
        noIndexar
      />
      <h1 className="section-title">Gestión de productos</h1>

      <FormProducto
        productoAEditar={productoAEditar}
        alTerminar={() => setProductoAEditar(null)}
        categorias={categorias}
      />

      {cargando && <p className="admin-estado">Cargando productos...</p>}
      {error && <p className="admin-estado admin-error">{error}</p>}

      {!cargando && !error && (
        <ul className="admin-lista">
          {productos.map((producto) => (
            <li
              key={producto.id}
              className={`admin-card admin-item ${productoAEditar?.id === producto.id ? 'admin-item--activo' : ''}`}
            >
              {producto.imagen ? (
                <img src={producto.imagen} alt="" className="admin-miniatura" loading="lazy" />
              ) : (
                <span className="admin-miniatura" aria-hidden="true" />
              )}
              <div className="admin-datos">
                <strong>{producto.nombre}</strong>
                <span>
                  {producto.categoria || 'Sin categoría'} · $
                  {Number(producto.precio).toLocaleString('es-AR')} · Stock: {producto.stock}
                </span>
              </div>
              <div className="admin-botones">
                <button
                  type="button"
                  className="btn-admin btn-admin--secundario"
                  onClick={() => editar(producto)}
                >
                  Editar
                </button>
                <button
                  type="button"
                  className="btn-admin btn-admin--peligro"
                  onClick={() => eliminar(producto)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default GestionProductos
