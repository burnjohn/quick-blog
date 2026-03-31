import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useApiMutation } from '.'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}))

describe('useApiMutation', () => {
  it('returns success when mutate resolves', async () => {
    const mockApiCall = vi.fn().mockResolvedValue({
      data: { success: true, message: 'Created' },
    })

    const { result } = renderHook(() => useApiMutation({ showToast: false }))

    let response
    await act(async () => {
      response = await result.current.mutate(mockApiCall)
    })

    expect(response.success).toBe(true)
    expect(result.current.loading).toBe(false)
  })

  it('returns cancelled when confirmation is denied', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)

    const mockApiCall = vi.fn()
    const { result } = renderHook(() => useApiMutation())

    let response
    await act(async () => {
      response = await result.current.mutate(mockApiCall, {
        confirmMessage: 'Are you sure?',
      })
    })

    expect(response).toEqual({ success: false, cancelled: true })
    expect(mockApiCall).not.toHaveBeenCalled()

    window.confirm.mockRestore()
  })
})
