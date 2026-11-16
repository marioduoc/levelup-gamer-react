import { Row, Col, Button, Table } from 'react-bootstrap'
import { Link, useParams } from 'react-router'
import EstadoCarga from '../../componentes/EstadoCarga.jsx'
import { obtenerProducto } from '../../api/productosApi.js'
import { useDatos } from '../../hooks/useDatos.js'
import { useAuth } from '../../auth/contexto.js'
import { formatearPrecio } from '../../utils/carrito.js'

export default function DetalleProductoAdmin() {
  const { codigo } = useParams()
  const { puede } = useAuth()
  const { datos: p, cargando, error } = useDatos(() => obtenerProducto(codigo), [codigo])

  return (
    <EstadoCarga cargando={cargando} error={error}>
      {p && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="h3 mb-0">{p.nombre}</h1>
            <div>
              <Button as={Link} to="/admin/productos" variant="outline-light" size="sm">Volver</Button>{' '}
              {puede('editarProductos') && (
                <Button as={Link} to={`/admin/productos/${p.codigo}/editar`} size="sm">Editar</Button>
              )}
            </div>
          </div>
          <Row className="g-4">
            <Col md={4}>
              <img src={p.imagen} alt={p.nombre} className="img-fluid rounded" />
            </Col>
            <Col md={8}>
              <Table size="sm">
                <tbody>
                  <tr><th>Código</th><td>{p.codigo}</td></tr>
                  <tr><th>Categoría</th><td>{p.categoria}</td></tr>
                  <tr><th>Precio</th><td>{formatearPrecio(p.precio)}</td></tr>
                  <tr><th>Oferta</th><td>{p.oferta}%</td></tr>
                  <tr><th>Precio final</th><td>{formatearPrecio(p.precioFinal)}</td></tr>
                  <tr><th>Stock</th><td>{p.stock}</td></tr>
                  <tr><th>Stock crítico</th><td>{p.stockCritico}</td></tr>
                </tbody>
              </Table>
              <p className="text-secondary">{p.descripcion}</p>
            </Col>
          </Row>
        </>
      )}
    </EstadoCarga>
  )
}
