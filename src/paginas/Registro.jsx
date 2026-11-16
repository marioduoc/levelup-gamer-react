import { useState } from 'react'
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router'
import CampoFormulario from '../componentes/CampoFormulario.jsx'
import { regiones, comunasDe } from '../datos/regiones.js'
import { registrar } from '../api/authApi.js'
import { erroresDeCampos, mensajeError } from '../api/cliente.js'
import { validarRegistro } from '../utils/validaciones.js'

const DATOS_INICIALES = {
  run: '',
  nombre: '',
  apellidos: '',
  correo: '',
  password: '',
  fechaNacimiento: '',
  region: '',
  comuna: '',
  direccion: '',
  codigoReferido: '',
}

export default function Registro() {
  const navegar = useNavigate()
  const [datos, setDatos] = useState(DATOS_INICIALES)
  const [errores, setErrores] = useState({})
  const [mensaje, setMensaje] = useState(null)

  function cambiar(e) {
    const { name, value } = e.target
    setDatos((anterior) => {
      const nuevo = { ...anterior, [name]: value }
      if (name === 'region') nuevo.comuna = ''
      return nuevo
    })
  }

  async function enviar(e) {
    e.preventDefault()
    const erroresEncontrados = validarRegistro(datos)
    setErrores(erroresEncontrados)
    if (Object.keys(erroresEncontrados).length > 0) {
      setMensaje({ tipo: 'danger', texto: 'Revisa los campos marcados en rojo.' })
      return
    }

    // el código de referido es solo visual, el backend no lo recibe
    const { codigoReferido: _referido, ...paraEnviar } = datos
    try {
      await registrar(paraEnviar)
    } catch (error) {
      setErrores(erroresDeCampos(error))
      setMensaje({ tipo: 'danger', texto: mensajeError(error, 'No se pudo crear la cuenta.') })
      return
    }

    setMensaje({ tipo: 'success', texto: '¡Cuenta creada con éxito! Ahora puedes iniciar sesión.' })
    setTimeout(() => navegar('/login'), 1500)
  }

  return (
    <Container className="py-4" style={{ maxWidth: 720 }}>
      <h1 className="section-title">Crear cuenta</h1>

      {mensaje && <Alert variant={mensaje.tipo}>{mensaje.texto}</Alert>}

      <Form noValidate onSubmit={enviar}>
        <CampoFormulario id="run" label="RUN (sin puntos ni guión, ej: 123456785)" error={errores.run}>
          <Form.Control name="run" maxLength={9} value={datos.run} onChange={cambiar} isInvalid={!!errores.run} />
        </CampoFormulario>

        <Row>
          <Col md={6}>
            <CampoFormulario id="nombre" label="Nombre" error={errores.nombre}>
              <Form.Control name="nombre" maxLength={50} value={datos.nombre} onChange={cambiar} isInvalid={!!errores.nombre} />
            </CampoFormulario>
          </Col>
          <Col md={6}>
            <CampoFormulario id="apellidos" label="Apellidos" error={errores.apellidos}>
              <Form.Control name="apellidos" maxLength={100} value={datos.apellidos} onChange={cambiar} isInvalid={!!errores.apellidos} />
            </CampoFormulario>
          </Col>
        </Row>

        <CampoFormulario id="correo" label="Correo electrónico" error={errores.correo}>
          <Form.Control type="email" name="correo" maxLength={100} value={datos.correo} onChange={cambiar} isInvalid={!!errores.correo} />
        </CampoFormulario>

        <Row>
          <Col md={6}>
            <CampoFormulario id="password" label="Contraseña (4 a 10 caracteres)" error={errores.password}>
              <Form.Control type="password" name="password" maxLength={10} value={datos.password} onChange={cambiar} isInvalid={!!errores.password} />
            </CampoFormulario>
          </Col>
          <Col md={6}>
            <CampoFormulario id="fechaNacimiento" label="Fecha de nacimiento" error={errores.fechaNacimiento}>
              <Form.Control type="date" name="fechaNacimiento" value={datos.fechaNacimiento} onChange={cambiar} isInvalid={!!errores.fechaNacimiento} />
            </CampoFormulario>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <CampoFormulario id="region" label="Región" error={errores.region}>
              <Form.Select name="region" value={datos.region} onChange={cambiar} isInvalid={!!errores.region}>
                <option value="">Selecciona una región</option>
                {regiones.map((r) => (
                  <option key={r.nombre} value={r.nombre}>{r.nombre}</option>
                ))}
              </Form.Select>
            </CampoFormulario>
          </Col>
          <Col md={6}>
            <CampoFormulario id="comuna" label="Comuna" error={errores.comuna}>
              <Form.Select name="comuna" value={datos.comuna} onChange={cambiar} isInvalid={!!errores.comuna} disabled={!datos.region}>
                <option value="">{datos.region ? 'Selecciona una comuna' : 'Primero selecciona una región'}</option>
                {comunasDe(datos.region).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </Form.Select>
            </CampoFormulario>
          </Col>
        </Row>

        <CampoFormulario id="direccion" label="Dirección" error={errores.direccion}>
          <Form.Control name="direccion" maxLength={300} value={datos.direccion} onChange={cambiar} isInvalid={!!errores.direccion} />
        </CampoFormulario>

        <CampoFormulario id="codigoReferido" label="Código de referido (opcional)">
          <Form.Control name="codigoReferido" value={datos.codigoReferido} onChange={cambiar} />
        </CampoFormulario>

        <Button type="submit" variant="primary" className="w-100">Registrarme</Button>
      </Form>
    </Container>
  )
}
