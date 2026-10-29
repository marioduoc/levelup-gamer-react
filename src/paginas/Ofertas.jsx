import { Container } from 'react-bootstrap'
import GrillaProductos from '../componentes/GrillaProductos.jsx'
import { obtenerOfertas } from '../datos/productos.js'

// solo los productos con descuento
export default function Ofertas({ onAgregar }) {
  const ofertas = obtenerOfertas()

  return (
    <Container>
      <h1 className="section-title">Ofertas</h1>
      <p className="text-secondary">Productos con descuento por tiempo limitado.</p>
      <GrillaProductos productos={ofertas} onAgregar={onAgregar} />
    </Container>
  )
}
