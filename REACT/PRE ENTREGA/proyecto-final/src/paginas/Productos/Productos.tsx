import { ItemListContainer } from '../../componentes/ItemListContainer/ItemListContainer'

// Requerimiento #3 de la pre-entrega: ruta /productos con el catálogo
// completo. Reusa el mismo ItemListContainer que Inicio (misma fuente
// de datos, productos.json vía fetch), solo cambia el encabezado.
function Productos() {
  return (
    <div>
      <div id="catalogo">
        <ItemListContainer Mensaje="Catálogo Completo" />
      </div>
    </div>
  )
}

export default Productos
