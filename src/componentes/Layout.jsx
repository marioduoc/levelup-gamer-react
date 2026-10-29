import { Outlet } from 'react-router'
import BarraNavegacion from './BarraNavegacion.jsx'
import PiePagina from './PiePagina.jsx'

// Marco del sitio: barra arriba, pie abajo y en el medio (Outlet) la página que toque.
export default function Layout({ cantidadCarrito, sesion, onCerrarSesion }) {
  return (
    <>
      <BarraNavegacion cantidadCarrito={cantidadCarrito} sesion={sesion} onCerrarSesion={onCerrarSesion} />
      <main>
        <Outlet />
      </main>
      <PiePagina />
    </>
  )
}
