// ─── DATOS ───────────────────────────────────────────────────────────────────

const productos = [
  {
    id: 1,
    nombre: "Remera Personalizada DTF",
    descripcion: "Impresión de alta calidad con colores vibrantes y gran durabilidad.",
    imagen: "images/product-1.svg",
    alt: "Remera personalizada estampada con DTF",
    precio: 25000,
    categoria: "dtf",
    labelOpcion: "Talle",
    opciones: ["S", "M", "L", "XL", "XXL"],
    nota: '<i class="fab fa-whatsapp"></i> El diseño se coordina por WhatsApp'
  },
  {
    id: 2,
    nombre: "Diseños 3D UV",
    descripcion: "Diseños únicos con relieve. Opciones con barniz o sin.",
    imagen: "images/product-2.svg",
    alt: "Stickers industriales DTF UV con relieve",
    precio: 75000,
    categoria: "uv",
    labelOpcion: "Acabado",
    opciones: ["Con Barniz", "Sin Barniz"],
    nota: '<i class="fas fa-upload"></i> Formatos: PNG o SVG con fondo transparente'
  },
  {
    id: 3,
    nombre: "Remeras Sublimadas",
    descripcion: "Ideales para eventos o merchandising personalizado.",
    imagen: "images/product-3.svg",
    alt: "Remera blanca apta para sublimación",
    precio: 10200,
    categoria: "sublimado",
    labelOpcion: "Talle",
    opciones: ["S", "M", "L", "XL"],
    nota: '<i class="fas fa-info-circle"></i> Tela: Spun Premium'
  }
];

// ─── CARRITO ─────────────────────────────────────────────────────────────────

// Al arrancar, leemos el carrito guardado. Si no hay nada, empezamos con array vacío.
let carrito = JSON.parse(localStorage.getItem("carrito-bubus")) || [];

function guardarCarrito() {
  localStorage.setItem("carrito-bubus", JSON.stringify(carrito));
}

function agregarAlCarrito(producto) {
  const yaExiste = carrito.find(item => item.id === producto.id);

  if (yaExiste) {
    yaExiste.cantidad++;
  } else {
    carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio, cantidad: 1 });
  }

  guardarCarrito();
  actualizarContador();
  mostrarConfirmacion(producto.nombre);
}

function actualizarContador() {
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const contador = document.getElementById("contador-carrito");
  if (contador) contador.textContent = totalItems;
}

function vaciarCarrito() {
  carrito = [];
  localStorage.removeItem("carrito-bubus");
  actualizarContador();
}

function mostrarConfirmacion(nombre) {
  const aviso = document.getElementById("aviso-carrito");
  if (!aviso) return;
  aviso.textContent = `"${nombre}" agregado al carrito.`;
  aviso.classList.add("visible");
  setTimeout(() => aviso.classList.remove("visible"), 2500);
}

// ─── RENDERIZADO ─────────────────────────────────────────────────────────────

const contenedorProductos = document.querySelector("#contenedor-catalogo");

function renderizarTienda(listaProductos) {
  if (!contenedorProductos) return;
  contenedorProductos.innerHTML = "";

  listaProductos.forEach(producto => {
    const opcionesHTML = producto.opciones
      .map(op => `<option value="${op.toLowerCase().replace(" ", "-")}">${op}</option>`)
      .join("");

    const card = document.createElement("article");
    card.classList.add("producto-card");

    card.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.alt}">
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion}</p>
      <div class="producto-opciones">
        <label for="opcion-${producto.id}">${producto.labelOpcion}:</label>
        <select id="opcion-${producto.id}" name="${producto.labelOpcion.toLowerCase()}">
          ${opcionesHTML}
        </select>
      </div>
      <span class="precio">$${producto.precio.toLocaleString("es-AR")}</span>
      <button type="button" class="btn-carrito" data-id="${producto.id}">
        <i class="fas fa-shopping-cart"></i> Agregar
      </button>
      <small class="coordinar-diseno">${producto.nota}</small>
    `;

    const boton = card.querySelector(".btn-carrito");
    boton.addEventListener("click", () => agregarAlCarrito(producto));

    contenedorProductos.appendChild(card);
  });
}

// ─── INICIO ──────────────────────────────────────────────────────────────────

renderizarTienda(productos);
actualizarContador();

const btnVaciar = document.getElementById("btn-vaciar");
if (btnVaciar) btnVaciar.addEventListener("click", vaciarCarrito);

// ─── FILTROS Y BÚSQUEDA ──────────────────────────────────────────────────────

function filtrarProductos(categoria, textoBusqueda) {
  let resultado = productos;

  if (categoria !== "todos") {
    resultado = resultado.filter(p => p.categoria === categoria);
  }

  if (textoBusqueda.trim() !== "") {
    const texto = textoBusqueda.toLowerCase();
    resultado = resultado.filter(p =>
      p.nombre.toLowerCase().includes(texto) ||
      p.descripcion.toLowerCase().includes(texto)
    );
  }

  renderizarTienda(resultado);
}

// Estado activo de filtros
let categoriaActiva = "todos";
let busquedaActiva = "";

// Botones de categoría
document.querySelectorAll(".btn-filtro").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".btn-filtro").forEach(b => b.classList.remove("activo"));
    btn.classList.add("activo");
    categoriaActiva = btn.dataset.categoria;
    filtrarProductos(categoriaActiva, busquedaActiva);
  });
});

// Barra de búsqueda
const inputBusqueda = document.getElementById("buscador");
if (inputBusqueda) {
  inputBusqueda.addEventListener("input", () => {
    busquedaActiva = inputBusqueda.value;
    filtrarProductos(categoriaActiva, busquedaActiva);
  });
}

// ─── PREFERENCIAS DE USUARIO ─────────────────────────────────────────────────

function cargarPreferencias() {
  const nombre = localStorage.getItem("pref-nombre-bubus");
  const color  = localStorage.getItem("pref-color-bubus");

  const saludo     = document.getElementById("saludo-usuario");
  const inputNombre = document.getElementById("pref-nombre");
  const selectColor = document.getElementById("pref-color");

  if (nombre) {
    if (saludo)      saludo.textContent = `¡Hola, ${nombre}! Bienvenido a BuBus Store.`;
    if (inputNombre) inputNombre.value  = nombre;
  }

  if (color) {
    document.body.style.backgroundColor = color;
    if (selectColor) selectColor.value  = color;
  }
}

cargarPreferencias();

const formPreferencias = document.getElementById("form-preferencias");
if (formPreferencias) {
  formPreferencias.addEventListener("submit", (e) => {
    e.preventDefault();
    const nombre = document.getElementById("pref-nombre").value.trim();
    const color  = document.getElementById("pref-color").value;
    localStorage.setItem("pref-nombre-bubus", nombre);
    localStorage.setItem("pref-color-bubus", color);
    cargarPreferencias();
  });
}
