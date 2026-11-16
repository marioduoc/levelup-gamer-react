import { Container, Button } from 'react-bootstrap'
import { Link } from 'react-router'

export default function SinPermiso() {
  return (
    <Container className="py-5 text-center">
      <h1 className="h3">Acceso restringido</h1>
      <p className="text-secondary">Tu cuenta no tiene permisos para ver esta sección.</p>
      <Button as={Link} to="/" variant="primary">Volver al inicio</Button>
    </Container>
  )
}
