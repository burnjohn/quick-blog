import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useApiMutation } from './useApiMutation'
import toast from 'react-hot-toast'

vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn(), success: vi.fn() }
}))

describe('useApiMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns initial state (loading: false, error: null, inProgress: false)', () => {
    const { result } = renderHook(() => useApiMutation())

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.inProgress).toBe(false)
    expect(typeof result.current.mutate).toBe('function')
    expect(typeof result.current.reset).toBe('function')
  })

  it('sets loading to true during API call', async () => {
    let resolveApi
    const apiPromise = new Promise((resolve) => {
      resolveApi = () => resolve({ data: { success: true } })
    })
    const mockApiCall = vi.fn().mockReturnValue(apiPromise)

    const { result } = renderHook(() => useApiMutation())

    act(() => {
      result.current.mutate(mockApiCall) // fire without awaiting
    })

    await act(async () => {
      await new Promise((r) => setTimeout(r, 0))
    })
    expect(result.current.loading).toBe(true)
    expect(result.current.inProgress).toBe(true)

    resolveApi()
    await act(async () => {
      await new Promise((r) => setTimeout(r, 0))
    })

    expect(result.current.loading).toBe(false)
  })

  it('returns { success: true, data } when API returns { success: true }', async () => {
    const mockData = { success: true, message: 'Done' }
    const mockApiCall = vi.fn().mockResolvedValue({ data: mockData })

    const { result } = renderHook(() => useApiMutation())

    let mutateResult
    await act(async () => {
      mutateResult = await result.current.mutate(mockApiCall)
    })

    expect(mutateResult).toEqual({ success: true, data: mockData })
  })

  it('shows success toast when successMessage is provided', async () => {
    const mockApiCall = vi.fn().mockResolvedValue({
      data: { success: true, message: 'Done' }
    })

    const { result } = renderHook(() => useApiMutation())

    await act(async () => {
      await result.current.mutate(mockApiCall, { successMessage: 'Success!' })
    })

    expect(toast.success).toHaveBeenCalledWith('Success!')
  })

  it('calls onSuccess callback when API succeeds', async () => {
    const mockData = { success: true, message: 'Done' }
    const mockApiCall = vi.fn().mockResolvedValue({ data: mockData })
    const onSuccess = vi.fn()

    const { result } = renderHook(() => useApiMutation())

    await act(async () => {
      await result.current.mutate(mockApiCall, { onSuccess })
    })

    expect(onSuccess).toHaveBeenCalledWith(mockData)
  })

  it('returns { success: false, message } when API returns { success: false, message }', async () => {
    const mockApiCall = vi.fn().mockResolvedValue({
      data: { success: false, message: 'Error msg' }
    })

    const { result } = renderHook(() => useApiMutation())

    let mutateResult
    await act(async () => {
      mutateResult = await result.current.mutate(mockApiCall)
    })

    expect(mutateResult).toEqual({ success: false, message: 'Error msg' })
    expect(result.current.error).toBe('Error msg')
  })

  it('shows error toast when API fails', async () => {
    const mockApiCall = vi.fn().mockResolvedValue({
      data: { success: false, message: 'Something went wrong' }
    })

    const { result } = renderHook(() => useApiMutation())

    await act(async () => {
      await result.current.mutate(mockApiCall)
    })

    expect(toast.error).toHaveBeenCalledWith('Something went wrong')
  })

  it('handles network errors when apiCall throws', async () => {
    const networkError = new Error('Network request failed')
    const mockApiCall = vi.fn().mockRejectedValue(networkError)

    const { result } = renderHook(() => useApiMutation())

    let mutateResult
    await act(async () => {
      mutateResult = await result.current.mutate(mockApiCall)
    })

    expect(mutateResult).toEqual({ success: false, message: 'Network request failed' })
    expect(result.current.error).toBe('Network request failed')
    expect(toast.error).toHaveBeenCalledWith('Network request failed')
  })

  it('handles confirmation dialog - cancels when user declines', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false)
    const mockApiCall = vi.fn().mockResolvedValue({ data: { success: true } })

    const { result } = renderHook(() => useApiMutation())

    let mutateResult
    await act(async () => {
      mutateResult = await result.current.mutate(mockApiCall, {
        confirmMessage: 'Are you sure?'
      })
    })

    expect(confirmSpy).toHaveBeenCalledWith('Are you sure?')
    expect(mutateResult).toEqual({ success: false, cancelled: true })
    expect(mockApiCall).not.toHaveBeenCalled()

    confirmSpy.mockRestore()
  })

  it('reset() clears error state', async () => {
    const mockApiCall = vi.fn().mockResolvedValue({
      data: { success: false, message: 'Error msg' }
    })

    const { result } = renderHook(() => useApiMutation())

    await act(async () => {
      await result.current.mutate(mockApiCall)
    })

    expect(result.current.error).toBe('Error msg')

    act(() => {
      result.current.reset()
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })
})
