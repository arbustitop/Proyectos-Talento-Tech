import { Seo } from '../../componentes/Seo/Seo'
import { EMAIL, WHATSAPP_VISIBLE, linkWhatsApp } from '../../utils/contacto'
import styles from './Legales.module.css'

// Términos y Condiciones de Uso y Compra + Política de Privacidad.
//
// Antes los links "Legal" del footer llevaban a "#" (a ningún lado). Ahora
// llevan acá: "Términos y condiciones" al principio y "Política de
// privacidad" directo al punto 5 (/legales#privacidad; el salto lo hace
// ScrollArriba, que respeta el #).
//
// El texto legal es el que pasó la marca, sin cambios de redacción. Solo se
// completaron los datos que venían entre corchetes (medios de pago, envíos,
// mail y WhatsApp); el mail y el WhatsApp salen de utils/contacto.js, así si
// cambian se actualizan acá también.

// Índice: el id de cada sección (para el ancla #) y su título. Es una
// constante fuera del componente porque no cambia nunca.
const SECCIONES = [
  { id: 'titular', titulo: '1. Identificación del titular y jurisdicción aplicable' },
  { id: 'consumidor', titulo: '2. Defensa del Consumidor y Derecho de Arrepentimiento' },
  { id: 'compra', titulo: '3. Condiciones de compra, precios, moneda, IVA y stock' },
  { id: 'cambios', titulo: '4. Política de cambios, devoluciones y garantías' },
  { id: 'privacidad', titulo: '5. Política de Privacidad y Protección de Datos Personales' },
  { id: 'propiedad', titulo: '6. Propiedad Intelectual' },
  { id: 'responsabilidad', titulo: '7. Limitación de responsabilidad técnica y enlaces a terceros' },
  { id: 'atencion', titulo: '8. Atención al cliente' },
  { id: 'modificaciones', titulo: '9. Modificaciones' },
  { id: 'aceptacion', titulo: '10. Aceptación' },
]

// Título de cada sección, tomado del índice: así el índice y los títulos no
// pueden quedar distintos.
function Titulo({ id }) {
  const seccion = SECCIONES.find((s) => s.id === id)
  return (
    <h2 id={id} className={styles.seccion}>
      {seccion.titulo}
    </h2>
  )
}

