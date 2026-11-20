import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import LeadCard from '.'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const mockBlog = {
  _id: 'lead-1',
  title: 'The Lead Story',
  description: '<p>Lead story body</p>',
  category: 'Startup',
  image: '/lead.jpg',
  createdAt: '2026-03-01T00:00:00Z',
}

const renderLead = () =>
  render(
    <MemoryRouter>
      <LeadCard blog={mockBlog} />
    </MemoryRouter>
  )

describe('LeadCard', () => {
  beforeEach(() => mockNavigate.mockClear())

  it('renders title, category, date, excerpt and cover', () => {
    renderLead()

    expect(screen.getByRole('heading', { name: 'The Lead Story' })).toBeInTheDocument()
    expect(screen.getByText('Startup')).toBeInTheDocument()
    expect(screen.getByText(/march/i)).toBeInTheDocument()
    expect(screen.getByText('Lead story body')).toBeInTheDocument()
    expect(screen.getByAltText('The Lead Story')).toBeInTheDocument()
  })

  it('opens the post on click and on Enter', async () => {
    const user = userEvent.setup()
    renderLead()

    await user.click(screen.getByRole('heading', { name: 'The Lead Story' }))
    expect(mockNavigate).toHaveBeenCalledWith('/blog/lead-1')

    mockNavigate.mockClear()
    screen.getByRole('link', { name: 'The Lead Story' }).focus()
    await user.keyboard('{Enter}')
    expect(mockNavigate).toHaveBeenCalledWith('/blog/lead-1')
  })
})
