// ItemList — "El Organizador" (Clase 04, Nivel 2). Recibe la lista
// completa y delega en Item el renderizado de cada producto individual.
// Cada producto es { id, nombre, precio, stock, imagen, categoria }, con
// precio y stock como number (así vienen de Firestore).

import { Item } from '../Item/Item'

export function ItemList({ productos }) {
  // Sin wrapper propio: la fila de Bootstrap (.row) del padre necesita que
  // cada columna sea hija directa suya. Un div extra acá dejaría la fila
  // con un solo hijo.
  return (
    <>
      {/* Clase 13: cada producto va en una columna de la grilla de
           Bootstrap. De las 12 columnas de la fila, una tarjeta ocupa:
             celular (<576px)  col-12   → 1 por fila
             sm      (≥576px)  col-sm-6 → 2 por fila
             lg      (≥992px)  col-lg-4 → 3 por fila
           No pasa de 3: el sitio mide como mucho 1126px (#root en
           index.css) y con 4 el botón "Agregar al carrito" se parte en dos
           líneas.
           Spread ({...prod}) pasa id/nombre/precio/stock como props
           individuales a Item, sin escribirlas una por una. */}
      {productos.map((prod) => (
        <div className="col-12 col-sm-6 col-lg-4" key={prod.id}>
          <Item {...prod} />
        </div>
      ))}
    </>
  )
}
