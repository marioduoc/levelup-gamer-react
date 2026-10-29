// catálogo de productos. hace de "base de datos" guardando todo en localStorage
// para que no se pierda al recargar

export const productosIniciales = [
  {
    codigo: 'JM001',
    categoria: 'Juegos de Mesa',
    nombre: 'Catan',
    precio: 29990,
    oferta: 0,
    stock: 25,
    stockCritico: 5,
    imagen: '/img/JM001.jpg',
    descripcion:
      'Un clásico juego de estrategia donde los jugadores compiten por colonizar y expandirse en la isla de Catan. Ideal para 3-4 jugadores.',
  },
  {
    codigo: 'JM002',
    categoria: 'Juegos de Mesa',
    nombre: 'Carcassonne',
    precio: 24990,
    oferta: 20,
    stock: 18,
    stockCritico: 5,
    imagen: '/img/JM002.jpg',
    descripcion:
      'Un juego de colocación de fichas donde los jugadores construyen el paisaje alrededor de la fortaleza medieval de Carcassonne.',
  },
  {
    codigo: 'AC001',
    categoria: 'Accesorios',
    nombre: 'Controlador Inalámbrico Xbox Series X',
    precio: 59990,
    oferta: 0,
    stock: 40,
    stockCritico: 8,
    imagen: '/img/AC001.jpg',
    descripcion:
      'Ofrece una experiencia de juego cómoda con botones mapeables y una respuesta táctil mejorada.',
  },
  {
    codigo: 'AC002',
    categoria: 'Accesorios',
    nombre: 'Auriculares Gamer HyperX Cloud II',
    precio: 79990,
    oferta: 15,
    stock: 15,
    stockCritico: 5,
    imagen: '/img/AC002.jpg',
    descripcion:
      'Sonido envolvente de calidad con micrófono desmontable y almohadillas de espuma viscoelástica.',
  },
  {
    codigo: 'CO001',
    categoria: 'Consolas',
    nombre: 'PlayStation 5',
    precio: 549990,
    oferta: 0,
    stock: 6,
    stockCritico: 3,
    imagen: '/img/CO001.jpg',
    descripcion:
      'La consola de última generación de Sony, con gráficos impresionantes y tiempos de carga ultrarrápidos.',
  },
  {
    codigo: 'CG001',
    categoria: 'Computadores Gamers',
    nombre: 'PC Gamer ASUS ROG Strix',
    precio: 1299990,
    oferta: 10,
    stock: 4,
    stockCritico: 2,
    imagen: '/img/CG001.jpg',
    descripcion:
      'Un potente equipo diseñado para los gamers más exigentes, con los últimos componentes.',
  },
  {
    codigo: 'SG001',
    categoria: 'Sillas Gamers',
    nombre: 'Silla Gamer Secretlab Titan',
    precio: 349990,
    oferta: 0,
    stock: 10,
    stockCritico: 3,
    imagen: '/img/SG001.jpg',
    descripcion:
      'Diseñada para el máximo confort, con soporte ergonómico y personalización ajustable.',
  },
  {
    codigo: 'MS001',
    categoria: 'Mouse',
    nombre: 'Mouse Gamer Logitech G502 HERO',
    precio: 49990,
    oferta: 0,
    stock: 30,
    stockCritico: 8,
    imagen: '/img/MS001.jpg',
    descripcion:
      'Sensor de alta precisión y botones personalizables, ideal para un control preciso.',
  },
  {
    codigo: 'MP001',
    categoria: 'Mousepad',
    nombre: 'Mousepad Razer Goliathus Extended Chroma',
    precio: 29990,
    oferta: 0,
    stock: 22,
    stockCritico: 5,
    imagen: '/img/MP001.jpg',
    descripcion:
      'Área de juego amplia con iluminación RGB personalizable y superficie suave y uniforme.',
  },
  {
    codigo: 'PP001',
    categoria: 'Poleras Personalizadas',
    nombre: "Polera Gamer Personalizada 'Level-Up'",
    precio: 14990,
    oferta: 0,
    stock: 0,
    stockCritico: 5,
    imagen: '/img/PP001.jpg',
    descripcion:
      'Camiseta cómoda y estilizada, personalizable con tu gamer tag o diseño favorito.',
  },
]

const CLAVE_PRODUCTOS = 'levelup_productos'

// devuelve todos los productos. la primera vez copia los iniciales a localStorage
export function obtenerProductos() {
  try {
    const guardado = localStorage.getItem(CLAVE_PRODUCTOS)
    if (guardado) return JSON.parse(guardado)
  } catch {
    // si lo guardado quedó corrupto seguimos con los iniciales
  }
  const copia = JSON.parse(JSON.stringify(productosIniciales))
  localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(copia))
  return copia
}

export function guardarProductos(lista) {
  localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(lista))
}

export function buscarProducto(codigo) {
  return obtenerProductos().find((p) => p.codigo === codigo)
}

// si el código ya existe lo reemplaza, si no lo agrega (sirve para el admin de la ep3)
export function guardarProducto(producto) {
  const lista = obtenerProductos()
  const indice = lista.findIndex((p) => p.codigo === producto.codigo)
  if (indice === -1) {
    lista.push(producto)
  } else {
    lista[indice] = producto
  }
  guardarProductos(lista)
}

export function eliminarProducto(codigo) {
  guardarProductos(obtenerProductos().filter((p) => p.codigo !== codigo))
}

export function restaurarCatalogo() {
  guardarProductos(JSON.parse(JSON.stringify(productosIniciales)))
}

export function obtenerCategorias() {
  const categorias = obtenerProductos().map((p) => p.categoria)
  return [...new Set(categorias)]
}

export function obtenerOfertas() {
  return obtenerProductos().filter((p) => p.oferta > 0)
}

// precio ya con la oferta aplicada
export function precioFinal(producto) {
  if (!producto.oferta) return producto.precio
  return Math.round(producto.precio * (1 - producto.oferta / 100))
}

// baja el stock de lo comprado, se llama al pagar
export function descontarStock(itemsComprados) {
  const lista = obtenerProductos()
  itemsComprados.forEach((item) => {
    const producto = lista.find((p) => p.codigo === item.codigo)
    if (producto) producto.stock = Math.max(0, producto.stock - item.cantidad)
  })
  guardarProductos(lista)
}
