import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { DateRangeFilter } from '../date-range-filter'

function renderFilter(initialEntry = '/') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <DateRangeFilter />
    </MemoryRouter>,
  )
}

describe('DateRangeFilter', () => {
  it('renders from and to year inputs', () => {
    renderFilter()

    expect(screen.getByLabelText(/from year/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/to year/i)).toBeInTheDocument()
  })

  it('initializes from URL search params', () => {
    renderFilter('/?dateBegin=-500&dateEnd=200')

    expect(screen.getByLabelText(/from year/i)).toHaveValue(-500)
    expect(screen.getByLabelText(/to year/i)).toHaveValue(200)
  })

  it('shows validation hint when only one field is filled', async () => {
    const user = userEvent.setup()
    renderFilter()

    await user.type(screen.getByLabelText(/from year/i), '1800')

    expect(screen.getByText('Both years required')).toBeInTheDocument()
  })

  it('shows validation hint when from > to', async () => {
    const user = userEvent.setup()
    renderFilter()

    await user.type(screen.getByLabelText(/from year/i), '1900')
    await user.type(screen.getByLabelText(/to year/i), '1800')

    expect(screen.getByText('From must be before To')).toBeInTheDocument()
  })

  it('shows clear button when values are present', async () => {
    const user = userEvent.setup()
    renderFilter()

    await user.type(screen.getByLabelText(/from year/i), '1800')

    expect(screen.getByLabelText(/clear date filter/i)).toBeInTheDocument()
  })

  it('clears both inputs when clear button is clicked', async () => {
    const user = userEvent.setup()
    renderFilter()

    await user.type(screen.getByLabelText(/from year/i), '1800')
    await user.type(screen.getByLabelText(/to year/i), '1900')
    await user.click(screen.getByLabelText(/clear date filter/i))

    expect(screen.getByLabelText(/from year/i)).toHaveValue(null)
    expect(screen.getByLabelText(/to year/i)).toHaveValue(null)
  })

  it('supports BCE dates (negative years)', async () => {
    const user = userEvent.setup()
    renderFilter()

    await user.type(screen.getByLabelText(/from year/i), '-500')
    await user.type(screen.getByLabelText(/to year/i), '-200')

    expect(screen.queryByText('Both years required')).not.toBeInTheDocument()
    expect(screen.queryByText('From must be before To')).not.toBeInTheDocument()
  })

  it('marks inputs as aria-invalid when range is inverted', async () => {
    const user = userEvent.setup()
    renderFilter()

    await user.type(screen.getByLabelText(/from year/i), '2000')
    await user.type(screen.getByLabelText(/to year/i), '1000')

    expect(screen.getByLabelText(/from year/i)).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText(/to year/i)).toHaveAttribute('aria-invalid', 'true')
  })

  it('does not sync invalid range to URL on blur', async () => {
    const user = userEvent.setup()
    renderFilter()

    const fromInput = screen.getByLabelText(/from year/i)
    const toInput = screen.getByLabelText(/to year/i)

    await user.type(fromInput, '2000')
    await user.type(toInput, '1000')
    await user.click(document.body) // blur

    // Hint should still show — URL was not updated
    expect(screen.getByText('From must be before To')).toBeInTheDocument()
  })
})
