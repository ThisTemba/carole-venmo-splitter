import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/sometype-mono/400.css'
import '@fontsource/sometype-mono/600.css'
import '@fontsource/sometype-mono/700.css'
import '@fontsource/permanent-marker/400.css'
import '@fontsource/bungee/400.css'
import './styles.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
