// cada función de la API llama al endpoint correcto y devuelve solo los datos
import api from './cliente.js'
import { login, registrar } from './authApi.js'
import * as productos from './productosApi.js'
import * as categorias from './categoriasApi.js'
import * as usuarios from './usuariosApi.js'
import * as boletas from './boletasApi.js'

vi.mock('./cliente.js', () => ({
  default: { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}))

beforeEach(() => {
  for (const metodo of ['get', 'post', 'put', 'delete']) {
    api[metodo].mockReset()
    api[metodo].mockResolvedValue({ data: 'datos' })
  }
})

describe('servicios de la API', () => {
  it('auth', async () => {
    expect(await login('a@duoc.cl', '1234')).toBe('datos')
    expect(api.post).toHaveBeenCalledWith('/auth/login', { correo: 'a@duoc.cl', password: '1234' })
    await registrar({ run: '1' })
    expect(api.post).toHaveBeenCalledWith('/auth/registro', { run: '1' })
  })

  it('productos', async () => {
    expect(await productos.listarProductos({ ofertas: true })).toBe('datos')
    expect(api.get).toHaveBeenCalledWith('/productos', { params: { ofertas: true } })
    await productos.obtenerProducto('JM001')
    expect(api.get).toHaveBeenCalledWith('/productos/JM001')
    await productos.productosStockCritico()
    expect(api.get).toHaveBeenCalledWith('/productos/stock-critico')
    await productos.crearProducto({ codigo: 'X' })
    expect(api.post).toHaveBeenCalledWith('/productos', { codigo: 'X' })
    await productos.actualizarProducto('JM001', { nombre: 'Y' })
    expect(api.put).toHaveBeenCalledWith('/productos/JM001', { nombre: 'Y' })
    await productos.eliminarProducto('JM001')
    expect(api.delete).toHaveBeenCalledWith('/productos/JM001')
  })

  it('categorías', async () => {
    expect(await categorias.listarCategorias()).toBe('datos')
    await categorias.crearCategoria('Nueva')
    expect(api.post).toHaveBeenCalledWith('/categorias', { nombre: 'Nueva' })
    await categorias.actualizarCategoria(2, 'Otra')
    expect(api.put).toHaveBeenCalledWith('/categorias/2', { nombre: 'Otra' })
    await categorias.eliminarCategoria(2)
    expect(api.delete).toHaveBeenCalledWith('/categorias/2')
  })

  it('usuarios', async () => {
    expect(await usuarios.listarUsuarios()).toBe('datos')
    await usuarios.obtenerUsuario(5)
    expect(api.get).toHaveBeenCalledWith('/usuarios/5')
    await usuarios.crearUsuario({ correo: 'x' })
    expect(api.post).toHaveBeenCalledWith('/usuarios', { correo: 'x' })
    await usuarios.actualizarUsuario(5, { correo: 'y' })
    expect(api.put).toHaveBeenCalledWith('/usuarios/5', { correo: 'y' })
    await usuarios.eliminarUsuario(5)
    expect(api.delete).toHaveBeenCalledWith('/usuarios/5')
  })

  it('boletas: la compra envía solo código y cantidad', async () => {
    const carrito = [{ codigo: 'JM001', nombre: 'Catan', precio: 1, imagen: '', stock: 9, cantidad: 2 }]
    expect(await boletas.comprar({ nombre: 'Ana' }, carrito)).toBe('datos')
    expect(api.post).toHaveBeenCalledWith('/boletas', { nombre: 'Ana', items: [{ codigo: 'JM001', cantidad: 2 }] })

    await boletas.misBoletas()
    expect(api.get).toHaveBeenCalledWith('/boletas/mias')
    await boletas.listarBoletas()
    expect(api.get).toHaveBeenCalledWith('/boletas')
    await boletas.obtenerBoleta(1)
    expect(api.get).toHaveBeenCalledWith('/boletas/1')
    await boletas.anularBoleta(1)
    expect(api.put).toHaveBeenCalledWith('/boletas/1/estado', { estado: 'ANULADA' })
    await boletas.eliminarBoleta(1)
    expect(api.delete).toHaveBeenCalledWith('/boletas/1')
  })
})
