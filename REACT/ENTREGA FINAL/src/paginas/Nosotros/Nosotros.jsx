import { useEffect, useState } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { FaLinkedin } from 'react-icons/fa'
import { db } from '../../firebase/config'
import { Seo } from '../../componentes/Seo/Seo'
import styles from './Nosotros.module.css'

// Página "Nosotros". Las tarjetas del equipo antes estaban en el footer de
// todas las páginas (Requerimiento #1 de la pre-entrega: al menos 3
// tarjetas de persona). Acá tienen lugar propio, con un texto que cuenta
// quiénes están detrás de la marca.
//
// Clase 09, Parte 2: el equipo se lee de la colección `equipo` de
// Firestore. Cada documento trae { nombre, rol, linkedinURL, fotoURL }; el
// `id` no es un campo, es el ID del documento (doc.id).

// Avatar con las iniciales sobre el violeta de la marca. Se usa como
// respaldo cuando un integrante no tiene fotoURL cargada en Firestore.
function avatarUrl(nombre) {
  const iniciales = encodeURIComponent(nombre)
  return `https://ui-avatars.com/api/?name=${iniciales}&background=7c3aed&color=fff&bold=true&size=160`
}

function Nosotros() {
  const [equipo, setEquipo] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Una sola lectura al montar ([]).
  useEffect(() => {
    // "ignore" evita setState si la página se desmonta antes de que
    // responda Firestore.
    let ignore = false

    getDocs(collection(db, 'equipo'))
      .then((snapshot) => {
        const integrantes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        // Firestore ordena los IDs como texto; los queremos 1, 2, 3.
        integrantes.sort((a, b) => Number(a.id) - Number(b.id))
        if (!ignore) setEquipo(integrantes)
      })
      .catch((err) => {
        // Detalle técnico a la consola; en pantalla, un mensaje claro.
        console.error('Error al leer el equipo de Firestore:', err)
        if (!ignore) setError('No pudimos cargar el equipo. Probá recargar la página.')
      })
      .finally(() => {
        if (!ignore) setCargando(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  return (
    <section className={styles.nosotros}>
      <Seo
        titulo="Nosotros"
        descripcion="Quiénes estamos detrás de BuBus Originals, estampado DTF con tu diseño."
      />

      <h1 className={styles.titulo}>Quiénes somos</h1>
      {/* Texto provisorio: lo ideal es que lo reescriban ustedes con su
           historia (cómo arrancó la marca, desde dónde estampan). */}
      <p className={styles.bajada}>
        En BuBus Originals estampamos con DTF remeras, buzos, camperas y mochilas. Diseñamos,
        estampamos y cada pedido lo charlamos por WhatsApp con quien lo va a usar.
      </p>

      <h2 className={styles.subtitulo}>El equipo</h2>
      {cargando && (
        <p className={styles.estado} role="status">
          Cargando equipo...
        </p>
      )}
      {error && (
        <p className={styles.estado} role="alert">
          {error}
        </p>
      )}

      <ul className={styles.equipo}>
        {equipo.map((persona) => (
          // key con el ID del documento: único y estable.
          <li className={styles.persona} key={persona.id}>
            {/* Si fotoURL viene vacía, || cae en el avatar de iniciales:
                 nunca queda una imagen rota. alt vacío: el nombre está
                 escrito al lado. */}
            <img
              src={persona.fotoURL || avatarUrl(persona.nombre)}
              alt=""
              className={styles.foto}
              width="96"
              height="96"
              loading="lazy"
            />
            <div>
              <p className={styles.nombre}>{persona.nombre}</p>
              <p className={styles.rol}>{persona.rol}</p>
              {/* Sin linkedinURL no mostramos un link que no lleva a nada. */}
              {persona.linkedinURL && (
                <a
                  href={persona.linkedinURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkedin}
                  aria-label={`LinkedIn de ${persona.nombre}`}
                >
                  <FaLinkedin aria-hidden="true" />
                  LinkedIn
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Nosotros
