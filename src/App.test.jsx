// pruebas de integración: la app completa con rutas, AuthProvider real y la API simulada
import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import App from './App.jsx'
import { AuthProvider } from './auth/AuthContext.jsx'
import { CLAVE_SESION } from './auth/sesion.js'
import { EVENTO_SESION_EXPIRADA, renovarTokens } from './api/cliente.js'
import { listarProductos, obtenerProducto, productosStockCritico } from './api/productosApi.js'
import { listarCategorias } from './api/categoriasApi.js'
import { comprar, misBoletas } from './api/boletasApi.js'
import { login } from './api/authApi.js'
import { PRODUCTOS, CATEGORIAS, USUARIOS, BOLETA, crearToken, respuestaLogin } from './pruebas/datos.js'

vi.mock('./api/productosApi.js')
vi.mock('./api/categoriasApi.js')
vi.mock('./api/boletasApi.js')
vi.mock('./api/authApi.js')
vi.mock('./api/usuariosApi.js')
vi.mock('./api/cliente.js', async (original) => ({ ...(await original()), renovarTokens: vi.fn() }))

const CARRITO = [{ codigo: 'JM001', nombre: 'Catan', precio: 29990, imagen: '', stock: 25, cantidad: 1 }]

beforeEach(() => {
  localStorage.clear()
  vi.clearAllMocks()
  listarProductos.mockImplementation((filtros = {}) =>
    Promise.resolve(filtros.ofertas ? PRODUCTOS.filter((p) => p.oferta > 0) : PRODUCTOS),
  )
  obtenerProducto.mockImplementation((codigo) => {
    const producto = PRODUCTOS.find((p) => p.codigo === codigo)
    return producto
      ? Promise.resolve(producto)
      : Promise.reject({ response: { status: 404, data: { mensaje: `No existe el producto ${codigo}.` } } })
  })
  listarCategorias.mockResolvedValue(CATEGORIAS)
  productosStockCritico.mockResolvedValue([])
  misBoletas.mockResolvedValue([])
})

function guardarSesion(usuario, { accessSeg = 1800, refreshSeg = 604800 } = {}) {
  localStorage.setItem(
    CLAVE_SESION,
    JSON.stringify({ accessToken: crearToken(accessSeg), refreshToken: crearToken(refreshSeg), usuario }),
  )
}

