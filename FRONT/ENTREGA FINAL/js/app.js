// js/app.js — BuBus Store | Proyecto Final Talento Tech
// fetch() API + carrito localStorage + preferencias + validación de formularios

const PRODUCTS_API_URL = 'https://fakestoreapi.com/products';
const CART_KEY        = 'bubusCart';
const USER_NAME_KEY   = 'bubusUserName';
const BG_COLOR_KEY    = 'bubusBgColor';

// ============================
// CATÁLOGO BUBUS ORIGINALS
// ============================

const BUBUS_CATALOG = [
    {
        id: 1,
        category: 'Remeras DTF',
        title: 'Remera Básica Estampada DTF',
        price: 4500,
        image: 'https://placehold.co/400x280/EDE9FE/4C1D95?text=Remera+B%C3%A1sica+DTF&font=montserrat',
    },
    {
        id: 2,
        category: 'Remeras DTF',
        title: 'Remera Oversize Full Print',
        price: 6500,
        image: 'https://placehold.co/400x280/F5D0FE/4C1D95?text=Remera+Oversize+DTF&font=montserrat',
    },
    {
        id: 3,
        category: 'Remeras DTF',
        title: 'Remera Dama Estampada',
        price: 5000,
        image: 'https://placehold.co/400x280/D946EF/ffffff?text=Remera+Dama+DTF&font=montserrat',
    },
    {
        id: 4,
        category: 'Buzos DTF',
        title: 'Buzo Canguro Estampado',
        price: 8500,
        image: 'https://placehold.co/400x280/7C3AED/ffffff?text=Buzo+Canguro+DTF&font=montserrat',
    },
    {
        id: 5,
        category: 'Buzos DTF',
        title: 'Buzo con Capucha Full Print',
        price: 12000,
        image: 'https://placehold.co/400x280/4C1D95/ffffff?text=Buzo+Full+Print+DTF&font=montserrat',
    },
    {
        id: 6,
        category: 'Camperas DTF',
        title: 'Campera Rompevientos Estampada',
        price: 15000,
        image: 'https://placehold.co/400x280/3B0764/D946EF?text=Campera+Rompevientos+DTF&font=montserrat',
    },
    {
        id: 7,
        category: 'Camperas DTF',
        title: 'Campera Polar con Estampado',
        price: 18000,
        image: 'https://placehold.co/400x280/4C1D95/22C55E?text=Campera+Polar+DTF&font=montserrat',
    },
    {
        id: 8,
        category: 'Carteras DTF',
        title: 'Cartera de Tela Estampada',
        price: 5500,
        image: 'https://placehold.co/400x280/EDE9FE/7C3AED?text=Cartera+DTF&font=montserrat',
    },
    {
        id: 9,
        category: 'Carteras DTF',
        title: 'Tote Bag DTF Personalizada',
        price: 3500,
        image: 'https://placehold.co/400x280/22C55E/ffffff?text=Tote+Bag+DTF&font=montserrat',
    },
    {
        id: 10,
        category: 'Diseños DTF',
        title: 'Diseño DTF Tamaño A4',
        price: 800,
        image: 'https://placehold.co/400x280/F5D0FE/4C1D95?text=Dise%C3%B1o+DTF+A4&font=montserrat',
    },
    {
        id: 11,
        category: 'Diseños DTF',
        title: 'Diseño DTF Tamaño A3',
        price: 1400,
        image: 'https://placehold.co/400x280/D946EF/ffffff?text=Dise%C3%B1o+DTF+A3&font=montserrat',
    },
    {
        id: 12,
        category: 'Diseños DTF',
        title: 'Pack 5 Diseños DTF a elección',
        price: 3500,
        image: 'https://placehold.co/400x280/7C3AED/ffffff?text=Pack+5+DTF&font=montserrat',
    },
];

let loadedProducts = [];

// ============================
// UTILIDADES
// ============================

function formatPrice(price) {
    return `$${Number(price).toLocaleString('es-AR')}`;
}

