// Funciones puras del carrito. Reciben el carrito actual y devuelven uno NUEVO
// (no modifican el original). Así React detecta el cambio y vuelve a dibujar.
//
// Un item del carrito se ve así:
// { codigo, nombre, precio, imagen, stock, cantidad }

import { precioFinal } from '../datos/productos.js'

export const CLAVE_CARRITO = 'levelup_carrito'
export const DESCUENTO_DUOC = 0.2 // 20 % de por vida para correos Duoc

// Lee el carrito guardado en el navegador (si existe).
export function leerCarritoGuardado() {
  try {
    const guardado = localStorage.getItem(CLAVE_CARRITO)
    return guardado ? JSON.parse(guardado) : []
  } catch {
    return []
  }
}

// Agrega una unidad del producto. Si ya estaba, suma 1.
// Si no hay stock suficiente, devuelve el mismo carrito sin cambios.
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

// Quita un producto completo del carrito.
export function quitarProducto(carrito, codigo) {
  return carrito.filter((item) => item.codigo !== codigo)
}

// Cambia la cantidad de un producto. Si queda en 0 o menos, lo quita.
// Nunca supera el stock disponible.
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

// Cuántas unidades hay en total (para el contador de la barra).
export function contarItems(carrito) {
  return carrito.reduce((total, item) => total + item.cantidad, 0)
}

// Suma de precio x cantidad de todos los items.
export function calcularSubtotal(carrito) {
  return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0)
}

// ¿El correo tiene derecho al descuento Duoc?
export function tieneDescuentoDuoc(correo) {
  return /@(duoc\.cl|profesor\.duoc\.cl)$/i.test(correo || '')
}

// Monto del descuento (0 si no aplica).
export function calcularDescuento(carrito, correo) {
  if (!tieneDescuentoDuoc(correo)) return 0
  return Math.round(calcularSubtotal(carrito) * DESCUENTO_DUOC)
}

// Total final a pagar.
export function calcularTotal(carrito, correo) {
  return calcularSubtotal(carrito) - calcularDescuento(carrito, correo)
}

// Formato chileno: 29990 -> "$29.990 CLP"
export function formatearPrecio(valor) {
  return '$' + valor.toLocaleString('es-CL') + ' CLP'
}
