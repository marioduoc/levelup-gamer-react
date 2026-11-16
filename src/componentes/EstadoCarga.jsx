import { Alert, Button, Spinner } from 'react-bootstrap'

// muestra spinner mientras carga, el error si falló, o el contenido
export default function EstadoCarga({ cargando, error, onReintentar, children }) {
  if (cargando) {
    return (
      <div className="py-5 text-center">
        <Spinner animation="border" role="status" aria-label="Cargando" />
      </div>
    )
  }
  if (error) {
    return (
      <Alert variant="danger">
        {error}
        {onReintentar && (
          <Button variant="outline-light" size="sm" className="ms-3" onClick={onReintentar}>
            Reintentar
          </Button>
        )}
      </Alert>
    )
  }
  return children
}
