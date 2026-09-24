import { Item } from '../Item/Item'

export function ItemList({ productos }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
      {productos.map((prod) => (
        <Item key={prod.id} {...prod} />
      ))}
    </div>
  )
}
