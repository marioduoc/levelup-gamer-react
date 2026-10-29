import { pagoAprobado, generarNumeroOrden, procesarPago, obtenerPedidos } from './pedidos.js'
import { buscarProducto } from '../datos/productos.js'

beforeEach(() => localStorage.clear())

describe('pagoAprobado', () => {
  it('aprueba una tarjeta de 16 dígitos que no termina en 0', () => {
    expect(pagoAprobado('4111 1111 1111 1111')).toBe(true)
  })

  it('rechaza una tarjeta terminada en 0 o incompleta', () => {
    expect(pagoAprobado('4111 1111 1111 1110')).toBe(false)
    expect(pagoAprobado('4111')).toBe(false)
    expect(pagoAprobado(undefined)).toBe(false)
  })
})

describe('generarNumeroOrden', () => {
  it('usa la fecha con formato AAAAMMDD más un correlativo de 4 dígitos', () => {
    const numero = generarNumeroOrden(new Date(2026, 9, 28))
    expect(numero).toMatch(/^20261028-\d{4}$/)
  })
})

describe('procesarPago', () => {
  const carrito = [{ codigo: 'JM001', nombre: 'Catan', precio: 29990, cantidad: 2 }]

  it('con pago aprobado registra el pedido y descuenta el stock', () => {
    const stockAntes = buscarProducto('JM001').stock
    const pedido = procesarPago(carrito, { nombre: 'Ana', tarjeta: '4111111111111111' }, 59980)

    expect(pedido.estado).toBe('aprobado')
    expect(pedido.total).toBe(59980)
    expect(buscarProducto('JM001').stock).toBe(stockAntes - 2)
    expect(obtenerPedidos()).toHaveLength(1)
  })

  it('con pago rechazado registra el pedido pero NO descuenta stock', () => {
    const stockAntes = buscarProducto('JM001').stock
    const pedido = procesarPago(carrito, { nombre: 'Ana', tarjeta: '4111111111111110' }, 59980)

    expect(pedido.estado).toBe('rechazado')
    expect(buscarProducto('JM001').stock).toBe(stockAntes)
    expect(obtenerPedidos()[0].estado).toBe('rechazado')
  })

  it('si lo guardado está corrupto, parte sin pedidos', () => {
    localStorage.setItem('levelup_pedidos', '{{corrupto')
    expect(obtenerPedidos()).toEqual([])
  })
})
