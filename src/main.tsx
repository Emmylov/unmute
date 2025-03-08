import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById('root');

if (!rootElement) {
  // Create root element if it doesn't exist
  const rootDiv = document.createElement('div');
  rootDiv.id = 'root';
  document.body.appendChild(rootDiv);
  console.warn('Root element was not found, created a new one');
}

createRoot(rootElement || document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
