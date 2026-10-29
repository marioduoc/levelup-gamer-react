// Pruebas de integración: la aplicación completa con sus rutas.
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import App from './App.jsx'

beforeEach(() => localStorage.clear())

function renderizarEn(url) {
  render(
    <MemoryRouter initialEntries={[url]}>
      <App />
    </MemoryRouter>,
  )
}

describe('Navegación y páginas', () => {
  it('la portada muestra el hero y 4 productos destacados', () => {
    renderizarEn('/')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Desafía tus límites')
    expect(screen.getAllByRole('button', { name: /Añadir al carrito|Sin stock/ })).toHaveLength(4)
  })

  it('una URL inexistente muestra la página 404 con la ruta intentada', () => {
    renderizarEn('/no-existe')
    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument()
    expect(screen.getByText('/no-existe')).toBeInTheDocument()
  })

  it('el detalle de un producto muestra sus datos y un código inventado muestra un aviso', () => {
    renderizarEn('/producto/CO001')
    expect(screen.getByRole('heading', { name: 'PlayStation 5' })).toBeInTheDocument()
    expect(screen.getByText('Stock disponible: 6')).toBeInTheDocument()
  })

  it('un código de producto inexistente muestra "Producto no encontrado"', () => {
    renderizarEn('/producto/XXX')
    expect(screen.getByText(/Producto no encontrado/)).toBeInTheDocument()
  })

  it('las páginas estáticas renderizan su título', () => {
    renderizarEn('/nosotros')
    expect(screen.getByRole('heading', { name: 'Quiénes somos' })).toBeInTheDocument()
  })

  it('categorías lista cada categoría con la cantidad de productos', () => {
    renderizarEn('/categorias')
    expect(screen.getByRole('heading', { name: 'Juegos de Mesa' })).toBeInTheDocument()
    expect(screen.getAllByText('2 producto(s)').length).toBeGreaterThan(0)
  })

  it('ofertas muestra solo productos con descuento', () => {
    renderizarEn('/ofertas')
    expect(screen.getByRole('heading', { name: 'Carcassonne' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Catan' })).not.toBeInTheDocument()
  })

  it('el blog lista los artículos y el detalle muestra el contenido', async () => {
    const usuario = userEvent.setup()
    renderizarEn('/blog')
    await usuario.click(screen.getByRole('heading', { name: /periféricos/ }))
    expect(screen.getByRole('heading', { level: 1, name: /periféricos/ })).toBeInTheDocument()
    expect(screen.getByText(/12 de agosto de 2026/)).toBeInTheDocument()
  })

  it('un artículo inexistente muestra un aviso', () => {
    renderizarEn('/blog/nada')
    expect(screen.getByText(/Artículo no encontrado/)).toBeInTheDocument()
  })
})

describe('Flujo del carrito', () => {
  it('agregar desde la portada actualiza el contador y guarda en localStorage', async () => {
    const usuario = userEvent.setup()
    renderizarEn('/')

    const botones = screen.getAllByRole('button', { name: 'Añadir al carrito' })
    await usuario.click(botones[0])
    await usuario.click(botones[0])
    await usuario.click(botones[1])

    expect(screen.getByTestId('contador-carrito')).toHaveTextContent('3')
    expect(screen.getByRole('status')).toHaveTextContent('agregado al carrito')
    expect(JSON.parse(localStorage.getItem('levelup_carrito'))).toHaveLength(2)
  })

  it('avisa cuando se intenta superar el stock', async () => {
    const usuario = userEvent.setup()
    renderizarEn('/producto/CG001') // stock 4

    const boton = screen.getByRole('button', { name: 'Añadir al carrito' })
    for (let i = 0; i < 5; i++) await usuario.click(boton)

    expect(screen.getByTestId('contador-carrito')).toHaveTextContent('4')
    expect(screen.getByRole('status')).toHaveTextContent('Solo quedan 4 unidades')
  })

  it('el carrito recuerda lo guardado en localStorage al cargar', () => {
    localStorage.setItem(
      'levelup_carrito',
      JSON.stringify([{ codigo: 'JM001', nombre: 'Catan', precio: 29990, imagen: '', stock: 25, cantidad: 2 }]),
    )
    renderizarEn('/carrito')
    expect(screen.getByTestId('contador-carrito')).toHaveTextContent('2')
    expect(screen.getByText('Catan')).toBeInTheDocument()
  })

  it('entrar a /checkout con el carrito vacío redirige al carrito', () => {
    renderizarEn('/checkout')
    expect(screen.getByRole('heading', { name: 'Tu carrito está vacío' })).toBeInTheDocument()
  })

  it('entrar a /compra-exitosa sin haber comprado redirige al inicio', () => {
    renderizarEn('/compra-exitosa')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Desafía tus límites')
  })
})

describe('Checkout', () => {
  const CARRITO = [{ codigo: 'JM001', nombre: 'Catan', precio: 29990, imagen: '', stock: 25, cantidad: 1 }]

  async function completarCheckout(usuario, tarjeta) {
    await usuario.type(screen.getByLabelText('Nombre *'), 'Pedro')
    await usuario.type(screen.getByLabelText('Apellidos *'), 'Hacker')
    await usuario.type(screen.getByLabelText('Correo *'), 'pedro@gmail.com')
    await usuario.type(screen.getByLabelText('Calle *'), 'Los Crisantemos 12')
    await usuario.selectOptions(screen.getByLabelText('Región *'), 'Región Metropolitana de Santiago')
    await usuario.selectOptions(screen.getByLabelText('Comuna *'), 'Providencia')
    await usuario.type(screen.getByLabelText(/Número de tarjeta/), tarjeta)
    await usuario.click(screen.getByRole('button', { name: /Pagar ahora/ }))
  }

  it('al enviar vacío muestra los errores y no cambia de página', async () => {
    localStorage.setItem('levelup_carrito', JSON.stringify(CARRITO))
    const usuario = userEvent.setup()
    renderizarEn('/checkout')

    await usuario.click(screen.getByRole('button', { name: /Pagar ahora/ }))

    expect(screen.getByText('El nombre es requerido.')).toBeInTheDocument()
    expect(screen.getByText('Ingresa los 16 dígitos de la tarjeta.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Checkout' })).toBeInTheDocument()
  })

  it('con tarjeta válida muestra la compra exitosa y vacía el carrito', async () => {
    localStorage.setItem('levelup_carrito', JSON.stringify(CARRITO))
    const usuario = userEvent.setup()
    renderizarEn('/checkout')

    await completarCheckout(usuario, '4111111111111111')

    expect(screen.getByRole('heading', { name: /Se ha realizado la compra/ })).toBeInTheDocument()
    expect(screen.getByText(/Total pagado/)).toHaveTextContent('$29.990 CLP')
    expect(screen.getByTestId('contador-carrito')).toHaveTextContent('0')
    expect(JSON.parse(localStorage.getItem('levelup_carrito'))).toEqual([])
  })

  it('con tarjeta terminada en 0 muestra el pago rechazado y conserva el carrito', async () => {
    localStorage.setItem('levelup_carrito', JSON.stringify(CARRITO))
    const usuario = userEvent.setup()
    renderizarEn('/checkout')

    await completarCheckout(usuario, '4111111111111110')

    const alerta = screen.getByRole('alert')
    expect(within(alerta).getByRole('heading')).toHaveTextContent('No se pudo realizar el pago')
    // Button de react-bootstrap renderizado como <Link> queda con role="button"
    expect(within(alerta).getByRole('button', { name: 'Volver a realizar el pago' })).toHaveAttribute('href', '/checkout')
    expect(screen.getByTestId('contador-carrito')).toHaveTextContent('1')
  })

  it('con sesión iniciada los datos del cliente vienen rellenados', () => {
    localStorage.setItem('levelup_carrito', JSON.stringify(CARRITO))
    localStorage.setItem(
      'levelup_sesion',
      JSON.stringify({ nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@duoc.cl', direccion: 'Calle 1', region: 'Maule', comuna: 'Talca' }),
    )
    renderizarEn('/checkout')

    expect(screen.getByLabelText('Nombre *')).toHaveValue('Ana')
    expect(screen.getByLabelText('Correo *')).toHaveValue('ana@duoc.cl')
    expect(screen.getByLabelText('Comuna *')).toHaveValue('Talca')
    expect(screen.getByText('Descuento Duoc (20%)')).toBeInTheDocument()
    expect(screen.getByText('Hola, Ana')).toBeInTheDocument()
  })
})

describe('Sesión', () => {
  it('iniciar sesión saluda al usuario y cerrar sesión lo quita', async () => {
    localStorage.setItem(
      'levelup_usuarios',
      JSON.stringify([{ run: '19011022K', nombre: 'Ana', correo: 'ana@duoc.cl', password: '1234' }]),
    )
    const usuario = userEvent.setup()
    renderizarEn('/login')

    await usuario.type(screen.getByLabelText('Correo electrónico'), 'ana@duoc.cl')
    await usuario.type(screen.getByLabelText('Contraseña'), '1234')
    await usuario.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(screen.getByText('Hola, Ana')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('levelup_sesion')).nombre).toBe('Ana')

    await usuario.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    expect(screen.queryByText('Hola, Ana')).not.toBeInTheDocument()
    expect(localStorage.getItem('levelup_sesion')).toBeNull()
  })
})
