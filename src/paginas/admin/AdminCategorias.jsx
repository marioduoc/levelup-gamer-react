import { useState } from 'react'
import { Table, Button, Form, InputGroup, Alert } from 'react-bootstrap'
import EstadoCarga from '../../componentes/EstadoCarga.jsx'
import ConfirmarAccion from '../../componentes/ConfirmarAccion.jsx'
import { listarCategorias, crearCategoria, actualizarCategoria, eliminarCategoria } from '../../api/categoriasApi.js'
import { mensajeError } from '../../api/cliente.js'
import { useDatos } from '../../hooks/useDatos.js'

export default function AdminCategorias() {
  const { datos, cargando, error, recargar } = useDatos(() => listarCategorias())
  const [nueva, setNueva] = useState('')
  const [editando, setEditando] = useState(null)
  const [aEliminar, setAEliminar] = useState(null)
  const [aviso, setAviso] = useState(null)

  async function ejecutar(accion, textoOk) {
    try {
      await accion()
      setAviso({ tipo: 'success', texto: textoOk })
      recargar()
      return true
    } catch (err) {
      setAviso({ tipo: 'danger', texto: mensajeError(err) })
      return false
    }
  }

  async function agregar(e) {
    e.preventDefault()
    if (!nueva.trim()) return
    if (await ejecutar(() => crearCategoria(nueva.trim()), `Categoría "${nueva.trim()}" creada.`)) setNueva('')
  }

  async function guardarEdicion(e) {
    e.preventDefault()
    if (await ejecutar(() => actualizarCategoria(editando.id, editando.nombre), 'Categoría actualizada.')) setEditando(null)
  }

  async function confirmarEliminar() {
    const categoria = aEliminar
    setAEliminar(null)
    await ejecutar(() => eliminarCategoria(categoria.id), `Categoría "${categoria.nombre}" eliminada.`)
  }

  return (
    <>
      <h1 className="h3">Categorías</h1>
      {aviso && <Alert variant={aviso.tipo} dismissible onClose={() => setAviso(null)}>{aviso.texto}</Alert>}

      <Form onSubmit={agregar} className="mb-3" style={{ maxWidth: 480 }}>
        <InputGroup>
          <Form.Control placeholder="Nueva categoría" aria-label="Nueva categoría" value={nueva} onChange={(e) => setNueva(e.target.value)} />
          <Button type="submit">Agregar</Button>
        </InputGroup>
      </Form>

      <EstadoCarga cargando={cargando} error={error} onReintentar={recargar}>
        <Table size="sm" hover className="align-middle">
          <thead>
            <tr><th>Id</th><th>Nombre</th><th></th></tr>
          </thead>
          <tbody>
            {(datos ?? []).map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>
                  {editando?.id === c.id ? (
                    <Form onSubmit={guardarEdicion}>
                      <InputGroup size="sm">
                        <Form.Control aria-label="Nombre de la categoría" value={editando.nombre} onChange={(e) => setEditando({ ...editando, nombre: e.target.value })} />
                        <Button type="submit" size="sm">Guardar</Button>
                        <Button variant="outline-secondary" size="sm" onClick={() => setEditando(null)}>Cancelar</Button>
                      </InputGroup>
                    </Form>
                  ) : (
                    c.nombre
                  )}
                </td>
                <td className="text-end text-nowrap">
                  <Button size="sm" variant="outline-primary" onClick={() => setEditando({ ...c })}>Editar</Button>{' '}
                  <Button size="sm" variant="outline-danger" onClick={() => setAEliminar(c)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </EstadoCarga>

      <ConfirmarAccion
        mostrar={!!aEliminar}
        titulo="Eliminar categoría"
        mensaje={`¿Eliminar "${aEliminar?.nombre}"?`}
        textoConfirmar="Eliminar"
        onConfirmar={confirmarEliminar}
        onCancelar={() => setAEliminar(null)}
      />
    </>
  )
}
