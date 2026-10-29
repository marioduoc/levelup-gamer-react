import { Form } from 'react-bootstrap'

// Campo de formulario genérico con su etiqueta y mensaje de error.
// Si "error" viene vacío, no se muestra nada en rojo.
export default function CampoFormulario({ id, label, error, children }) {
  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label>{label}</Form.Label>
      {children}
      {error && <div className="text-danger small mt-1">{error}</div>}
    </Form.Group>
  )
}
