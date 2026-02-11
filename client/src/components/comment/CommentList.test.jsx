import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import CommentList from './CommentList'

vi.mock('../../assets/assets', () => ({
  assets: { user_icon: 'user_icon.svg' },
}))

vi.mock('../../utils/formatters', () => ({
  formatRelativeTime: vi.fn(() => '2 hours ago'),
}))

const mockComments = [
  {
    _id: '1',
    name: 'John Doe',
    content: 'Great post!',
    createdAt: '2025-04-21T07:06:37.508Z',
  },
  {
    _id: '2',
    name: 'Jane Smith',
    content: 'Very helpful',
    createdAt: '2025-04-22T10:34:22.020Z',
  },
]

describe('CommentList', () => {
  it('renders "Comments (0)" and empty state message when comments array is empty', () => {
    render(<CommentList comments={[]} />)

    expect(screen.getByText(/Comments \(0\)/)).toBeInTheDocument()
    expect(screen.getByText('No comments yet. Be the first!')).toBeInTheDocument()
  })

  it('renders "Comments (2)" with correct count when comments provided', () => {
    render(<CommentList comments={mockComments} />)

    expect(screen.getByText(/Comments \(2\)/)).toBeInTheDocument()
  })

  it('renders each comment\'s name when comments provided', () => {
    render(<CommentList comments={mockComments} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('renders each comment\'s content when comments provided', () => {
    render(<CommentList comments={mockComments} />)

    expect(screen.getByText('Great post!')).toBeInTheDocument()
    expect(screen.getByText('Very helpful')).toBeInTheDocument()
  })
})
