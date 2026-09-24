// NewProductContainer — Clase 06 (obligatorio): contenedor del alta de
// producto. Maneja los datos del formulario y sube la imagen a Imgbb antes
// de armar el producto final. El estado `loading` evita que el usuario
// reenvíe el formulario mientras la imagen se está subiendo.
// Portado desde CLASE 6/ejercicios/src/NewProductContainer.jsx.
// En Clase 10, cuando se conecte Firebase, `handleFormSubmit` va a guardar
// `nuevoProducto` en la base en vez de solo loguearlo.

import { useState, type ChangeEvent, type FormEvent } from 'react'
import ProductForm from '../ProductForm/ProductForm'

// La API key vive en .env (VITE_IMGBB_API_KEY), no en el código — .env está
// en .gitignore. Ver .env.example para la variable que hay que definir.
const IMGBB_UPLOAD_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`

interface ImgbbResponse {
  data: {
    url: string
  }
}

function NewProductContainer() {
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [imagen, setImagen] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    if (name === 'nombre') setNombre(value)
    if (name === 'precio') setPrecio(value)
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setImagen(event.target.files?.[0] ?? null)
  }

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const formData = new FormData()
      if (imagen) formData.append('image', imagen)

      const response = await fetch(IMGBB_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('No se pudo subir la imagen')
      }

      const data: ImgbbResponse = await response.json()
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
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
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
      loading={loading}
    />
  )
}

export default NewProductContainer
