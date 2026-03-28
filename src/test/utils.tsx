import { type ReactNode } from 'react'
import { render } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { CollectedProvider } from '@/hooks/useCollected'
import { ThemeProvider } from '@/hooks/useTheme'

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  })
}

interface RenderOptions {
  initialEntries?: string[]
}

export function renderWithProviders(ui: ReactNode, options: RenderOptions = {}) {
  const queryClient = createTestQueryClient()
  const { initialEntries = ['/'] } = options

  return render(
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <CollectedProvider>
          <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>
        </CollectedProvider>
      </QueryClientProvider>
    </ThemeProvider>,
  )
}
