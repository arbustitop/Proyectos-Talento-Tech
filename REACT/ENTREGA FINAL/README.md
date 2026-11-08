# BuBus Originals — E-commerce (Entrega Final React, Talento Tech 2026-2C)

Tienda online de estampados DTF de la marca **BuBus Originals**: catálogo de
prendas e insumos con búsqueda y paginador, detalle de producto, carrito,
registro e inicio de sesión, y un panel para que el dueño de la tienda
administre productos y cupones.

Autor: **Augusto Vila**

## Stack

- React 19 + Vite, en **JavaScript**
- React Router (rutas, rutas dinámicas y rutas protegidas)
- Context API: `AuthContext` (sesión) y `CarritoContext` (carrito)
- Firebase: Firestore (productos, equipo, cupones) y Authentication (correo y contraseña)
- Estilos: Bootstrap 5 (tema oscuro), CSS Modules y CSS nativo
- React Icons y React Helmet Async (título y descripción por página)

## Requerimientos de la consigna

| # | Requerimiento | Dónde está |
|---|---------------|------------|
| 1.1 | Carrito con Context API: agregar, eliminar y vaciar (además, +/- de cantidad en el carrito) | `src/context/CarritoContext.js`, `CarritoProvider.jsx`, `useCarrito.js`; contador en `src/componentes/CartWidget`; vista en `src/paginas/Carrito` |
| 1.2 | AuthContext con Firebase Authentication | `src/context/AuthContext.js`, `AuthProvider.jsx`, `useAuth.js` |
| 1.2 | Formularios de login y registro | `src/paginas/Login`, `src/paginas/Registro` |
| 1.2 | Rutas protegidas | `src/componentes/ProtectedRoute`: `/perfil` pide sesión; `/admin/*` pide además ser el administrador |
| 2.1 | CRUD de productos: formulario controlado, validaciones (nombre obligatorio, precio mayor que cero, stock entero), editar, eliminar con confirmación | `src/paginas/admin/GestionProductos`, `src/componentes/FormProducto` |
| 2.2 | Indicadores de carga y mensajes de error | catálogo (`src/componentes/ItemListContainer` + `ui/EstadoCatalogo`), detalle, panel y footer |
| 3 | Diseño responsive y estilos | grilla de Bootstrap + CSS Modules (`*.module.css`) + `src/App.css` |
| 4.1 | Búsqueda en tiempo real | `src/componentes/BarraBusqueda` (ignora mayúsculas y tildes) |
| 4.2 | Paginador | `src/componentes/Paginador` (6 productos por página, funciona junto con la búsqueda) |
| 5 | Repositorio público y deploy | este repositorio; configuración de deploy en `vercel.json` y `public/_redirects` |

## Rutas

| Ruta | Página | Acceso |
|------|--------|--------|
| `/` | Inicio | público |
| `/productos` | Catálogo con búsqueda y paginador | público |
| `/producto/:id` | Detalle de producto | público |
| `/carrito` | Carrito | público |
| `/login` | Iniciar sesión | público |
| `/registro` | Crear cuenta | público |
| `/perfil` | Mi perfil | con sesión |
| `/admin/productos` | Panel de productos (CRUD) | solo administrador |
| `/admin/cupones` | Panel de cupones | solo administrador |

## Cómo correrlo

1. Instalar dependencias:

   ```bash
   npm install
   ```

2. Copiar `.env.example` como `.env` y completar los datos de la app web de
   Firebase (Consola de Firebase → Configuración del proyecto → Tus apps) y
   el UID del administrador (Authentication → Usuarios). Las claves no se
   suben al repositorio.

3. Levantar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

Para generar la versión de producción: `npm run build` (queda en `dist/`).

## Estructura

```text
src/
  componentes/   piezas reutilizables (Header, Footer, Item, ItemList, CartWidget, Paginador, FormProducto, ...)
    ui/          Boton y EstadoCatalogo, con su CSS Module
  paginas/       una carpeta por ruta (Inicio, Productos, DetalleProducto, Carrito, Login, Registro, Perfil, admin/)
  context/       AuthContext y CarritoContext, cada uno con su Provider y su hook
  firebase/      inicialización de Firebase (lee las variables VITE_FIREBASE_*)
  utils/         acceso al catálogo en Firestore y normalización de texto para la búsqueda
```