function Legales() {
  return (
    <article className={styles.legales}>
      <Seo
        titulo="Términos y condiciones"
        descripcion="Términos y condiciones de uso y compra y política de privacidad de BuBus Originals."
      />

      <h1 className={styles.titulo}>Términos y Condiciones de Uso y Compra</h1>
      <p className={styles.subtitulo}>Política de Privacidad · BuBus Originals</p>

      {/* Índice: un texto legal largo se recorre buscando un punto puntual
           (cambios, privacidad); con el índice se llega de un clic. */}
      <nav className={styles.indice} aria-label="Índice">
        <ol>
          {SECCIONES.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`}>{s.titulo}</a>
            </li>
          ))}
        </ol>
      </nav>

      <Titulo id="titular" />
      <p>
        El presente sitio web y la tienda online operan bajo la denominación comercial BuBus
        Originals, cuyo titular es un Monotributista, CUIT N.º 27-33362042-2, con domicilio legal y
        comercial en Sarmiento 1113, Ciudad Autónoma de Buenos Aires, República Argentina.
      </p>
      <p>
        La utilización del sitio, la navegación y la realización de cualquier compra implican la
        aceptación plena y sin reservas de los presentes Términos y Condiciones.
      </p>
      <p>
        Toda controversia derivada de la interpretación, ejecución o cumplimiento de estos términos,
        o de las operaciones de compraventa celebradas a través del sitio, se someterá a los
        Tribunales Ordinarios de la Ciudad Autónoma de Buenos Aires, con renuncia expresa a cualquier
        otro fuero o jurisdicción que pudiera corresponder.
      </p>

      <Titulo id="consumidor" />
      <p>
        Las operaciones de compraventa celebradas a través de este sitio se rigen por la Ley N.º
        24.240 de Defensa del Consumidor y sus modificatorias, el Código Civil y Comercial de la
        Nación y demás normativa aplicable.
      </p>
      <p>
        De conformidad con el artículo 34 de la Ley N.º 24.240 y el artículo 1110 del Código Civil y
        Comercial de la Nación, el consumidor tiene derecho a revocar la aceptación del producto o
        servicio dentro de los diez (10) días corridos contados desde la fecha de celebración del
        contrato o de la entrega del bien, sin necesidad de justificación alguna y sin penalidad.
      </p>
      <p>
        <strong>Excepción legal – Productos personalizados o confeccionados a medida:</strong> En
        virtud del artículo 1116, inciso c), del Código Civil y Comercial de la Nación, no procede el
        derecho de arrepentimiento respecto de los productos confeccionados conforme a las
        especificaciones del consumidor o claramente personalizados (incluyendo, a título
        enunciativo, indumentaria y productos textiles con estampados, diseños, nombres, frases,
        imágenes o cualquier otro elemento personalizado solicitado por el cliente).
      </p>
      <p>
        En estos casos, una vez iniciada la producción o confección del producto personalizado, no se
        admitirán cancelaciones, devoluciones ni arrepentimientos, salvo vicios o defectos de
        fabricación imputables al vendedor.
      </p>

      <Titulo id="compra" />
      <p>
        3.1. Los precios publicados en el sitio se expresan en pesos argentinos (ARS) e incluyen el
        Impuesto al Valor Agregado (IVA) cuando corresponda, salvo indicación expresa en contrario.
      </p>
      <p>
        3.2. Los costos de envío, si los hubiere, se calcularán e informarán al momento de finalizar
        la compra, según el método de envío seleccionado y el domicilio de entrega.
      </p>
      <p>
        3.3. La disponibilidad de stock de productos no personalizados se actualiza en tiempo real o
        de forma periódica. La confirmación definitiva de la operación queda sujeta a la verificación
        de disponibilidad al momento del procesamiento del pedido.
      </p>
      <p>
        3.4. Respecto de los productos personalizados o a medida, el precio y los plazos de
        producción se informarán al momento de la solicitud o confirmación del diseño. Una vez
        confirmado el pedido y abonado el importe correspondiente, se inicia el proceso de
        personalización, no admitiéndose modificaciones ni cancelaciones posteriores, salvo acuerdo
        expreso de las partes.
      </p>
      <p>3.5. Medios de pago habilitados: transferencia bancaria y Mercado Pago.</p>
      <p>
        3.6. Métodos de envío: mensajería dentro de la Ciudad Autónoma de Buenos Aires; al resto del
        país, por Vía Cargo u otras empresas de encomiendas.
      </p>

      <Titulo id="cambios" />
      <p>
        <strong>4.1. Productos no personalizados:</strong> El consumidor podrá solicitar cambio o
        devolución dentro de los plazos legales aplicables, siempre que el producto se encuentre en
        perfectas condiciones, con su embalaje original y etiquetas, y no haya sido utilizado. Los
        gastos de envío derivados del cambio o devolución correrán por cuenta del consumidor, salvo
        que el producto presente defectos de fabricación o no se ajuste a lo adquirido.
      </p>
      <p>
        <strong>4.2. Productos personalizados o confeccionados a medida:</strong> No se admiten
        cambios ni devoluciones por arrepentimiento, de conformidad con lo establecido en el punto 2.
      </p>
      <p>
        Únicamente se aceptarán reclamos por defectos de fabricación, errores de producción
        imputables al vendedor o vicios ocultos, los que deberán ser comunicados dentro de los plazos
        legales de garantía.
      </p>
      <p>
        <strong>4.3. Garantía legal:</strong> Todos los productos se encuentran amparados por la
        garantía legal prevista en la Ley N.º 24.240 y el Código Civil y Comercial de la Nación.
      </p>
      <p>
        Para ejercer cualquier reclamo, el cliente deberá contactarse a través de los canales de
        atención indicados en el <a href="#atencion">punto 8</a>, acompañando el número de pedido,
        factura o comprobante de compra y, en su caso, fotografías o descripción del defecto.
      </p>

      <Titulo id="privacidad" />
      <p>
        5.1. El titular del sitio actúa como Responsable del Tratamiento de los datos personales
        recabados a través del sitio web, formularios de contacto, proceso de compra y canales de
        atención al cliente.
      </p>
      <p>5.2. Finalidad de la recolección: los datos personales se recaban con las siguientes finalidades:</p>
      <ul>
        <li>Procesar y gestionar pedidos y envíos.</li>
        <li>Facturación y cobro.</li>
        <li>Comunicación relacionada con el pedido (confirmaciones, seguimiento, consultas).</li>
        <li>Atención al cliente y gestión de reclamos.</li>
        <li>
          Envío de información comercial o promocional, únicamente cuando el usuario haya prestado
          su consentimiento expreso.
        </li>
        <li>Cumplimiento de obligaciones legales y fiscales.</li>
      </ul>
      <p>
        5.3. Derechos del titular de los datos: el titular de los datos podrá ejercer en cualquier
        momento los derechos de acceso, rectificación, actualización y supresión de sus datos
        personales, conforme a lo establecido en la Ley N.º 25.326. Para ejercer estos derechos
        deberá enviar una solicitud a <a href={`mailto:${EMAIL}`}>{EMAIL}</a>, acreditando su
        identidad.
      </p>
      <p>
        5.4. Órgano de control: la Agencia de Acceso a la Información Pública, en su carácter de
        Órgano de Control de la Ley N.º 25.326, tiene a su cargo la atención de las denuncias y
        reclamos que se interpongan con relación al incumplimiento de las normas sobre protección de
        datos personales. Sitio web:{' '}
        <a href="https://www.argentina.gob.ar/aaip" target="_blank" rel="noopener noreferrer">
          www.argentina.gob.ar/aaip
        </a>
        .
      </p>
      <p>
        5.5. Los datos no serán cedidos a terceros, salvo a los prestadores de servicios necesarios
        para la operatoria (pasarelas de pago, operadores logísticos, servicios de mensajería,
        plataformas de facturación electrónica), quienes actuarán únicamente conforme a las
        instrucciones del Responsable y con las medidas de seguridad adecuadas.
      </p>

      <Titulo id="propiedad" />
      <p>
        Todos los contenidos del sitio web (textos, fotografías, imágenes, diseños, logotipos,
        marcas, tipografías, código fuente, bases de datos y cualquier otro elemento) son de
        titularidad exclusiva de BuBus Originals o de terceros que han autorizado su uso, y se
        encuentran protegidos por las leyes de propiedad intelectual e industrial de la República
        Argentina y tratados internacionales.
      </p>
      <p>
        Queda prohibida la reproducción, distribución, comunicación pública, transformación o
        cualquier otro uso no autorizado de dichos contenidos, total o parcialmente, sin el
        consentimiento previo y por escrito del titular.
      </p>
      <p>
        Los diseños personalizados creados a partir de solicitudes del cliente podrán ser utilizados
        por BuBus Originals con fines promocionales del servicio, salvo que el cliente manifieste
        expresamente lo contrario al momento de la compra.
      </p>

      <Titulo id="responsabilidad" />
      <p>
        7.1. El titular del sitio no garantiza la disponibilidad ininterrumpida ni la ausencia de
        errores técnicos del sitio web. Podrán realizarse tareas de mantenimiento, actualizaciones o
        sufrir interrupciones por causas ajenas a su voluntad.
      </p>
      <p>
        7.2. El titular no será responsable por daños derivados de la utilización del sitio, virus,
        malware, fallas de conexión, o por el uso indebido de la información contenida en el mismo,
        siempre que no medie dolo o culpa grave de su parte.
      </p>
      <p>
        7.3. El sitio puede contener enlaces a sitios de terceros (pasarelas de pago, operadores
        logísticos, redes sociales, etc.). Dichos enlaces se proporcionan únicamente para comodidad
        del usuario. El titular no controla ni se responsabiliza por el contenido, políticas de
        privacidad o prácticas de dichos sitios de terceros.
      </p>

      <Titulo id="atencion" />
      <p>
        Para consultas, reclamos, ejercicio de derechos o cualquier comunicación relacionada con
        estos Términos y Condiciones o con las operaciones de compraventa, el cliente podrá
        contactarse a través de:
      </p>
      <ul>
        <li>
          Correo electrónico: <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </li>
        <li>
          WhatsApp:{' '}
          <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer">
            {WHATSAPP_VISIBLE}
          </a>
        </li>
      </ul>

      <Titulo id="modificaciones" />
      <p>
        El titular se reserva el derecho de modificar total o parcialmente los presentes Términos y
        Condiciones y la Política de Privacidad en cualquier momento. Las modificaciones entrarán en
        vigencia a partir de su publicación en el sitio. Se recomienda al usuario revisar
        periódicamente esta sección.
      </p>

      <Titulo id="aceptacion" />
      <p>
        La navegación por el sitio y/o la realización de una compra implica la aceptación plena y sin
        reservas de los presentes Términos y Condiciones y de la Política de Privacidad.
      </p>
      <p className={styles.lugar}>Ciudad Autónoma de Buenos Aires, República Argentina.</p>
    </article>
  )
}

export default Legales
