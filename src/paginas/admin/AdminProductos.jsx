import { useState } from 'react'
import { Table, Button, Badge, Alert } from 'react-bootstrap'
import { Link } from 'react-router'
import EstadoCarga from '../../componentes/EstadoCarga.jsx'
import ConfirmarAccion from '../../componentes/ConfirmarAccion.jsx'
import { listarProductos, eliminarProducto } from '../../api/productosApi.js'
import { mensajeError } from '../../api/cliente.js'
import { useDatos } from '../../hooks/useDatos.js'
import { useAuth } from '../../auth/contexto.js'
import { formatearPrecio } from '../../utils/carrito.js'

export default function AdminProductos() {
  const { puede } = useAuth()
  const puedeEditar = puede('editarProductos')
  const { datos, cargando, error, recargar } = useDatos(() => listarProductos())
  const [aEliminar, setAEliminar] = useState(null)
  const [aviso, setAviso] = useState(null)

  async function confirmarEliminar() {
    const producto = aEliminar
    setAEliminar(null)
    try {
      await eliminarProducto(producto.codigo)
      setAviso({ tipo: 'success', texto: `Producto ${producto.codigo} eliminado.` })
      recargar()
    } catch (err) {
      setAviso({ tipo: 'danger', texto: mensajeError(err) })
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Productos</h1>
        {puedeEditar && <Button as={Link} to="/admin/productos/nuevo">Nuevo producto</Button>}
      </div>
      {aviso && <Alert variant={aviso.tipo} dismissible onClose={() => setAviso(null)}>{aviso.texto}</Alert>}

      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
        <Table responsive hover size="sm" className="align-middle">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th className="text-end">Precio</th>
              <th className="text-end">Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(datos ?? []).map((p) => (
              <tr key={p.codigo}>
                <td>{p.codigo}</td>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td className="text-end">{formatearPrecio(p.precioFinal)}</td>
                <td className="text-end">
                  {p.stock} {p.stockBajo && <Badge bg="warning" text="dark">bajo</Badge>}
                </td>
                <td className="text-end text-nowrap">
                  <Button as={Link} to={`/admin/productos/${p.codigo}`} size="sm" variant="outline-light">Ver</Button>{' '}
                  {puedeEditar && (
                    <>
                      <Button as={Link} to={`/admin/productos/${p.codigo}/editar`} size="sm" variant="outline-primary">Editar</Button>{' '}
                      <Button size="sm" variant="outline-danger" onClick={() => setAEliminar(p)}>Eliminar</Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </EstadoCarga>

      <ConfirmarAccion
        mostrar={!!aEliminar}
        titulo="Eliminar producto"
        mensaje={`¿Eliminar "${aEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminar}
        onCancelar={() => setAEliminar(null)}
      />
    </>
  )
}
