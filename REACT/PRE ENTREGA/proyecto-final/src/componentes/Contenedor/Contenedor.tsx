// Componente "envoltorio" — Contenedor
//
// Recibe children y lo enmarca con un estilo genérico.

import type { ReactNode } from 'react'

interface ContenedorProps {
  children: ReactNode
}

function Contenedor({ children }: ContenedorProps) {
  const estilo = {
    border: '1px solid #ccc',
    padding: '16px',
    margin: '16px 0',
    backgroundColor: '#f4f3ec',
  }

  return <div style={estilo}>{children}</div>
}

export default Contenedor
