import { useEffect, useState } from 'react'
import { mensajeError } from '../api/cliente.js'

// ejecuta una petición al montar (y cuando cambian las dependencias) y expone datos, carga y error
export function useDatos(cargar, dependencias = []) {
  const [estado, setEstado] = useState({ datos: null, cargando: true, error: '' })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let vigente = true
    setEstado((anterior) => ({ ...anterior, cargando: true, error: '' }))
    cargar()
      .then((datos) => vigente && setEstado({ datos, cargando: false, error: '' }))
      .catch((error) =>
        vigente && setEstado({ datos: null, cargando: false, error: mensajeError(error, 'No se pudieron cargar los datos.') }),
      )
    // si el componente se desmonta antes de responder, se ignora la respuesta
    return () => {
      vigente = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencias, version])

  return { ...estado, recargar: () => setVersion((v) => v + 1) }
}
