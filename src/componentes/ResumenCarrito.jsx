import { calcularSubtotal, calcularDescuento, calcularTotal, formatearPrecio } from '../utils/carrito.js'

// subtotal, descuento (si el correo es duoc) y total
export default function ResumenCarrito({ carrito, correo }) {
  const subtotal = calcularSubtotal(carrito)
  const descuento = calcularDescuento(carrito, correo)
  const total = calcularTotal(carrito, correo)

  return (
    <div className="border rounded p-3">
      <div className="d-flex justify-content-between">
        <span>Subtotal</span>
        <span>{formatearPrecio(subtotal)}</span>
      </div>

      {descuento > 0 && (
        <div className="d-flex justify-content-between text-success">
          <span>Descuento Duoc (20%)</span>
          <span>- {formatearPrecio(descuento)}</span>
        </div>
      )}

      <hr />
      <div className="d-flex justify-content-between fw-bold">
        <span>Total</span>
        <span className="price">{formatearPrecio(total)}</span>
      </div>
    </div>
  )
}
