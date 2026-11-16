import { useEffect, useState } from 'react'
import { Form, Row, Col, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router'
import CampoFormulario from '../../componentes/CampoFormulario.jsx'
import EstadoCarga from '../../componentes/EstadoCarga.jsx'
import { crearProducto, actualizarProducto, obtenerProducto } from '../../api/productosApi.js'
import { listarCategorias } from '../../api/categoriasApi.js'
import { erroresDeCampos, mensajeError } from '../../api/cliente.js'
import { useDatos } from '../../hooks/useDatos.js'

const VACIO = {
  codigo: '', nombre: '', descripcion: '', precio: '', oferta: 0,
  stock: '', stockCritico: '', imagen: '/img/placeholder.png', categoriaId: '',
}

const NUMERICOS = ['precio', 'oferta', 'stock', 'stockCritico', 'categoriaId']

// sirve para crear (/admin/productos/nuevo) y editar (/admin/productos/:codigo/editar)
export default function FormProducto() {
  const { codigo } = useParams()
  const editando = !!codigo
  const navegar = useNavigate()
  const categorias = useDatos(() => listarCategorias())
  const [datos, setDatos] = useState(VACIO)
  const [cargando, setCargando] = useState(editando)
  const [errores, setErrores] = useState({})
  const [error, setError] = useState('')

  useEffect(() => {
    if (!editando) return
    obtenerProducto(codigo)
      .then((p) => setDatos({ ...p, descripcion: p.descripcion ?? '', imagen: p.imagen ?? '' }))
      .catch((err) => setError(mensajeError(err)))
      .finally(() => setCargando(false))
  }, [codigo, editando])

  function cambiar(e) {
    const { name, value } = e.target
    setDatos((anterior) => ({ ...anterior, [name]: name === 'codigo' ? value.toUpperCase() : value }))
  }

  async function guardar(e) {
    e.preventDefault()
    const cuerpo = { ...datos }
    NUMERICOS.forEach((campo) => {
      cuerpo[campo] = cuerpo[campo] === '' ? null : Number(cuerpo[campo])
    })
    try {
      if (editando) await actualizarProducto(codigo, cuerpo)
      else await crearProducto(cuerpo)
      navegar('/admin/productos')
    } catch (err) {
      setErrores(erroresDeCampos(err))
      setError(mensajeError(err, 'No se pudo guardar el producto.'))
    }
  }

  return (
    <>
      <h1 className="h3">{editando ? `Editar ${codigo}` : 'Nuevo producto'}</h1>
      {error && <Alert variant="danger">{error}</Alert>}

      <EstadoCarga cargando={cargando || categorias.cargando} error={categorias.error}>
        <Form noValidate onSubmit={guardar}>
          <Row>
            <Col md={4}>
              <CampoFormulario id="codigo" label="Código *" error={errores.codigo}>
                <Form.Control name="codigo" value={datos.codigo} onChange={cambiar} disabled={editando} isInvalid={!!errores.codigo} placeholder="JM003" />
              </CampoFormulario>
            </Col>
            <Col md={8}>
              <CampoFormulario id="nombre" label="Nombre *" error={errores.nombre}>
                <Form.Control name="nombre" value={datos.nombre} onChange={cambiar} isInvalid={!!errores.nombre} />
              </CampoFormulario>
            </Col>
          </Row>
          <CampoFormulario id="descripcion" label="Descripción" error={errores.descripcion}>
            <Form.Control as="textarea" rows={3} name="descripcion" value={datos.descripcion} onChange={cambiar} isInvalid={!!errores.descripcion} />
          </CampoFormulario>
          <Row>
            <Col md={6}>
              <CampoFormulario id="categoriaId" label="Categoría *" error={errores.categoriaId}>
                <Form.Select name="categoriaId" value={datos.categoriaId} onChange={cambiar} isInvalid={!!errores.categoriaId}>
                  <option value="">Selecciona una categoría</option>
                  {(categorias.datos ?? []).map((c) => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </Form.Select>
              </CampoFormulario>
            </Col>
            <Col md={6}>
              <CampoFormulario id="imagen" label="Imagen (ruta)" error={errores.imagen}>
                <Form.Control name="imagen" value={datos.imagen} onChange={cambiar} isInvalid={!!errores.imagen} />
              </CampoFormulario>
            </Col>
          </Row>
          <Row>
            <Col sm={6} md={3}>
              <CampoFormulario id="precio" label="Precio *" error={errores.precio}>
                <Form.Control type="number" min={0} name="precio" value={datos.precio} onChange={cambiar} isInvalid={!!errores.precio} />
              </CampoFormulario>
            </Col>
            <Col sm={6} md={3}>
              <CampoFormulario id="oferta" label="Oferta %" error={errores.oferta}>
                <Form.Control type="number" min={0} max={100} name="oferta" value={datos.oferta} onChange={cambiar} isInvalid={!!errores.oferta} />
              </CampoFormulario>
            </Col>
            <Col sm={6} md={3}>
              <CampoFormulario id="stock" label="Stock *" error={errores.stock}>
                <Form.Control type="number" min={0} name="stock" value={datos.stock} onChange={cambiar} isInvalid={!!errores.stock} />
              </CampoFormulario>
            </Col>
            <Col sm={6} md={3}>
              <CampoFormulario id="stockCritico" label="Stock crítico *" error={errores.stockCritico}>
                <Form.Control type="number" min={0} name="stockCritico" value={datos.stockCritico} onChange={cambiar} isInvalid={!!errores.stockCritico} />
              </CampoFormulario>
            </Col>
          </Row>
          <div className="d-flex gap-2">
            <Button type="submit">Guardar</Button>
            <Button as={Link} to="/admin/productos" variant="outline-secondary">Cancelar</Button>
          </div>
        </Form>
      </EstadoCarga>
    </>
  )
}
