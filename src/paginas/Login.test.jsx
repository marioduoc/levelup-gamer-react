import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import Login from './Login.jsx'
import { registrarUsuario } from '../datos/usuarios.js'

beforeEach(() => {
  localStorage.clear()
  registrarUsuario({ run: '19011022K', nombre: 'Ana', correo: 'ana@duoc.cl', password: '1234' })
})

function renderizar(onIniciarSesion = vi.fn()) {
  render(
    <MemoryRouter>
      <Login onIniciarSesion={onIniciarSesion} />
    </MemoryRouter>,
  )
}

describe('Login', () => {
  it('al principio no muestra ningún error', () => {
    renderizar()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('el estado cambia cuando el usuario escribe en los campos', async () => {
    const usuario = userEvent.setup()
    renderizar()

    await usuario.type(screen.getByLabelText('Correo electrónico'), 'ana@duoc.cl')
    await usuario.type(screen.getByLabelText('Contraseña'), '1234')

    expect(screen.getByLabelText('Correo electrónico')).toHaveValue('ana@duoc.cl')
    expect(screen.getByLabelText('Contraseña')).toHaveValue('1234')
  })

  it('muestra un error si se envía vacío y NO llama a onIniciarSesion', async () => {
    const usuario = userEvent.setup()
    const alIniciar = vi.fn()
    renderizar(alIniciar)

    await usuario.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Ingresa tu correo y contraseña.')
    expect(alIniciar).not.toHaveBeenCalled()
  })

  it('muestra un error con credenciales incorrectas', async () => {
    const usuario = userEvent.setup()
    renderizar()

    await usuario.type(screen.getByLabelText('Correo electrónico'), 'ana@duoc.cl')
    await usuario.type(screen.getByLabelText('Contraseña'), 'mala')
    await usuario.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Correo o contraseña incorrectos.')
  })

  it('con credenciales correctas llama a onIniciarSesion con el usuario', async () => {
    const usuario = userEvent.setup()
    const alIniciar = vi.fn()
    renderizar(alIniciar)

    await usuario.type(screen.getByLabelText('Correo electrónico'), 'ana@duoc.cl')
    await usuario.type(screen.getByLabelText('Contraseña'), '1234')
    await usuario.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(alIniciar).toHaveBeenCalledTimes(1)
    expect(alIniciar.mock.calls[0][0].nombre).toBe('Ana')
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
