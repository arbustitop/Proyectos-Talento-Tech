// Datos de contacto de la tienda. Un solo lugar: el Footer y el botón
// "Finalizar compra" del carrito usan el mismo número; si cambia, se
// cambia acá.

// Formato internacional sin "+" ni espacios, como lo pide wa.me
// (54 Argentina, 9 celular, 11 área).
export const WHATSAPP_NUMERO = '5491162767836'

// Cómo se muestra el número a las personas (con espacios y guion).
export const WHATSAPP_VISIBLE = '+54 11 6276-7836'

export const EMAIL = 'bubusogventas@gmail.com'

export const INSTAGRAM_USUARIO = 'BubusOG.AR'
export const INSTAGRAM_URL = `https://instagram.com/${INSTAGRAM_USUARIO}`

// Mensaje que ya viene escrito al tocar "Escribinos" desde el Inicio o
// Contacto. Un saludo concreto arranca la charla mejor que un chat vacío.
export const MENSAJE_CONSULTA = 'Hola BuBus! Quiero hacer un pedido con mi diseño.'

// Link que abre WhatsApp con el chat de la tienda. Con `texto`, el mensaje
// ya aparece escrito y el cliente solo tiene que apretar enviar.
// encodeURIComponent: los espacios, saltos de línea y "$" no pueden ir
// tal cual en una URL.
export function linkWhatsApp(texto = '') {
  const base = `https://wa.me/${WHATSAPP_NUMERO}`
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base
}
