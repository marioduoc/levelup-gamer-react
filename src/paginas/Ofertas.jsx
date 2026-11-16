import { Container } from 'react-bootstrap'
import GrillaProductos from '../componentes/GrillaProductos.jsx'
import EstadoCarga from '../componentes/EstadoCarga.jsx'
import { listarProductos } from '../api/productosApi.js'
import { useDatos } from '../hooks/useDatos.js'

// el filtro de ofertas lo hace el backend (?ofertas=true)
export default function Ofertas({ onAgregar }) {
  const { datos, cargando, error, recargar } = useDatos(() => listarProductos({ ofertas: true }))

  return (
    <Container>
      <h1 className="section-title">Ofertas</h1>
      <p className="text-secondary">Productos con descuento por tiempo limitado.</p>
      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
        <GrillaProductos productos={datos ?? []} onAgregar={onAgregar} />
      </EstadoCarga>
    </Container>
  )
}
