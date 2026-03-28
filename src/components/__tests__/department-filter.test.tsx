import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { DepartmentFilter } from '../department-filter'
import { DEPARTMENTS } from '@/lib/constants'

function renderFilter(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <DepartmentFilter />
    </MemoryRouter>
  )
}

describe('DepartmentFilter', () => {
  it('renders all department tags', () => {
    renderFilter()

    for (const dept of DEPARTMENTS) {
      expect(screen.getByText(dept.displayName)).toBeInTheDocument()
    }
  })

  it('has "All" as active by default', () => {
    renderFilter()

    const allButton = screen.getByText('All')
    expect(allButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('marks the correct department as active from URL', () => {
    renderFilter('/?dept=11')

    const epButton = screen.getByText('European Paintings')
    expect(epButton).toHaveAttribute('aria-pressed', 'true')

    const allButton = screen.getByText('All')
    expect(allButton).toHaveAttribute('aria-pressed', 'false')
  })

  it('updates active state when a department is clicked', async () => {
    const user = userEvent.setup()
    renderFilter()

    const modernArt = screen.getByText('Modern Art')
    await user.click(modernArt)

    expect(modernArt).toHaveAttribute('aria-pressed', 'true')
  })

  it('has proper accessibility attributes', () => {
    renderFilter()

    const group = screen.getByRole('group', { name: /department filters/i })
    expect(group).toBeInTheDocument()
  })
})
