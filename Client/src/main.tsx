import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ColorProvider } from './context/colorContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ColorProvider>
    <App />
    </ColorProvider>
  </StrictMode>,
)