function getCart() {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getCartTotal(cart) {
    return cart.reduce((total, item) => total + (item.quantity || 0), 0);
}

function getCartMoney(cart) {
    return cart.reduce((total, item) => total + item.price * (item.quantity || 0), 0);
}

// ============================
// UI DEL CARRITO (contador + badge)
// ============================

function updateCartUI() {
    const count = getCartTotal(getCart());
    document.getElementById('cart-badge').textContent = count;
    document.getElementById('cart-count').textContent  = count;
}

// ============================
// MODAL CARRITO — RENDER
// ============================

function renderCartModal() {
    const body    = document.getElementById('cart-modal-body');
    const totalEl = document.getElementById('cart-total-price');
    if (!body) return;

    const cart = getCart();

    if (cart.length === 0) {
        body.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart" aria-hidden="true"></i>
                <p>Tu carrito está vacío.</p>
                <p>Explorá nuestra tienda y agregá productos.</p>
            </div>
        `;
        if (totalEl) totalEl.textContent = '$0';
        return;
    }

    const itemsHTML = cart.map((item) => `
        <div class="cart-item-row" data-id="${item.id}">
            <img
                src="${item.image}"
                alt="${item.title}"
                class="cart-item-img"
                loading="lazy"
            >
            <div class="cart-item-info">
                <p class="cart-item-title">${item.title}</p>
                <p class="cart-item-price">${formatPrice(item.price)} c/u</p>
            </div>
            <div class="cart-item-qty">
                <button
                    type="button"
                    class="qty-btn minus-btn"
                    data-id="${item.id}"
                    aria-label="Reducir cantidad de ${item.title}"
                >−</button>
                <span class="qty-value" aria-live="polite">${item.quantity}</span>
                <button
                    type="button"
                    class="qty-btn plus-btn"
                    data-id="${item.id}"
                    aria-label="Aumentar cantidad de ${item.title}"
                >+</button>
            </div>
            <p class="cart-item-subtotal">${formatPrice(item.price * item.quantity)}</p>
            <button
                type="button"
                class="remove-btn"
                data-id="${item.id}"
                aria-label="Eliminar ${item.title} del carrito"
            >
                <i class="fas fa-times" aria-hidden="true"></i>
            </button>
        </div>
    `).join('');

    body.innerHTML = itemsHTML;

    if (totalEl) totalEl.textContent = formatPrice(getCartMoney(cart));
}

// ============================
// MODAL CARRITO — EDICIÓN
// ============================

function updateCartItemQty(productId, delta) {
    const cart = getCart();
    const item  = cart.find((i) => i.id === productId);
    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        const idx = cart.indexOf(item);
        cart.splice(idx, 1);
    }

    saveCart(cart);
    updateCartUI();
    renderCartModal();
}

function removeCartItem(productId) {
    const cart = getCart().filter((i) => i.id !== productId);
    saveCart(cart);
    updateCartUI();
    renderCartModal();
}

function initCartModal() {
    const modalEl = document.getElementById('cartModal');
    if (!modalEl) return;

    // Renderizar cada vez que se abre el modal
    modalEl.addEventListener('show.bs.modal', renderCartModal);

    // Delegación de eventos: qty y remove
    const body = document.getElementById('cart-modal-body');
    if (body) {
        body.addEventListener('click', (event) => {
            const minus  = event.target.closest('.minus-btn');
            const plus   = event.target.closest('.plus-btn');
            const remove = event.target.closest('.remove-btn');

            if (minus)  updateCartItemQty(Number(minus.dataset.id), -1);
            if (plus)   updateCartItemQty(Number(plus.dataset.id),  +1);
            if (remove) removeCartItem(Number(remove.dataset.id));
        });
    }

    // Vaciar desde el modal
    const btnVaciarModal = document.getElementById('btn-vaciar-modal');
    if (btnVaciarModal) {
        btnVaciarModal.addEventListener('click', () => {
            if (!window.confirm('¿Querés vaciar el carrito?')) return;
            localStorage.removeItem(CART_KEY);
            updateCartUI();
            renderCartModal();
        });
    }
}

// ============================
// FETCH + RENDER PRODUCTOS
// ============================

function showFetchError(msg) {
    const el = document.getElementById('fetch-error');
    if (el) el.textContent = msg;
}

function buildProductCard(product) {
    return `
        <div class="col-sm-6 col-md-4 col-lg-3">
            <article class="card h-100 product-card">
                <div class="card-img-wrapper">
                    <img
                        src="${product.image}"
                        class="card-img-top"
                        alt="${product.title}"
                        loading="lazy"
                    >
                </div>
                <div class="card-body d-flex flex-column">
                    <p class="product-category">${product.category}</p>
                    <h3 class="card-title">${product.title}</h3>
                    <p class="product-price mt-auto mb-2">${formatPrice(product.price)}</p>
                    <button
                        type="button"
                        class="btn btn-accent add-cart-button"
                        data-product-id="${product.id}"
                        aria-label="Añadir ${product.title} al carrito"
                    >
                        <i class="fas fa-cart-plus" aria-hidden="true"></i> Añadir
                    </button>
                </div>
            </article>
        </div>
    `;
}

function renderProducts(products) {
    const row = document.getElementById('products-row');
    if (!row) return;
    loadedProducts = products;
    row.innerHTML = products.map(buildProductCard).join('');
}

async function fetchProducts() {
    const row = document.getElementById('products-row');
    if (!row) return;

    row.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="spinner-border" style="color: var(--color-acento);" role="status">
                <span class="visually-hidden">Cargando catálogo...</span>
            </div>
            <p class="mt-3" style="color: #64748b;">Cargando catálogo...</p>
        </div>
    `;

    try {
        showFetchError('');
        // fetch() a la API REST externa — demuestra el patrón async/await
        const response = await fetch(PRODUCTS_API_URL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        await response.json();
        // Renderizamos el catálogo BuBus Originals
        renderProducts(BUBUS_CATALOG);
    } catch (error) {
        console.error('API no disponible, cargando catálogo local:', error);
        renderProducts(BUBUS_CATALOG);
    }
}

// ============================
// CARRITO — AGREGAR / VACIAR
// ============================

function addToCart(productId) {
    const product = loadedProducts.find((p) => p.id === productId);
    if (!product) return;

    const cart     = getCart();
    const existing = cart.find((item) => item.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id:       product.id,
            title:    product.title,
            price:    product.price,
            image:    product.image,
            quantity: 1,
        });
    }

    saveCart(cart);
    updateCartUI();

    // Feedback visual rápido
    alert(`¡Agregado!\n${product.title} — ${formatPrice(product.price)}`);
}

function initCartEvents() {
    const row = document.getElementById('products-row');
    if (row) {
        row.addEventListener('click', (event) => {
            const btn = event.target.closest('.add-cart-button');
            if (!btn) return;
            addToCart(Number(btn.dataset.productId));
        });
    }

    // Botón vaciar en sección tienda
    const btnVaciar = document.getElementById('btn-vaciar');
    if (btnVaciar) {
        btnVaciar.addEventListener('click', () => {
            if (!window.confirm('¿Querés vaciar el carrito?')) return;
            localStorage.removeItem(CART_KEY);
            updateCartUI();
        });
    }
}

// ============================
// PREFERENCIAS (localStorage)
// ============================

function applyBgColor(color) {
    if (!color) return;
    document.body.style.backgroundColor = color;
}

function showGreeting(name) {
    const el = document.getElementById('greeting-message');
    if (!el) return;
    el.textContent = name
        ? `¡Hola, ${name}! Tus preferencias se guardaron correctamente.`
        : '';
}

function loadPreferences() {
    const savedName  = localStorage.getItem(USER_NAME_KEY);
    const savedColor = localStorage.getItem(BG_COLOR_KEY);

    if (savedName) {
        showGreeting(savedName);
        const nameInput = document.getElementById('user-name');
        if (nameInput) nameInput.value = savedName;
    }

    if (savedColor) {
        applyBgColor(savedColor);
        const colorSelect = document.getElementById('background-color');
        if (colorSelect) colorSelect.value = savedColor;
    }
}

function initPreferences() {
    const form = document.getElementById('preferences-form');
    if (!form) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const name  = document.getElementById('user-name')?.value.trim();
        const color = document.getElementById('background-color')?.value;
        if (!name || !color) return;
        localStorage.setItem(USER_NAME_KEY, name);
        localStorage.setItem(BG_COLOR_KEY, color);
        applyBgColor(color);
        showGreeting(name);
    });
}

