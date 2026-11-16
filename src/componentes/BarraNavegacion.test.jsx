import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BarraNavegacion from './BarraNavegacion.jsx'
import { renderizarConSesion } from '../pruebas/renderizar.jsx'
import { USUARIOS } from '../pruebas/datos.js'

function renderizar(usuario = null, cantidadCarrito = 0) {
  return renderizarConSesion(<BarraNavegacion cantidadCarrito={cantidadCarrito} />, { usuario })
}

describe('BarraNavegacion', () => {
  it('muestra la cantidad de items del carrito que recibe por props', () => {
    renderizar(null, 7)
    expect(screen.getByTestId('contador-carrito')).toHaveTextContent('7')
  })

  it('sin sesión muestra "Iniciar sesión" y "Crear cuenta" pero no el panel', () => {
    renderizar()
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toHaveAttribute('href', '/login')
    expect(screen.getByRole('button', { name: 'Crear cuenta' })).toHaveAttribute('href', '/registro')
    expect(screen.queryByRole('link', { name: 'Panel' })).not.toBeInTheDocument()
  })

  it('un cliente ve sus compras y el carrito, pero no el panel', () => {
    renderizar(USUARIOS.cliente)
    expect(screen.getByText(/Hola, Camila/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Mis compras' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver carrito' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Panel' })).not.toBeInTheDocument()
  })

  it('el vendedor ve el panel pero no el carrito ni mis compras', () => {
    renderizar(USUARIOS.vendedor)
    expect(screen.getByRole('link', { name: 'Panel' })).toHaveAttribute('href', '/admin')
    expect(screen.queryByRole('link', { name: 'Ver carrito' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Mis compras' })).not.toBeInTheDocument()
  })

  it('el admin ve el panel y también puede comprar', () => {
    renderizar(USUARIOS.admin)
    expect(screen.getByRole('link', { name: 'Panel' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Ver carrito' })).toBeInTheDocument()
  })

  it('"Cerrar sesión" llama a cerrarSesion del contexto', async () => {
    const usuario = userEvent.setup()
    const { auth } = renderizar(USUARIOS.cliente)

    await usuario.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    expect(auth.cerrarSesion).toHaveBeenCalledTimes(1)
  })

  it('tiene los enlaces principales del sitio', () => {
    renderizar()
    for (const nombre of ['Home', 'Productos', 'Categorías', 'Ofertas', 'Nosotros', 'Blog', 'Contacto']) {
      expect(screen.getByRole('link', { name: nombre })).toBeInTheDocument()
    }
  })
})
