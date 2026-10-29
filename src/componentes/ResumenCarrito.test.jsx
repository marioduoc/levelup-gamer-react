import { render, screen } from '@testing-library/react'
import ResumenCarrito from './ResumenCarrito.jsx'

const CARRITO = [
  { codigo: 'A', precio: 10000, cantidad: 2 },
  { codigo: 'B', precio: 5000, cantidad: 1 },
]

describe('ResumenCarrito', () => {
  it('muestra subtotal y total sin descuento para un correo normal', () => {
    render(<ResumenCarrito carrito={CARRITO} correo="ana@gmail.com" />)
    expect(screen.getAllByText('$25.000 CLP')).toHaveLength(2) // subtotal y total iguales
    expect(screen.queryByText(/Descuento Duoc/)).not.toBeInTheDocument()
  })

  it('muestra la línea de descuento solo cuando el correo es Duoc', () => {
    render(<ResumenCarrito carrito={CARRITO} correo="ana@duoc.cl" />)
    expect(screen.getByText('Descuento Duoc (20%)')).toBeInTheDocument()
    expect(screen.getByText('- $5.000 CLP')).toBeInTheDocument()
    expect(screen.getByText('$20.000 CLP')).toBeInTheDocument()
  })

  it('con el carrito vacío todo queda en $0', () => {
    render(<ResumenCarrito carrito={[]} />)
    expect(screen.getAllByText('$0 CLP')).toHaveLength(2)
  })
})
