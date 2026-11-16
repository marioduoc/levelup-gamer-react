import api from './cliente.js'

// solo se envía código y cantidad; el backend calcula precios, descuento y total
export function comprar(datosEnvio, carrito) {
  const items = carrito.map(({ codigo, cantidad }) => ({ codigo, cantidad }))
  return api.post('/boletas', { ...datosEnvio, items }).then((r) => r.data)
}

export function misBoletas() {
  return api.get('/boletas/mias').then((r) => r.data)
}

export function listarBoletas() {
  return api.get('/boletas').then((r) => r.data)
}

export function obtenerBoleta(id) {
  return api.get(`/boletas/${id}`).then((r) => r.data)
}

export function anularBoleta(id) {
  return api.put(`/boletas/${id}/estado`, { estado: 'ANULADA' }).then((r) => r.data)
}

export function eliminarBoleta(id) {
  return api.delete(`/boletas/${id}`)
}
