// prueba los interceptores con un adapter falso, sin red
import api, { EVENTO_SESION_EXPIRADA, erroresDeCampos, mensajeError } from './cliente.js'
import { CLAVE_SESION, guardarSesion, leerSesion } from '../auth/sesion.js'

const USUARIO = { id: 3, nombre: 'Camila', rol: 'CLIENTE' }

function respuesta(config, status, data) {
  if (status >= 400) {
    const error = new Error(`status ${status}`)
    error.config = config
    error.response = { status, data }
    return Promise.reject(error)
  }
  return Promise.resolve({ data, status, statusText: 'OK', headers: {}, config })
}

let adapter
beforeEach(() => {
  localStorage.clear()
  adapter = vi.fn()
  api.defaults.adapter = adapter
})

describe('cliente axios', () => {
  it('sin sesión no envía Authorization', async () => {
    adapter.mockImplementation((config) => respuesta(config, 200, []))
    await api.get('/productos')
    expect(adapter.mock.calls[0][0].headers.Authorization).toBeUndefined()
  })

  it('con sesión agrega el header Bearer con el access token', async () => {
    guardarSesion({ accessToken: 'tok-acceso', refreshToken: 'tok-refresh', usuario: USUARIO })
    adapter.mockImplementation((config) => respuesta(config, 200, []))

    await api.get('/boletas/mias')

    expect(adapter.mock.calls[0][0].headers.Authorization).toBe('Bearer tok-acceso')
    expect(adapter.mock.calls[0][0].baseURL).toBe('/api/v1')
  })

  it('ante un 401 renueva los tokens y repite la petición una vez', async () => {
    guardarSesion({ accessToken: 'vencido', refreshToken: 'tok-refresh', usuario: USUARIO })
    adapter.mockImplementation((config) => {
      if (config.url === '/auth/refresh') {
        return respuesta(config, 200, { accessToken: 'nuevo', refreshToken: 'refresh-2', usuario: USUARIO })
      }
      return config.headers.Authorization === 'Bearer nuevo'
        ? respuesta(config, 200, ['ok'])
        : respuesta(config, 401, { mensaje: 'El token expiró.' })
    })

    const { data } = await api.get('/boletas/mias')

    expect(data).toEqual(['ok'])
    expect(leerSesion().accessToken).toBe('nuevo')
    expect(leerSesion().refreshToken).toBe('refresh-2')
    const refresh = adapter.mock.calls.find(([c]) => c.url === '/auth/refresh')[0]
    expect(JSON.parse(refresh.data)).toEqual({ refreshToken: 'tok-refresh' })
  })

  it('si varias peticiones reciben 401 a la vez se hace un solo refresh', async () => {
    guardarSesion({ accessToken: 'vencido', refreshToken: 'tok-refresh', usuario: USUARIO })
    adapter.mockImplementation((config) => {
      if (config.url === '/auth/refresh') {
        return respuesta(config, 200, { accessToken: 'nuevo', refreshToken: 'r2', usuario: USUARIO })
      }
      return config.headers.Authorization === 'Bearer nuevo'
        ? respuesta(config, 200, 'ok')
        : respuesta(config, 401, {})
    })

    await Promise.all([api.get('/a'), api.get('/b'), api.get('/c')])

    expect(adapter.mock.calls.filter(([c]) => c.url === '/auth/refresh')).toHaveLength(1)
  })

  it('si el refresh falla borra la sesión y avisa con un evento', async () => {
    guardarSesion({ accessToken: 'vencido', refreshToken: 'malo', usuario: USUARIO })
    adapter.mockImplementation((config) => respuesta(config, 401, { mensaje: 'no' }))
    const alExpirar = vi.fn()
    window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirar)

    await expect(api.get('/usuarios/me')).rejects.toMatchObject({ response: { status: 401 } })

    expect(localStorage.getItem(CLAVE_SESION)).toBeNull()
    expect(alExpirar).toHaveBeenCalledTimes(1)
    window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirar)
  })

  it('un 401 del login no intenta renovar (credenciales malas)', async () => {
    guardarSesion({ accessToken: 'x', refreshToken: 'y', usuario: USUARIO })
    adapter.mockImplementation((config) => respuesta(config, 401, { mensaje: 'Correo o contraseña incorrectos.' }))

    await expect(api.post('/auth/login', {})).rejects.toBeTruthy()
    expect(adapter).toHaveBeenCalledTimes(1)
  })

  it('un 403 no se reintenta', async () => {
    guardarSesion({ accessToken: 'x', refreshToken: 'y', usuario: USUARIO })
    adapter.mockImplementation((config) => respuesta(config, 403, {}))

    await expect(api.get('/usuarios')).rejects.toBeTruthy()
    expect(adapter).toHaveBeenCalledTimes(1)
  })
})

describe('mensajes de error', () => {
  it('usa el mensaje del backend si viene', () => {
    expect(mensajeError({ response: { data: { mensaje: 'Stock insuficiente' } } })).toBe('Stock insuficiente')
  })

  it('sin respuesta del servidor avisa que no hubo conexión', () => {
    expect(mensajeError({ request: {} })).toBe('No se pudo conectar con el servidor.')
  })

  it('en otro caso usa el texto por defecto', () => {
    expect(mensajeError({}, 'por defecto')).toBe('por defecto')
    expect(mensajeError(undefined)).toBe('Ocurrió un error inesperado.')
  })

  it('erroresDeCampos devuelve los campos o un objeto vacío', () => {
    expect(erroresDeCampos({ response: { data: { campos: { run: 'mal' } } } })).toEqual({ run: 'mal' })
    expect(erroresDeCampos({})).toEqual({})
  })
})
