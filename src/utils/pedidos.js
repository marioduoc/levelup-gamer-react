// Simulación del pago y registro de pedidos (no hay backend todavía).

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

// Genera un número de orden con la fecha, ej: 20261028-1234
export function generarNumeroOrden(fecha = new Date()) {
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  const correlativo = String(Math.floor(Math.random() * 9000) + 1000)
  return `${anio}${mes}${dia}-${correlativo}`
}

// Regla de la "pasarela" simulada: una tarjeta que termina en 0 se rechaza.
// Sirve para mostrar en la presentación tanto la compra exitosa como la fallida.
export function pagoAprobado(numeroTarjeta) {
  const limpio = (numeroTarjeta || '').replace(/\s/g, '')
  return limpio.length === 16 && !limpio.endsWith('0')
}

// Procesa la compra. Devuelve el pedido con su estado ('aprobado' o 'rechazado').
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
