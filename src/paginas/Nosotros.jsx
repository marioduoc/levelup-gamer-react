import { Container, Row, Col, Card } from 'react-bootstrap'

export default function Nosotros() {
  return (
    <Container className="py-4">
      <h1 className="section-title">Quiénes somos</h1>
      <p className="text-secondary" style={{ maxWidth: 760 }}>
        Level-Up Gamer es una tienda online chilena dedicada a productos para gamers. No tenemos
        local físico: despachamos a todo el país. Nacimos de una comunidad de jugadores que
        quería precios justos y productos probados por gente que realmente juega.
      </p>

      <Row xs={1} md={3} className="g-3 mt-2">
        <Col>
          <Card className="h-100">
            <Card.Body>
              <Card.Title as="h2" className="h6">Misión</Card.Title>
              <Card.Text className="text-secondary">
                Proporcionar productos de alta calidad para gamers en todo Chile, ofreciendo una
                experiencia de compra única y personalizada.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="h-100">
            <Card.Body>
              <Card.Title as="h2" className="h6">Visión</Card.Title>
              <Card.Text className="text-secondary">
                Ser la tienda online líder en productos para gamers en Chile, reconocida por su
                innovación, servicio al cliente y compromiso con la comunidad.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card className="h-100">
            <Card.Body>
              <Card.Title as="h2" className="h6">Programa LevelUp</Card.Title>
              <Card.Text className="text-secondary">
                Cada compra suma puntos LevelUp. Los estudiantes Duoc tienen un 20% de descuento
                de por vida con su correo institucional.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}
