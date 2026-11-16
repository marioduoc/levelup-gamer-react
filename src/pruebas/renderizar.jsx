import { render } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router'
import { AuthContext } from '../auth/contexto.js'
import { puede } from '../auth/permisos.js'

// renderiza con una sesión simulada (sin llamar a la API) y en la ruta indicada
export function renderizarConSesion(ui, { usuario = null, ruta = '/', patron = '*' } = {}) {
  const auth = {
    usuario,
    verificando: false,
    iniciarSesion: vi.fn(),
    cerrarSesion: vi.fn(),
    puede: (permiso) => puede(usuario, permiso),
  }
  const resultado = render(
    <AuthContext.Provider value={auth}>
      <MemoryRouter initialEntries={[ruta]}>
        <Routes>
          <Route path={patron} element={ui} />
          <Route path="/login" element={<p>pagina login</p>} />
          <Route path="/sin-permiso" element={<p>pagina sin permiso</p>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  )
  return { ...resultado, auth }
}
