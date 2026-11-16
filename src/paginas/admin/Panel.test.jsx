import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderizarConSesion } from '../../pruebas/renderizar.jsx'
import { PRODUCTOS, CATEGORIAS, USUARIOS, BOLETA } from '../../pruebas/datos.js'
import AdminProductos from './AdminProductos.jsx'
import DetalleProductoAdmin from './DetalleProductoAdmin.jsx'
import FormProducto from './FormProducto.jsx'
import AdminCategorias from './AdminCategorias.jsx'
import AdminOrdenes from './AdminOrdenes.jsx'
import DetalleOrden from './DetalleOrden.jsx'
import AdminUsuarios from './AdminUsuarios.jsx'
import FormUsuario from './FormUsuario.jsx'
import * as productosApi from '../../api/productosApi.js'
import * as categoriasApi from '../../api/categoriasApi.js'
import * as boletasApi from '../../api/boletasApi.js'
import * as usuariosApi from '../../api/usuariosApi.js'

vi.mock('../../api/productosApi.js')
vi.mock('../../api/categoriasApi.js')
vi.mock('../../api/boletasApi.js')
vi.mock('../../api/usuariosApi.js')

const conflicto = (mensaje) => () => Promise.reject({ response: { status: 409, data: { mensaje } } })

beforeEach(() => {
  vi.clearAllMocks()
  productosApi.listarProductos.mockResolvedValue(PRODUCTOS)
  productosApi.obtenerProducto.mockResolvedValue(PRODUCTOS[0])
  productosApi.crearProducto.mockResolvedValue(PRODUCTOS[0])
  productosApi.actualizarProducto.mockResolvedValue(PRODUCTOS[0])
  productosApi.eliminarProducto.mockResolvedValue({})
  categoriasApi.listarCategorias.mockResolvedValue(CATEGORIAS)
  categoriasApi.crearCategoria.mockResolvedValue({ id: 9, nombre: 'Nueva' })
  categoriasApi.actualizarCategoria.mockResolvedValue({})
  categoriasApi.eliminarCategoria.mockResolvedValue({})
  boletasApi.listarBoletas.mockResolvedValue([BOLETA])
  boletasApi.obtenerBoleta.mockResolvedValue(BOLETA)
  boletasApi.anularBoleta.mockResolvedValue({ ...BOLETA, estado: 'ANULADA' })
  boletasApi.eliminarBoleta.mockResolvedValue({})
  usuariosApi.listarUsuarios.mockResolvedValue(Object.values(USUARIOS))
  usuariosApi.obtenerUsuario.mockResolvedValue(USUARIOS.vendedor)
  usuariosApi.crearUsuario.mockResolvedValue({})
  usuariosApi.actualizarUsuario.mockResolvedValue({})
  usuariosApi.eliminarUsuario.mockResolvedValue({})
})

