// qué roles pueden hacer cada cosa. un solo lugar para la barra, el panel, los botones y las rutas
export const PERMISOS = {
  comprar: ['CLIENTE', 'ADMIN'],
  verPanel: ['ADMIN', 'VENDEDOR'],
  verProductos: ['ADMIN', 'VENDEDOR'],
  editarProductos: ['ADMIN'],
  gestionarCategorias: ['ADMIN'],
  verOrdenes: ['ADMIN', 'VENDEDOR'],
  gestionarOrdenes: ['ADMIN'],
  gestionarUsuarios: ['ADMIN'],
  verStockCritico: ['ADMIN'],
}

export function puede(usuario, permiso) {
  return !!usuario && (PERMISOS[permiso] ?? []).includes(usuario.rol)
}

// un visitante sin cuenta también arma su carrito; inicia sesión al pagar
export function puedeUsarCarrito(usuario) {
  return !usuario || puede(usuario, 'comprar')
}
