import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from '@/hooks/useTheme'
import { CollectedProvider } from '@/hooks/useCollected'
import { STALE_TIME, GC_TIME } from '@/lib/constants'
import { router } from '@/routes/router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      gcTime: GC_TIME,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <CollectedProvider>
          <RouterProvider router={router} />
        </CollectedProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
