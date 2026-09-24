import { useState } from 'react'
import ProductForm from './ProductForm'

// Reemplazá por tu propia API key de https://api.imgbb.com/
const IMGBB_API_KEY = 'GET_YOUR_OWN_API_KEY'
const IMGBB_UPLOAD_URL = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`

function NewProductContainer() {
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [imagen, setImagen] = useState(null)
  const [error, setError] = useState(null)

  // Estado loading (Clase 6)
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    if (name === 'nombre') setNombre(value)
    if (name === 'precio') setPrecio(value)
  }

  const handleFileChange = (event) => {
    setImagen(event.target.files[0])
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setLoading(true) // Primera acción del handler

    try {
      const formData = new FormData()
      formData.append('image', imagen)

      const response = await fetch(IMGBB_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('No se pudo subir la imagen')
      }

      const data = await response.json()
      const imageUrl = data.data.url

      const nuevoProducto = {
        nombre,
        precio,
        imagen: imageUrl,
      }

      console.log('Producto creado:', nuevoProducto)

      setNombre('')
      setPrecio('')
      setImagen(null)
    } catch (err) {
      setError(err.message)
    } finally {
      // Se ejecuta siempre (éxito o error)
      setLoading(false)
    }
  }

  return (
    <ProductForm
      nombre={nombre}
      precio={precio}
      onChange={handleChange}
      onFileChange={handleFileChange}
      onSubmit={handleFormSubmit}
      error={error}
      loading={loading} // Pasamos el estado loading como prop
    />
  )
}

export default NewProductContainer