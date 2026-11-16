import { Container, Alert, Table, Button } from 'react-bootstrap'
import { Link, Navigate } from 'react-router'
import { formatearPrecio } from '../utils/carrito.js'

// recibe la boleta que devolvió el backend; exito decide qué mensaje se muestra
export default function ResultadoCompra({ boleta, exito }) {
  if (!boleta) {
    return <Navigate to="/" replace />
  }

  return (
    <Container className="py-4" style={{ maxWidth: 760 }}>
      {exito ? (
        <Alert variant="success">
          <Alert.Heading as="h1" className="h4">Se ha realizado la compra. N° {boleta.numero}</Alert.Heading>
          Te enviaremos la boleta a <strong>{boleta.correoCliente}</strong>.
        </Alert>
      ) : (
        <Alert variant="danger">
          <Alert.Heading as="h1" className="h4">No se pudo realizar el pago. N° {boleta.numero}</Alert.Heading>
          La tarjeta fue rechazada. Tu carrito sigue guardado, puedes intentarlo de nuevo.
          <div className="mt-3">
            <Button as={Link} to="/checkout" variant="primary">Volver a realizar el pago</Button>
          </div>
        </Alert>
      )}

      <h2 className="h5 mt-4">Datos del cliente</h2>
      <p className="mb-1">{boleta.nombreCliente} {boleta.apellidosCliente} · {boleta.correoCliente}</p>
      <p className="text-secondary">
        {boleta.calle}{boleta.departamento && `, Depto ${boleta.departamento}`}, {boleta.comuna}, {boleta.region}
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
          {boleta.detalles.map((item) => (
            <tr key={item.codigo}>
              <td>{item.nombre}</td>
              <td>{formatearPrecio(item.precioUnitario)}</td>
              <td>{item.cantidad}</td>
              <td className="text-end">{formatearPrecio(item.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {boleta.descuento > 0 && (
        <p className="text-end text-success mb-1">Descuento Duoc (20%): - {formatearPrecio(boleta.descuento)}</p>
      )}
      <p className="h5 text-end">
        Total {exito ? 'pagado' : 'a pagar'}: <span className="price">{formatearPrecio(boleta.total)}</span>
      </p>

      {exito && (
        <div className="text-center mt-4 d-flex gap-2 justify-content-center">
          <Button as={Link} to="/productos" variant="outline-primary">Seguir comprando</Button>
          <Button as={Link} to="/mis-compras" variant="primary">Ver mis compras</Button>
        </div>
      )}
    </Container>
  )
}
