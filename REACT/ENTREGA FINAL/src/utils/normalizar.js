// Clase 13: pasa a minúsculas y saca las tildes ("Básica" → "basica"),
// así la búsqueda encuentra "Remera Básica" aunque se escriba "basica" o
// "BÁSICA". normalize('NFD') separa cada letra de su tilde y el replace
// borra esas tildes sueltas (rango Unicode ̀-ͯ).
export function normalizar(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}
