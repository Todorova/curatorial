import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { DepartmentFilter } from '../department-filter'
import { MET_API_BASE } from '@/lib/constants'

const mockDepartments = [
  { departmentId: 11, displayName: 'European Paintings' },
  { departmentId: 21, displayName: 'Modern Art' },
  { departmentId: 6, displayName: 'Asian Art' },
]

const server = setupServer(
  http.get(`${MET_API_BASE}/departments`, () => {
    return HttpResponse.json({ departments: mockDepartments })
  }),
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function renderFilter(initialEntry = '/') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <DepartmentFilter />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('DepartmentFilter', () => {
  it('renders "All" tag and fetched departments', async () => {
    renderFilter()

    expect(screen.getByText('All')).toBeInTheDocument()
    expect(await screen.findByText('European Paintings')).toBeInTheDocument()
    expect(screen.getByText('Modern Art')).toBeInTheDocument()
    expect(screen.getByText('Asian Art')).toBeInTheDocument()
  })

  it('has "All" as active by default', async () => {
    renderFilter()

    await screen.findByText('European Paintings')
    const allButton = screen.getByText('All')
    expect(allButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('has proper accessibility attributes', async () => {
    renderFilter()

    await screen.findByText('European Paintings')
    const group = screen.getByRole('group', { name: /department filters/i })
    expect(group).toBeInTheDocument()
  })
})
