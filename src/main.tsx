import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TooltipProvider } from '@/components/ui/tooltip'
import { CollectedProvider } from '@/context/collected-context'
import { STALE_TIME, GC_TIME } from '@/lib/constants'
import './index.css'
import App from './App'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
      retry: 1,
      retryDelay: (attempt) => Math.min(1500 * 2 ** attempt, 8000),
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CollectedProvider>
          <TooltipProvider>
            <App />
          </TooltipProvider>
        </CollectedProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
