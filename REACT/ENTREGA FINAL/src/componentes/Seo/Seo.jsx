import { Helmet } from 'react-helmet-async'

// Clase 13: SEO con React Helmet. Cada página usa <Seo> UNA vez y define
// su título y su descripción:
//   <Seo titulo="Catálogo" descripcion="..." />
//
// Por qué un componente y no <Helmet> suelto en cada página: con React 19,
// react-helmet-async ya no reemplaza etiquetas; le pasa cada <title> y
// <meta> a React, que las sube al <head> tal cual. Si dos componentes de
// la misma pantalla pusieran un <title>, quedarían dos. Con <Seo> como
// única puerta, cada etiqueta sale de un solo lugar y el formato
// ("Título | BuBus Originals") es igual en todo el sitio.

const MARCA = 'BuBus Originals'

// Props: titulo y descripcion de la página. noIndexar es para login,
// perfil, panel y 404: no tiene sentido que Google las muestre en sus
// resultados.
export function Seo({ titulo, descripcion, noIndexar = false }) {
  const tituloCompleto = `${titulo} | ${MARCA}`

  return (
    <Helmet>
      {/* Lo que muestra la pestaña y el título azul del resultado en Google. */}
      <title>{tituloCompleto}</title>
      {/* El texto gris debajo del título en Google. */}
      <meta name="description" content={descripcion} />
      {/* Open Graph: título y texto de la vista previa al compartir el link
           por WhatsApp, Instagram o Facebook. */}
      <meta property="og:title" content={tituloCompleto} />
      <meta property="og:description" content={descripcion} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={MARCA} />
      {noIndexar && <meta name="robots" content="noindex" />}
    </Helmet>
  )
}
