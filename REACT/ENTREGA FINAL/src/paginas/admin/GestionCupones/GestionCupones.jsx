import { useState, useEffect } from 'react'
import { collection, addDoc, doc, deleteDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../../../firebase/config'
import { Seo } from '../../../componentes/Seo/Seo'

// Clase 10 (obligatorio): alta y baja de cupones de descuento en la
// colección `cupones`, con addDoc y deleteDoc. Toda la lógica vive en este
// componente, como pide la consigna. Ruta /admin/cupones, protegida por
// login desde la Clase 12. Cada cupón es { codigo, porcentaje }:
// porcentaje de descuento de 1 a 100, guardado como number para poder
// hacer cuentas con él.

const cuponesRef = collection(db, 'cupones')

function GestionCupones() {
  const [codigo, setCodigo] = useState('')
  const [porcentaje, setPorcentaje] = useState('')

  const [cupones, setCupones] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  // Deshabilita el botón mientras guarda: un doble click no crea dos veces
  // el mismo cupón.
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    // onSnapshot (y no getDocs): se queda escuchando la colección y vuelve
    // a llamar a esta función en cada alta o baja. Así la lista se
    // actualiza en tiempo real sin volver a pedir los datos a mano.
    const desuscribir = onSnapshot(
      cuponesRef,
      (snapshot) => {
        const lista = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
        lista.sort((a, b) => a.codigo.localeCompare(b.codigo))
        setCupones(lista)
        setError(null)
        setCargando(false)
      },
      (err) => {
        console.error('Error al leer cupones:', err)
        setError('No se pudieron cargar los cupones.')
        setCargando(false)
      },
    )
    // Cleanup: dejamos de escuchar al salir de la página.
    return desuscribir
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const codigoLimpio = codigo.trim().toUpperCase()
    const porcentajeNumero = Number(porcentaje)

    if (!codigoLimpio) {
      alert('El código del cupón no puede estar vacío.')
      return
    }
    if (!Number.isFinite(porcentajeNumero) || porcentajeNumero <= 0 || porcentajeNumero > 100) {
      alert('El porcentaje tiene que ser un número entre 1 y 100.')
      return
    }
    // Dos cupones con el mismo código serían ambiguos al aplicarlo.
    if (cupones.some((c) => c.codigo === codigoLimpio)) {
      alert(`Ya existe un cupón ${codigoLimpio}.`)
      return
    }

    setGuardando(true)
    try {
      // addDoc: documento nuevo con ID automático. La lista se entera sola
      // por onSnapshot; acá solo vaciamos el form.
      await addDoc(cuponesRef, { codigo: codigoLimpio, porcentaje: porcentajeNumero })
      setCodigo('')
      setPorcentaje('')
    } catch (err) {
      console.error('Error al crear cupón:', err)
      alert('No se pudo crear el cupón. Revisá tu sesión y probá de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  const eliminarCupon = async (cupon) => {
    if (!confirm(`¿Eliminar el cupón ${cupon.codigo}?`)) return
    try {
      // doc(): referencia a un documento puntual (colección + ID).
      await deleteDoc(doc(db, 'cupones', cupon.id))
    } catch (err) {
      console.error('Error al eliminar cupón:', err)
      alert('No se pudo eliminar el cupón.')
    }
  }

  return (
    <section className="admin">
      <Seo
        titulo="Gestión de cupones"
        descripcion="Panel de administración de cupones."
        noIndexar
      />
      <h1 className="section-title">Gestión de cupones</h1>

      <form className="admin-card admin-form admin-form--fila" onSubmit={handleSubmit}>
        <label>
          Código
          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="BUBUS10"
            maxLength={20}
          />
        </label>
        <label>
          Descuento (%)
          <input
            type="number"
            value={porcentaje}
            onChange={(e) => setPorcentaje(e.target.value)}
            placeholder="10"
            min="1"
            max="100"
          />
        </label>
        <button type="submit" className="btn-admin" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Crear cupón'}
        </button>
      </form>

      {cargando && <p className="admin-estado">Cargando cupones...</p>}
      {error && <p className="admin-estado admin-error">{error}</p>}
      {!cargando && !error && cupones.length === 0 && (
        <p className="admin-estado">Todavía no hay cupones. Creá el primero.</p>
      )}

      {cupones.length > 0 && (
        <ul className="admin-lista">
          {cupones.map((cupon) => (
            <li key={cupon.id} className="admin-card admin-item">
              <span className="cupon-codigo">{cupon.codigo}</span>
              <span className="cupon-porcentaje">{cupon.porcentaje}% OFF</span>
              <button
                type="button"
                className="btn-admin btn-admin--peligro"
                onClick={() => eliminarCupon(cupon)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default GestionCupones
