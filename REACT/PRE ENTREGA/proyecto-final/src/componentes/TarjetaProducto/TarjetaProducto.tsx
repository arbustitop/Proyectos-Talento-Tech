import styles from './TarjetaProducto.module.css'

interface TarjetaProductoProps {
  imagen: string
  nombre: string
  precio: number
}

function TarjetaProducto({ imagen, nombre, precio }: TarjetaProductoProps) {
  return (
    <div className={styles.tarjeta}>
      <img src={imagen} alt={nombre} className={styles.imagen} />
      <h3 className={styles.nombre}>{nombre}</h3>
      <p className={styles.precio}>${precio}</p>
    </div>
  )
}

export default TarjetaProducto
