import api from './cliente.js'

export function listarUsuarios() {
  return api.get('/usuarios').then((r) => r.data)
}

export function obtenerUsuario(id) {
  return api.get(`/usuarios/${id}`).then((r) => r.data)
}

export function crearUsuario(usuario) {
  return api.post('/usuarios', usuario).then((r) => r.data)
}

export function actualizarUsuario(id, usuario) {
  return api.put(`/usuarios/${id}`, usuario).then((r) => r.data)
}

export function eliminarUsuario(id) {
  return api.delete(`/usuarios/${id}`)
}
