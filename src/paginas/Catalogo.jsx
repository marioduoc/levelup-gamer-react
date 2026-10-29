import { Container, Form, Row, Col } from 'react-bootstrap'
import { useSearchParams } from 'react-router'
import GrillaProductos from '../componentes/GrillaProductos.jsx'
import { obtenerProductos, obtenerCategorias } from '../datos/productos.js'

// Catálogo completo con buscador y filtro por categoría.
// El filtro vive en la URL (?buscar=...&categoria=...) gracias a useSearchParams.
export default function Catalogo({ onAgregar }) {
  const [parametros, setParametros] = useSearchParams()
  const textoBuscado = parametros.get('buscar') ?? ''
  const categoria = parametros.get('categoria') ?? ''

  const productos = obtenerProductos()
  const categorias = obtenerCategorias()

  function actualizar(clave, valor) {
    const copia = new URLSearchParams(parametros)
    if (valor) copia.set(clave, valor)
    else copia.delete(clave) // sin valor, borramos la clave
    setParametros(copia)
  }

  const filtrados = productos.filter((p) => {
    const coincideTexto = p.nombre.toLowerCase().includes(textoBuscado.toLowerCase())
    const coincideCategoria = categoria === '' || p.categoria === categoria
    return coincideTexto && coincideCategoria
  })

  return (
    <Container>
      <h1 className="section-title">Catálogo</h1>

      <Row className="g-3 mb-4">
        <Col md={8}>
          <Form.Control
            type="search"
            placeholder="Buscar producto..."
            aria-label="Buscar producto"
            value={textoBuscado}
            onChange={(e) => actualizar('buscar', e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Select
            aria-label="Filtrar por categoría"
            value={categoria}
            onChange={(e) => actualizar('categoria', e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      <p className="text-secondary small">{filtrados.length} producto(s) encontrado(s)</p>
      <GrillaProductos productos={filtrados} onAgregar={onAgregar} />
    </Container>
  )
}
