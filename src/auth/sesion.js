// sesión guardada en localStorage para que sobreviva a recargas: { accessToken, refreshToken, usuario }

export const CLAVE_SESION = 'levelup_sesion'

export function leerSesion() {
  try {
    const guardada = JSON.parse(localStorage.getItem(CLAVE_SESION))
    return guardada?.accessToken && guardada?.usuario ? guardada : null
  } catch {
    return null
  }
}

export function guardarSesion({ accessToken, refreshToken, usuario }) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify({ accessToken, refreshToken, usuario }))
}

export function borrarSesion() {
  localStorage.removeItem(CLAVE_SESION)
}

// el payload de un JWT es JSON en base64url; se lee sin verificar la firma (eso lo hace el backend)
export function leerPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

export function tokenVigente(token) {
  const payload = token ? leerPayload(token) : null
  return !!payload?.exp && payload.exp * 1000 > Date.now()
}
