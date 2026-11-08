import styles from './Boton.module.css'

// Botón reutilizable con variantes. Un solo componente en vez de repetir el
// mismo CSS en cada botón del sitio:
//   <Boton>Agregar</Boton>                   → violeta, relleno
//   <Boton variante="contorno">Ver</Boton>   → transparente con borde
//
// Clase 14, CSS Modules: las clases de Boton.module.css se importan como un
// objeto (styles.boton, styles.relleno...). Vite les cambia el nombre al
// compilar (por ejemplo "_boton_x1y2z"), así que no chocan con ninguna otra
// clase del sitio aunque se llamen igual.
//
// ...resto: cualquier otra prop (type, onClick, disabled, aria-*, to) pasa
// tal cual al elemento.
//
// `como`: qué elemento dibujar. Por defecto un <button>; para algo que
// navega a otra página va un Link, con el mismo aspecto:
//   <Boton como={Link} to="/productos" variante="contorno">Seguir comprando</Boton>
// (Un link disfrazado de botón sigue siendo un link: se puede abrir en otra
// pestaña y el lector de pantalla lo anuncia como "enlace".)
export function Boton({
  como: Elemento = 'button',
  variante = 'relleno',
  className = '',
  children,
  ...resto
}) {
  const clases = `${styles.boton} ${styles[variante]} ${className}`.trim()
  return (
    <Elemento className={clases} {...resto}>
      {children}
    </Elemento>
  )
}
