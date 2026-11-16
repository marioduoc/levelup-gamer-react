import { Container, Button } from 'react-bootstrap'
import { Link } from 'react-router'
import GrillaProductos from '../componentes/GrillaProductos.jsx'
import EstadoCarga from '../componentes/EstadoCarga.jsx'
import { listarProductos } from '../api/productosApi.js'
import { useDatos } from '../hooks/useDatos.js'

export default function Inicio({ onAgregar }) {
  const { datos, cargando, error, recargar } = useDatos(() => listarProductos())
  const destacados = (datos ?? []).slice(0, 4)

  return (
    <>
      <section className="hero">
        <Container>
          <h1 className="display-5 fw-bold">
            Desafía tus límites con <span>Level-Up Gamer</span>
          </h1>
          <p className="text-secondary mx-auto" style={{ maxWidth: 600 }}>
            Consolas, accesorios, computadores y sillas gamer con despacho a todo Chile. Únete a
            nuestra comunidad y gana puntos LevelUp en cada compra.
          </p>
          <Button as={Link} to="/productos" variant="primary" size="lg">
            Ver catálogo
          </Button>
        </Container>
      </section>

      <Container>
        <h2 className="section-title">Productos destacados</h2>
        <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
          <GrillaProductos productos={destacados} onAgregar={onAgregar} />
        </EstadoCarga>
      </Container>
    </>
  )
}
