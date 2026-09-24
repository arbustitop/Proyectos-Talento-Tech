// Reutiliza el componente Asistente (Clase 02, patrón props + .map()) para
// mostrar los servicios de BuBus Originals en vez de datos genéricos.

export interface DatoAsistente {
  nombre: string
  tarea: string
  emoji: string
}

export const asistentes: DatoAsistente[] = [
  { nombre: 'Prendas DTF personalizadas', tarea: 'Diseños exclusivos y alta calidad de impresión', emoji: '👕' },
  { nombre: 'Servicios de estampado', tarea: 'Estampado textil en tres modelos de planchas', emoji: '🖨️' },
  { nombre: 'Gestión ordenada', tarea: 'Control de inventario y stock en tiempo real', emoji: '📊' },
]
