import { Container, Row, Col, Card } from 'react-bootstrap'
import { Link } from 'react-router'
import EstadoCarga from '../componentes/EstadoCarga.jsx'
import { listarProductos } from '../api/productosApi.js'
import { listarCategorias } from '../api/categoriasApi.js'
import { useDatos } from '../hooks/useDatos.js'

// las dos peticiones van en paralelo
function cargarTodo() {
  return Promise.all([listarCategorias(), listarProductos()])
}

export default function Categorias() {
  const { datos, cargando, error, recargar } = useDatos(cargarTodo)
  const [categorias, productos] = datos ?? [[], []]

  return (
    <Container>
      <h1 className="section-title">Categorías</h1>
      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
        <Row xs={2} md={3} lg={5} className="g-3">
          {categorias.map((categoria) => {
            const cantidad = productos.filter((p) => p.categoriaId === categoria.id).length
            return (
              <Col key={categoria.id}>
                <Card
                  as={Link}
                  to={`/productos?categoria=${encodeURIComponent(categoria.nombre)}`}
                  className="h-100 text-center text-decoration-none text-white"
                >
                  <Card.Body>
                    <Card.Title as="h2" className="h6">{categoria.nombre}</Card.Title>
                    <Card.Text className="text-secondary small mb-0">{cantidad} producto(s)</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            )
          })}
        </Row>
      </EstadoCarga>
    </Container>
  )
}
