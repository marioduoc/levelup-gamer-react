import { Card, Button, Badge } from 'react-bootstrap'
import { Link } from 'react-router'
import { formatearPrecio } from '../utils/carrito.js'

// tarjeta de un producto. si no llega onAgregar (ej: vendedor) no se muestra el botón
export default function TarjetaProducto({ producto, onAgregar }) {
  const sinStock = producto.stock <= 0
  const stockCritico = !sinStock && producto.stock <= producto.stockCritico
  const tieneOferta = producto.oferta > 0

  return (
    <Card className="h-100">
      <Link to={`/producto/${producto.codigo}`}>
        <Card.Img variant="top" src={producto.imagen} alt={producto.nombre} />
      </Link>
      <Card.Body className="d-flex flex-column">
        <small className="text-secondary">{producto.categoria}</small>
        <Card.Title as="h3" className="h6">
          <Link to={`/producto/${producto.codigo}`} className="text-white text-decoration-none">
            {producto.nombre}
          </Link>
        </Card.Title>

        {/* solo aparece una de las dos etiquetas según el stock */}
        {sinStock && <Badge bg="secondary" className="align-self-start mb-2">Agotado</Badge>}
        {stockCritico && <Badge bg="warning" text="dark" className="align-self-start mb-2">¡Últimas unidades!</Badge>}
        {tieneOferta && <Badge bg="danger" className="align-self-start mb-2">-{producto.oferta}%</Badge>}

        <div className="mt-auto">
          {tieneOferta && <div className="price-old">{formatearPrecio(producto.precio)}</div>}
          <p className="price mb-2">{formatearPrecio(producto.precioFinal)}</p>
          {onAgregar && (
            <Button
              variant="primary"
              className="w-100"
              disabled={sinStock}
              onClick={() => onAgregar(producto)}
            >
              {sinStock ? 'Sin stock' : 'Añadir al carrito'}
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  )
}
