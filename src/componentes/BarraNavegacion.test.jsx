import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import BarraNavegacion from './BarraNavegacion.jsx'

function renderizar(props) {
  return render(
    <MemoryRouter>
      <BarraNavegacion cantidadCarrito={0} sesion={null} onCerrarSesion={vi.fn()} {...props} />
    </MemoryRouter>,
  )
}

describe('BarraNavegacion', () => {
  it('muestra la cantidad de items del carrito que recibe por props', () => {
    renderizar({ cantidadCarrito: 7 })
    expect(screen.getByTestId('contador-carrito')).toHaveTextContent('7')
  })

  it('sin sesión muestra "Iniciar sesión" y "Crear cuenta"', () => {
    renderizar()
    // Button de react-bootstrap renderizado como <Link> queda con role="button" y href
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toHaveAttribute('href', '/login')
    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toHaveAttribute('href', '/registro')
    expect(screen.queryByText(/Hola,/)).not.toBeInTheDocument()
  })

  it('con sesión saluda al usuario y el botón "Cerrar sesión" llama a onCerrarSesion', async () => {
    const usuario = userEvent.setup()
    const alCerrar = vi.fn()
    renderizar({ sesion: { nombre: 'Ana' }, onCerrarSesion: alCerrar })

    expect(screen.getByText('Hola, Ana')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Iniciar sesión' })).not.toBeInTheDocument()

    await usuario.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    expect(alCerrar).toHaveBeenCalledTimes(1)
  })

  it('tiene los enlaces principales del sitio', () => {
    renderizar()
    for (const nombre of ['Home', 'Productos', 'Categorías', 'Ofertas', 'Nosotros', 'Blog', 'Contacto']) {
      expect(screen.getByRole('link', { name: nombre })).toBeInTheDocument()
    }
  })
})
