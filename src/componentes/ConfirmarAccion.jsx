import { Modal, Button } from 'react-bootstrap'

export default function ConfirmarAccion({ mostrar, titulo, mensaje, textoConfirmar = 'Confirmar', onConfirmar, onCancelar }) {
  return (
    <Modal show={mostrar} onHide={onCancelar} centered>
      <Modal.Header closeButton>
        <Modal.Title as="h2" className="h5">{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{mensaje}</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={onCancelar}>Cancelar</Button>
        <Button variant="danger" onClick={onConfirmar}>{textoConfirmar}</Button>
      </Modal.Footer>
    </Modal>
  )
}
