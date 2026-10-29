import { Outlet } from 'react-router'
import BarraNavegacion from './BarraNavegacion.jsx'
import PiePagina from './PiePagina.jsx'

// estructura fija: barra arriba, pie abajo y el Outlet (la página) al medio
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
