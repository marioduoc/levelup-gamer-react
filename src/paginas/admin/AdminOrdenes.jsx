import { Table, Button } from 'react-bootstrap'
import { Link } from 'react-router'
import EstadoCarga from '../../componentes/EstadoCarga.jsx'
import EstadoBoleta from '../../componentes/EstadoBoleta.jsx'
import { formatearFecha } from '../../utils/formato.js'
import { listarBoletas } from '../../api/boletasApi.js'
import { useDatos } from '../../hooks/useDatos.js'
import { formatearPrecio } from '../../utils/carrito.js'

export default function AdminOrdenes() {
  const { datos, cargando, error, recargar } = useDatos(() => listarBoletas())

  return (
    <>
      <h1 className="h3">Órdenes</h1>
      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
        <Table responsive hover size="sm" className="align-middle">
          <thead>
            <tr>
              <th>N°</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th className="text-end">Total</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(datos ?? []).map((b) => (
              <tr key={b.id}>
                <td>{b.numero}</td>
                <td>{formatearFecha(b.fecha)}</td>
                <td>{b.nombreCliente} {b.apellidosCliente}</td>
                <td className="text-end">{formatearPrecio(b.total)}</td>
                <td><EstadoBoleta estado={b.estado} /></td>
                <td className="text-end">
                  <Button as={Link} to={`/admin/ordenes/${b.id}`} size="sm" variant="outline-light">Ver</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </EstadoCarga>
    </>
  )
}
