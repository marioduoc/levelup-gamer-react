import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import Registro from './Registro.jsx'
import { obtenerUsuarios, registrarUsuario } from '../datos/usuarios.js'

beforeEach(() => localStorage.clear())

function renderizar() {
  render(
    <MemoryRouter>
      <Registro />
    </MemoryRouter>,
  )
}

async function completarFormularioValido(usuario) {
  await usuario.type(screen.getByLabelText(/RUN/), '123456785')
  await usuario.type(screen.getByLabelText('Nombre'), 'Ana')
  await usuario.type(screen.getByLabelText('Apellidos'), 'Pérez')
  await usuario.type(screen.getByLabelText('Correo electrónico'), 'ana@duoc.cl')
  await usuario.type(screen.getByLabelText(/Contraseña/), '1234')
  await usuario.type(screen.getByLabelText('Fecha de nacimiento'), '1990-05-10')
  await usuario.selectOptions(screen.getByLabelText('Región'), 'Maule')
  await usuario.selectOptions(screen.getByLabelText('Comuna'), 'Talca')
  await usuario.type(screen.getByLabelText('Dirección'), 'Calle 123')
}

describe('Registro', () => {
  it('el selector de comuna está deshabilitado hasta elegir una región', async () => {
    const usuario = userEvent.setup()
    renderizar()

    expect(screen.getByLabelText('Comuna')).toBeDisabled()
    await usuario.selectOptions(screen.getByLabelText('Región'), 'Maule')
    expect(screen.getByLabelText('Comuna')).toBeEnabled()
    expect(screen.getByRole('option', { name: 'Talca' })).toBeInTheDocument()
  })

  it('al enviar vacío muestra los errores y no registra nada', async () => {
    const usuario = userEvent.setup()
    renderizar()

    await usuario.click(screen.getByRole('button', { name: 'Registrarme' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Revisa los campos marcados en rojo.')
    expect(screen.getByText(/RUN inválido/)).toBeInTheDocument()
    expect(obtenerUsuarios()).toHaveLength(0)
  })

  it('con datos válidos registra al usuario y muestra el mensaje de éxito', async () => {
    const usuario = userEvent.setup()
    renderizar()

    await completarFormularioValido(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Registrarme' }))

    expect(screen.getByRole('alert')).toHaveTextContent('¡Cuenta creada con éxito!')
    expect(obtenerUsuarios()).toHaveLength(1)
    expect(obtenerUsuarios()[0].correo).toBe('ana@duoc.cl')
  })

  it('avisa si el correo ya está registrado', async () => {
    registrarUsuario({ run: '111111111', nombre: 'Otro', correo: 'ana@duoc.cl', password: '1234' })
    const usuario = userEvent.setup()
    renderizar()

    await completarFormularioValido(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Registrarme' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Ya existe un usuario registrado con ese correo.')
    expect(obtenerUsuarios()).toHaveLength(1)
  })
})
