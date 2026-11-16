import api from './cliente.js'

export function login(correo, password) {
  return api.post('/auth/login', { correo, password }).then((r) => r.data)
}

export function registrar(datos) {
  return api.post('/auth/registro', datos).then((r) => r.data)
}
