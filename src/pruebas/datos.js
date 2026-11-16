// datos falsos con la misma forma que responde la API, para las pruebas

export const CATEGORIAS = [
  {
    id: 1,
    nombre: 'Juegos de Mesa'
  },
  {
    id: 2,
    nombre: 'Accesorios'
  },
  {
    id: 3,
    nombre: 'Consolas'
  },
  {
    id: 4,
    nombre: 'Computadores Gamers'
  },
  {
    id: 5,
    nombre: 'Sillas Gamers'
  },
  {
    id: 6,
    nombre: 'Mouse'
  },
  {
    id: 7,
    nombre: 'Mousepad'
  },
  {
    id: 8,
    nombre: 'Poleras Personalizadas'
  }
]

export const PRODUCTOS = [
  {
    codigo: 'JM001',
    nombre: 'Catan',
    descripcion: 'Un clásico juego de estrategia donde los jugadores compiten por colonizar y expandirse en la isla de Catan. Ideal para 3-4 jugadores.',
    precio: 29990,
    oferta: 0,
    precioFinal: 29990,
    stock: 25,
    stockCritico: 5,
    stockBajo: false,
    imagen: '/img/JM001.jpg',
    categoriaId: 1,
    categoria: 'Juegos de Mesa'
  },
  {
    codigo: 'JM002',
    nombre: 'Carcassonne',
    descripcion: 'Un juego de colocación de fichas donde los jugadores construyen el paisaje alrededor de la fortaleza medieval de Carcassonne.',
    precio: 24990,
    oferta: 20,
    precioFinal: 19992,
    stock: 18,
    stockCritico: 5,
    stockBajo: false,
    imagen: '/img/JM002.jpg',
    categoriaId: 1,
    categoria: 'Juegos de Mesa'
  },
  {
    codigo: 'AC001',
    nombre: 'Controlador Inalámbrico Xbox Series X',
    descripcion: 'Ofrece una experiencia de juego cómoda con botones mapeables y una respuesta táctil mejorada.',
    precio: 59990,
    oferta: 0,
    precioFinal: 59990,
    stock: 40,
    stockCritico: 8,
    stockBajo: false,
    imagen: '/img/AC001.jpg',
    categoriaId: 2,
    categoria: 'Accesorios'
  },
  {
    codigo: 'AC002',
    nombre: 'Auriculares Gamer HyperX Cloud II',
    descripcion: 'Sonido envolvente de calidad con micrófono desmontable y almohadillas de espuma viscoelástica.',
    precio: 79990,
    oferta: 15,
    precioFinal: 67992,
    stock: 15,
    stockCritico: 5,
    stockBajo: false,
    imagen: '/img/AC002.jpg',
    categoriaId: 2,
    categoria: 'Accesorios'
  },
  {
    codigo: 'CO001',
    nombre: 'PlayStation 5',
    descripcion: 'La consola de última generación de Sony, con gráficos impresionantes y tiempos de carga ultrarrápidos.',
    precio: 549990,
    oferta: 0,
    precioFinal: 549990,
    stock: 6,
    stockCritico: 3,
    stockBajo: false,
    imagen: '/img/CO001.jpg',
    categoriaId: 3,
    categoria: 'Consolas'
  },
  {
    codigo: 'CG001',
    nombre: 'PC Gamer ASUS ROG Strix',
    descripcion: 'Un potente equipo diseñado para los gamers más exigentes, con los últimos componentes.',
    precio: 1299990,
    oferta: 10,
    precioFinal: 1169991,
    stock: 4,
    stockCritico: 2,
    stockBajo: false,
    imagen: '/img/CG001.jpg',
    categoriaId: 4,
    categoria: 'Computadores Gamers'
  },
  {
    codigo: 'SG001',
    nombre: 'Silla Gamer Secretlab Titan',
    descripcion: 'Diseñada para el máximo confort, con soporte ergonómico y personalización ajustable.',
    precio: 349990,
    oferta: 0,
    precioFinal: 349990,
    stock: 10,
    stockCritico: 3,
    stockBajo: false,
    imagen: '/img/SG001.jpg',
    categoriaId: 5,
    categoria: 'Sillas Gamers'
  },
  {
    codigo: 'MS001',
    nombre: 'Mouse Gamer Logitech G502 HERO',
    descripcion: 'Sensor de alta precisión y botones personalizables, ideal para un control preciso.',
    precio: 49990,
    oferta: 0,
    precioFinal: 49990,
    stock: 30,
    stockCritico: 8,
    stockBajo: false,
    imagen: '/img/MS001.jpg',
    categoriaId: 6,
    categoria: 'Mouse'
  },
  {
    codigo: 'MP001',
    nombre: 'Mousepad Razer Goliathus Extended Chroma',
    descripcion: 'Área de juego amplia con iluminación RGB personalizable y superficie suave y uniforme.',
    precio: 29990,
    oferta: 0,
    precioFinal: 29990,
    stock: 22,
    stockCritico: 5,
    stockBajo: false,
    imagen: '/img/MP001.jpg',
    categoriaId: 7,
    categoria: 'Mousepad'
  },
  {
    codigo: 'PP001',
    nombre: "Polera Gamer Personalizada 'Level-Up'",
    descripcion: 'Camiseta cómoda y estilizada, personalizable con tu gamer tag o diseño favorito.',
    precio: 14990,
    oferta: 0,
    precioFinal: 14990,
    stock: 0,
    stockCritico: 5,
    stockBajo: true,
    imagen: '/img/PP001.jpg',
    categoriaId: 8,
    categoria: 'Poleras Personalizadas'
  }
]

const BASE_USUARIO = { fechaNacimiento: '2000-01-01', region: 'Valparaíso', comuna: 'Viña del Mar', direccion: 'Calle 3', activo: true }

export const USUARIOS = {
  admin: { ...BASE_USUARIO, id: 1, run: '111111111', nombre: 'Ana', apellidos: 'Rojas', correo: 'admin@duoc.cl', rol: 'ADMIN' },
  vendedor: { ...BASE_USUARIO, id: 2, run: '222222222', nombre: 'Bruno', apellidos: 'Soto', correo: 'vendedor@duoc.cl', rol: 'VENDEDOR' },
  cliente: { ...BASE_USUARIO, id: 3, run: '333333333', nombre: 'Camila', apellidos: 'Muñoz', correo: 'cliente@gmail.com', rol: 'CLIENTE' },
}

export const BOLETA = {
  id: 1,
  numero: '20261110-1001',
  fecha: '2026-11-10T15:30:00',
  subtotal: 29990,
  descuento: 0,
  total: 29990,
  estado: 'APROBADA',
  usuarioId: 3,
  nombreCliente: 'Camila',
  apellidosCliente: 'Muñoz',
  correoCliente: 'cliente@gmail.com',
  calle: 'Calle 3',
  departamento: null,
  region: 'Valparaíso',
  comuna: 'Viña del Mar',
  indicaciones: null,
  detalles: [{ codigo: 'JM001', nombre: 'Catan', cantidad: 1, precioUnitario: 29990, subtotal: 29990 }],
}

// JWT falso: solo importa el payload con exp (segundos desde ahora)
export function crearToken(segundos = 1800) {
  const payload = btoa(JSON.stringify({ sub: '1', exp: Math.floor(Date.now() / 1000) + segundos }))
  return `cabecera.${payload}.firma`
}

export function respuestaLogin(usuario) {
  return { accessToken: crearToken(), refreshToken: crearToken(7 * 86400), tipo: 'Bearer', expiraEnSegundos: 1800, usuario }
}
