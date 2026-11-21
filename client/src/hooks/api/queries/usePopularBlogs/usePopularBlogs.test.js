import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import toast from 'react-hot-toast'
import { usePopularBlogs } from '.'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('../../../../api', () => ({
  blogApi: {
    getPopular: vi.fn(),
  },
}))

import { blogApi } from '../../../../api'

const mockPost = { _id: '1', title: 'Top', views: 10, comments: 2 }

describe('usePopularBlogs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('requests with limit/days and returns posts and range', async () => {
    blogApi.getPopular.mockResolvedValue({
      data: { success: true, count: 1, range: 'window', blogs: [mockPost] },
    })

    const { result } = renderHook(() => usePopularBlogs({ limit: 5, days: 7 }))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(blogApi.getPopular).toHaveBeenCalledWith({ limit: 5, days: 7 })
    expect(result.current.blogs).toEqual([mockPost])
    expect(result.current.range).toBe('window')
  })

  it('uses defaults of 8 posts over 30 days', async () => {
    blogApi.getPopular.mockResolvedValue({ data: { success: true, blogs: [] } })

    renderHook(() => usePopularBlogs())

    await waitFor(() => expect(blogApi.getPopular).toHaveBeenCalledWith({ limit: 8, days: 30 }))
  })

  it('returns an error without showing a toast on failure', async () => {
    blogApi.getPopular.mockRejectedValue(new Error('Server error'))

    const { result } = renderHook(() => usePopularBlogs())

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.blogs).toEqual([])
    expect(result.current.error).toBeTruthy()
    expect(toast.error).not.toHaveBeenCalled()
  })
})
