// funciones del carrito. devuelven un carrito nuevo en vez de modificar el que llega,
// si no React no se entera del cambio
import { precioFinal } from '../datos/productos.js'

export const CLAVE_CARRITO = 'levelup_carrito'
export const DESCUENTO_DUOC = 0.2 // 20% para correos duoc

export function leerCarritoGuardado() {
  try {
    const guardado = localStorage.getItem(CLAVE_CARRITO)
    return guardado ? JSON.parse(guardado) : []
  } catch {
    return []
  }
}

// agrega 1. si ya estaba suma 1, y si no alcanza el stock no hace nada
export function agregarProducto(carrito, producto) {
  const existente = carrito.find((item) => item.codigo === producto.codigo)
  const cantidadActual = existente ? existente.cantidad : 0

  if (cantidadActual + 1 > producto.stock) {
    return carrito
  }

  if (existente) {
    return carrito.map((item) =>
      item.codigo === producto.codigo ? { ...item, cantidad: item.cantidad + 1 } : item,
    )
  }

  return [
    ...carrito,
    {
      codigo: producto.codigo,
      nombre: producto.nombre,
      precio: precioFinal(producto),
      imagen: producto.imagen,
      stock: producto.stock,
      cantidad: 1,
    },
  ]
}

export function quitarProducto(carrito, codigo) {
  return carrito.filter((item) => item.codigo !== codigo)
}

// si la cantidad llega a 0 el producto se saca, y nunca pasa del stock
export function cambiarCantidad(carrito, codigo, nuevaCantidad) {
  if (nuevaCantidad <= 0) {
    return quitarProducto(carrito, codigo)
  }
  return carrito.map((item) => {
    if (item.codigo !== codigo) return item
    const cantidad = Math.min(nuevaCantidad, item.stock)
    return { ...item, cantidad }
  })
}

// total de unidades, lo usa el contador de la barra
export function contarItems(carrito) {
  return carrito.reduce((total, item) => total + item.cantidad, 0)
}

export function calcularSubtotal(carrito) {
  return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0)
}

export function tieneDescuentoDuoc(correo) {
  return /@(duoc\.cl|profesor\.duoc\.cl)$/i.test(correo || '')
}

export function calcularDescuento(carrito, correo) {
  if (!tieneDescuentoDuoc(correo)) return 0
  return Math.round(calcularSubtotal(carrito) * DESCUENTO_DUOC)
}

export function calcularTotal(carrito, correo) {
  return calcularSubtotal(carrito) - calcularDescuento(carrito, correo)
}

// 29990 -> "$29.990 CLP"
export function formatearPrecio(valor) {
  return '$' + valor.toLocaleString('es-CL') + ' CLP'
}
