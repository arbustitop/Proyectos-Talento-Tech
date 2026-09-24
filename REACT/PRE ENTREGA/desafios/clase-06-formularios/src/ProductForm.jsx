function ProductForm({ nombre, precio, onChange, onFileChange, onSubmit, error, loading }) {
  return (
    <form onSubmit={onSubmit}>
      <h2>Nuevo producto</h2>

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
