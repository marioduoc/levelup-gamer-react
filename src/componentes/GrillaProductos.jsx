import { Row, Col } from 'react-bootstrap'
import TarjetaProducto from './TarjetaProducto.jsx'

// Grilla responsiva: 1 columna en celular, 2 en tablet, 3 o 4 en escritorio.
export default function GrillaProductos({ productos, onAgregar }) {
  if (productos.length === 0) {
    return <p className="text-secondary">No hay productos para mostrar.</p>
  }

  return (
    <Row xs={1} sm={2} lg={3} xl={4} className="g-4">
      {productos.map((producto) => (
        <Col key={producto.codigo}>
          <TarjetaProducto producto={producto} onAgregar={onAgregar} />
        </Col>
      ))}
    </Row>
  )
}
