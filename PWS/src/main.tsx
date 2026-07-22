import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import './index.css'
import App from './App.tsx'
import { UserProvider } from './context/UserContext.tsx'
import { CallProvider } from './context/CallContext.tsx'
import { NotificationCenterProvider } from './context/NotificationCenterContext.tsx'
import { ErrorLogProvider } from './context/ErrorLogContext.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000,
      retry: 1,
      refetchOnWindowFocus: false,
      gcTime: 1000 * 60 * 60 * 24,
    },
  },
})

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: 'PWS_QUERY_CACHE',
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      <ErrorLogProvider>
        <UserProvider>
          <CallProvider>
            <NotificationCenterProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </NotificationCenterProvider>
          </CallProvider>
        </UserProvider>
      </ErrorLogProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  </StrictMode>,
)
