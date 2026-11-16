import { useEffect, useState } from 'react'
import { Form, Row, Col, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router'
import CampoFormulario from '../../componentes/CampoFormulario.jsx'
import EstadoCarga from '../../componentes/EstadoCarga.jsx'
import { crearUsuario, actualizarUsuario, obtenerUsuario } from '../../api/usuariosApi.js'
import { erroresDeCampos, mensajeError } from '../../api/cliente.js'
import { regiones, comunasDe } from '../../datos/regiones.js'

const VACIO = {
  run: '', nombre: '', apellidos: '', correo: '', password: '', rol: 'CLIENTE',
  fechaNacimiento: '', region: '', comuna: '', direccion: '', activo: true,
}

export default function FormUsuario() {
  const { id } = useParams()
  const editando = !!id
  const navegar = useNavigate()
  const [datos, setDatos] = useState(VACIO)
  const [cargando, setCargando] = useState(editando)
  const [errores, setErrores] = useState({})
  const [error, setError] = useState('')

  useEffect(() => {
    if (!editando) return
    obtenerUsuario(id)
      .then((u) => setDatos({ ...VACIO, ...u, password: '', fechaNacimiento: u.fechaNacimiento ?? '', region: u.region ?? '', comuna: u.comuna ?? '', direccion: u.direccion ?? '' }))
      .catch((err) => setError(mensajeError(err)))
      .finally(() => setCargando(false))
  }, [id, editando])

  function cambiar(e) {
    const { name, value, type, checked } = e.target
    setDatos((anterior) => {
      const nuevo = { ...anterior, [name]: type === 'checkbox' ? checked : value }
      if (name === 'region') nuevo.comuna = ''
      return nuevo
    })
  }

  async function guardar(e) {
    e.preventDefault()
    // campos vacíos van como null; password vacío al editar = no se cambia
    const cuerpo = Object.fromEntries(Object.entries(datos).map(([k, v]) => [k, v === '' ? null : v]))
    try {
      if (editando) await actualizarUsuario(id, cuerpo)
      else await crearUsuario(cuerpo)
      navegar('/admin/usuarios')
    } catch (err) {
      setErrores(erroresDeCampos(err))
      setError(mensajeError(err, 'No se pudo guardar el usuario.'))
    }
  }

  return (
    <>
      <h1 className="h3">{editando ? 'Editar usuario' : 'Nuevo usuario'}</h1>
      {error && <Alert variant="danger">{error}</Alert>}

      <EstadoCarga cargando={cargando}>
        <Form noValidate onSubmit={guardar}>
          <Row>
            <Col md={4}>
              <CampoFormulario id="run" label="RUN *" error={errores.run}>
                <Form.Control name="run" maxLength={9} value={datos.run} onChange={cambiar} isInvalid={!!errores.run} placeholder="123456785" />
              </CampoFormulario>
            </Col>
            <Col md={4}>
              <CampoFormulario id="nombre" label="Nombre *" error={errores.nombre}>
                <Form.Control name="nombre" value={datos.nombre} onChange={cambiar} isInvalid={!!errores.nombre} />
              </CampoFormulario>
            </Col>
            <Col md={4}>
              <CampoFormulario id="apellidos" label="Apellidos *" error={errores.apellidos}>
                <Form.Control name="apellidos" value={datos.apellidos} onChange={cambiar} isInvalid={!!errores.apellidos} />
              </CampoFormulario>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <CampoFormulario id="correo" label="Correo *" error={errores.correo}>
                <Form.Control type="email" name="correo" value={datos.correo} onChange={cambiar} isInvalid={!!errores.correo} />
              </CampoFormulario>
            </Col>
            <Col md={6}>
              <CampoFormulario id="password" label={editando ? 'Contraseña (vacío = no cambiar)' : 'Contraseña *'} error={errores.password}>
                <Form.Control type="password" name="password" value={datos.password} onChange={cambiar} isInvalid={!!errores.password} />
              </CampoFormulario>
            </Col>
          </Row>
          <Row>
            <Col md={4}>
              <CampoFormulario id="rol" label="Rol *" error={errores.rol}>
                <Form.Select name="rol" value={datos.rol} onChange={cambiar}>
                  <option value="CLIENTE">CLIENTE</option>
                  <option value="VENDEDOR">VENDEDOR</option>
                  <option value="ADMIN">ADMIN</option>
                </Form.Select>
              </CampoFormulario>
            </Col>
            <Col md={4}>
              <CampoFormulario id="fechaNacimiento" label="Fecha de nacimiento" error={errores.fechaNacimiento}>
                <Form.Control type="date" name="fechaNacimiento" value={datos.fechaNacimiento} onChange={cambiar} isInvalid={!!errores.fechaNacimiento} />
              </CampoFormulario>
            </Col>
            <Col md={4} className="d-flex align-items-center">
              <Form.Check id="activo" name="activo" label="Cuenta activa" checked={datos.activo} onChange={cambiar} />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <CampoFormulario id="region" label="Región">
                <Form.Select name="region" value={datos.region} onChange={cambiar}>
                  <option value="">Selecciona una región</option>
                  {regiones.map((r) => <option key={r.nombre} value={r.nombre}>{r.nombre}</option>)}
                </Form.Select>
              </CampoFormulario>
            </Col>
            <Col md={6}>
              <CampoFormulario id="comuna" label="Comuna">
                <Form.Select name="comuna" value={datos.comuna} onChange={cambiar} disabled={!datos.region}>
                  <option value="">Selecciona una comuna</option>
                  {comunasDe(datos.region).map((c) => <option key={c} value={c}>{c}</option>)}
                </Form.Select>
              </CampoFormulario>
            </Col>
          </Row>
          <CampoFormulario id="direccion" label="Dirección" error={errores.direccion}>
            <Form.Control name="direccion" value={datos.direccion} onChange={cambiar} isInvalid={!!errores.direccion} />
          </CampoFormulario>
          <div className="d-flex gap-2">
            <Button type="submit">Guardar</Button>
            <Button as={Link} to="/admin/usuarios" variant="outline-secondary">Cancelar</Button>
          </div>
        </Form>
      </EstadoCarga>
    </>
  )
}
