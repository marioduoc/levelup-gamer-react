import { PERMISOS, puede, puedeUsarCarrito } from './permisos.js'
import { CLAVE_SESION, borrarSesion, guardarSesion, leerPayload, leerSesion, tokenVigente } from './sesion.js'
import { crearToken } from '../pruebas/datos.js'

const admin = { rol: 'ADMIN' }
const vendedor = { rol: 'VENDEDOR' }
const cliente = { rol: 'CLIENTE' }

describe('permisos por rol', () => {
  it('el admin puede todo', () => {
    for (const permiso of Object.keys(PERMISOS)) {
      expect(puede(admin, permiso)).toBe(true)
    }
  })

  it('el vendedor solo ve productos y órdenes', () => {
    expect(puede(vendedor, 'verPanel')).toBe(true)
    expect(puede(vendedor, 'verProductos')).toBe(true)
    expect(puede(vendedor, 'verOrdenes')).toBe(true)
    for (const permiso of ['comprar', 'editarProductos', 'gestionarCategorias', 'gestionarOrdenes', 'gestionarUsuarios', 'verStockCritico']) {
      expect(puede(vendedor, permiso)).toBe(false)
    }
  })

  it('el cliente solo compra', () => {
    expect(puede(cliente, 'comprar')).toBe(true)
    expect(puede(cliente, 'verPanel')).toBe(false)
  })

  it('sin usuario o con un permiso desconocido no se puede', () => {
    expect(puede(null, 'comprar')).toBe(false)
    expect(puede(admin, 'permisoQueNoExiste')).toBe(false)
  })

  it('el carrito es para visitantes, clientes y admin, no para el vendedor', () => {
    expect(puedeUsarCarrito(null)).toBe(true)
    expect(puedeUsarCarrito(cliente)).toBe(true)
    expect(puedeUsarCarrito(admin)).toBe(true)
    expect(puedeUsarCarrito(vendedor)).toBe(false)
  })
})

describe('sesión en localStorage', () => {
  beforeEach(() => localStorage.clear())

  it('guarda, lee y borra la sesión', () => {
    guardarSesion({ accessToken: 'a', refreshToken: 'r', usuario: cliente })
    expect(leerSesion()).toEqual({ accessToken: 'a', refreshToken: 'r', usuario: cliente })
    borrarSesion()
    expect(leerSesion()).toBeNull()
  })

  it('ignora datos corruptos o incompletos', () => {
    localStorage.setItem(CLAVE_SESION, '{no es json')
    expect(leerSesion()).toBeNull()
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ nombre: 'formato viejo de la EP2' }))
    expect(leerSesion()).toBeNull()
  })

  it('lee el payload del token y sabe si está vigente', () => {
    expect(leerPayload(crearToken(60)).exp).toBeGreaterThan(Date.now() / 1000)
    expect(tokenVigente(crearToken(60))).toBe(true)
    expect(tokenVigente(crearToken(-60))).toBe(false)
    expect(tokenVigente('basura')).toBe(false)
    expect(tokenVigente(undefined)).toBe(false)
    expect(leerPayload('a.b.c')).toBeNull()
  })
})
