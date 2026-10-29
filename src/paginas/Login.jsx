import { useState } from 'react'
import { Container, Form, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router'
import CampoFormulario from '../componentes/CampoFormulario.jsx'
import { iniciarSesion } from '../datos/usuarios.js'

// login. si el correo y la clave calzan le avisa a App con onIniciarSesion(usuario)
export default function Login({ onIniciarSesion }) {
  const navegar = useNavigate()
  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function enviar(e) {
    e.preventDefault()

    if (!correo.trim() || !password) {
      setError('Ingresa tu correo y contraseña.')
      return
    }

    const usuario = iniciarSesion(correo, password)
    if (!usuario) {
      setError('Correo o contraseña incorrectos.')
      return
    }

    setError('')
    onIniciarSesion(usuario)
    navegar('/')
  }

  return (
    <Container className="py-4" style={{ maxWidth: 480 }}>
      <h1 className="section-title">Iniciar sesión</h1>

      {/* el error solo se muestra si hay */}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form noValidate onSubmit={enviar}>
        <CampoFormulario id="correo" label="Correo electrónico">
          <Form.Control type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        </CampoFormulario>
        <CampoFormulario id="password" label="Contraseña">
          <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </CampoFormulario>
        <Button type="submit" variant="primary" className="w-100">Entrar</Button>
      </Form>

      <p className="text-secondary mt-3 mb-0">
        ¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link>
      </p>
    </Container>
  )
}
