import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Schriften werden lokal mit ausgeliefert statt von Google Fonts geladen:
// kein Aufruf eines externen Dienstes und keine Übertragung der IP-Adresse
// an Dritte (CON-3j-01, NFR-15c-01).
import '@fontsource-variable/fraunces/opsz.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
