import api from './cliente.js'

export function listarProductos(filtros = {}) {
  return api.get('/productos', { params: filtros }).then((r) => r.data)
}

export function obtenerProducto(codigo) {
  return api.get(`/productos/${codigo}`).then((r) => r.data)
}

export function productosStockCritico() {
  return api.get('/productos/stock-critico').then((r) => r.data)
}

export function crearProducto(producto) {
  return api.post('/productos', producto).then((r) => r.data)
}

export function actualizarProducto(codigo, producto) {
  return api.put(`/productos/${codigo}`, producto).then((r) => r.data)
}

export function eliminarProducto(codigo) {
  return api.delete(`/productos/${codigo}`)
}
