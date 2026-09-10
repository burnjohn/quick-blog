import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { formatRelativeTime } from '../../utils/formatters'
import CommentItem from './CommentItem'

vi.mock('../../assets/assets', () => ({
  assets: { user_icon: 'user_icon.svg' },
}))

vi.mock('../../utils/formatters', () => ({
  formatRelativeTime: vi.fn(() => '2 hours ago'),
}))

describe('CommentItem', () => {
  const mockComment = {
    _id: '1',
    name: 'Alice',
    content: 'Nice article!',
    createdAt: '2025-02-11T14:30:00.000Z',
  }

  beforeEach(() => {
    vi.mocked(formatRelativeTime).mockReturnValue('2 hours ago')
  })

  it('renders comment author name', () => {
    render(<CommentItem comment={mockComment} />)

    expect(screen.getByText('Alice')).toBeInTheDocument()
  })

  it('renders comment content', () => {
    render(<CommentItem comment={mockComment} />)

    expect(screen.getByText('Nice article!')).toBeInTheDocument()
  })

  it('renders formatted relative time and calls formatRelativeTime with the date', () => {
    render(<CommentItem comment={mockComment} />)

    expect(screen.getByText('2 hours ago')).toBeInTheDocument()
    expect(formatRelativeTime).toHaveBeenCalledWith(mockComment.createdAt)
  })

  it('renders user avatar icon image', () => {
    render(<CommentItem comment={mockComment} />)

    const img = screen.getByRole('presentation')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'user_icon.svg')
  })
})
