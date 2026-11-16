import { Container, Accordion, Table } from 'react-bootstrap'
import { Link } from 'react-router'
import EstadoCarga from '../componentes/EstadoCarga.jsx'
import EstadoBoleta from '../componentes/EstadoBoleta.jsx'
import { formatearFecha } from '../utils/formato.js'
import { misBoletas } from '../api/boletasApi.js'
import { useDatos } from '../hooks/useDatos.js'
import { formatearPrecio } from '../utils/carrito.js'

export default function MisCompras() {
  const { datos, cargando, error, recargar } = useDatos(() => misBoletas())
  const boletas = datos ?? []

  return (
    <Container className="py-4" style={{ maxWidth: 860 }}>
      <h1 className="section-title">Mis compras</h1>
      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
        {boletas.length === 0 ? (
          <p className="text-secondary">
            Todavía no tienes compras. <Link to="/productos">Ver catálogo</Link>
          </p>
        ) : (
          <Accordion>
            {boletas.map((b) => (
              <Accordion.Item key={b.id} eventKey={String(b.id)}>
                <Accordion.Header>
                  <span className="me-3">N° {b.numero}</span>
                  <span className="me-3 text-secondary small">{formatearFecha(b.fecha)}</span>
                  <span className="me-3"><EstadoBoleta estado={b.estado} /></span>
                  <strong>{formatearPrecio(b.total)}</strong>
                </Accordion.Header>
                <Accordion.Body>
                  <Table size="sm" className="mb-2">
                    <tbody>
                      {b.detalles.map((d) => (
                        <tr key={d.codigo}>
                          <td>{d.nombre}</td>
                          <td>x{d.cantidad}</td>
                          <td className="text-end">{formatearPrecio(d.subtotal)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <p className="small text-secondary mb-0">
                    Envío a {b.calle}, {b.comuna}, {b.region}
                  </p>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        )}
      </EstadoCarga>
    </Container>
  )
}
