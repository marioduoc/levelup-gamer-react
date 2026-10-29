import { Container, Alert } from 'react-bootstrap'
import { Link, useParams } from 'react-router'
import { buscarArticulo, formatearFecha } from '../datos/blog.js'

export default function DetalleBlog() {
  const { id } = useParams()
  const articulo = buscarArticulo(id)

  if (!articulo) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          Artículo no encontrado. <Link to="/blog">Volver al blog</Link>.
        </Alert>
      </Container>
    )
  }

  return (
    <Container className="py-4" style={{ maxWidth: 760 }}>
      <small className="text-info">{articulo.categoria}</small>
      <h1>{articulo.titulo}</h1>
      <p className="text-secondary small">{formatearFecha(articulo.fecha)}</p>
      <p>{articulo.contenido}</p>
      <Link to="/blog">← Volver al blog</Link>
    </Container>
  )
}
