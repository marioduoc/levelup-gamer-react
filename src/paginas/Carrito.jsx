import { Container, Table, Button, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router'
import ResumenCarrito from '../componentes/ResumenCarrito.jsx'
import { formatearPrecio } from '../utils/carrito.js'
import { useAuth } from '../auth/contexto.js'

// el carrito. el estado está en App y baja por props
export default function Carrito({ carrito, onCambiarCantidad, onQuitar, onVaciar }) {
  const { usuario } = useAuth()

  if (carrito.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h1 className="h3">Tu carrito está vacío</h1>
        <p className="text-secondary">Agrega productos desde el catálogo.</p>
        <Button as={Link} to="/productos" variant="primary">Ver catálogo</Button>
      </Container>
    )
  }

  return (
    <Container className="py-4">
      <h1 className="section-title">Carrito de compras</h1>
      <Row className="g-4">
        <Col lg={8}>
          <Table responsive hover className="align-middle">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((item) => (
                <tr key={item.codigo}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img src={item.imagen} alt="" width={48} height={36} className="rounded object-fit-cover" />
                      <span>{item.nombre}</span>
                    </div>
                  </td>
                  <td>{formatearPrecio(item.precio)}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        aria-label={`Quitar una unidad de ${item.nombre}`}
                        onClick={() => onCambiarCantidad(item.codigo, item.cantidad - 1)}
                      >
                        −
                      </Button>
                      <span data-testid={`cantidad-${item.codigo}`}>{item.cantidad}</span>
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        aria-label={`Agregar una unidad de ${item.nombre}`}
                        disabled={item.cantidad >= item.stock}
                        onClick={() => onCambiarCantidad(item.codigo, item.cantidad + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </td>
                  <td>{formatearPrecio(item.precio * item.cantidad)}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      aria-label={`Eliminar ${item.nombre}`}
                      onClick={() => onQuitar(item.codigo)}
                    >
                      ✕
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button variant="outline-secondary" size="sm" onClick={onVaciar}>
            Vaciar carrito
          </Button>
        </Col>

        <Col lg={4}>
          <ResumenCarrito carrito={carrito} correo={usuario?.correo} />
          {!usuario && (
            <p className="small text-secondary mt-2 mb-0">
              Al pagar te pediremos iniciar sesión. Las cuentas @duoc.cl tienen 20% de descuento.
            </p>
          )}
          <Button as={Link} to="/checkout" variant="primary" className="w-100 mt-3">
            Proceder al pago
          </Button>
        </Col>
      </Row>
    </Container>
  )
}
