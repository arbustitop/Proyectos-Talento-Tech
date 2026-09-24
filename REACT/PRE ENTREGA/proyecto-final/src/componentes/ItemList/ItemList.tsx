// ItemList — "El Organizador" (Clase 04, Nivel 2). Recibe la lista
// completa y delega en Item el renderizado de cada producto individual.

import { Item } from '../Item/Item'

export interface DatoItem {
  id: string
  nombre: string
  precio: number
  stock: number
  imagen?: string
  categoria?: string
}

interface ItemListProps {
  productos: DatoItem[]
}

export function ItemList({ productos }: ItemListProps) {
  // Sin wrapper propio: el contenedor grid (.products-grid) del padre
  // necesita que cada Item sea un hijo directo suyo para poder ubicarlos
  // en columnas. Un div extra acá dejaría el grid con un solo hijo.
  return (
    <>
      {/* Spread ({...prod}) pasa id/nombre/precio/stock como props
          individuales a Item, sin escribirlas una por una. */}
      {productos.map((prod) => (
        <Item key={prod.id} {...prod} />
      ))}
    </>
  )
}
