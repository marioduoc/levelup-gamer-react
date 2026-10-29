import { Container, Alert, Table, Button } from 'react-bootstrap'
import { Link, Navigate } from 'react-router'
import { formatearPrecio } from '../utils/carrito.js'

// misma página para los dos casos: compra ok y pago rechazado.
// la prop exito decide cuál se muestra
export default function ResultadoCompra({ pedido, exito }) {
  // si entran directo a la url sin haber comprado, de vuelta al inicio
  if (!pedido) {
    return <Navigate to="/" replace />
  }

  const { cliente } = pedido

  return (
    <Container className="py-4" style={{ maxWidth: 760 }}>
      {exito ? (
        <Alert variant="success">
          <Alert.Heading as="h1" className="h4">✓ Se ha realizado la compra. N° {pedido.numero}</Alert.Heading>
          Te enviaremos la boleta a <strong>{cliente.correo}</strong>.
        </Alert>
      ) : (
        <Alert variant="danger">
          <Alert.Heading as="h1" className="h4">✕ No se pudo realizar el pago. N° {pedido.numero}</Alert.Heading>
          La tarjeta fue rechazada. Tu carrito sigue guardado, puedes intentarlo de nuevo.
          <div className="mt-3">
            <Button as={Link} to="/checkout" variant="primary">Volver a realizar el pago</Button>
          </div>
        </Alert>
      )}

      <h2 className="h5 mt-4">Datos del cliente</h2>
      <p className="mb-1">{cliente.nombre} {cliente.apellidos} · {cliente.correo}</p>
      <p className="text-secondary">
        {cliente.calle}{cliente.departamento && `, Depto ${cliente.departamento}`}, {cliente.comuna}, {cliente.region}
      </p>

      <h2 className="h5 mt-4">Detalle</h2>
      <Table size="sm">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th className="text-end">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {pedido.items.map((item) => (
            <tr key={item.codigo}>
              <td>{item.nombre}</td>
              <td>{formatearPrecio(item.precio)}</td>
              <td>{item.cantidad}</td>
              <td className="text-end">{formatearPrecio(item.precio * item.cantidad)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <p className="h5 text-end">
        Total {exito ? 'pagado' : 'a pagar'}: <span className="price">{formatearPrecio(pedido.total)}</span>
      </p>

      {exito && (
        <div className="text-center mt-4">
          <Button as={Link} to="/productos" variant="outline-primary">Seguir comprando</Button>
        </div>
      )}
    </Container>
  )
}
