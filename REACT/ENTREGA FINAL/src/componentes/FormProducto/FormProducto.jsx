import { useState, useEffect } from 'react'
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'

// Clase 11 (obligatorio): el MISMO formulario crea y edita. Lo decide la
// prop `productoAEditar`:
//   - null      → creación (addDoc, ID automático)
//   - producto  → edición  (updateDoc sobre su ID)
// `alTerminar` avisa al panel que guardamos o cancelamos, para que vuelva
// a poner productoAEditar en null.

const VACIO = {
  nombre: '',
  precio: '',
  stock: '',
  categoria: '',
  imagen: '',
  descripcion: '',
  destacado: false,
  fotos: [],
}

export function FormProducto({ productoAEditar, alTerminar, categorias }) {
  // Un estado por campo, todos como texto (es lo que manejan los inputs).
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')
  const [categoria, setCategoria] = useState('')
  const [imagen, setImagen] = useState('')
  // Entrega Final: texto para el detalle del producto y marca para que
  // aparezca entre los destacados del Inicio. Los dos son opcionales.
  const [descripcion, setDescripcion] = useState('')
  const [destacado, setDestacado] = useState(false)
  // Galería del detalle: fotos además de la principal (espalda, detalle de
  // la estampa). En el formulario es un texto con una URL por línea; en
  // Firestore se guarda como lista (array).
  const [fotosExtra, setFotosExtra] = useState('')
  const [guardando, setGuardando] = useState(false)

  const modoEdicion = productoAEditar !== null

  // Copia un producto a los campos (o los vacía con VACIO). En Firestore
  // precio y stock son number: acá se muestran como texto y al guardar se
  // vuelven a convertir con Number().
  const cargarCampos = (p) => {
    setNombre(p.nombre)
    setPrecio(String(p.precio))
    setStock(String(p.stock))
    setCategoria(p.categoria ?? '')
    setImagen(p.imagen ?? '')
    // ?? porque los productos cargados antes no tienen estos campos.
    setDescripcion(p.descripcion ?? '')
    setDestacado(p.destacado ?? false)
    setFotosExtra((p.fotos ?? []).join('\n'))
  }

  // Requerimiento técnico: useEffect que observa productoAEditar y pasa
  // sus datos a los estados del form (o los vacía si volvió a null).
  // El lint avisa "set-state-in-effect": React hoy prefiere remontar el
  // form con una `key` por producto, pero la consigna pide este useEffect
  // a propósito para practicar la sincronización con un efecto.
  useEffect(() => {
    cargarCampos(productoAEditar ?? VACIO)
  }, [productoAEditar])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // --- Validación, antes de tocar Firebase ---
    const nombreLimpio = nombre.trim()
    const precioNumero = Number(precio)
    const stockNumero = stock.trim() === '' ? 0 : Number(stock)

    if (!nombreLimpio) {
      alert('El nombre del producto no puede estar vacío.')
      return
    }
    // Number('') es 0 y Number('abc') es NaN: este chequeo ataja vacío,
    // texto y negativos de una vez.
    if (!Number.isFinite(precioNumero) || precioNumero <= 0) {
      alert('El precio tiene que ser un número mayor que cero.')
      return
    }
    if (!Number.isInteger(stockNumero) || stockNumero < 0) {
      alert('El stock tiene que ser un número entero, 0 o más.')
      return
    }

    const datos = {
      nombre: nombreLimpio,
      precio: precioNumero,
      stock: stockNumero,
      categoria: categoria.trim(),
      imagen: imagen.trim(),
      descripcion: descripcion.trim(),
      destacado,
      // Una URL por renglón; se descartan los renglones vacíos.
      fotos: fotosExtra
        .split('\n')
        .map((url) => url.trim())
        .filter(Boolean),
    }

    setGuardando(true)
    try {
      // Requerimiento técnico: la lógica condicional del onSubmit.
      if (productoAEditar === null) {
        await addDoc(collection(db, 'productos'), datos)
        // productoAEditar ya era null y no cambia: el efecto no vuelve a
        // correr, así que vaciamos a mano.
        cargarCampos(VACIO)
      } else {
        // updateDoc cambia solo los campos que le pasamos, en el documento
        // de ese ID. addDoc no se ejecuta en este caso.
        await updateDoc(doc(db, 'productos', productoAEditar.id), datos)
      }
      alTerminar()
    } catch (err) {
      console.error('Error al guardar producto:', err)
      alert('No se pudo guardar el producto. Revisá tu sesión y probá de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <form
      className={`admin-card admin-form ${modoEdicion ? 'admin-form--edicion' : ''}`}
      onSubmit={handleSubmit}
    >
      {/* Interfaz adaptativa: título según el modo. */}
      <h2>{modoEdicion ? `Editando: ${productoAEditar.nombre}` : 'Nuevo producto'}</h2>

      <label>
        Nombre
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      </label>

      <div className="admin-form-fila">
        <label>
          Precio ($)
          {/* type="text" + inputMode: valida nuestro código (y el alert que
               pide la consigna), no el navegador; en el celular igual sale
               el teclado numérico. */}
          <input
            type="text"
            inputMode="decimal"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
        </label>
        <label>
          Stock
          <input
            type="text"
            inputMode="numeric"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </label>
      </div>

      <label>
        Categoría
        <input
          type="text"
          list="categorias-producto"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        />
        <datalist id="categorias-producto">
          {categorias.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </label>

      <label>
        URL de la imagen
        <input
          type="url"
          value={imagen}
          onChange={(e) => setImagen(e.target.value)}
          placeholder="https://i.ibb.co/..."
        />
      </label>

      <label>
        Descripción (se ve en el detalle del producto)
        <textarea
          rows={3}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Ej: Remera de algodón peinado 24/1 con estampado DTF frente."
        />
      </label>

      <label>
        Fotos extra para la galería (una URL por renglón)
        <textarea
          rows={3}
          value={fotosExtra}
          onChange={(e) => setFotosExtra(e.target.value)}
          placeholder={'https://i.ibb.co/.../espalda.jpg\nhttps://i.ibb.co/.../detalle.jpg'}
        />
      </label>

      {/* El checkbox va antes del texto y en la misma fila: así se lee
           "[x] Destacado en el Inicio" y todo el renglón es clickeable. */}
      <label className="admin-form-check">
        <input
          type="checkbox"
          checked={destacado}
          onChange={(e) => setDestacado(e.target.checked)}
        />
        Destacado en el Inicio
      </label>

      <div className="admin-form-acciones">
        {/* Interfaz adaptativa: texto del botón según el modo. */}
        <button type="submit" className="btn-admin" disabled={guardando}>
          {guardando ? 'Guardando...' : modoEdicion ? 'Actualizar Producto' : 'Agregar Producto'}
        </button>
        {modoEdicion && (
          <button
            type="button"
            className="btn-admin btn-admin--secundario"
            onClick={alTerminar}
            disabled={guardando}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
