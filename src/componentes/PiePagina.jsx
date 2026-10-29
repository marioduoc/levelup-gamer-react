import { Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router'

// Se calcula una sola vez al cargar el archivo (no en cada render).
const ANIO_ACTUAL = new Date().getFullYear()

export default function PiePagina() {
  const anio = ANIO_ACTUAL

  return (
    <footer className="site-footer">
      <Container>
        <Row className="gy-3">
          <Col md={6}>
            <p className="logo mb-1 text-white">LEVEL<span>UP</span> GAMER</p>
            <p className="mb-0">La tienda online líder en productos para gamers en Chile.</p>
          </Col>
          <Col md={3}>
            <h3 className="h6 text-white">Enlaces</h3>
            <ul className="list-unstyled mb-0">
              <li><Link to="/nosotros" className="text-secondary">Nosotros</Link></li>
              <li><Link to="/blog" className="text-secondary">Blog</Link></li>
              <li><Link to="/contacto" className="text-secondary">Contacto</Link></li>
            </ul>
          </Col>
          <Col md={3}>
            <h3 className="h6 text-white">Síguenos</h3>
            <p className="mb-0">Instagram · Twitter · TikTok</p>
          </Col>
        </Row>
        <p className="text-center small mt-4 mb-0">© {anio} Level-Up Gamer. Todos los derechos reservados.</p>
      </Container>
    </footer>
  )
}
