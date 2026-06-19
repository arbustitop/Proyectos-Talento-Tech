# BuBus Store — Proyecto Final de E-commerce

**Alumno:** Augusto Vila
**Curso:** Talento Tech — Módulo Front-End JavaScript
**Proyecto:** Sitio web de e-commerce dinámico e interactivo

---

## Descripción del proyecto

BuBus Store es una tienda online de prendas y servicios de estampado DTF (remeras, buzos, camperas, carteras y diseños).
El proyecto final integra todos los conocimientos del módulo:
diseño responsivo con Bootstrap y Flexbox, consumo de API REST con `fetch()`,
renderizado dinámico en el DOM, carrito de compras completo con modal interactivo
y persistencia total en `localStorage`.

---

## Tecnologías utilizadas

- **HTML5** — Etiquetas semánticas: `header`, `nav`, `main`, `section`, `article`, `footer`
- **Bootstrap 5.3** — Grid (`row`, `col-sm-6 col-md-4 col-lg-3`), Modal, spinner, badges
- **CSS3 + Flexbox** — Variables de marca (`:root`), Flexbox, Media Queries, animaciones, `mix-blend-mode`
- **JavaScript ES6+** — `fetch()`, `async/await`, `localStorage`, DOM, validación con regex
- **Font Awesome 6** — Iconografía
- **Google Fonts** — Fuente Montserrat
- **Formspree** — Envío del formulario de contacto sin backend

---

## Requisitos del proyecto cumplidos

### HTML — Etiquetas semánticas

- Estructura `header > nav > main > footer` con `role="banner"` y `aria-label`
- Secciones con `section`, tarjetas con `article`
- Formularios con `label`, `input`, `textarea`, `select`
- `<h1>` oculto visualmente para SEO, jerarquía `h1 → h2 → h3` respetada
- Enlace de salto para accesibilidad por teclado (`skip-link`)

### CSS — Bootstrap + Flexbox responsivo

- Bootstrap 5 para el grid de productos (`row`, `col-sm-6 col-md-4 col-lg-3`)
- CSS personalizado con variables `:root` para toda la paleta de la marca BuBus
- Navbar sticky con logo, links centrados y acciones a la derecha (estándar de e-commerce global)
- `mix-blend-mode: multiply` en el logo para eliminar el fondo blanco sobre el header púrpura
- Rapport de fondo: logo repetido con `background-repeat` y muy baja opacidad en toda la página
- Modal del carrito con estilos propios: filas por producto, botones +/−, total destacado
- Media Queries (`max-width: 768px`, `480px`): menú hamburguesa, nombre de marca oculto en mobile
- Dropdown de usuario con transición CSS (`opacity` + `transform`)

### JavaScript — API REST + carrito localStorage

- `fetch()` hacia `https://fakestoreapi.com/products` con `async/await` y `try/catch`
- Spinner de Bootstrap mientras carga; mensaje de error visible si la API falla
- Catálogo propio de 12 productos BuBus Originals renderizados dinámicamente con `innerHTML`
- **Carrito completo:**
  - Agregar productos con acumulación de cantidades
  - Modal Bootstrap con lista de productos, cantidad, precio unitario y subtotal por ítem
  - Botones +/− para editar cantidad directamente desde el modal
  - Botón eliminar por producto individual
  - Total dinámico que se recalcula en cada acción
  - Vaciar carrito (desde la tienda y desde el modal)
  - Persistencia en `localStorage`: el carrito sobrevive al cierre del navegador
  - Badge verde en el navbar se actualiza en tiempo real
- Preferencias de usuario (nombre + color de fondo) persistidas en `localStorage`
- **Validación JS del formulario de contacto:**
  - Campo nombre: requerido, con foco automático en el campo inválido
  - Email: validación con expresión regular `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
  - Mensaje: campo requerido
  - Mensajes de error y éxito visibles al usuario (`aria-live`)
  - Honeypot anti-spam

### Accesibilidad y SEO

- `<meta name="description">` y `<meta name="keywords">`
- `lang="es"` en `<html>`
- `alt` descriptivos en imágenes, `aria-hidden` en íconos decorativos
- `aria-label`, `aria-expanded`, `aria-haspopup`, `aria-live`, `role="dialog"` en elementos interactivos
- `loading="lazy"` en imágenes de productos
- Navegación por teclado: `skip-link`, `focus-visible`, `tabindex="-1"` en honeypot
- Subtítulos `.vtt` en el video de demo

---

## Estructura de archivos

```text
ENTREGA FINAL/
├── index.html                 → Página principal del e-commerce
├── styles.css                 → Estilos propios (Bootstrap + Flexbox + marca BuBus)
├── js/
│   └── app.js                 → JavaScript: API, carrito, modal, preferencias, validación
├── bubus_originals_logo.png   → Logotipo BuBus Originals
├── bubus_originals_intro.mp4  → Demo en video
├── bubus_originals_subs.vtt   → Subtítulos del video (accesibilidad)
└── README.MD                  → Este archivo
```

---

## Cómo usar el proyecto

1. Abrir `index.html` en el navegador (o con Live Server en VS Code).
2. Los productos se cargan automáticamente desde la API al abrir la página.
3. Hacer clic en "Añadir" agrega un producto al carrito.
4. El badge verde en el navbar se actualiza en tiempo real.
5. Hacer clic en el ícono del carrito abre el modal con la lista completa.
6. Desde el modal: editar cantidades con +/−, eliminar productos o vaciar el carrito.
7. El carrito persiste al recargar la página gracias a `localStorage`.
8. El ícono de usuario despliega un menú con acceso a Preferencias, Demo, Nosotros y Contacto.
9. En "Preferencias" se puede guardar el nombre y el color de fondo.
10. El formulario de contacto valida todos los campos con JavaScript antes de enviar.

---

## Nota para el Profe Migue

Este proyecto es el resultado de todo el módulo construido clase a clase.
Usé IA como apoyo para ajustar semántica, aplicar buenas prácticas y detectar errores,
pero cada decisión de diseño y lógica la tomé entendiendo qué hace el código y por qué.

Gracias por las clases. ¡Nos vemos en el módulo de Backend!

Augusto Vila — BuBus Store
