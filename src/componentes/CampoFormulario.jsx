import { Form } from 'react-bootstrap'

// campo de formulario reutilizable: label + lo que le pase dentro + el error en rojo
export default function CampoFormulario({ id, label, error, children }) {
  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label>{label}</Form.Label>
      {children}
      {error && <div className="text-danger small mt-1">{error}</div>}
    </Form.Group>
  )
}
