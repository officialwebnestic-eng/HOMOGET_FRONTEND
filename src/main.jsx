import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { SidebarProvider } from "./context/SidebarContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AuthProvider } from './context/AuthContext.jsx'
import ToastProvider from './model/SuccessToasNotification.jsx'
import { PermissionProvider } from './context/PermessionContenx.jsx'
import { BrowserRouter } from 'react-router-dom'
createRoot(document.getElementById('root')).render(
  <StrictMode>
  
    <ToastProvider>
      <ThemeProvider>
        <SidebarProvider>
          <AuthProvider>
            <PermissionProvider>
              <App />
            </PermissionProvider>
          </AuthProvider>
        </SidebarProvider>
      </ThemeProvider>
    </ToastProvider>

  </StrictMode>
);