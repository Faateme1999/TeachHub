import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { ToastProvider } from './components/ui/ToastProvider'
import App from './App.tsx'
import './index.css'

// Create the QueryClient ONCE (not inside a component) so it isn't recreated on
// every render — that would throw away all cached data.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Don't refetch every time the window regains focus (keeps things calm
      // for a small learning app). Data is considered fresh for 30 seconds.
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
})

// Provider nesting (outer → inner):
//   StrictMode            – dev-only checks
//   QueryClientProvider   – gives every component access to TanStack Query
//   BrowserRouter         – enables routing (URLs, <Link>, useNavigate)
//   ToastProvider         – lets any page pop a toast message
//   AuthProvider          – login state; sits inside QueryClient so logout can
//                           clear the query cache
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
