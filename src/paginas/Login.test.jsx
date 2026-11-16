import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router'
import Login from './Login.jsx'
import { AuthContext } from '../auth/contexto.js'
import { USUARIOS } from '../pruebas/datos.js'

function renderizar(entrada = '/login') {
  const auth = { usuario: null, verificando: false, iniciarSesion: vi.fn(), cerrarSesion: vi.fn(), puede: () => false }
  render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={[entrada]}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<p>inicio</p>} />
          <Route path="/admin" element={<p>panel</p>} />
          <Route path="/checkout" element={<p>checkout</p>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
  return auth
}

async function escribirCredenciales(usuario, correo, clave) {
  await usuario.type(screen.getByLabelText('Correo electrónico'), correo)
  await usuario.type(screen.getByLabelText('Contraseña'), clave)
  await usuario.click(screen.getByRole('button', { name: 'Entrar' }))
}

describe('Login', () => {
  it('al principio no muestra ningún error', () => {
    renderizar()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('si se envía vacío muestra un error y no llama a la API', async () => {
    const usuario = userEvent.setup()
    const auth = renderizar()

    await usuario.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Ingresa tu correo y contraseña.')
    expect(auth.iniciarSesion).not.toHaveBeenCalled()
  })

  it('muestra el mensaje del backend con credenciales incorrectas', async () => {
    const usuario = userEvent.setup()
    const auth = renderizar()
    auth.iniciarSesion.mockRejectedValue({
      response: { status: 401, data: { mensaje: 'Correo o contraseña incorrectos.' } },
    })

    await escribirCredenciales(usuario, 'ana@duoc.cl', 'mala')

    expect(await screen.findByRole('alert')).toHaveTextContent('Correo o contraseña incorrectos.')
  })

  it('un cliente entra y vuelve al inicio', async () => {
    const usuario = userEvent.setup()
    const auth = renderizar()
    auth.iniciarSesion.mockResolvedValue(USUARIOS.cliente)

    await escribirCredenciales(usuario, 'cliente@gmail.com', 'Cliente123!')

    expect(auth.iniciarSesion).toHaveBeenCalledWith('cliente@gmail.com', 'Cliente123!')
    expect(await screen.findByText('inicio')).toBeInTheDocument()
  })

  it('admin y vendedor van directo al panel', async () => {
    const usuario = userEvent.setup()
    const auth = renderizar()
    auth.iniciarSesion.mockResolvedValue(USUARIOS.vendedor)

    await escribirCredenciales(usuario, 'vendedor@duoc.cl', 'Vendedor123!')

    expect(await screen.findByText('panel')).toBeInTheDocument()
  })

  it('si venía de una ruta protegida vuelve a ella', async () => {
    const usuario = userEvent.setup()
    const auth = renderizar({ pathname: '/login', state: { desde: '/checkout' } })
    auth.iniciarSesion.mockResolvedValue(USUARIOS.cliente)

    expect(screen.getByRole('alert')).toHaveTextContent('Inicia sesión para continuar.')
    await escribirCredenciales(usuario, 'cliente@gmail.com', 'Cliente123!')

    expect(await screen.findByText('checkout')).toBeInTheDocument()
  })
})
