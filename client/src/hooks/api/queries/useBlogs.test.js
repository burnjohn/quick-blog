import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useBlogs } from './useBlogs'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}))

const mockBlog = { _id: '1', title: 'Test' }

vi.mock('../../../api', () => ({
  blogApi: {
    getAll: vi.fn(),
  },
}))

import { blogApi } from '../../../api'

describe('useBlogs', () => {
  it('returns blogs after successful fetch', async () => {
    blogApi.getAll.mockResolvedValue({
      data: { success: true, blogs: [mockBlog] },
    })

    const { result } = renderHook(() => useBlogs())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.blogs).toEqual([mockBlog])
  })

  it('returns empty array on failure', async () => {
    blogApi.getAll.mockRejectedValue(new Error('Server error'))

    const { result } = renderHook(() => useBlogs())

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.blogs).toEqual([])
    expect(result.current.error).toBeTruthy()
  })
})
