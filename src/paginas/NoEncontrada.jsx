import { Container, Button } from 'react-bootstrap'
import { Link, useLocation } from 'react-router'

// página 404 (ruta *). muestra la url que se intentó abrir
export default function NoEncontrada() {
  const ubicacion = useLocation()

  return (
    <Container className="py-5 text-center">
      <h1 className="display-4">404</h1>
      <p className="text-secondary">
        No encontramos nada en <code>{ubicacion.pathname}</code>
      </p>
      <Button as={Link} to="/" variant="primary">Volver al inicio</Button>
    </Container>
  )
}
