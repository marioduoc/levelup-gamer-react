// Pruebas del CRUD de productos sobre localStorage.
import {
  productosIniciales,
  obtenerProductos,
  buscarProducto,
  guardarProducto,
  eliminarProducto,
  restaurarCatalogo,
  obtenerCategorias,
  obtenerOfertas,
  precioFinal,
  descontarStock,
} from './productos.js'

// Cada prueba parte con el localStorage limpio.
beforeEach(() => localStorage.clear())

describe('obtenerProductos (READ)', () => {
  it('la primera vez devuelve los productos iniciales y los guarda', () => {
    const lista = obtenerProductos()
    expect(lista).toHaveLength(productosIniciales.length)
    expect(localStorage.getItem('levelup_productos')).not.toBeNull()
  })

  it('si lo guardado está corrupto vuelve a los iniciales', () => {
    localStorage.setItem('levelup_productos', '???')
    expect(obtenerProductos()).toHaveLength(productosIniciales.length)
  })

  it('buscarProducto encuentra por código y devuelve undefined si no existe', () => {
    expect(buscarProducto('CO001').nombre).toBe('PlayStation 5')
    expect(buscarProducto('NOEXISTE')).toBeUndefined()
  })
})

describe('guardarProducto (CREATE / UPDATE)', () => {
  it('agrega un producto nuevo', () => {
    guardarProducto({ codigo: 'TEST1', nombre: 'Prueba', precio: 1000, stock: 1, categoria: 'Test' })
    expect(obtenerProductos()).toHaveLength(productosIniciales.length + 1)
    expect(buscarProducto('TEST1').nombre).toBe('Prueba')
  })

  it('reemplaza un producto existente con el mismo código', () => {
    const catan = buscarProducto('JM001')
    guardarProducto({ ...catan, precio: 1 })
    expect(buscarProducto('JM001').precio).toBe(1)
    expect(obtenerProductos()).toHaveLength(productosIniciales.length)
  })
})

describe('eliminarProducto (DELETE) y restaurarCatalogo', () => {
  it('elimina el producto indicado', () => {
    eliminarProducto('JM001')
    expect(buscarProducto('JM001')).toBeUndefined()
  })

  it('restaurarCatalogo deja todo como al principio', () => {
    eliminarProducto('JM001')
    restaurarCatalogo()
    expect(buscarProducto('JM001')).toBeDefined()
  })
})

describe('consultas de apoyo', () => {
  it('obtenerCategorias no repite categorías', () => {
    const categorias = obtenerCategorias()
    expect(categorias).toContain('Juegos de Mesa')
    expect(new Set(categorias).size).toBe(categorias.length)
  })

  it('obtenerOfertas devuelve solo productos con oferta', () => {
    const ofertas = obtenerOfertas()
    expect(ofertas.length).toBeGreaterThan(0)
    expect(ofertas.every((p) => p.oferta > 0)).toBe(true)
  })

  it('precioFinal aplica el porcentaje de oferta', () => {
    expect(precioFinal({ precio: 10000, oferta: 0 })).toBe(10000)
    expect(precioFinal({ precio: 10000, oferta: 15 })).toBe(8500)
  })

  it('descontarStock resta lo comprado y nunca baja de 0', () => {
    descontarStock([
      { codigo: 'CO001', cantidad: 2 },
      { codigo: 'CG001', cantidad: 99 },
      { codigo: 'NOEXISTE', cantidad: 1 },
    ])
    expect(buscarProducto('CO001').stock).toBe(4)
    expect(buscarProducto('CG001').stock).toBe(0)
  })
})
