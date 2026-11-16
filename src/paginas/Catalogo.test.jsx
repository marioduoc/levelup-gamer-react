import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router'
import Catalogo from './Catalogo.jsx'
import { PRODUCTOS, CATEGORIAS } from '../pruebas/datos.js'
import { listarProductos } from '../api/productosApi.js'
import { listarCategorias } from '../api/categoriasApi.js'

vi.mock('../api/productosApi.js')
vi.mock('../api/categoriasApi.js')

beforeEach(() => {
  listarProductos.mockResolvedValue(PRODUCTOS)
  listarCategorias.mockResolvedValue(CATEGORIAS)
})

function renderizar(url = '/productos') {
  render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/productos" element={<Catalogo onAgregar={vi.fn()} />} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Catalogo', () => {
  it('pide los productos a la API y los muestra todos', async () => {
    renderizar()
    expect(await screen.findByText(`${PRODUCTOS.length} producto(s) encontrado(s)`)).toBeInTheDocument()
    expect(listarProductos).toHaveBeenCalledTimes(1)
  })

  it('lee el filtro de categoría desde la URL', async () => {
    renderizar('/productos?categoria=Consolas')
    expect(await screen.findByText('1 producto(s) encontrado(s)')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'PlayStation 5' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Catan' })).not.toBeInTheDocument()
  })

  it('filtra al escribir en el buscador', async () => {
    const usuario = userEvent.setup()
    renderizar()
    await screen.findByText(`${PRODUCTOS.length} producto(s) encontrado(s)`)

    await usuario.type(screen.getByRole('searchbox', { name: 'Buscar producto' }), 'mouse')

    expect(screen.getByText('2 producto(s) encontrado(s)')).toBeInTheDocument()
  })

  it('las categorías del filtro vienen de la API', async () => {
    const usuario = userEvent.setup()
    renderizar()
    await screen.findByText(`${PRODUCTOS.length} producto(s) encontrado(s)`)
    const selector = screen.getByRole('combobox', { name: 'Filtrar por categoría' })

    await usuario.selectOptions(selector, 'Juegos de Mesa')
    expect(screen.getByText('2 producto(s) encontrado(s)')).toBeInTheDocument()

    await usuario.selectOptions(selector, '')
    expect(screen.getByText(`${PRODUCTOS.length} producto(s) encontrado(s)`)).toBeInTheDocument()
  })

  it('si la API falla muestra el error y permite reintentar', async () => {
    listarProductos.mockRejectedValueOnce({ request: {} })
    const usuario = userEvent.setup()
    renderizar()

    expect(await screen.findByText('No se pudo conectar con el servidor.')).toBeInTheDocument()
    await usuario.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(await screen.findByText(`${PRODUCTOS.length} producto(s) encontrado(s)`)).toBeInTheDocument()
  })
})
