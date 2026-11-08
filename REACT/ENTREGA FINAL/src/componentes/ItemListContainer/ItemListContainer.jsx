// ItemListContainer — "El Cerebro" (Clase 04, Nivel 1). Consigue los
// datos y se los pasa a ItemList; no le importa cómo se muestran.
// Clase 08: carga el catálogo desde /productos.json (carpeta public/)
// con fetch en vez de tenerlo hardcodeado.
// Clase 09: el catálogo ahora viene de Firestore. Este componente no
// cambió: el cambio quedó encerrado en utils/catalogo.js.
// Clase 13: búsqueda por nombre en tiempo real, grilla de Bootstrap y
// estados (cargando / error / sin resultados) con EstadoCatalogo.
// Entrega Final, Requerimiento 4.2: paginador. Muestra de a
// PRODUCTOS_POR_PAGINA para no cargar todas las tarjetas (y sus fotos) de
// una sola vez.

import { useState, useEffect, useMemo, useRef } from 'react'
import { FaSearch } from 'react-icons/fa'
import { ItemList } from '../ItemList/ItemList'
import { BarraBusqueda } from '../BarraBusqueda/BarraBusqueda'
import { EstadoCatalogo } from '../ui/EstadoCatalogo/EstadoCatalogo'
import { Boton } from '../ui/Boton/Boton'
import { Paginador } from '../Paginador/Paginador'
import { obtenerCatalogo } from '../../utils/catalogo'
import { normalizar } from '../../utils/normalizar'

// 6 = dos filas completas de la grilla en pantalla grande (3 por fila) y
// tres filas en tablet (2 por fila): ninguna página queda con un hueco.
const PRODUCTOS_POR_PAGINA = 6

export function ItemListContainer({ Mensaje }) {
  const [products, setProducts] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)
  // Clase 13, paso 1: el estado del input controlado de búsqueda.
  const [busqueda, setBusqueda] = useState('')
  // Entrega Final: la página del catálogo que se está viendo (arranca en 1).
  const [pagina, setPagina] = useState(1)
  // Referencia a la <section>, para subir hasta el principio del catálogo
  // al cambiar de página (si no, quedás mirando el pie de la página nueva).
  const seccionRef = useRef(null)

  useEffect(() => {
    // "ignore" evita setState si el componente se desmontó antes de que
    // resuelva el fetch (ej. el usuario navega a otra página).
    let ignore = false

    obtenerCatalogo()
      .then((data) => {
        if (!ignore) setProducts(data)
      })
      .catch((err) => {
        if (!ignore) setError(err.message)
      })
      .finally(() => {
        if (!ignore) setCargando(false)
      })

    return () => {
      ignore = true
    }
  }, [])

  // Solo se muestran los productos que tienen stock disponible.
  // Clase 13, paso 2: además, los que coinciden con la búsqueda.
  //
  // La lista filtrada NO es otro useState: se calcula a partir de
  // `products` y `busqueda`. Como estado aparte habría que mantenerla
  // sincronizada a mano. useMemo guarda el resultado y solo vuelve a
  // filtrar cuando cambia la lista o el término; la búsqueda no vuelve a
  // pedir nada a Firestore, filtra lo que ya está en memoria.
  const termino = normalizar(busqueda)
  const visibles = useMemo(
    () =>
      products.filter(
        (prod) => prod.stock > 0 && (termino === '' || normalizar(prod.nombre).includes(termino)),
      ),
    [products, termino],
  )
  const conStock = useMemo(() => products.filter((prod) => prod.stock > 0).length, [products])

  // Paginación: también se calcula, no se guarda. Se pagina sobre
  // `visibles` (lo ya filtrado), así la búsqueda y el paginador funcionan
  // juntos: buscar "remera" pagina solo las remeras.
  const totalPaginas = Math.ceil(visibles.length / PRODUCTOS_POR_PAGINA)
  const inicio = (pagina - 1) * PRODUCTOS_POR_PAGINA
  const deEstaPagina = visibles.slice(inicio, inicio + PRODUCTOS_POR_PAGINA)

  // Al escribir en la búsqueda se vuelve a la página 1: si estabas en la 3
  // y el resultado tiene una sola página, la 3 quedaría vacía. Se hace acá,
  // en el mismo evento, y no con un useEffect que "mire" la búsqueda: así
  // es un solo render en vez de dos.
  const cambiarBusqueda = (texto) => {
    setBusqueda(texto)
    setPagina(1)
  }

  const cambiarPagina = (nueva) => {
    setPagina(nueva)
    seccionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  // El título va siempre, en los tres estados, así la página no "salta".
  const titulo = <h2 className="section-title">{Mensaje}</h2>

  if (cargando) {
    return (
      <section className="container catalogo-productos">
        {titulo}
        {/* Spinner de Bootstrap. role="status" + texto: el lector de
             pantalla anuncia la carga. */}
        <EstadoCatalogo role="status">
          <div className="spinner-border" aria-hidden="true" />
          <p>Cargando productos...</p>
        </EstadoCatalogo>
      </section>
    )
  }

  if (error) {
    return (
      <section className="container catalogo-productos">
        {titulo}
        <EstadoCatalogo error role="alert">
          <p>Error: {error}</p>
        </EstadoCatalogo>
      </section>
    )
  }

  return (
    <section ref={seccionRef} className="container catalogo-productos">
      {titulo}

      <BarraBusqueda
        valor={busqueda}
        alCambiar={cambiarBusqueda}
        total={conStock}
        encontrados={visibles.length}
      />

      {/* Clase 13, paso 3: mostrar solo los que coinciden. Si no queda
           ninguno, un mensaje con salida (ver todos) en vez de una grilla
           vacía. */}
      {visibles.length === 0 ? (
        <EstadoCatalogo>
          <FaSearch aria-hidden="true" />
          <p>No encontramos productos para &quot;{busqueda.trim()}&quot;.</p>
          <Boton type="button" variante="contorno" onClick={() => cambiarBusqueda('')}>
            Ver todos los productos
          </Boton>
        </EstadoCatalogo>
      ) : (
        <>
          {/* Grilla de Bootstrap: `row` es la fila; las columnas las pone
               ItemList (una por producto). g-4 = espacio entre tarjetas. */}
          <div className="row g-4">
            <ItemList productos={deEstaPagina} />
          </div>
          <Paginador paginaActual={pagina} totalPaginas={totalPaginas} alCambiar={cambiarPagina} />
        </>
      )}
    </section>
  )
}
