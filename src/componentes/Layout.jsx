import { Outlet } from 'react-router'
import BarraNavegacion from './BarraNavegacion.jsx'
import PiePagina from './PiePagina.jsx'

export default function Layout({ cantidadCarrito }) {
  return (
    <>
      <BarraNavegacion cantidadCarrito={cantidadCarrito} />
      <main>
        <Outlet />
      </main>
      <PiePagina />
    </>
  )
}
