import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App'

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)

// Produktion: vorgerendertes HTML hydrieren; Entwicklung: clientseitig rendern.
if (container.firstElementChild) hydrateRoot(container, app)
else createRoot(container).render(app)
