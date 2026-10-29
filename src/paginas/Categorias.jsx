import { Container, Row, Col, Card } from 'react-bootstrap'
import { Link } from 'react-router'
import { obtenerProductos, obtenerCategorias } from '../datos/productos.js'

// muestra los productos agrupados por categoría
export default function Categorias() {
  const productos = obtenerProductos()
  const categorias = obtenerCategorias()

  return (
    <Container>
      <h1 className="section-title">Categorías</h1>
      <Row xs={2} md={3} lg={5} className="g-3">
        {categorias.map((categoria) => {
          const cantidad = productos.filter((p) => p.categoria === categoria).length
          return (
            <Col key={categoria}>
              <Card
                as={Link}
                to={`/productos?categoria=${encodeURIComponent(categoria)}`}
                className="h-100 text-center text-decoration-none text-white"
              >
                <Card.Body>
                  <Card.Title as="h2" className="h6">{categoria}</Card.Title>
                  <Card.Text className="text-secondary small mb-0">
                    {cantidad} producto(s)
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>
    </Container>
  )
}
