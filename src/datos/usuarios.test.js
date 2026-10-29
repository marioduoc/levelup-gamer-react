import { obtenerUsuarios, registrarUsuario, iniciarSesion, eliminarUsuario } from './usuarios.js'

const ANA = { run: '19011022K', nombre: 'Ana', correo: 'ana@duoc.cl', password: '1234' }

beforeEach(() => localStorage.clear())

describe('registrarUsuario', () => {
  it('registra un usuario nuevo', () => {
    expect(registrarUsuario(ANA)).toEqual({ ok: true })
    expect(obtenerUsuarios()).toHaveLength(1)
  })

  it('no permite repetir el RUN ni el correo', () => {
    registrarUsuario(ANA)
    expect(registrarUsuario({ ...ANA, correo: 'otra@duoc.cl' }).error).toMatch(/RUN/)
    expect(registrarUsuario({ ...ANA, run: '111111111', correo: 'ANA@duoc.cl' }).error).toMatch(/correo/)
    expect(obtenerUsuarios()).toHaveLength(1)
  })
})

describe('iniciarSesion', () => {
  it('devuelve el usuario si el correo y la contraseña coinciden', () => {
    registrarUsuario(ANA)
    expect(iniciarSesion('Ana@Duoc.cl', '1234').nombre).toBe('Ana')
  })

  it('devuelve null si la contraseña es incorrecta o el usuario no existe', () => {
    registrarUsuario(ANA)
    expect(iniciarSesion('ana@duoc.cl', 'mala')).toBeNull()
    expect(iniciarSesion('nadie@duoc.cl', '1234')).toBeNull()
  })
})

describe('eliminarUsuario y datos corruptos', () => {
  it('elimina por RUN', () => {
    registrarUsuario(ANA)
    eliminarUsuario(ANA.run)
    expect(obtenerUsuarios()).toEqual([])
  })

  it('si lo guardado está corrupto devuelve una lista vacía', () => {
    localStorage.setItem('levelup_usuarios', 'xx')
    expect(obtenerUsuarios()).toEqual([])
  })
})
