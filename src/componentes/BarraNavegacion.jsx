import { startTransition } from 'react'
import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap'
import { NavLink, Link, useNavigate } from 'react-router'
import { useAuth } from '../auth/contexto.js'
import { puedeUsarCarrito } from '../auth/permisos.js'

// los enlaces se arman según el rol: el vendedor no ve el carrito y solo admin/vendedor ven el panel
export default function BarraNavegacion({ cantidadCarrito }) {
  const { usuario, puede, cerrarSesion } = useAuth()
  const navegar = useNavigate()

  // navegar y borrar la sesión en la misma transición; si no, una ruta protegida alcanza a mandar al login
  function salir() {
    startTransition(() => {
      navegar('/', { replace: true })
      cerrarSesion()
    })
  }

  return (
    <Navbar expand="lg" sticky="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="logo">
          LEVEL<span>UP</span> GAMER
        </Navbar.Brand>

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
            {puede('verPanel') && <Nav.Link as={NavLink} to="/admin">Panel</Nav.Link>}
          </Nav>

          <Nav className="align-items-lg-center gap-2">
            {usuario ? (
              <>
                <span className="text-secondary small">
                  Hola, {usuario.nombre} <Badge bg="dark" className="border">{usuario.rol}</Badge>
                </span>
                {puede('comprar') && (
                  <Nav.Link as={NavLink} to="/mis-compras">Mis compras</Nav.Link>
                )}
                <Button variant="outline-primary" size="sm" onClick={salir}>
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

            {puedeUsarCarrito(usuario) && (
              <Nav.Link as={Link} to="/carrito" aria-label="Ver carrito">
                🛒 <Badge pill className="cart-count" data-testid="contador-carrito">{cantidadCarrito}</Badge>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