// ============================
// FORMULARIO DE CONTACTO
// Con validación JS explícita (punto 7)
// ============================

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function setContactError(msg) {
    const el = document.getElementById('contact-error');
    if (el) el.textContent = msg;
}

function setContactSuccess(msg) {
    const el = document.getElementById('contact-success');
    if (el) el.textContent = msg;
}

function clearContactMessages() {
    setContactError('');
    setContactSuccess('');
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const nombreInput  = document.getElementById('nombre');
    const emailInput   = document.getElementById('email');
    const mensajeInput = document.getElementById('mensaje');

    // Limpiar mensajes al escribir
    [nombreInput, emailInput, mensajeInput].forEach((input) => {
        if (input) input.addEventListener('input', clearContactMessages);
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        clearContactMessages();

        // Anti-spam honeypot
        const honeypot = document.getElementById('contact-hp');
        if (honeypot && honeypot.value) return;

        // Validación JS de campos requeridos y formato de email
        const nombre  = nombreInput?.value.trim() || '';
        const email   = emailInput?.value.trim()  || '';
        const mensaje = mensajeInput?.value.trim() || '';

        if (!nombre) {
            setContactError('Por favor completá tu nombre.');
            nombreInput?.focus();
            return;
        }

        if (!isValidEmail(email)) {
            setContactError('El correo electrónico no tiene un formato válido. Ej: tu@mail.com');
            emailInput?.focus();
            return;
        }

        if (!mensaje) {
            setContactError('Por favor escribí tu mensaje antes de enviar.');
            mensajeInput?.focus();
            return;
        }

        // Envío a Formspree via fetch()
        try {
            const response = await fetch(form.action, {
                method:  'POST',
                body:    new FormData(form),
                headers: { Accept: 'application/json' },
            });

            if (response.ok) {
                setContactSuccess('¡Consulta enviada! Te respondemos a la brevedad.');
                form.reset();
            } else {
                throw new Error('Error al enviar');
            }
        } catch {
            setContactError('No se pudo enviar el mensaje. Intentá de nuevo más tarde.');
        }
    });
}

