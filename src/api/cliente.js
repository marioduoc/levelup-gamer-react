import axios from 'axios'
import { leerSesion, guardarSesion, borrarSesion } from '../auth/sesion.js'

export const EVENTO_SESION_EXPIRADA = 'levelup:sesion-expirada'

// en desarrollo vite redirige /api al backend; en producción lo hace nginx
const api = axios.create({ baseURL: '/api/v1', timeout: 15000 })

api.interceptors.request.use((config) => {
  const sesion = leerSesion()
  if (sesion) {
    config.headers.Authorization = `Bearer ${sesion.accessToken}`
  }
  return config
})

// si varias peticiones reciben 401 a la vez, se hace un solo refresh y todas esperan ese
let renovacionEnCurso = null

export function renovarTokens() {
  if (!renovacionEnCurso) {
    const refreshToken = leerSesion()?.refreshToken
    renovacionEnCurso = api
      .post('/auth/refresh', { refreshToken })
      .then(({ data }) => {
        guardarSesion(data)
        return data
      })
      .finally(() => {
        renovacionEnCurso = null
      })
  }
  return renovacionEnCurso
}

api.interceptors.response.use(
  (respuesta) => respuesta,
  async (error) => {
    const original = error.config
    const esRutaAuth = original?.url?.startsWith('/auth/')

    if (error.response?.status === 401 && original && !original._reintentado && !esRutaAuth && leerSesion()) {
      original._reintentado = true
      try {
        const { accessToken } = await renovarTokens()
        original.headers.Authorization = `Bearer ${accessToken}`
        return api(original)
      } catch {
        borrarSesion()
        window.dispatchEvent(new Event(EVENTO_SESION_EXPIRADA))
      }
    }
    return Promise.reject(error)
  },
)

export function mensajeError(error, porDefecto = 'Ocurrió un error inesperado.') {
  if (error?.response?.data?.mensaje) return error.response.data.mensaje
  if (error?.request && !error?.response) return 'No se pudo conectar con el servidor.'
  return porDefecto
}

export function erroresDeCampos(error) {
  return error?.response?.data?.campos ?? {}
}

export default api
