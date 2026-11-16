import { Row, Col, Card, Table, Alert } from 'react-bootstrap'
import { Link } from 'react-router'
import { useAuth } from '../../auth/contexto.js'
import { SECCIONES } from './secciones.js'
import EstadoCarga from '../../componentes/EstadoCarga.jsx'
import { productosStockCritico } from '../../api/productosApi.js'
import { useDatos } from '../../hooks/useDatos.js'

function StockCritico() {
  const { datos, cargando, error } = useDatos(() => productosStockCritico())

  return (
    <>
      <h2 className="h5 mt-4">Stock crítico</h2>
      <EstadoCarga cargando={cargando} error={error}>
        {datos?.length === 0 ? (
          <Alert variant="success">Todos los productos tienen stock suficiente.</Alert>
        ) : (
          <Table size="sm">
            <thead>
              <tr><th>Código</th><th>Producto</th><th>Stock</th><th>Mínimo</th></tr>
            </thead>
            <tbody>
              {(datos ?? []).map((p) => (
                <tr key={p.codigo}>
                  <td>{p.codigo}</td>
                  <td><Link to={`/admin/productos/${p.codigo}`}>{p.nombre}</Link></td>
                  <td className="text-warning fw-bold">{p.stock}</td>
                  <td>{p.stockCritico}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </EstadoCarga>
    </>
  )
}

export default function PanelInicio() {
  const { usuario, puede } = useAuth()

  return (
    <>
      <h1 className="h3">Hola, {usuario.nombre}</h1>
      <p className="text-secondary">Rol: {usuario.rol}</p>
      <Row xs={1} sm={2} className="g-3">
        {SECCIONES.filter((s) => puede(s.permiso)).map((s) => (
          <Col key={s.ruta}>
            <Card as={Link} to={s.ruta} className="h-100 text-decoration-none text-white">
              <Card.Body>
                <Card.Title as="h2" className="h6">{s.texto}</Card.Title>
                <Card.Text className="small text-secondary">{s.descripcion}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {puede('verStockCritico') && <StockCritico />}
    </>
  )
}
