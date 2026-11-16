// Pruebas de componente: renderizado, props y eventos.
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import TarjetaProducto from './TarjetaProducto.jsx'

const CATAN = {
  codigo: 'JM001',
  categoria: 'Juegos de Mesa',
  nombre: 'Catan',
  precio: 29990,
  oferta: 0,
  precioFinal: 29990,
  stock: 25,
  stockCritico: 5,
  imagen: '/img/JM001.jpg',
}

// La tarjeta tiene <Link>, así que necesita un router alrededor.
function renderizar(producto, onAgregar = vi.fn()) {
  return render(
    <MemoryRouter>
      <TarjetaProducto producto={producto} onAgregar={onAgregar} />
    </MemoryRouter>,
  )
}

describe('TarjetaProducto', () => {
  it('muestra el nombre, la categoría y el precio formateado (props)', () => {
    renderizar(CATAN)
    expect(screen.getByRole('heading', { name: 'Catan' })).toBeInTheDocument()
    expect(screen.getByText('Juegos de Mesa')).toBeInTheDocument()
    expect(screen.getByText('$29.990 CLP')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Catan' })).toHaveAttribute('src', '/img/JM001.jpg')
  })

  it('al hacer clic en "Añadir al carrito" llama a onAgregar con el producto (evento)', async () => {
    const usuario = userEvent.setup()
    const alAgregar = vi.fn() // espía
    renderizar(CATAN, alAgregar)

    await usuario.click(screen.getByRole('button', { name: 'Añadir al carrito' }))

    expect(alAgregar).toHaveBeenCalledTimes(1)
    expect(alAgregar).toHaveBeenCalledWith(CATAN)
  })

  it('sin stock el botón se deshabilita y aparece "Agotado" (renderizado condicional)', () => {
    renderizar({ ...CATAN, stock: 0 })
    expect(screen.getByRole('button', { name: 'Sin stock' })).toBeDisabled()
    expect(screen.getByText('Agotado')).toBeInTheDocument()
    expect(screen.queryByText('¡Últimas unidades!')).not.toBeInTheDocument()
  })

  it('con stock bajo el crítico muestra "¡Últimas unidades!"', () => {
    renderizar({ ...CATAN, stock: 3 })
    expect(screen.getByText('¡Últimas unidades!')).toBeInTheDocument()
    expect(screen.queryByText('Agotado')).not.toBeInTheDocument()
  })

  it('con oferta muestra el precio antiguo tachado y el nuevo', () => {
    renderizar({ ...CATAN, oferta: 20, precioFinal: 23992 })
    expect(screen.getByText('-20%')).toBeInTheDocument()
    expect(screen.getByText('$29.990 CLP')).toHaveClass('price-old')
    expect(screen.getByText('$23.992 CLP')).toHaveClass('price')
  })

  it('sin onAgregar (ej: vendedor) no muestra el botón de compra', () => {
    render(
      <MemoryRouter>
        <TarjetaProducto producto={CATAN} onAgregar={null} />
      </MemoryRouter>,
    )
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
