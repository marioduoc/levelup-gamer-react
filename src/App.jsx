import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router'
import { Alert, Container } from 'react-bootstrap'

import Layout from './componentes/Layout.jsx'
import Inicio from './paginas/Inicio.jsx'
import Catalogo from './paginas/Catalogo.jsx'
import Categorias from './paginas/Categorias.jsx'
import Ofertas from './paginas/Ofertas.jsx'
import DetalleProducto from './paginas/DetalleProducto.jsx'
import Carrito from './paginas/Carrito.jsx'
import Checkout from './paginas/Checkout.jsx'
import ResultadoCompra from './paginas/ResultadoCompra.jsx'
import Registro from './paginas/Registro.jsx'
import Login from './paginas/Login.jsx'
import Nosotros from './paginas/Nosotros.jsx'
import Blog from './paginas/Blog.jsx'
import DetalleBlog from './paginas/DetalleBlog.jsx'
import Contacto from './paginas/Contacto.jsx'
import NoEncontrada from './paginas/NoEncontrada.jsx'

import {
  CLAVE_CARRITO,
  leerCarritoGuardado,
  agregarProducto,
  quitarProducto,
  cambiarCantidad,
  contarItems,
} from './utils/carrito.js'

const CLAVE_SESION = 'levelup_sesion'

function leerSesionGuardada() {
  try {
    const guardado = localStorage.getItem(CLAVE_SESION)
    return guardado ? JSON.parse(guardado) : null
  } catch {
    return null
  }
}

// componente padre. acá vive el estado que ocupan varias páginas: el carrito y la sesión
export default function App() {
  // le paso una función a useState para que localStorage se lea solo la primera vez
  const [carrito, setCarrito] = useState(leerCarritoGuardado)
  const [sesion, setSesion] = useState(leerSesionGuardada)
  const [ultimoPedido, setUltimoPedido] = useState(null)
  const [aviso, setAviso] = useState('') // mensajito tipo "producto agregado"

  // guardo el carrito en el navegador cada vez que cambia
  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito))
  }, [carrito])

  useEffect(() => {
    if (sesion) localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion))
    else localStorage.removeItem(CLAVE_SESION)
  }, [sesion])

  // el aviso se borra solo a los 2,5 seg
  useEffect(() => {
    if (!aviso) return
    const temporizador = setTimeout(() => setAviso(''), 2500)
    return () => clearTimeout(temporizador)
  }, [aviso])

  function manejarAgregar(producto) {
    const nuevoCarrito = agregarProducto(carrito, producto)
    if (nuevoCarrito === carrito) {
      setAviso(`Solo quedan ${producto.stock} unidades de "${producto.nombre}".`)
      return
    }
    setCarrito(nuevoCarrito)
    setAviso(`"${producto.nombre}" agregado al carrito.`)
  }

  function manejarCambiarCantidad(codigo, cantidad) {
    setCarrito(cambiarCantidad(carrito, codigo, cantidad))
  }

  function manejarQuitar(codigo) {
    setCarrito(quitarProducto(carrito, codigo))
  }

  function manejarVaciar() {
    setCarrito([])
  }

  function manejarIniciarSesion(usuario) {
    setSesion(usuario)
    setAviso(`¡Bienvenido, ${usuario.nombre}!`)
  }

  function manejarCerrarSesion() {
    setSesion(null)
  }

  function manejarPagoRealizado(pedido) {
    setUltimoPedido(pedido)
    if (pedido.estado === 'aprobado') setCarrito([])
  }

  return (
    <>
      {aviso && (
        <Container className="position-fixed top-0 end-0 mt-5 pt-4 pe-3" style={{ zIndex: 1050, maxWidth: 360 }}>
          <Alert variant="info" className="shadow" role="status">{aviso}</Alert>
        </Container>
      )}

      <Routes>
        <Route
          element={
            <Layout
              cantidadCarrito={contarItems(carrito)}
              sesion={sesion}
              onCerrarSesion={manejarCerrarSesion}
            />
          }
        >
          <Route index element={<Inicio onAgregar={manejarAgregar} />} />
          <Route path="productos" element={<Catalogo onAgregar={manejarAgregar} />} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="ofertas" element={<Ofertas onAgregar={manejarAgregar} />} />
          <Route path="producto/:codigo" element={<DetalleProducto onAgregar={manejarAgregar} />} />
          <Route
            path="carrito"
            element={
              <Carrito
                carrito={carrito}
                sesion={sesion}
                onCambiarCantidad={manejarCambiarCantidad}
                onQuitar={manejarQuitar}
                onVaciar={manejarVaciar}
              />
            }
          />
          <Route
            path="checkout"
            element={<Checkout carrito={carrito} sesion={sesion} onPagoRealizado={manejarPagoRealizado} />}
          />
          <Route path="compra-exitosa" element={<ResultadoCompra pedido={ultimoPedido} exito />} />
          <Route path="compra-fallida" element={<ResultadoCompra pedido={ultimoPedido} exito={false} />} />
          <Route path="registro" element={<Registro />} />
          <Route path="login" element={<Login onIniciarSesion={manejarIniciarSesion} />} />
          <Route path="nosotros" element={<Nosotros />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:id" element={<DetalleBlog />} />
          <Route path="contacto" element={<Contacto />} />
          <Route path="*" element={<NoEncontrada />} />
        </Route>
      </Routes>
    </>
  )
}
