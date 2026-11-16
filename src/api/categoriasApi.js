import api from './cliente.js'

export function listarCategorias() {
  return api.get('/categorias').then((r) => r.data)
}

export function crearCategoria(nombre) {
  return api.post('/categorias', { nombre }).then((r) => r.data)
}

export function actualizarCategoria(id, nombre) {
  return api.put(`/categorias/${id}`, { nombre }).then((r) => r.data)
}

export function eliminarCategoria(id) {
  return api.delete(`/categorias/${id}`)
}
