import { Navigate, Outlet, useLocation } from 'react-router'
import { Container, Spinner } from 'react-bootstrap'
import { useAuth } from './contexto.js'

// sin sesión -> login (y vuelve aquí después); con sesión pero sin permiso -> /sin-permiso
export default function RutaProtegida({ permiso, children }) {
  const { usuario, verificando, puede } = useAuth()
  const ubicacion = useLocation()

  if (verificando) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" aria-label="Verificando sesión" />
      </Container>
    )
  }

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />
  }

  if (permiso && !puede(permiso)) {
    return <Navigate to="/sin-permiso" replace />
  }

  return children ?? <Outlet />
}
