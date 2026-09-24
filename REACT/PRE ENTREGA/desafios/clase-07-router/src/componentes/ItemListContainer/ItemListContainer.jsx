import { ItemList } from '../ItemList/ItemList'

// Clase 7: acá reutilizamos la misma lógica de listado que ya veníamos
// usando en clases anteriores (array simulando una API + filtro de stock).
// El obligatorio de Clase 8 es evolucionar ESTE componente para que
// cargue los datos con fetch en vez de tenerlos hardcodeados.
export function ItemListContainer({ Mensaje }) {
  const productos = [
    { id: '1', nombre: 'Remera Básica Estampada DTF', precio: 4500, stock: 15, imagen: 'https://placehold.co/400x280/EDE9FE/4C1D95?text=Remera+B%C3%A1sica+DTF&font=montserrat' },
    { id: '2', nombre: 'Remera Oversize Full Print', precio: 6500, stock: 8, imagen: 'https://placehold.co/400x280/F5D0FE/4C1D95?text=Remera+Oversize+DTF&font=montserrat' },
    { id: '3', nombre: 'Remera Dama Estampada', precio: 5000, stock: 10, imagen: 'https://placehold.co/400x280/D946EF/ffffff?text=Remera+Dama+DTF&font=montserrat' },
    { id: '4', nombre: 'Buzo Canguro Estampado', precio: 8500, stock: 6, imagen: 'https://placehold.co/400x280/7C3AED/ffffff?text=Buzo+Canguro+DTF&font=montserrat' },
  ]

  // Filtramos antes de pasarle la lista a ItemList: solo mostramos lo
  // que tiene stock disponible.
  const productosConStock = productos.filter((prod) => prod.stock > 0)

  return (
    <div>
      <h2>{Mensaje}</h2>
      <ItemList productos={productosConStock} />
    </div>
  )
}
