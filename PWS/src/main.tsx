import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { UserProvider } from './context/UserContext.tsx'
import { CallProvider } from './context/CallContext.tsx'
import { NotificationCenterProvider } from './context/NotificationCenterContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <CallProvider>
        <NotificationCenterProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </NotificationCenterProvider>
      </CallProvider>
    </UserProvider>
  </StrictMode>,
)
