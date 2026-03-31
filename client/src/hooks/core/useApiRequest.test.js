import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useApiRequest } from './useApiRequest'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}))

describe('useApiRequest', () => {
  it('returns success data when execute succeeds', async () => {
    const mockApiCall = vi.fn().mockResolvedValue({
      data: { success: true, message: 'Done' },
    })

    const { result } = renderHook(() => useApiRequest({ showToast: false }))

    expect(result.current.loading).toBe(false)

    let response
    await act(async () => {
      response = await result.current.execute(mockApiCall)
    })

    expect(response.success).toBe(true)
    expect(response.data.message).toBe('Done')
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('sets error when API call throws', async () => {
    const mockApiCall = vi.fn().mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useApiRequest({ showToast: false }))

    let response
    await act(async () => {
      response = await result.current.execute(mockApiCall, { showErrorToast: false })
    })

    expect(response.success).toBe(false)
    expect(result.current.error).toBe('Network error')
    expect(result.current.loading).toBe(false)
  })
})
