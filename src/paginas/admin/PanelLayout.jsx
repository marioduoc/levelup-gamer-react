import { Container, Row, Col, Nav } from 'react-bootstrap'
import { NavLink, Outlet } from 'react-router'
import { useAuth } from '../../auth/contexto.js'
import { SECCIONES } from './secciones.js'

// el menú solo muestra lo que el rol puede usar: al vendedor no le aparecen categorías ni usuarios
export default function PanelLayout() {
  const { usuario, puede } = useAuth()
  const visibles = SECCIONES.filter((s) => puede(s.permiso))

  return (
    <Container fluid="lg" className="py-4">
      <Row className="g-4">
        <Col md={3}>
          <div className="border rounded p-3">
            <p className="small text-secondary mb-2">
              Panel {usuario.rol === 'ADMIN' ? 'de administración' : 'de vendedor'}
            </p>
            <Nav as="nav" className="flex-column" aria-label="Menú del panel">
              <Nav.Link as={NavLink} to="/admin" end>Inicio</Nav.Link>
              {visibles.map((s) => (
                <Nav.Link key={s.ruta} as={NavLink} to={s.ruta}>{s.texto}</Nav.Link>
              ))}
            </Nav>
          </div>
        </Col>
        <Col md={9}>
          <Outlet />
        </Col>
      </Row>
    </Container>
  )
}
