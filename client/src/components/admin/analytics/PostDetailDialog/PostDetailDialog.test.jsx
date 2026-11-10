import React, { useRef, useState } from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const hook = vi.hoisted(() => vi.fn())
vi.mock('../../../../hooks/api/queries/useAnalyticsPost', () => ({ useAnalyticsPost: hook }))

import PostDetailDialog from '.'

const post = {
  id: 'p1',
  title: 'Hello World',
  category: 'Tech',
  tags: ['react'],
  author: { id: 'u', name: 'Sarah' },
  publishedAt: '2026-03-01',
  kpis: [{ key: 'views', value: 1200, delta: { direction: 'up', percent: 12.2 } }],
  series: [{ date: '2026-10-01', views: 5 }],
  sources: [{ key: 'search', views: 10, share: 0.5 }],
  devices: [{ key: 'mobile', views: 10, share: 0.5 }],
}

const state = (over) => ({ post: null, loading: false, error: null, notFound: false, refetch: vi.fn(), ...over })

beforeEach(() => hook.mockReset())

describe('PostDetailDialog', () => {
  it('shows post data and an Open post link', () => {
    hook.mockReturnValue(state({ post }))
    render(<PostDetailDialog postId='p1' onClose={() => {}} />)
    expect(screen.getByRole('heading', { name: 'Hello World' })).toBeInTheDocument()
    expect(screen.getByText('1,200')).toBeInTheDocument()
    const link = screen.getByRole('link', { name: 'Open post' })
    expect(link).toHaveAttribute('href', '/blog/p1')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  })

  it('shows the skeleton instead of a previous post while another post loads', () => {
    hook.mockReturnValue(state({ post, loading: true }))
    render(<PostDetailDialog postId='p2' onClose={() => {}} />)
    expect(screen.getByRole('status', { name: 'Loading post details' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Hello World' })).not.toBeInTheDocument()
  })

  it('calls onClose on cancel event', () => {
    hook.mockReturnValue(state({ post }))
    const onClose = vi.fn()
    const { container } = render(<PostDetailDialog postId='p1' onClose={onClose} />)
    fireEvent(container.querySelector('dialog'), new Event('cancel', { cancelable: true }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('shows Post not found', () => {
    hook.mockReturnValue(state({ error: new Error('x'), notFound: true }))
    render(<PostDetailDialog postId='p1' onClose={() => {}} />)
    expect(screen.getByText('Post not found')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Retry' })).toBeNull()
  })

  it('offers Retry on error', async () => {
    const refetch = vi.fn()
    hook.mockReturnValue(state({ error: new Error('x'), refetch }))
    render(<PostDetailDialog postId='p1' onClose={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(refetch).toHaveBeenCalled()
  })

  it('returns focus to the trigger after close', async () => {
    hook.mockReturnValue(state({ post }))
    function Harness() {
      const [id, setId] = useState(null)
      const ref = useRef(null)
      return (
        <>
          <button ref={ref} onClick={() => setId('p1')}>trigger</button>
          <PostDetailDialog postId={id} returnFocusRef={ref} onClose={() => setId(null)} />
        </>
      )
    }
    render(<Harness />)
    const trigger = screen.getByText('trigger')
    await userEvent.click(trigger)
    await userEvent.click(screen.getByRole('button', { name: 'Close post details' }))
    expect(trigger).toHaveFocus()
  })

  it('falls back to #top-posts-heading', async () => {
    hook.mockReturnValue(state({ post }))
    const { rerender } = render(
      <>
        <h2 id='top-posts-heading' tabIndex={-1}>Top</h2>
        <PostDetailDialog postId='p1' onClose={() => {}} />
      </>
    )
    rerender(
      <>
        <h2 id='top-posts-heading' tabIndex={-1}>Top</h2>
        <PostDetailDialog postId={null} onClose={() => {}} />
      </>
    )
    expect(document.getElementById('top-posts-heading')).toHaveFocus()
  })
})
