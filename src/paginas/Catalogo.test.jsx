import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router'
import Catalogo from './Catalogo.jsx'
import { productosIniciales } from '../datos/productos.js'

beforeEach(() => localStorage.clear())

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
  it('sin filtros muestra todos los productos', () => {
    renderizar()
    expect(screen.getByText(`${productosIniciales.length} producto(s) encontrado(s)`)).toBeInTheDocument()
  })

  it('lee el filtro de categoría desde la URL', () => {
    renderizar('/productos?categoria=Consolas')
    expect(screen.getByText('1 producto(s) encontrado(s)')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'PlayStation 5' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Catan' })).not.toBeInTheDocument()
  })

  it('filtra al escribir en el buscador', async () => {
    const usuario = userEvent.setup()
    renderizar()

    await usuario.type(screen.getByRole('searchbox', { name: 'Buscar producto' }), 'mouse')

    expect(screen.getByText('2 producto(s) encontrado(s)')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Logitech/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Razer/ })).toBeInTheDocument()
  })

  it('al elegir una categoría y luego "Todas" vuelve a mostrar todo', async () => {
    const usuario = userEvent.setup()
    renderizar()
    const selector = screen.getByRole('combobox', { name: 'Filtrar por categoría' })

    await usuario.selectOptions(selector, 'Juegos de Mesa')
    expect(screen.getByText('2 producto(s) encontrado(s)')).toBeInTheDocument()

    await usuario.selectOptions(selector, '')
    expect(screen.getByText(`${productosIniciales.length} producto(s) encontrado(s)`)).toBeInTheDocument()
  })
})
