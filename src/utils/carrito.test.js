// Pruebas unitarias de las funciones puras del carrito.
import {
  agregarProducto,
  quitarProducto,
  cambiarCantidad,
  contarItems,
  calcularSubtotal,
  calcularDescuento,
  calcularTotal,
  tieneDescuentoDuoc,
  formatearPrecio,
  leerCarritoGuardado,
  CLAVE_CARRITO,
} from './carrito.js'

const CATAN = { codigo: 'JM001', nombre: 'Catan', precio: 29990, oferta: 0, precioFinal: 29990, stock: 2, imagen: '/img/JM001.jpg' }
const MOUSE = { codigo: 'MS001', nombre: 'Mouse', precio: 49990, oferta: 0, precioFinal: 49990, stock: 30, imagen: '/img/MS001.jpg' }
const CARCA = { codigo: 'JM002', nombre: 'Carcassonne', precio: 24990, oferta: 20, precioFinal: 19992, stock: 18, imagen: '/img/JM002.jpg' }

describe('agregarProducto', () => {
  it('agrega un producto nuevo con cantidad 1', () => {
    const carrito = agregarProducto([], CATAN)
    expect(carrito).toHaveLength(1)
    expect(carrito[0].cantidad).toBe(1)
    expect(carrito[0].codigo).toBe('JM001')
  })

  it('si el producto ya estaba, suma 1 a la cantidad', () => {
    const carrito = agregarProducto(agregarProducto([], CATAN), CATAN)
    expect(carrito).toHaveLength(1)
    expect(carrito[0].cantidad).toBe(2)
  })

  it('no agrega más unidades que el stock disponible', () => {
    let carrito = agregarProducto([], CATAN)
    carrito = agregarProducto(carrito, CATAN) // llega al stock (2)
    const resultado = agregarProducto(carrito, CATAN) // una más: no debería pasar
    expect(resultado).toBe(carrito) // devuelve el mismo carrito sin cambios
    expect(resultado[0].cantidad).toBe(2)
  })

  it('guarda el precio con la oferta aplicada', () => {
    const carrito = agregarProducto([], CARCA)
    expect(carrito[0].precio).toBe(19992) // 24990 - 20 %
  })

  it('no modifica el carrito original (inmutabilidad)', () => {
    const original = []
    agregarProducto(original, CATAN)
    expect(original).toHaveLength(0)
  })
})

describe('quitarProducto y cambiarCantidad', () => {
  const carrito = agregarProducto(agregarProducto([], CATAN), MOUSE)

  it('quita solo el producto indicado', () => {
    const resultado = quitarProducto(carrito, 'JM001')
    expect(resultado).toHaveLength(1)
    expect(resultado[0].codigo).toBe('MS001')
  })

  it('cambia la cantidad de un producto sin tocar los demás', () => {
    const resultado = cambiarCantidad(carrito, 'MS001', 5)
    expect(resultado.find((i) => i.codigo === 'MS001').cantidad).toBe(5)
    expect(resultado.find((i) => i.codigo === 'JM001').cantidad).toBe(1)
  })

  it('si la cantidad baja a 0 elimina el producto', () => {
    const resultado = cambiarCantidad(carrito, 'JM001', 0)
    expect(resultado.find((i) => i.codigo === 'JM001')).toBeUndefined()
  })

  it('no permite superar el stock', () => {
    const resultado = cambiarCantidad(carrito, 'JM001', 99)
    expect(resultado.find((i) => i.codigo === 'JM001').cantidad).toBe(2)
  })
})

describe('totales', () => {
  const carrito = [
    { codigo: 'A', precio: 10000, cantidad: 2 },
    { codigo: 'B', precio: 5000, cantidad: 1 },
  ]

  it('cuenta las unidades totales', () => {
    expect(contarItems(carrito)).toBe(3)
    expect(contarItems([])).toBe(0)
  })

  it('calcula el subtotal como precio x cantidad', () => {
    expect(calcularSubtotal(carrito)).toBe(25000)
  })

  it('aplica 20 % de descuento solo a correos Duoc', () => {
    expect(tieneDescuentoDuoc('ana@duoc.cl')).toBe(true)
    expect(tieneDescuentoDuoc('profe@profesor.duoc.cl')).toBe(true)
    expect(tieneDescuentoDuoc('ana@gmail.com')).toBe(false)
    expect(tieneDescuentoDuoc(undefined)).toBe(false)

    expect(calcularDescuento(carrito, 'ana@duoc.cl')).toBe(5000)
    expect(calcularDescuento(carrito, 'ana@gmail.com')).toBe(0)
  })

  it('el total es el subtotal menos el descuento', () => {
    expect(calcularTotal(carrito, 'ana@duoc.cl')).toBe(20000)
    expect(calcularTotal(carrito, 'ana@gmail.com')).toBe(25000)
  })

  it('formatea el precio en pesos chilenos', () => {
    expect(formatearPrecio(29990)).toBe('$29.990 CLP')
  })
})

describe('leerCarritoGuardado', () => {
  beforeEach(() => localStorage.clear())

  it('devuelve una lista vacía si no hay nada guardado', () => {
    expect(leerCarritoGuardado()).toEqual([])
  })

  it('devuelve lo guardado en localStorage', () => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify([{ codigo: 'A', cantidad: 1 }]))
    expect(leerCarritoGuardado()).toEqual([{ codigo: 'A', cantidad: 1 }])
  })

  it('si lo guardado está corrupto, parte con el carrito vacío', () => {
    localStorage.setItem(CLAVE_CARRITO, 'esto no es json')
    expect(leerCarritoGuardado()).toEqual([])
  })
})