describe('Productos del panel', () => {
  it('el admin ve crear, editar y eliminar', async () => {
    renderizarConSesion(<AdminProductos />, { usuario: USUARIOS.admin })
    expect(await screen.findByText('Catan')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Nuevo producto' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Editar' })).toHaveLength(PRODUCTOS.length)
  })

  it('el vendedor solo puede ver, sin crear, editar ni eliminar', async () => {
    renderizarConSesion(<AdminProductos />, { usuario: USUARIOS.vendedor })
    expect(await screen.findByText('Catan')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Ver' })).toHaveLength(PRODUCTOS.length)
    expect(screen.queryByRole('button', { name: 'Nuevo producto' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Editar' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Eliminar' })).not.toBeInTheDocument()
  })

  it('eliminar pide confirmación y llama a la API', async () => {
    const usuario = userEvent.setup()
    renderizarConSesion(<AdminProductos />, { usuario: USUARIOS.admin })
    await screen.findByText('Catan')

    await usuario.click(screen.getAllByRole('button', { name: 'Eliminar' })[0])
    const modal = screen.getByRole('dialog')
    await usuario.click(within(modal).getByRole('button', { name: 'Eliminar' }))

    expect(productosApi.eliminarProducto).toHaveBeenCalledWith('JM001')
    expect(await screen.findByText('Producto JM001 eliminado.')).toBeInTheDocument()
  })

  it('si el backend no deja eliminar, muestra el motivo', async () => {
    productosApi.eliminarProducto.mockImplementation(conflicto('El producto JM001 tiene ventas registradas'))
    const usuario = userEvent.setup()
    renderizarConSesion(<AdminProductos />, { usuario: USUARIOS.admin })
    await screen.findByText('Catan')

    await usuario.click(screen.getAllByRole('button', { name: 'Eliminar' })[0])
    await usuario.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Eliminar' }))

    expect(await screen.findByText(/tiene ventas registradas/)).toBeInTheDocument()
  })

  it('el detalle muestra los datos y "Editar" solo para el admin', async () => {
    renderizarConSesion(<DetalleProductoAdmin />, { usuario: USUARIOS.vendedor, ruta: '/admin/productos/JM001', patron: '/admin/productos/:codigo' })
    expect(await screen.findByRole('heading', { name: 'Catan' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Editar' })).not.toBeInTheDocument()
  })

  it('crear producto convierte los números y vuelve al listado', async () => {
    const usuario = userEvent.setup()
    renderizarConSesion(<FormProducto />, { usuario: USUARIOS.admin, ruta: '/admin/productos/nuevo', patron: '/admin/productos/nuevo' })

    await usuario.type(await screen.findByLabelText('Código *'), 'ms002')
    await usuario.type(screen.getByLabelText('Nombre *'), 'Mouse nuevo')
    await usuario.selectOptions(screen.getByLabelText('Categoría *'), 'Mouse')
    await usuario.type(screen.getByLabelText('Precio *'), '9990')
    await usuario.type(screen.getByLabelText('Stock *'), '10')
    await usuario.type(screen.getByLabelText('Stock crítico *'), '2')
    await usuario.click(screen.getByRole('button', { name: 'Guardar' }))

    const enviado = productosApi.crearProducto.mock.calls[0][0]
    expect(enviado).toMatchObject({ codigo: 'MS002', precio: 9990, stock: 10, stockCritico: 2, categoriaId: 6, oferta: 0 })
  })

  it('editar carga el producto, bloquea el código y muestra errores del backend', async () => {
    productosApi.actualizarProducto.mockImplementation(() =>
      Promise.reject({ response: { status: 400, data: { mensaje: 'Hay datos inválidos en la solicitud.', campos: { precio: 'El precio no puede ser negativo.' } } } }),
    )
    const usuario = userEvent.setup()
    renderizarConSesion(<FormProducto />, { usuario: USUARIOS.admin, ruta: '/admin/productos/JM001/editar', patron: '/admin/productos/:codigo/editar' })

    expect(await screen.findByDisplayValue('Catan')).toBeInTheDocument()
    expect(screen.getByLabelText('Código *')).toBeDisabled()
    await usuario.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(productosApi.actualizarProducto).toHaveBeenCalledWith('JM001', expect.objectContaining({ nombre: 'Catan' }))
    expect(await screen.findByText('El precio no puede ser negativo.')).toBeInTheDocument()
  })
})

describe('Categorías del panel', () => {
  it('crea, edita y elimina categorías', async () => {
    const usuario = userEvent.setup()
    renderizarConSesion(<AdminCategorias />, { usuario: USUARIOS.admin })
    await screen.findByText('Consolas')

    await usuario.type(screen.getByLabelText('Nueva categoría'), 'Streaming')
    await usuario.click(screen.getByRole('button', { name: 'Agregar' }))
    expect(categoriasApi.crearCategoria).toHaveBeenCalledWith('Streaming')

    await usuario.click(screen.getAllByRole('button', { name: 'Editar' })[0])
    const campo = screen.getByLabelText('Nombre de la categoría')
    await usuario.clear(campo)
    await usuario.type(campo, 'Juegos')
    await usuario.click(screen.getByRole('button', { name: 'Guardar' }))
    expect(categoriasApi.actualizarCategoria).toHaveBeenCalledWith(1, 'Juegos')

    await usuario.click(screen.getAllByRole('button', { name: 'Eliminar' })[1])
    await usuario.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Eliminar' }))
    expect(categoriasApi.eliminarCategoria).toHaveBeenCalledWith(2)
  })

  it('muestra el error si la categoría tiene productos', async () => {
    categoriasApi.eliminarCategoria.mockImplementation(conflicto("No se puede eliminar 'Juegos de Mesa' porque tiene productos."))
    const usuario = userEvent.setup()
    renderizarConSesion(<AdminCategorias />, { usuario: USUARIOS.admin })
    await screen.findByText('Consolas')

    await usuario.click(screen.getAllByRole('button', { name: 'Eliminar' })[0])
    await usuario.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Eliminar' }))

    expect(await screen.findByText(/porque tiene productos/)).toBeInTheDocument()
  })
})

describe('Órdenes del panel', () => {
  it('lista las órdenes con su estado', async () => {
    renderizarConSesion(<AdminOrdenes />, { usuario: USUARIOS.vendedor })
    expect(await screen.findByText('20261110-1001')).toBeInTheDocument()
    expect(screen.getByText('APROBADA')).toBeInTheDocument()
  })

  function abrirDetalle(usuario) {
    return renderizarConSesion(<DetalleOrden />, { usuario, ruta: '/admin/ordenes/1', patron: '/admin/ordenes/:id' })
  }

  it('el vendedor ve el detalle pero no puede anular ni eliminar', async () => {
    abrirDetalle(USUARIOS.vendedor)
    expect(await screen.findByRole('heading', { name: 'Orden N° 20261110-1001' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Anular|Eliminar/ })).not.toBeInTheDocument()
  })

  it('el admin anula una orden aprobada', async () => {
    const usuario = userEvent.setup()
    abrirDetalle(USUARIOS.admin)

    await usuario.click(await screen.findByRole('button', { name: 'Anular orden' }))
    await usuario.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Anular' }))

    expect(boletasApi.anularBoleta).toHaveBeenCalledWith(1)
    expect(await screen.findByText('Orden anulada. El stock fue devuelto.')).toBeInTheDocument()
  })

  it('el admin puede eliminar una orden anulada', async () => {
    boletasApi.obtenerBoleta.mockResolvedValue({ ...BOLETA, estado: 'ANULADA', descuento: 100 })
    const usuario = userEvent.setup()
    abrirDetalle(USUARIOS.admin)

    await usuario.click(await screen.findByRole('button', { name: 'Eliminar orden' }))
    await usuario.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Eliminar' }))

    expect(boletasApi.eliminarBoleta).toHaveBeenCalledWith(1)
  })
})

describe('Usuarios del panel', () => {
  it('lista usuarios y elimina uno con confirmación', async () => {
    const usuario = userEvent.setup()
    renderizarConSesion(<AdminUsuarios />, { usuario: USUARIOS.admin })
    expect(await screen.findByText('vendedor@duoc.cl')).toBeInTheDocument()

    await usuario.click(screen.getAllByRole('button', { name: 'Eliminar' })[1])
    await usuario.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Eliminar' }))

    expect(usuariosApi.eliminarUsuario).toHaveBeenCalledWith(2)
    expect(await screen.findByText('Usuario vendedor@duoc.cl eliminado.')).toBeInTheDocument()
  })

  it('muestra el error del backend al eliminar', async () => {
    usuariosApi.eliminarUsuario.mockImplementation(conflicto('No puedes eliminar tu propia cuenta.'))
    const usuario = userEvent.setup()
    renderizarConSesion(<AdminUsuarios />, { usuario: USUARIOS.admin })
    await screen.findByText('admin@duoc.cl')

    await usuario.click(screen.getAllByRole('button', { name: 'Eliminar' })[0])
    await usuario.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Eliminar' }))

    expect(await screen.findByText('No puedes eliminar tu propia cuenta.')).toBeInTheDocument()
  })

  it('crear usuario envía el rol elegido', async () => {
    const usuario = userEvent.setup()
    renderizarConSesion(<FormUsuario />, { usuario: USUARIOS.admin, ruta: '/admin/usuarios/nuevo', patron: '/admin/usuarios/nuevo' })

    await usuario.type(screen.getByLabelText('RUN *'), '123456785')
    await usuario.type(screen.getByLabelText('Nombre *'), 'Pedro')
    await usuario.type(screen.getByLabelText('Apellidos *'), 'Pérez')
    await usuario.type(screen.getByLabelText('Correo *'), 'pedro@duoc.cl')
    await usuario.type(screen.getByLabelText('Contraseña *'), 'clave1')
    await usuario.selectOptions(screen.getByLabelText('Rol *'), 'VENDEDOR')
    await usuario.selectOptions(screen.getByLabelText('Región'), 'Maule')
    await usuario.selectOptions(screen.getByLabelText('Comuna'), 'Talca')
    await usuario.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(usuariosApi.crearUsuario).toHaveBeenCalledWith(
      expect.objectContaining({ correo: 'pedro@duoc.cl', rol: 'VENDEDOR', comuna: 'Talca', fechaNacimiento: null, activo: true }),
    )
  })

  it('editar carga el usuario, permite desactivarlo y muestra errores', async () => {
    usuariosApi.actualizarUsuario.mockImplementation(conflicto('Ya existe un usuario registrado con ese correo.'))
    const usuario = userEvent.setup()
    renderizarConSesion(<FormUsuario />, { usuario: USUARIOS.admin, ruta: '/admin/usuarios/2/editar', patron: '/admin/usuarios/:id/editar' })

    expect(await screen.findByDisplayValue('vendedor@duoc.cl')).toBeInTheDocument()
    await usuario.click(screen.getByLabelText('Cuenta activa'))
    await usuario.click(screen.getByRole('button', { name: 'Guardar' }))

    expect(usuariosApi.actualizarUsuario).toHaveBeenCalledWith('2', expect.objectContaining({ activo: false, password: null }))
    expect(await screen.findByText('Ya existe un usuario registrado con ese correo.')).toBeInTheDocument()
  })
})
