import { useEffect, useState } from 'react'
import { login } from '../api/authApi.js'
import { EVENTO_SESION_EXPIRADA, renovarTokens } from '../api/cliente.js'
import { CLAVE_SESION, borrarSesion, guardarSesion, leerSesion, tokenVigente } from './sesion.js'
import { puede } from './permisos.js'
import { AuthContext } from './contexto.js'

// al cargar o recargar la página: token vigente -> sesión lista; vencido con refresh vigente -> hay que renovar;
// ambos vencidos -> se descarta
function sesionInicial() {
  const guardada = leerSesion()
  if (!guardada) return null
  if (tokenVigente(guardada.accessToken) || tokenVigente(guardada.refreshToken)) return guardada
  borrarSesion()
  return null
}

function necesitaRenovar() {
  const guardada = leerSesion()
  return !!guardada && !tokenVigente(guardada.accessToken) && tokenVigente(guardada.refreshToken)
}

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(sesionInicial)
  const [verificando, setVerificando] = useState(necesitaRenovar)

  useEffect(() => {
    if (!verificando) return
    renovarTokens()
      .then((nueva) => setSesion(nueva))
      .catch(() => {
        borrarSesion()
        setSesion(null)
      })
      .finally(() => setVerificando(false))
    // solo al montar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // el interceptor avisa cuando el refresh falla, y otra pestaña puede cerrar o abrir sesión
  useEffect(() => {
    const alExpirar = () => setSesion(null)
    const alCambiarOtraPestana = (e) => {
      if (e.key === CLAVE_SESION) setSesion(leerSesion())
    }
    window.addEventListener(EVENTO_SESION_EXPIRADA, alExpirar)
    window.addEventListener('storage', alCambiarOtraPestana)
    return () => {
      window.removeEventListener(EVENTO_SESION_EXPIRADA, alExpirar)
      window.removeEventListener('storage', alCambiarOtraPestana)
    }
  }, [])

  async function iniciarSesion(correo, password) {
    const datos = await login(correo, password)
    guardarSesion(datos)
    setSesion(datos)
    return datos.usuario
  }

  function cerrarSesion() {
    borrarSesion()
    setSesion(null)
  }

  const usuario = sesion?.usuario ?? null
  const valor = {
    usuario,
    verificando,
    iniciarSesion,
    cerrarSesion,
    puede: (permiso) => puede(usuario, permiso),
  }

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
