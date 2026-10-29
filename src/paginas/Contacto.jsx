import { useState } from 'react'
import { Container, Form, Button, Alert } from 'react-bootstrap'
import CampoFormulario from '../componentes/CampoFormulario.jsx'
import { validarContacto } from '../utils/validaciones.js'

const DATOS_INICIALES = { nombre: '', correo: '', asunto: '', comentario: '' }

export default function Contacto() {
  const [datos, setDatos] = useState(DATOS_INICIALES)
  const [errores, setErrores] = useState({})
  const [enviado, setEnviado] = useState(false)

  function cambiar(e) {
    const { name, value } = e.target
    setDatos({ ...datos, [name]: value })
  }

  function enviar(e) {
    e.preventDefault()
    const erroresEncontrados = validarContacto(datos)
    setErrores(erroresEncontrados)
    if (Object.keys(erroresEncontrados).length > 0) return

    setEnviado(true)
    setDatos(DATOS_INICIALES)
  }

  return (
    <Container className="py-4" style={{ maxWidth: 640 }}>
      <h1 className="section-title">Contacto</h1>

      {enviado && (
        <Alert variant="success" onClose={() => setEnviado(false)} dismissible>
          ¡Mensaje enviado! Te responderemos a la brevedad.
        </Alert>
      )}

      <Form noValidate onSubmit={enviar}>
        <CampoFormulario id="nombre" label="Nombre" error={errores.nombre}>
          <Form.Control name="nombre" maxLength={100} value={datos.nombre} onChange={cambiar} isInvalid={!!errores.nombre} />
        </CampoFormulario>

        <CampoFormulario id="correo" label="Correo electrónico" error={errores.correo}>
          <Form.Control type="email" name="correo" maxLength={100} value={datos.correo} onChange={cambiar} isInvalid={!!errores.correo} />
        </CampoFormulario>

        <CampoFormulario id="asunto" label="Motivo" error={errores.asunto}>
          <Form.Select name="asunto" value={datos.asunto} onChange={cambiar} isInvalid={!!errores.asunto}>
            <option value="">Selecciona un motivo</option>
            <option value="pedido">Consulta sobre un pedido</option>
            <option value="producto">Consulta sobre un producto</option>
            <option value="reclamo">Reclamo</option>
            <option value="otro">Otro</option>
          </Form.Select>
        </CampoFormulario>

        <CampoFormulario id="comentario" label="Comentario" error={errores.comentario}>
          <Form.Control as="textarea" rows={5} name="comentario" maxLength={500} value={datos.comentario} onChange={cambiar} isInvalid={!!errores.comentario} />
          <Form.Text className="text-secondary">{datos.comentario.length}/500</Form.Text>
        </CampoFormulario>

        <Button type="submit" variant="primary">Enviar mensaje</Button>
      </Form>
    </Container>
  )
}
