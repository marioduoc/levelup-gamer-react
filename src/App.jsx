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
import MisCompras from './paginas/MisCompras.jsx'
import Registro from './paginas/Registro.jsx'
import Login from './paginas/Login.jsx'
import Nosotros from './paginas/Nosotros.jsx'
import Blog from './paginas/Blog.jsx'
import DetalleBlog from './paginas/DetalleBlog.jsx'
import Contacto from './paginas/Contacto.jsx'
import SinPermiso from './paginas/SinPermiso.jsx'
import NoEncontrada from './paginas/NoEncontrada.jsx'

import PanelLayout from './paginas/admin/PanelLayout.jsx'
import PanelInicio from './paginas/admin/PanelInicio.jsx'
import AdminProductos from './paginas/admin/AdminProductos.jsx'
import DetalleProductoAdmin from './paginas/admin/DetalleProductoAdmin.jsx'
import FormProducto from './paginas/admin/FormProducto.jsx'
import AdminCategorias from './paginas/admin/AdminCategorias.jsx'
import AdminOrdenes from './paginas/admin/AdminOrdenes.jsx'
import DetalleOrden from './paginas/admin/DetalleOrden.jsx'
import AdminUsuarios from './paginas/admin/AdminUsuarios.jsx'
import FormUsuario from './paginas/admin/FormUsuario.jsx'

import RutaProtegida from './auth/RutaProtegida.jsx'
import { useAuth } from './auth/contexto.js'
import { puedeUsarCarrito } from './auth/permisos.js'
import {
  CLAVE_CARRITO,
  leerCarritoGuardado,
  agregarProducto,
  quitarProducto,
  cambiarCantidad,
  contarItems,
} from './utils/carrito.js'

// el carrito vive aquí porque lo usan varias páginas; la sesión vive en AuthContext
export default function App() {
  const { usuario } = useAuth()
  const [carrito, setCarrito] = useState(leerCarritoGuardado)
  const [ultimaBoleta, setUltimaBoleta] = useState(null)
  const [aviso, setAviso] = useState('')

  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito))
  }, [carrito])

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

  function manejarPagoRealizado(boleta) {
    setUltimaBoleta(boleta)
    if (boleta.estado === 'APROBADA') setCarrito([])
  }

  // el vendedor no compra, así que no recibe el botón de agregar
  const onAgregar = puedeUsarCarrito(usuario) ? manejarAgregar : null

  return (
    <>
      {aviso && (
        <Container className="position-fixed top-0 end-0 mt-5 pt-4 pe-3" style={{ zIndex: 1050, maxWidth: 360 }}>
          <Alert variant="info" className="shadow" role="status">{aviso}</Alert>
        </Container>
      )}

      <Routes>
        <Route element={<Layout cantidadCarrito={contarItems(carrito)} />}>
          <Route index element={<Inicio onAgregar={onAgregar} />} />
          <Route path="productos" element={<Catalogo onAgregar={onAgregar} />} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="ofertas" element={<Ofertas onAgregar={onAgregar} />} />
          <Route path="producto/:codigo" element={<DetalleProducto onAgregar={onAgregar} />} />
          <Route
            path="carrito"
            element={
              <Carrito
                carrito={carrito}
                onCambiarCantidad={(codigo, cantidad) => setCarrito(cambiarCantidad(carrito, codigo, cantidad))}
                onQuitar={(codigo) => setCarrito(quitarProducto(carrito, codigo))}
                onVaciar={() => setCarrito([])}
              />
            }
          />
          <Route
            path="checkout"
            element={
              <RutaProtegida permiso="comprar">
                <Checkout carrito={carrito} onPagoRealizado={manejarPagoRealizado} />
              </RutaProtegida>
            }
          />
          <Route path="compra-exitosa" element={<ResultadoCompra boleta={ultimaBoleta} exito />} />
          <Route path="compra-fallida" element={<ResultadoCompra boleta={ultimaBoleta} exito={false} />} />
          <Route path="mis-compras" element={<RutaProtegida permiso="comprar"><MisCompras /></RutaProtegida>} />
          <Route path="registro" element={<Registro />} />
          <Route path="login" element={<Login />} />
          <Route path="nosotros" element={<Nosotros />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:id" element={<DetalleBlog />} />
          <Route path="contacto" element={<Contacto />} />
          <Route path="sin-permiso" element={<SinPermiso />} />

          {/* panel: cada ruta exige su propio permiso, no basta con entrar a /admin */}
          <Route path="admin" element={<RutaProtegida permiso="verPanel"><PanelLayout /></RutaProtegida>}>
            <Route index element={<PanelInicio />} />
            <Route element={<RutaProtegida permiso="verProductos" />}>
              <Route path="productos" element={<AdminProductos />} />
              <Route path="productos/:codigo" element={<DetalleProductoAdmin />} />
            </Route>
            <Route element={<RutaProtegida permiso="editarProductos" />}>
              <Route path="productos/nuevo" element={<FormProducto />} />
              <Route path="productos/:codigo/editar" element={<FormProducto />} />
            </Route>
            <Route element={<RutaProtegida permiso="gestionarCategorias" />}>
              <Route path="categorias" element={<AdminCategorias />} />
            </Route>
            <Route element={<RutaProtegida permiso="verOrdenes" />}>
              <Route path="ordenes" element={<AdminOrdenes />} />
              <Route path="ordenes/:id" element={<DetalleOrden />} />
            </Route>
            <Route element={<RutaProtegida permiso="gestionarUsuarios" />}>
              <Route path="usuarios" element={<AdminUsuarios />} />
              <Route path="usuarios/nuevo" element={<FormUsuario />} />
              <Route path="usuarios/:id/editar" element={<FormUsuario />} />
            </Route>
          </Route>

          <Route path="*" element={<NoEncontrada />} />
        </Route>
      </Routes>
    </>
  )
}