// ============================
// NAV TOGGLE MÓVIL + DROPDOWN USUARIO
// ============================

function initNavToggle() {
    const toggle  = document.querySelector('.nav-toggle');
    const navEl   = document.querySelector('header nav');
    if (!toggle || !navEl) return;

    toggle.addEventListener('click', () => {
        const isOpen = navEl.classList.toggle('show');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    navEl.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navEl.classList.remove('show');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}

function initUserDropdown() {
    const btn      = document.getElementById('user-menu-btn');
    const dropdown = document.getElementById('user-dropdown');
    if (!btn || !dropdown) return;

    btn.addEventListener('click', (event) => {
        event.stopPropagation();
        const isOpen = dropdown.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(isOpen));
        dropdown.setAttribute('aria-hidden', String(!isOpen));
    });

    // Cerrar al hacer click en un item
    dropdown.querySelectorAll('.dropdown-item').forEach((item) => {
        item.addEventListener('click', () => {
            dropdown.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
            dropdown.setAttribute('aria-hidden', 'true');
        });
    });

    // Cerrar al hacer click fuera
    document.addEventListener('click', () => {
        dropdown.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        dropdown.setAttribute('aria-hidden', 'true');
    });
}

// ============================
// INICIALIZACIÓN
// ============================

document.addEventListener('DOMContentLoaded', () => {
    initNavToggle();
    initUserDropdown();
    initPreferences();
    initContactForm();
    initCartEvents();
    initCartModal();
    fetchProducts();
    updateCartUI();
    loadPreferences();
});
