import { useState } from 'react'
import { Container, Form, Row, Col, Button, Table, Alert } from 'react-bootstrap'
import { Navigate, useNavigate } from 'react-router'
import CampoFormulario from '../componentes/CampoFormulario.jsx'
import ResumenCarrito from '../componentes/ResumenCarrito.jsx'
import { regiones, comunasDe } from '../datos/regiones.js'
import { validarCheckout } from '../utils/validaciones.js'
import { calcularTotal, formatearPrecio } from '../utils/carrito.js'
import { comprar } from '../api/boletasApi.js'
import { erroresDeCampos, mensajeError } from '../api/cliente.js'
import { useAuth } from '../auth/contexto.js'

// datos de envío y tarjeta. la ruta exige sesión con permiso para comprar (ver App)
export default function Checkout({ carrito, onPagoRealizado }) {
  const navegar = useNavigate()
  const { usuario } = useAuth()

  const [datos, setDatos] = useState({
    nombre: usuario?.nombre ?? '',
    apellidos: usuario?.apellidos ?? '',
    correo: usuario?.correo ?? '',
    calle: usuario?.direccion ?? '',
    departamento: '',
    region: usuario?.region ?? '',
    comuna: usuario?.comuna ?? '',
    indicaciones: '',
    tarjeta: '',
  })
  const [errores, setErrores] = useState({})
  const [errorServidor, setErrorServidor] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [pagoEnviado, setPagoEnviado] = useState(false)

  // al pagar el carrito se vacía justo antes de navegar; la bandera evita rebotar al carrito
  if (carrito.length === 0 && !pagoEnviado) {
    return <Navigate to="/carrito" replace />
  }

  function cambiar(e) {
    const { name, value } = e.target
    setDatos((anterior) => {
      const nuevo = { ...anterior, [name]: value }
      if (name === 'region') nuevo.comuna = ''
      return nuevo
    })
  }

  async function enviar(e) {
    e.preventDefault()
    const erroresEncontrados = validarCheckout(datos)
    setErrores(erroresEncontrados)
    if (Object.keys(erroresEncontrados).length > 0) return

    setEnviando(true)
    setErrorServidor('')
    try {
      const boleta = await comprar(datos, carrito)
      setPagoEnviado(true)
      onPagoRealizado(boleta)
      navegar(boleta.estado === 'APROBADA' ? '/compra-exitosa' : '/compra-fallida')
    } catch (error) {
      setErrores(erroresDeCampos(error))
      setErrorServidor(mensajeError(error, 'No se pudo procesar la compra.'))
    } finally {
      setEnviando(false)
    }
  }

  // la vista previa del descuento usa el correo de la cuenta, igual que el backend
  const totalEstimado = calcularTotal(carrito, usuario?.correo)

  return (
    <Container className="py-4">
      <h1 className="section-title">Checkout</h1>
      {errorServidor && <Alert variant="danger">{errorServidor}</Alert>}

      <Row className="g-4">
        <Col lg={7}>
          <Form noValidate onSubmit={enviar}>
            <h2 className="h5">Información del cliente</h2>
            <Row>
              <Col md={6}>
                <CampoFormulario id="nombre" label="Nombre *" error={errores.nombre}>
                  <Form.Control name="nombre" value={datos.nombre} onChange={cambiar} isInvalid={!!errores.nombre} />
                </CampoFormulario>
              </Col>
              <Col md={6}>
                <CampoFormulario id="apellidos" label="Apellidos *" error={errores.apellidos}>
                  <Form.Control name="apellidos" value={datos.apellidos} onChange={cambiar} isInvalid={!!errores.apellidos} />
                </CampoFormulario>
              </Col>
            </Row>
            <CampoFormulario id="correo" label="Correo *" error={errores.correo}>
              <Form.Control type="email" name="correo" value={datos.correo} onChange={cambiar} isInvalid={!!errores.correo} />
            </CampoFormulario>

            <h2 className="h5 mt-4">Dirección de entrega</h2>
            <Row>
              <Col md={8}>
                <CampoFormulario id="calle" label="Calle *" error={errores.calle}>
                  <Form.Control name="calle" value={datos.calle} onChange={cambiar} isInvalid={!!errores.calle} />
                </CampoFormulario>
              </Col>
              <Col md={4}>
                <CampoFormulario id="departamento" label="Departamento (opcional)">
                  <Form.Control name="departamento" placeholder="Ej: 603" value={datos.departamento} onChange={cambiar} />
                </CampoFormulario>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <CampoFormulario id="region" label="Región *" error={errores.region}>
                  <Form.Select name="region" value={datos.region} onChange={cambiar} isInvalid={!!errores.region}>
                    <option value="">Selecciona una región</option>
                    {regiones.map((r) => (
                      <option key={r.nombre} value={r.nombre}>{r.nombre}</option>
                    ))}
                  </Form.Select>
                </CampoFormulario>
              </Col>
              <Col md={6}>
                <CampoFormulario id="comuna" label="Comuna *" error={errores.comuna}>
                  <Form.Select name="comuna" value={datos.comuna} onChange={cambiar} isInvalid={!!errores.comuna} disabled={!datos.region}>
                    <option value="">Selecciona una comuna</option>
                    {comunasDe(datos.region).map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </Form.Select>
                </CampoFormulario>
              </Col>
            </Row>
            <CampoFormulario id="indicaciones" label="Indicaciones para la entrega (opcional)">
              <Form.Control as="textarea" rows={2} name="indicaciones" placeholder="Ej: Entre calles, color del edificio, no tiene timbre." value={datos.indicaciones} onChange={cambiar} />
            </CampoFormulario>

            <h2 className="h5 mt-4">Pago</h2>
            <CampoFormulario id="tarjeta" label="Número de tarjeta (16 dígitos) *" error={errores.tarjeta}>
              <Form.Control name="tarjeta" inputMode="numeric" placeholder="4111 1111 1111 1111" value={datos.tarjeta} onChange={cambiar} isInvalid={!!errores.tarjeta} />
              <Form.Text className="text-secondary">
                Pago simulado: una tarjeta terminada en 0 será rechazada.
              </Form.Text>
            </CampoFormulario>

            <Button type="submit" variant="primary" size="lg" className="w-100" disabled={enviando}>
              {enviando ? 'Procesando...' : `Pagar ahora ${formatearPrecio(totalEstimado)}`}
            </Button>
          </Form>
        </Col>

        <Col lg={5}>
          <Table size="sm" className="align-middle">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cant.</th>
                <th className="text-end">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((item) => (
                <tr key={item.codigo}>
                  <td>{item.nombre}</td>
                  <td>{item.cantidad}</td>
                  <td className="text-end">{formatearPrecio(item.precio * item.cantidad)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <ResumenCarrito carrito={carrito} correo={usuario?.correo} />
        </Col>
      </Row>
    </Container>
  )
}
