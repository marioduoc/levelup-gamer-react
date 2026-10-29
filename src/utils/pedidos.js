// pago simulado y guardado de pedidos (todavía no hay backend real)

import { descontarStock } from '../datos/productos.js'

const CLAVE_PEDIDOS = 'levelup_pedidos'

export function obtenerPedidos() {
  try {
    const guardado = localStorage.getItem(CLAVE_PEDIDOS)
    return guardado ? JSON.parse(guardado) : []
  } catch {
    return []
  }
}

// número de orden con la fecha, ej 20261028-1234
export function generarNumeroOrden(fecha = new Date()) {
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  const correlativo = String(Math.floor(Math.random() * 9000) + 1000)
  return `${anio}${mes}${dia}-${correlativo}`
}

// regla inventada de la pasarela: si la tarjeta termina en 0 se rechaza.
// así puedo mostrar los dos casos (compra ok y pago fallido) en la presentación
export function pagoAprobado(numeroTarjeta) {
  const limpio = (numeroTarjeta || '').replace(/\s/g, '')
  return limpio.length === 16 && !limpio.endsWith('0')
}

// arma el pedido y lo deja 'aprobado' o 'rechazado' según la tarjeta
export function procesarPago(carrito, datosCliente, total) {
  const pedido = {
    numero: generarNumeroOrden(),
    fecha: new Date().toISOString(),
    cliente: datosCliente,
    items: carrito,
    total,
    estado: pagoAprobado(datosCliente.tarjeta) ? 'aprobado' : 'rechazado',
  }

  if (pedido.estado === 'aprobado') {
    descontarStock(carrito)
  }

  const pedidos = obtenerPedidos()
  pedidos.push(pedido)
  localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(pedidos))

  return pedido
}
