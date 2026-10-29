// Reglas de validación de los formularios (las mismas de la Evaluación 1,
// ahora como funciones que devuelven un objeto con los errores encontrados).

const DOMINIOS_CORREO_VALIDOS = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com']

export function validarCorreo(correo) {
  const partes = correo.split('@')
  if (partes.length !== 2) return false
  const dominio = partes[1].toLowerCase()
  return DOMINIOS_CORREO_VALIDOS.includes(dominio) && correo.length <= 100
}

// RUN chileno sin puntos ni guión, ej: 19011022K. Verifica el dígito verificador.
export function validarRun(run) {
  const limpio = run.trim().toUpperCase()
  if (!/^[0-9]{6,8}[0-9K]$/.test(limpio)) return false

  const cuerpo = limpio.slice(0, -1)
  const dv = limpio.slice(-1)

  let suma = 0
  let multiplo = 2
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo
    multiplo = multiplo === 7 ? 2 : multiplo + 1
  }
  const resto = 11 - (suma % 11)
  const dvEsperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto)

  return dv === dvEsperado
}

export function calcularEdad(fechaNacimiento) {
  const hoy = new Date()
  // Se agrega la hora para que la fecha se interprete en hora local y no en UTC
  // (sin esto, en Chile la fecha quedaba corrida un día hacia atrás).
  const nacimiento = new Date(fechaNacimiento + 'T00:00:00')
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const mes = hoy.getMonth() - nacimiento.getMonth()
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--
  }
  return edad
}

// Devuelve un objeto { campo: 'mensaje' }. Si está vacío, el formulario es válido.
export function validarRegistro(datos) {
  const errores = {}

  if (!validarRun(datos.run || '')) {
    errores.run = 'RUN inválido. Formato: 123456785 (sin puntos ni guión).'
  }
  if (!datos.nombre?.trim() || datos.nombre.length > 50) {
    errores.nombre = 'El nombre es requerido (máx. 50 caracteres).'
  }
  if (!datos.apellidos?.trim() || datos.apellidos.length > 100) {
    errores.apellidos = 'Los apellidos son requeridos (máx. 100 caracteres).'
  }
  if (!validarCorreo(datos.correo || '')) {
    errores.correo = 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.'
  }
  if (!datos.password || datos.password.length < 4 || datos.password.length > 10) {
    errores.password = 'La contraseña debe tener entre 4 y 10 caracteres.'
  }
  if (!datos.fechaNacimiento) {
    errores.fechaNacimiento = 'La fecha de nacimiento es requerida.'
  } else if (calcularEdad(datos.fechaNacimiento) < 18) {
    errores.fechaNacimiento = 'Debes ser mayor de 18 años para registrarte.'
  }
  if (!datos.region) {
    errores.region = 'Selecciona una región.'
  }
  if (!datos.comuna) {
    errores.comuna = 'Selecciona una comuna.'
  }
  if (!datos.direccion?.trim() || datos.direccion.length > 300) {
    errores.direccion = 'La dirección es requerida (máx. 300 caracteres).'
  }

  return errores
}

export function validarContacto(datos) {
  const errores = {}

  if (!datos.nombre?.trim() || datos.nombre.length > 100) {
    errores.nombre = 'El nombre es requerido (máx. 100 caracteres).'
  }
  if (!validarCorreo(datos.correo || '')) {
    errores.correo = 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.'
  }
  if (!datos.asunto) {
    errores.asunto = 'Selecciona un motivo.'
  }
  if (!datos.comentario?.trim() || datos.comentario.length > 500) {
    errores.comentario = 'El comentario es requerido (máx. 500 caracteres).'
  }

  return errores
}

export function validarCheckout(datos) {
  const errores = {}

  if (!datos.nombre?.trim()) errores.nombre = 'El nombre es requerido.'
  if (!datos.apellidos?.trim()) errores.apellidos = 'Los apellidos son requeridos.'
  if (!validarCorreo(datos.correo || '')) {
    errores.correo = 'Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.'
  }
  if (!datos.calle?.trim()) errores.calle = 'La calle es requerida.'
  if (!datos.region) errores.region = 'Selecciona una región.'
  if (!datos.comuna) errores.comuna = 'Selecciona una comuna.'
  if (!/^\d{16}$/.test((datos.tarjeta || '').replace(/\s/g, ''))) {
    errores.tarjeta = 'Ingresa los 16 dígitos de la tarjeta.'
  }

  return errores
}
