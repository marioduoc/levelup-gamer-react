import { useState } from 'react'
import { Container, Form, Button, Alert } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router'
import CampoFormulario from '../componentes/CampoFormulario.jsx'
import { useAuth } from '../auth/contexto.js'
import { puede } from '../auth/permisos.js'
import { mensajeError } from '../api/cliente.js'

export default function Login() {
  const navegar = useNavigate()
  const ubicacion = useLocation()
  const { iniciarSesion } = useAuth()
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function enviar(e) {
    e.preventDefault()
    if (!correo.trim() || !password) {
      setError('Ingresa tu correo y contraseña.')
      return
    }

    setEnviando(true)
    try {
      const usuario = await iniciarSesion(correo.trim(), password)
      setError('')
      // vuelve a la página que pidió login; si no, admin y vendedor van al panel
      const destino = ubicacion.state?.desde ?? (puede(usuario, 'verPanel') ? '/admin' : '/')
      navegar(destino, { replace: true })
    } catch (err) {
      setError(mensajeError(err, 'No se pudo iniciar sesión.'))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Container className="py-4" style={{ maxWidth: 480 }}>
      <h1 className="section-title">Iniciar sesión</h1>

      {ubicacion.state?.desde && !error && (
        <Alert variant="info">Inicia sesión para continuar.</Alert>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form noValidate onSubmit={enviar}>
        <CampoFormulario id="correo" label="Correo electrónico">
          <Form.Control type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        </CampoFormulario>
        <CampoFormulario id="password" label="Contraseña">
          <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </CampoFormulario>
        <Button type="submit" variant="primary" className="w-100" disabled={enviando}>
          {enviando ? 'Entrando...' : 'Entrar'}
        </Button>
      </Form>

      <p className="text-secondary mt-3 mb-0">
        ¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link>
      </p>
    </Container>
  )
}
