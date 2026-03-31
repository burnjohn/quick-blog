import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useApiQuery } from './useApiQuery'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}))

describe('useApiQuery', () => {
  it('auto-fetches on mount and sets data', async () => {
    const mockApiCall = vi.fn().mockResolvedValue({
      data: { success: true, blogs: [] },
    })

    const { result } = renderHook(() => useApiQuery(mockApiCall))

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.data).toEqual({ success: true, blogs: [] })
    expect(mockApiCall).toHaveBeenCalledTimes(1)
  })

  it('skips fetch when enabled is false', () => {
    const mockApiCall = vi.fn()

    const { result } = renderHook(() =>
      useApiQuery(mockApiCall, { enabled: false })
    )

    expect(result.current.loading).toBe(false)
    expect(mockApiCall).not.toHaveBeenCalled()
  })
})
