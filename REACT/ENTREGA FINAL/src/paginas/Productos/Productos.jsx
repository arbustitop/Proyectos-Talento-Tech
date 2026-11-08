import { ItemListContainer } from '../../componentes/ItemListContainer/ItemListContainer'
import { Seo } from '../../componentes/Seo/Seo'

// Requerimiento #3 de la pre-entrega: ruta /productos con el catálogo
// completo. Reusa el mismo ItemListContainer que Inicio (misma fuente
// de datos, Firestore desde la Clase 09), solo cambia el encabezado.
function Productos() {
  return (
    <div>
      <Seo
        titulo="Catálogo"
        descripcion="Todo el catálogo de BuBus Originals: remeras, buzos, camperas, mochilas, gorras y pliegos DTF. Buscá por nombre y armá tu pedido."
      />

      <div id="catalogo">
        <ItemListContainer Mensaje="Catálogo completo" />
      </div>
    </div>
  )
}

export default Productos
