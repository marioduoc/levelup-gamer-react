import { Container, Row, Col, Card } from 'react-bootstrap'
import { Link } from 'react-router'
import { articulosBlog, formatearFecha } from '../datos/blog.js'

export default function Blog() {
  return (
    <Container className="py-4">
      <h1 className="section-title">Blog</h1>
      <Row xs={1} md={3} className="g-4">
        {articulosBlog.map((articulo) => (
          <Col key={articulo.id}>
            <Card as={Link} to={`/blog/${articulo.id}`} className="h-100 text-decoration-none text-white">
              <Card.Body className="d-flex flex-column">
                <small className="text-info">{articulo.categoria}</small>
                <Card.Title as="h2" className="h6">{articulo.titulo}</Card.Title>
                <Card.Text className="text-secondary small">{articulo.resumen}</Card.Text>
                <small className="text-secondary mt-auto">{formatearFecha(articulo.fecha)}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}
