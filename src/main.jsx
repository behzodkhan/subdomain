import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TooltipProvider } from '@radix-ui/react-tooltip';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <TooltipProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TooltipProvider>
    </AuthProvider>
  </StrictMode>,
)