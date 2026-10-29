import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Contacto from './Contacto.jsx'

describe('Contacto (formulario controlado)', () => {
  it('el contador de caracteres cambia a medida que se escribe (estado)', async () => {
    const usuario = userEvent.setup()
    render(<Contacto />)

    expect(screen.getByText('0/500')).toBeInTheDocument()
    await usuario.type(screen.getByLabelText('Comentario'), 'Hola')
    expect(screen.getByText('4/500')).toBeInTheDocument()
    expect(screen.getByLabelText('Comentario')).toHaveValue('Hola')
  })

  it('los mensajes de error aparecen solo después de enviar con datos inválidos', async () => {
    const usuario = userEvent.setup()
    render(<Contacto />)

    expect(screen.queryByText(/requerido/)).not.toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(screen.getByText('El nombre es requerido (máx. 100 caracteres).')).toBeInTheDocument()
    expect(screen.getByText('Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.')).toBeInTheDocument()
    expect(screen.getByText('Selecciona un motivo.')).toBeInTheDocument()
    expect(screen.getByText('El comentario es requerido (máx. 500 caracteres).')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('con datos válidos muestra el mensaje de éxito y limpia el formulario', async () => {
    const usuario = userEvent.setup()
    render(<Contacto />)

    await usuario.type(screen.getByLabelText('Nombre'), 'Ana')
    await usuario.type(screen.getByLabelText('Correo electrónico'), 'ana@gmail.com')
    await usuario.selectOptions(screen.getByLabelText('Motivo'), 'producto')
    await usuario.type(screen.getByLabelText('Comentario'), '¿Tienen stock de la PS5?')
    await usuario.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(screen.getByRole('alert')).toHaveTextContent('¡Mensaje enviado!')
    expect(screen.getByLabelText('Nombre')).toHaveValue('')
    expect(screen.getByLabelText('Comentario')).toHaveValue('')
  })
})
