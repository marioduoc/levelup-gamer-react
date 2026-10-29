import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap'
import { NavLink, Link } from 'react-router'

// barra de arriba. recibe todo por props (items del carrito, sesión y cerrar sesión)
export default function BarraNavegacion({ cantidadCarrito, sesion, onCerrarSesion }) {
  return (
    <Navbar expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="logo">
          LEVEL<span>UP</span> GAMER
        </Navbar.Brand>

        {/* en celular el menú se mete detrás de este botón */}
        <Navbar.Toggle aria-controls="menu-principal" />

        <Navbar.Collapse id="menu-principal">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
            <Nav.Link as={NavLink} to="/productos">Productos</Nav.Link>
            <Nav.Link as={NavLink} to="/categorias">Categorías</Nav.Link>
            <Nav.Link as={NavLink} to="/ofertas">Ofertas</Nav.Link>
            <Nav.Link as={NavLink} to="/nosotros">Nosotros</Nav.Link>
            <Nav.Link as={NavLink} to="/blog">Blog</Nav.Link>
            <Nav.Link as={NavLink} to="/contacto">Contacto</Nav.Link>
          </Nav>

          <Nav className="align-items-lg-center gap-2">
            {sesion ? (
              <>
                <span className="text-secondary small">Hola, {sesion.nombre}</span>
                <Button variant="outline-primary" size="sm" onClick={onCerrarSesion}>
                  Cerrar sesión
                </Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" variant="outline-primary" size="sm">
                  Iniciar sesión
                </Button>
                <Button as={Link} to="/registro" variant="primary" size="sm">
                  Crear cuenta
                </Button>
              </>
            )}

            <Nav.Link as={Link} to="/carrito" aria-label="Ver carrito">
              🛒 <Badge pill className="cart-count" data-testid="contador-carrito">{cantidadCarrito}</Badge>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
