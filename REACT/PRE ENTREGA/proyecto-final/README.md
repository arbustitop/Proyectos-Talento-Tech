# BuBus Originals — Proyecto Final (Talento Tech, React)

Proyecto final integrador del curso de React de Talento Tech. E-commerce de
estampados DTF para la marca BuBus Originals, construido clase a clase con
TypeScript + Vite.

## Stack

- React + TypeScript (Vite, template `react-ts`)
- CSS Modules para estilos encapsulados por componente
- Oxlint

## Estructura

Cada componente vive en su propia carpeta dentro de `src/componentes/`
(convención introducida en Clase 04):

```text
src/
  componentes/
    <NombreComponente>/
      <NombreComponente>.tsx
      <NombreComponente>.module.css   (si tiene estilos encapsulados)
  data/                                 datos de ejemplo (catálogo, servicios)
  App.tsx                               ensambla todos los componentes
```

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

## Registro de errores y soluciones

Bugs reales que aparecieron mientras se armaba el proyecto, y cómo se
resolvieron — para tener memoria de los errores típicos y no repetirlos.

### Clase 01 — comentario TODO obsoleto sin borrar

En `Saludo.jsx`, después de completar el `return`, quedó colgado el
comentario `// TODO: completar el return con tu JSX` al final de la línea.
No rompía nada, pero era código muerto engañoso (parecía que faltaba
resolver algo que ya estaba resuelto). **Solución**: borrar el comentario
una vez que el código que describía ya está hecho.

### Clase 02 — `key={index}` en vez de una key única

En la Lista de Asistentes, el `.map()` usaba el índice del array como
`key`. Funciona, pero no sigue la recomendación de React de usar un
identificador estable de los datos. **Solución**: usar `key={asistente.nombre}`
(el nombre es único en ese set de datos).

### Clase 02 — exportar datos y componente desde el mismo archivo

`App.jsx` exportaba una constante `asistentes` junto con el componente
`App`. React Fast Refresh (hot reload) funciona mejor cuando un archivo
exporta *solo* componentes; mezclar un export de datos ahí puede romper el
hot reload de ese archivo (warning de `oxlint`: `react/only-export-components`).
**Solución**: mover los datos a su propio archivo en `data/`.

### Clase 03 — `key={prod.id}` con un `id` que no existía

En el catálogo de productos, el `.map()` usaba `key={prod.id}`, pero los
objetos de `data/productos.ts` no tienen campo `id` (solo `nombre`,
`categoria`, `precio`, `imagen`). Todas las keys terminaban siendo
`undefined`, y React tira el warning de "keys duplicadas" en consola.
**Solución**: usar `key={prod.nombre}`, que sí es único en ese catálogo.

### Clase 04 — código pegado fuera de la función (ReferenceError)

Al resolver la pregunta de "¿cómo mostrar solo los productos con stock?",
el filtro quedó escrito así, DESPUÉS del `}` que cierra el componente:

```js
export function ItemListContainer({ Mensaje }) {
  const productos = [...]
  return ( ... )
}
const productosConStock = productos.filter(prod => prod.stock > 0) // fuera de la función
<ItemList productos={productosConStock} />                          // código muerto
```

`productos` era una variable local del componente — fuera de la función no
existe, así que apenas se importaba el archivo la app tiraba
`ReferenceError: productos is not defined`. Además esas líneas nunca se
ejecutaban como parte del render. **Solución**: mover el `.filter()` adentro
de la función, antes del `return`, y usar `productosConStock` (en vez de
`productos`) en el `<ItemList productos={...} />` del return.
