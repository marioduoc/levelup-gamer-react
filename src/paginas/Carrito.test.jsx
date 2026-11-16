import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Carrito from './Carrito.jsx'
import { renderizarConSesion } from '../pruebas/renderizar.jsx'

const CARRITO = [
  { codigo: 'JM001', nombre: 'Catan', precio: 29990, imagen: '/img/JM001.jpg', stock: 25, cantidad: 2 },
  { codigo: 'MS001', nombre: 'Mouse', precio: 49990, imagen: '/img/MS001.jpg', stock: 2, cantidad: 2 },
]

function renderizar(props = {}, usuario = null) {
  const espias = {
    onCambiarCantidad: vi.fn(),
    onQuitar: vi.fn(),
    onVaciar: vi.fn(),
  }
  renderizarConSesion(<Carrito carrito={CARRITO} {...espias} {...props} />, { usuario })
  return espias
}

describe('Carrito', () => {
  it('con el carrito vacío muestra el mensaje y el enlace al catálogo', () => {
    renderizar({ carrito: [] })
    expect(screen.getByRole('heading', { name: 'Tu carrito está vacío' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ver catálogo' })).toHaveAttribute('href', '/productos')
  })

  it('muestra una fila por item con su subtotal', () => {
    renderizar()
    expect(screen.getByText('Catan')).toBeInTheDocument()
    expect(screen.getByText('$59.980 CLP')).toBeInTheDocument() // 29990 x 2
    expect(screen.getByTestId('cantidad-JM001')).toHaveTextContent('2')
  })

  it('los botones + y − llaman a onCambiarCantidad con la nueva cantidad', async () => {
    const usuario = userEvent.setup()
    const espias = renderizar()

    await usuario.click(screen.getByRole('button', { name: 'Agregar una unidad de Catan' }))
    expect(espias.onCambiarCantidad).toHaveBeenCalledWith('JM001', 3)

    await usuario.click(screen.getByRole('button', { name: 'Quitar una unidad de Catan' }))
    expect(espias.onCambiarCantidad).toHaveBeenCalledWith('JM001', 1)
  })

  it('el botón + se deshabilita cuando se llega al stock', () => {
    renderizar()
    expect(screen.getByRole('button', { name: 'Agregar una unidad de Mouse' })).toBeDisabled()
  })

  it('eliminar y vaciar llaman a sus funciones', async () => {
    const usuario = userEvent.setup()
    const espias = renderizar()

    await usuario.click(screen.getByRole('button', { name: 'Eliminar Mouse' }))
    expect(espias.onQuitar).toHaveBeenCalledWith('MS001')

    await usuario.click(screen.getByRole('button', { name: 'Vaciar carrito' }))
    expect(espias.onVaciar).toHaveBeenCalledTimes(1)
  })

  it('aplica el descuento Duoc cuando la cuenta tiene correo Duoc', () => {
    renderizar({}, { nombre: 'Ana', correo: 'ana@duoc.cl', rol: 'CLIENTE' })
    expect(screen.getByText('Descuento Duoc (20%)')).toBeInTheDocument()
    expect(screen.queryByText(/te pediremos iniciar sesión/)).not.toBeInTheDocument()
  })

  it('sin sesión avisa que al pagar se pedirá iniciar sesión', () => {
    renderizar()
    expect(screen.getByText(/te pediremos iniciar sesión/)).toBeInTheDocument()
    expect(screen.queryByText('Descuento Duoc (20%)')).not.toBeInTheDocument()
  })
})
