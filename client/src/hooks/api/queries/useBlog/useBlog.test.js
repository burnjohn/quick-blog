import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useBlog } from '.'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('../../../../api', () => ({
  blogApi: {
    getById: vi.fn(),
  },
}))

import { blogApi } from '../../../../api'

describe('useBlog', () => {
  it('fetches a single blog by ID', async () => {
    blogApi.getById.mockResolvedValue({
      data: { success: true, blog: { _id: '1', title: 'Test' } },
    })

    const { result } = renderHook(() => useBlog('1'))

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.blog).toEqual({ _id: '1', title: 'Test' })
    expect(blogApi.getById).toHaveBeenCalledWith('1')
  })

  it('skips fetch when no ID is provided', () => {
    const { result } = renderHook(() => useBlog(null))

    expect(result.current.loading).toBe(false)
    expect(result.current.blog).toBeNull()
  })
})
