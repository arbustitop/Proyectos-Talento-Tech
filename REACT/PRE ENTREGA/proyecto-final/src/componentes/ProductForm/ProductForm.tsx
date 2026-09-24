// ProductForm — Clase 06 (obligatorio): formulario controlado para dar de
// alta un producto, con indicador de carga mientras se sube la imagen.
// Presentacional puro: solo recibe valores y handlers por props, la lógica
// vive en NewProductContainer.

import type { ChangeEvent, FormEvent } from 'react'

interface ProductFormProps {
  nombre: string
  precio: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  error: string | null
  loading: boolean
}

function ProductForm({
  nombre,
  precio,
  onChange,
  onFileChange,
  onSubmit,
  error,
  loading,
}: ProductFormProps) {
  return (
    <form onSubmit={onSubmit} className="product-form">
      <h3>Nuevo producto</h3>

      <label>
        Nombre
        <input
          type="text"
          name="nombre"
          value={nombre}
          onChange={onChange}
          required
        />
      </label>

      <label>
        Precio
        <input
          type="number"
          name="precio"
          value={precio}
          onChange={onChange}
          required
        />
      </label>

      <label>
        Imagen
        <input
          type="file"
          name="imagen"
          accept="image/*"
          onChange={onFileChange}
          required
        />
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Subiendo...' : 'Crear producto'}
      </button>
    </form>
  )
}

export default ProductForm
