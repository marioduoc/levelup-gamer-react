// secciones del panel y el permiso que exige cada una
export const SECCIONES = [
  { ruta: '/admin/productos', texto: 'Productos', permiso: 'verProductos', descripcion: 'Catálogo y stock' },
  { ruta: '/admin/categorias', texto: 'Categorías', permiso: 'gestionarCategorias', descripcion: 'Crear y ordenar categorías' },
  { ruta: '/admin/ordenes', texto: 'Órdenes', permiso: 'verOrdenes', descripcion: 'Compras de los clientes' },
  { ruta: '/admin/usuarios', texto: 'Usuarios', permiso: 'gestionarUsuarios', descripcion: 'Cuentas y roles' },
]
