import { useState } from 'react'
import { Table, Button, Alert, Row, Col } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router'
import EstadoCarga from '../../componentes/EstadoCarga.jsx'
import ConfirmarAccion from '../../componentes/ConfirmarAccion.jsx'
import EstadoBoleta from '../../componentes/EstadoBoleta.jsx'
import { formatearFecha } from '../../utils/formato.js'
import { obtenerBoleta, anularBoleta, eliminarBoleta } from '../../api/boletasApi.js'
import { mensajeError } from '../../api/cliente.js'
import { useDatos } from '../../hooks/useDatos.js'
import { useAuth } from '../../auth/contexto.js'
import { formatearPrecio } from '../../utils/carrito.js'

export default function DetalleOrden() {
  const { id } = useParams()
  const navegar = useNavigate()
  const { puede } = useAuth()
  const { datos: b, cargando, error, recargar } = useDatos(() => obtenerBoleta(id), [id])
  const [confirmar, setConfirmar] = useState(null)
  const [aviso, setAviso] = useState(null)

  async function ejecutar() {
    const accion = confirmar
    setConfirmar(null)
    try {
      if (accion === 'anular') {
        await anularBoleta(b.id)
        setAviso({ tipo: 'success', texto: 'Orden anulada. El stock fue devuelto.' })
        recargar()
      } else {
        await eliminarBoleta(b.id)
        navegar('/admin/ordenes')
      }
    } catch (err) {
      setAviso({ tipo: 'danger', texto: mensajeError(err) })
    }
  }

  const gestiona = puede('gestionarOrdenes')

  return (
    <EstadoCarga cargando={cargando} error={error}>
      {b && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="h3 mb-0">Orden N° {b.numero}</h1>
            <Button as={Link} to="/admin/ordenes" variant="outline-light" size="sm">Volver</Button>
          </div>
          {aviso && <Alert variant={aviso.tipo}>{aviso.texto}</Alert>}

          <Row className="mb-3">
            <Col sm={6}>
              <p className="mb-1">Fecha: {formatearFecha(b.fecha)}</p>
              <p className="mb-1">Estado: <EstadoBoleta estado={b.estado} /></p>
            </Col>
            <Col sm={6}>
              <p className="mb-1">{b.nombreCliente} {b.apellidosCliente} · {b.correoCliente}</p>
              <p className="text-secondary mb-1">
                {b.calle}{b.departamento && `, Depto ${b.departamento}`}, {b.comuna}, {b.region}
              </p>
              {b.indicaciones && <p className="small text-secondary">Indicaciones: {b.indicaciones}</p>}
            </Col>
          </Row>

          <Table size="sm">
            <thead>
              <tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th className="text-end">Subtotal</th></tr>
            </thead>
            <tbody>
              {b.detalles.map((d) => (
                <tr key={d.codigo}>
                  <td>{d.codigo} · {d.nombre}</td>
                  <td>{formatearPrecio(d.precioUnitario)}</td>
                  <td>{d.cantidad}</td>
                  <td className="text-end">{formatearPrecio(d.subtotal)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <p className="text-end mb-1">Subtotal: {formatearPrecio(b.subtotal)}</p>
          {b.descuento > 0 && <p className="text-end text-success mb-1">Descuento Duoc: - {formatearPrecio(b.descuento)}</p>}
          <p className="text-end h5">Total: {formatearPrecio(b.total)}</p>

          {gestiona && (
            <div className="d-flex gap-2 justify-content-end mt-3">
              {b.estado === 'APROBADA' && (
                <Button variant="outline-warning" onClick={() => setConfirmar('anular')}>Anular orden</Button>
              )}
              {b.estado !== 'APROBADA' && (
                <Button variant="outline-danger" onClick={() => setConfirmar('eliminar')}>Eliminar orden</Button>
              )}
            </div>
          )}

          <ConfirmarAccion
            mostrar={!!confirmar}
            titulo={confirmar === 'anular' ? 'Anular orden' : 'Eliminar orden'}
            mensaje={confirmar === 'anular'
              ? 'Se anulará la orden y el stock volverá al inventario.'
              : 'La orden se eliminará definitivamente.'}
            textoConfirmar={confirmar === 'anular' ? 'Anular' : 'Eliminar'}
            onConfirmar={ejecutar}
            onCancelar={() => setConfirmar(null)}
          />
        </>
      )}
    </EstadoCarga>
  )
}
