import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { useComments } from '.'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('../../../../api', () => ({
  commentApi: {
    getByBlogId: vi.fn(),
    add: vi.fn(),
  },
}))

import { commentApi } from '../../../../api'

describe('useComments', () => {
  it('fetches comments for a blog', async () => {
    commentApi.getByBlogId.mockResolvedValue({
      data: {
        success: true,
        comments: [{ _id: '1', name: 'Alice', content: 'Nice!' }],
      },
    })

    const { result } = renderHook(() => useComments('blog1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.comments).toEqual([
      { _id: '1', name: 'Alice', content: 'Nice!' },
    ])
  })

  it('addComment triggers refetch', async () => {
    commentApi.getByBlogId.mockResolvedValue({
      data: { success: true, comments: [] },
    })
    commentApi.add.mockResolvedValue({
      data: { success: true, message: 'Comment added' },
    })

    const { result } = renderHook(() => useComments('blog1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Reset call count after initial fetch
    commentApi.getByBlogId.mockClear()
    commentApi.getByBlogId.mockResolvedValue({
      data: {
        success: true,
        comments: [{ _id: '2', name: 'Bob', content: 'Hello' }],
      },
    })

    await act(async () => {
      await result.current.addComment({
        name: 'Bob',
        content: 'Hello',
      })
    })

    expect(commentApi.add).toHaveBeenCalled()
    // addComment calls fetchComments internally, triggering refetch
    expect(commentApi.getByBlogId).toHaveBeenCalled()
  })
})
