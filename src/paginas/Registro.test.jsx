import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import Registro from './Registro.jsx'
import { registrar } from '../api/authApi.js'

vi.mock('../api/authApi.js')

beforeEach(() => vi.clearAllMocks())

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
  })

  it('al enviar vacío valida en el navegador y no llama a la API', async () => {
    const usuario = userEvent.setup()
    renderizar()

    await usuario.click(screen.getByRole('button', { name: 'Registrarme' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Revisa los campos marcados en rojo.')
    expect(screen.getByText(/RUN inválido/)).toBeInTheDocument()
    expect(registrar).not.toHaveBeenCalled()
  })

  it('con datos válidos envía el registro a la API sin el código de referido', async () => {
    registrar.mockResolvedValue({ id: 9, rol: 'CLIENTE' })
    const usuario = userEvent.setup()
    renderizar()

    await completarFormularioValido(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Registrarme' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('¡Cuenta creada con éxito!')
    const enviado = registrar.mock.calls[0][0]
    expect(enviado.correo).toBe('ana@duoc.cl')
    expect(enviado).not.toHaveProperty('codigoReferido')
  })

  it('muestra el mensaje del backend si el correo ya existe', async () => {
    registrar.mockImplementation(() => Promise.reject({
      response: { status: 409, data: { mensaje: 'Ya existe un usuario registrado con ese correo.' } },
    }))
    const usuario = userEvent.setup()
    renderizar()

    await completarFormularioValido(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Registrarme' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Ya existe un usuario registrado con ese correo.')
  })

  it('marca los campos que el backend rechaza', async () => {
    registrar.mockImplementation(() => Promise.reject({
      response: { status: 400, data: { mensaje: 'Hay datos inválidos en la solicitud.', campos: { direccion: 'Dirección rechazada.' } } },
    }))
    const usuario = userEvent.setup()
    renderizar()

    await completarFormularioValido(usuario)
    await usuario.click(screen.getByRole('button', { name: 'Registrarme' }))

    expect(await screen.findByText('Dirección rechazada.')).toBeInTheDocument()
  })
})
