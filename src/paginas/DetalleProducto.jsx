import { Container, Row, Col, Button, Badge, Alert } from 'react-bootstrap'
import { Link, useParams, useNavigate } from 'react-router'
import EstadoCarga from '../componentes/EstadoCarga.jsx'
import { obtenerProducto } from '../api/productosApi.js'
import { useDatos } from '../hooks/useDatos.js'
import { formatearPrecio } from '../utils/carrito.js'

export default function DetalleProducto({ onAgregar }) {
  const { codigo } = useParams()
  const navegar = useNavigate()
  const { datos: producto, cargando, error } = useDatos(() => obtenerProducto(codigo), [codigo])

  if (!cargando && (error || !producto)) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          {error || 'Producto no encontrado.'} <Link to="/productos">Volver al catálogo</Link>.
        </Alert>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <EstadoCarga cargando={cargando}>
        {producto && (
          <>
            <Button variant="link" className="px-0 mb-3" onClick={() => navegar(-1)}>
              ← Volver
            </Button>
            <Row className="g-4">
              <Col md={6}>
                <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded" />
              </Col>
              <Col md={6}>
                <small className="text-secondary">{producto.categoria}</small>
                <h1 className="h2">{producto.nombre}</h1>
                {producto.oferta > 0 && (
                  <>
                    <Badge bg="danger" className="mb-2">-{producto.oferta}%</Badge>
                    <div className="price-old">{formatearPrecio(producto.precio)}</div>
                  </>
                )}
                <p className="price fs-4">{formatearPrecio(producto.precioFinal)}</p>
                {producto.stock <= 0 ? (
                  <Badge bg="secondary" className="mb-3">Agotado</Badge>
                ) : (
                  <p className="text-secondary small">Stock disponible: {producto.stock}</p>
                )}
                <p>{producto.descripcion}</p>
                {onAgregar && (
                  <Button variant="primary" disabled={producto.stock <= 0} onClick={() => onAgregar(producto)}>
                    {producto.stock <= 0 ? 'Sin stock' : 'Añadir al carrito'}
                  </Button>
                )}
              </Col>
            </Row>
          </>
        )}
      </EstadoCarga>
    </Container>
  )
}
