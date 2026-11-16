import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import GrillaProductos from './GrillaProductos.jsx'
import { PRODUCTOS } from '../pruebas/datos.js'

describe('GrillaProductos', () => {
  it('renderiza una tarjeta por cada producto de la lista', () => {
    render(
      <MemoryRouter>
        <GrillaProductos productos={PRODUCTOS} onAgregar={vi.fn()} />
      </MemoryRouter>,
    )
    // Cada tarjeta tiene exactamente un botón de agregar / sin stock
    expect(screen.getAllByRole('button')).toHaveLength(PRODUCTOS.length)
    expect(screen.getByRole('heading', { name: 'Catan' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'PlayStation 5' })).toBeInTheDocument()
  })

  it('con la lista vacía muestra un mensaje en vez de la grilla', () => {
    render(
      <MemoryRouter>
        <GrillaProductos productos={[]} onAgregar={vi.fn()} />
      </MemoryRouter>,
    )
    expect(screen.getByText('No hay productos para mostrar.')).toBeInTheDocument()
    expect(screen.queryAllByRole('button')).toHaveLength(0)
  })
})
