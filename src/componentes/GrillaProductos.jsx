import { Row, Col } from 'react-bootstrap'
import TarjetaProducto from './TarjetaProducto.jsx'

// grilla responsiva: 1 columna en celu, 2 en tablet y 3-4 en pantalla grande
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