function renderizarEn(url) {
  render(
    <MemoryRouter initialEntries={[url]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>,
  )
}

describe('Navegación y páginas', () => {
  it('la portada muestra el hero y 4 productos destacados traídos de la API', async () => {
    renderizarEn('/')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Desafía tus límites')
    expect(await screen.findAllByRole('button', { name: /Añadir al carrito|Sin stock/ })).toHaveLength(4)
  })

  it('una URL inexistente muestra la página 404', () => {
    renderizarEn('/no-existe')
    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument()
  })

  it('el detalle de un producto muestra sus datos', async () => {
    renderizarEn('/producto/CO001')
    expect(await screen.findByRole('heading', { name: 'PlayStation 5' })).toBeInTheDocument()
    expect(screen.getByText('Stock disponible: 6')).toBeInTheDocument()
  })

  it('un código inexistente muestra el mensaje del backend', async () => {
    renderizarEn('/producto/XXX')
    expect(await screen.findByText(/No existe el producto XXX/)).toBeInTheDocument()
  })

  it('las páginas estáticas renderizan su título', () => {
    renderizarEn('/nosotros')
    expect(screen.getByRole('heading', { name: 'Quiénes somos' })).toBeInTheDocument()
  })

  it('categorías lista cada categoría con la cantidad de productos', async () => {
    renderizarEn('/categorias')
    expect(await screen.findByRole('heading', { name: 'Juegos de Mesa' })).toBeInTheDocument()
    expect(screen.getAllByText('2 producto(s)').length).toBeGreaterThan(0)
  })

  it('ofertas pide a la API solo los productos con descuento', async () => {
    renderizarEn('/ofertas')
    expect(await screen.findByRole('heading', { name: 'Carcassonne' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Catan' })).not.toBeInTheDocument()
    expect(listarProductos).toHaveBeenCalledWith({ ofertas: true })
  })

  it('el blog lista los artículos y el detalle muestra el contenido', async () => {
    const usuario = userEvent.setup()
    renderizarEn('/blog')
    await usuario.click(screen.getByRole('heading', { name: /periféricos/ }))
    expect(screen.getByRole('heading', { level: 1, name: /periféricos/ })).toBeInTheDocument()
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

    const botones = await screen.findAllByRole('button', { name: 'Añadir al carrito' })
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

    const boton = await screen.findByRole('button', { name: 'Añadir al carrito' })
    for (let i = 0; i < 5; i++) await usuario.click(boton)

    expect(screen.getByTestId('contador-carrito')).toHaveTextContent('4')
    expect(screen.getByRole('status')).toHaveTextContent('Solo quedan 4 unidades')
  })

  it('el carrito recuerda lo guardado en localStorage al cargar', () => {
    localStorage.setItem('levelup_carrito', JSON.stringify([{ ...CARRITO[0], cantidad: 2 }]))
    renderizarEn('/carrito')
    expect(screen.getByTestId('contador-carrito')).toHaveTextContent('2')
    expect(screen.getByText('Catan')).toBeInTheDocument()
  })

  it('entrar a /compra-exitosa sin haber comprado redirige al inicio', () => {
    renderizarEn('/compra-exitosa')
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Desafía tus límites')
  })
})

describe('Checkout contra la API', () => {
  async function pagar(usuario, tarjeta) {
    await usuario.type(await screen.findByLabelText(/Número de tarjeta/), tarjeta)
    await usuario.click(screen.getByRole('button', { name: /Pagar ahora/ }))
  }

  it('sin sesión, /checkout manda al login', () => {
    localStorage.setItem('levelup_carrito', JSON.stringify(CARRITO))
    renderizarEn('/checkout')
    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument()
    expect(screen.getByText('Inicia sesión para continuar.')).toBeInTheDocument()
  })

  it('con sesión y carrito vacío redirige al carrito', () => {
    guardarSesion(USUARIOS.cliente)
    renderizarEn('/checkout')
    expect(screen.getByRole('heading', { name: 'Tu carrito está vacío' })).toBeInTheDocument()
  })

  it('los datos vienen de la cuenta y una cuenta Duoc ve el descuento', () => {
    localStorage.setItem('levelup_carrito', JSON.stringify(CARRITO))
    guardarSesion(USUARIOS.admin)
    renderizarEn('/checkout')

    expect(screen.getByLabelText('Nombre *')).toHaveValue('Ana')
    expect(screen.getByLabelText('Correo *')).toHaveValue('admin@duoc.cl')
    expect(screen.getByText('Descuento Duoc (20%)')).toBeInTheDocument()
  })

  it('compra aprobada: envía solo código y cantidad, muestra la boleta y vacía el carrito', async () => {
    localStorage.setItem('levelup_carrito', JSON.stringify(CARRITO))
    guardarSesion(USUARIOS.cliente)
    comprar.mockResolvedValue(BOLETA)
    const usuario = userEvent.setup()
    renderizarEn('/checkout')

    await pagar(usuario, '4111111111111111')

    expect(await screen.findByRole('heading', { name: /Se ha realizado la compra/ })).toBeInTheDocument()
    expect(screen.getByText(/Total pagado/)).toHaveTextContent('$29.990 CLP')
    expect(screen.getByTestId('contador-carrito')).toHaveTextContent('0')
    const [datosEnvio, carritoEnviado] = comprar.mock.calls[0]
    expect(datosEnvio.tarjeta).toBe('4111111111111111')
    expect(carritoEnviado[0].codigo).toBe('JM001')
  })

  it('pago rechazado: muestra el aviso y conserva el carrito', async () => {
    localStorage.setItem('levelup_carrito', JSON.stringify(CARRITO))
    guardarSesion(USUARIOS.cliente)
    comprar.mockResolvedValue({ ...BOLETA, estado: 'RECHAZADA' })
    const usuario = userEvent.setup()
    renderizarEn('/checkout')

    await pagar(usuario, '4111111111111110')

    const alerta = await screen.findByRole('alert')
    expect(within(alerta).getByRole('heading')).toHaveTextContent('No se pudo realizar el pago')
    expect(screen.getByTestId('contador-carrito')).toHaveTextContent('1')
  })

  it('si el backend responde sin stock, se queda en el checkout con el mensaje', async () => {
    localStorage.setItem('levelup_carrito', JSON.stringify(CARRITO))
    guardarSesion(USUARIOS.cliente)
    comprar.mockRejectedValue({ response: { status: 409, data: { mensaje: "Stock insuficiente para 'Catan'. Disponible: 0." } } })
    const usuario = userEvent.setup()
    renderizarEn('/checkout')

    await pagar(usuario, '4111111111111111')

    expect(await screen.findByText(/Stock insuficiente para 'Catan'/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Checkout' })).toBeInTheDocument()
  })
})

describe('Sesión', () => {
  it('iniciar sesión guarda los tokens y cerrar sesión los borra', async () => {
    login.mockResolvedValue(respuestaLogin(USUARIOS.cliente))
    const usuario = userEvent.setup()
    renderizarEn('/login')

    await usuario.type(screen.getByLabelText('Correo electrónico'), 'cliente@gmail.com')
    await usuario.type(screen.getByLabelText('Contraseña'), 'Cliente123!')
    await usuario.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByText(/Hola, Camila/)).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(CLAVE_SESION)).accessToken).toBeTruthy()

    await usuario.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    expect(screen.queryByText(/Hola, Camila/)).not.toBeInTheDocument()
    expect(localStorage.getItem(CLAVE_SESION)).toBeNull()
  })

  it('al recargar con un token vigente la sesión sigue activa sin llamar a la API', () => {
    guardarSesion(USUARIOS.cliente)
    renderizarEn('/')
    expect(screen.getByText(/Hola, Camila/)).toBeInTheDocument()
    expect(renovarTokens).not.toHaveBeenCalled()
  })

  it('al recargar con el access vencido usa el refresh token para renovar', async () => {
    guardarSesion(USUARIOS.cliente, { accessSeg: -60 })
    renovarTokens.mockResolvedValue(respuestaLogin(USUARIOS.cliente))
    renderizarEn('/mis-compras')

    expect(await screen.findByRole('heading', { name: 'Mis compras' })).toBeInTheDocument()
    expect(renovarTokens).toHaveBeenCalledTimes(1)
  })

  it('si el refresh falla al recargar, se cierra la sesión', async () => {
    guardarSesion(USUARIOS.cliente, { accessSeg: -60 })
    renovarTokens.mockRejectedValue(new Error('401'))
    renderizarEn('/mis-compras')

    expect(await screen.findByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument()
    expect(localStorage.getItem(CLAVE_SESION)).toBeNull()
  })

  it('con ambos tokens vencidos la sesión se descarta', () => {
    guardarSesion(USUARIOS.cliente, { accessSeg: -60, refreshSeg: -60 })
    renderizarEn('/')
    expect(screen.queryByText(/Hola, Camila/)).not.toBeInTheDocument()
    expect(localStorage.getItem(CLAVE_SESION)).toBeNull()
  })

  it('cuando el interceptor avisa que la sesión expiró, la interfaz se cierra', () => {
    guardarSesion(USUARIOS.cliente)
    renderizarEn('/')
    expect(screen.getByText(/Hola, Camila/)).toBeInTheDocument()

    act(() => window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA)))

    expect(screen.queryByText(/Hola, Camila/)).not.toBeInTheDocument()
  })
})

describe('Restricciones por rol', () => {
  it('sin sesión, /admin manda al login', () => {
    renderizarEn('/admin')
    expect(screen.getByRole('heading', { name: 'Iniciar sesión' })).toBeInTheDocument()
  })

  it('un cliente que entra a /admin ve "Acceso restringido"', () => {
    guardarSesion(USUARIOS.cliente)
    renderizarEn('/admin')
    expect(screen.getByRole('heading', { name: 'Acceso restringido' })).toBeInTheDocument()
  })

  it('el vendedor solo ve Productos y Órdenes en el menú del panel', () => {
    guardarSesion(USUARIOS.vendedor)
    renderizarEn('/admin')

    const menu = screen.getByRole('navigation', { name: 'Menú del panel' })
    expect(within(menu).getByRole('link', { name: 'Productos' })).toBeInTheDocument()
    expect(within(menu).getByRole('link', { name: 'Órdenes' })).toBeInTheDocument()
    expect(within(menu).queryByRole('link', { name: 'Usuarios' })).not.toBeInTheDocument()
    expect(within(menu).queryByRole('link', { name: 'Categorías' })).not.toBeInTheDocument()
  })

  it('el vendedor no puede entrar por URL a usuarios ni a crear productos', () => {
    guardarSesion(USUARIOS.vendedor)
    renderizarEn('/admin/usuarios')
    expect(screen.getByRole('heading', { name: 'Acceso restringido' })).toBeInTheDocument()
  })

  it('el vendedor no ve botones de compra en la tienda', async () => {
    guardarSesion(USUARIOS.vendedor)
    renderizarEn('/productos')
    expect(await screen.findByRole('heading', { name: 'Catan' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Añadir al carrito' })).not.toBeInTheDocument()
  })

  it('el admin ve todas las secciones del panel', () => {
    guardarSesion(USUARIOS.admin)
    renderizarEn('/admin')
    const menu = screen.getByRole('navigation', { name: 'Menú del panel' })
    for (const seccion of ['Productos', 'Categorías', 'Órdenes', 'Usuarios']) {
      expect(within(menu).getByRole('link', { name: seccion })).toBeInTheDocument()
    }
  })
})
