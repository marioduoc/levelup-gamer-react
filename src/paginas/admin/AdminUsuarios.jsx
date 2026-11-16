import { useState } from 'react'
import { Table, Button, Badge, Alert } from 'react-bootstrap'
import { Link } from 'react-router'
import EstadoCarga from '../../componentes/EstadoCarga.jsx'
import ConfirmarAccion from '../../componentes/ConfirmarAccion.jsx'
import { listarUsuarios, eliminarUsuario } from '../../api/usuariosApi.js'
import { mensajeError } from '../../api/cliente.js'
import { useDatos } from '../../hooks/useDatos.js'

export default function AdminUsuarios() {
  const { datos, cargando, error, recargar } = useDatos(() => listarUsuarios())
  const [aEliminar, setAEliminar] = useState(null)
  const [aviso, setAviso] = useState(null)

  async function confirmarEliminar() {
    const usuario = aEliminar
    setAEliminar(null)
    try {
      await eliminarUsuario(usuario.id)
      setAviso({ tipo: 'success', texto: `Usuario ${usuario.correo} eliminado.` })
      recargar()
    } catch (err) {
      setAviso({ tipo: 'danger', texto: mensajeError(err) })
    }
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Usuarios</h1>
        <Button as={Link} to="/admin/usuarios/nuevo">Nuevo usuario</Button>
      </div>
      {aviso && <Alert variant={aviso.tipo} dismissible onClose={() => setAviso(null)}>{aviso.texto}</Alert>}

      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
        <Table responsive hover size="sm" className="align-middle">
          <thead>
            <tr><th>RUN</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th></th></tr>
          </thead>
          <tbody>
            {(datos ?? []).map((u) => (
              <tr key={u.id}>
                <td>{u.run}</td>
                <td>{u.nombre} {u.apellidos}</td>
                <td>{u.correo}</td>
                <td><Badge bg="dark" className="border">{u.rol}</Badge></td>
                <td>{u.activo ? 'Activo' : <span className="text-secondary">Inactivo</span>}</td>
                <td className="text-end text-nowrap">
                  <Button as={Link} to={`/admin/usuarios/${u.id}/editar`} size="sm" variant="outline-primary">Editar</Button>{' '}
                  <Button size="sm" variant="outline-danger" onClick={() => setAEliminar(u)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </EstadoCarga>

      <ConfirmarAccion
        mostrar={!!aEliminar}
        titulo="Eliminar usuario"
        mensaje={`¿Eliminar la cuenta ${aEliminar?.correo}? Si tiene compras, mejor desactívala.`}
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminar}
        onCancelar={() => setAEliminar(null)}
      />
    </>
  )
}
