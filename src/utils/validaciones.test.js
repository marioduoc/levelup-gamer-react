import {
  validarCorreo,
  validarRun,
  calcularEdad,
  validarRegistro,
  validarContacto,
  validarCheckout,
} from './validaciones.js'

describe('validarCorreo', () => {
  it('acepta solo los dominios permitidos', () => {
    expect(validarCorreo('ana@duoc.cl')).toBe(true)
    expect(validarCorreo('ana@profesor.duoc.cl')).toBe(true)
    expect(validarCorreo('ana@gmail.com')).toBe(true)
    expect(validarCorreo('ana@hotmail.com')).toBe(false)
  })

  it('rechaza correos mal formados o muy largos', () => {
    expect(validarCorreo('sin-arroba')).toBe(false)
    expect(validarCorreo('a@b@gmail.com')).toBe(false)
    expect(validarCorreo('a'.repeat(95) + '@gmail.com')).toBe(false)
  })
})

describe('validarRun', () => {
  it('acepta un RUN con dígito verificador correcto', () => {
    expect(validarRun('123456785')).toBe(true)
    expect(validarRun('111111111')).toBe(true)
    expect(validarRun('12345605K')).toBe(true) // dígito verificador K
    expect(validarRun(' 12345605k ')).toBe(true) // tolera espacios y minúscula
  })

  it('rechaza un RUN con dígito verificador incorrecto o formato inválido', () => {
    expect(validarRun('123456784')).toBe(false)
    expect(validarRun('19011022K')).toBe(false) // el ejemplo del sitio antiguo no era válido
    expect(validarRun('19.011.022-K')).toBe(false)
    expect(validarRun('123')).toBe(false)
    expect(validarRun('')).toBe(false)
  })
})

describe('calcularEdad', () => {
  it('calcula la edad a partir de la fecha de nacimiento', () => {
    const hace20 = new Date()
    hace20.setFullYear(hace20.getFullYear() - 20)
    expect(calcularEdad(hace20.toISOString().slice(0, 10))).toBe(20)
  })

  it('resta un año si todavía no cumple años este año', () => {
    const manana = new Date()
    manana.setDate(manana.getDate() + 1)
    manana.setFullYear(manana.getFullYear() - 18)
    expect(calcularEdad(manana.toISOString().slice(0, 10))).toBe(17)
  })
})

const REGISTRO_VALIDO = {
  run: '123456785',
  nombre: 'Ana',
  apellidos: 'Pérez',
  correo: 'ana@duoc.cl',
  password: '1234',
  fechaNacimiento: '1990-05-10',
  region: 'Maule',
  comuna: 'Talca',
  direccion: 'Calle 123',
}

describe('validarRegistro', () => {
  it('no devuelve errores con datos correctos', () => {
    expect(validarRegistro(REGISTRO_VALIDO)).toEqual({})
  })

  it('devuelve un error por cada campo inválido', () => {
    const errores = validarRegistro({ ...REGISTRO_VALIDO, run: '1', correo: 'x', password: '12', comuna: '' })
    expect(Object.keys(errores)).toEqual(['run', 'correo', 'password', 'comuna'])
  })

  it('exige ser mayor de 18 años', () => {
    const errores = validarRegistro({ ...REGISTRO_VALIDO, fechaNacimiento: new Date().toISOString().slice(0, 10) })
    expect(errores.fechaNacimiento).toMatch(/mayor de 18/)
  })

  it('marca todo como requerido si el formulario viene vacío', () => {
    const errores = validarRegistro({})
    expect(Object.keys(errores)).toHaveLength(9)
  })
})

describe('validarContacto', () => {
  it('acepta un mensaje completo', () => {
    expect(validarContacto({ nombre: 'Ana', correo: 'ana@gmail.com', asunto: 'otro', comentario: 'Hola' })).toEqual({})
  })

  it('exige nombre, correo válido, motivo y comentario', () => {
    const errores = validarContacto({ nombre: '', correo: 'malo', asunto: '', comentario: ' ' })
    expect(errores).toHaveProperty('nombre')
    expect(errores).toHaveProperty('correo')
    expect(errores).toHaveProperty('asunto')
    expect(errores).toHaveProperty('comentario')
  })
})

describe('validarCheckout', () => {
  const CHECKOUT_VALIDO = {
    nombre: 'Ana',
    apellidos: 'Pérez',
    correo: 'ana@gmail.com',
    calle: 'Los Crisantemos 12',
    region: 'Maule',
    comuna: 'Talca',
    tarjeta: '4111 1111 1111 1111',
  }

  it('acepta datos completos', () => {
    expect(validarCheckout(CHECKOUT_VALIDO)).toEqual({})
  })

  it('exige los 16 dígitos de la tarjeta', () => {
    expect(validarCheckout({ ...CHECKOUT_VALIDO, tarjeta: '1234' })).toHaveProperty('tarjeta')
  })

  it('detecta los campos obligatorios vacíos', () => {
    const errores = validarCheckout({})
    expect(Object.keys(errores).sort()).toEqual(['apellidos', 'calle', 'comuna', 'correo', 'nombre', 'region', 'tarjeta'])
  })
})
