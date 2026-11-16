import { Badge } from 'react-bootstrap'

const COLORES = { APROBADA: 'success', RECHAZADA: 'danger', ANULADA: 'secondary' }

export default function EstadoBoleta({ estado }) {
  return <Badge bg={COLORES[estado] ?? 'secondary'}>{estado}</Badge>
}
