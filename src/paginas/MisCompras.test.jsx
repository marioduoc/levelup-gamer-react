import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MisCompras from './MisCompras.jsx'
import { renderizarConSesion } from '../pruebas/renderizar.jsx'
import { BOLETA, USUARIOS } from '../pruebas/datos.js'
import { misBoletas } from '../api/boletasApi.js'

vi.mock('../api/boletasApi.js')

describe('MisCompras', () => {
  it('sin compras invita a ver el catálogo', async () => {
    misBoletas.mockResolvedValue([])
    renderizarConSesion(<MisCompras />, { usuario: USUARIOS.cliente })
    expect(await screen.findByText(/Todavía no tienes compras/)).toBeInTheDocument()
  })

  it('lista las boletas del usuario y muestra el detalle al abrirlas', async () => {
    misBoletas.mockResolvedValue([BOLETA, { ...BOLETA, id: 2, numero: '20261111-2002', estado: 'RECHAZADA' }])
    const usuario = userEvent.setup()
    renderizarConSesion(<MisCompras />, { usuario: USUARIOS.cliente })

    expect(await screen.findByText('N° 20261110-1001')).toBeInTheDocument()
    expect(screen.getByText('RECHAZADA')).toBeInTheDocument()

    await usuario.click(screen.getByText('N° 20261110-1001'))
    expect(screen.getAllByText('Catan')[0]).toBeVisible()
  })
})
