import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
// 1) Primero el CSS de Bootstrap, 2) después nuestros estilos (para poder sobrescribirlo).
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'

// BrowserRouter va una sola vez, envolviendo toda la aplicación.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
