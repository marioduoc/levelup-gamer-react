// usuarios registrados, guardados en localStorage

const CLAVE_USUARIOS = 'levelup_usuarios'

export function obtenerUsuarios() {
  try {
    const guardado = localStorage.getItem(CLAVE_USUARIOS)
    return guardado ? JSON.parse(guardado) : []
  } catch {
    return []
  }
}

function guardarUsuarios(usuarios) {
  localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios))
}

// registra un usuario nuevo, no deja repetir run ni correo. devuelve { ok, error }
export function registrarUsuario(usuario) {
  const usuarios = obtenerUsuarios()

  if (usuarios.some((u) => u.run === usuario.run)) {
    return { ok: false, error: 'Ya existe un usuario registrado con ese RUN.' }
  }
  if (usuarios.some((u) => u.correo.toLowerCase() === usuario.correo.toLowerCase())) {
    return { ok: false, error: 'Ya existe un usuario registrado con ese correo.' }
  }

  usuarios.push(usuario)
  guardarUsuarios(usuarios)
  return { ok: true }
}

// busca por correo + contraseña, devuelve el usuario o null
export function iniciarSesion(correo, password) {
  const usuario = obtenerUsuarios().find(
    (u) => u.correo.toLowerCase() === correo.toLowerCase() && u.password === password,
  )
  return usuario ?? null
}

export function eliminarUsuario(run) {
  guardarUsuarios(obtenerUsuarios().filter((u) => u.run !== run))
}
