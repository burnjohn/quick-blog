import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useAnalyticsPost } from '.'
import { analyticsApi } from '../../../../api'

vi.mock('../../../../api', () => ({ analyticsApi: { getPost: vi.fn() } }))

const httpError = (status) => Object.assign(new Error(`HTTP ${status}`), { response: { status } })

beforeEach(() => {
  analyticsApi.getPost.mockReset()
})

describe('useAnalyticsPost', () => {
  it.each([400, 404])('reports notFound for a %i response', async (status) => {
    analyticsApi.getPost.mockImplementation(() => Promise.reject(httpError(status)))
    const { result } = renderHook(() => useAnalyticsPost('a'.repeat(24)))
    await waitFor(() => expect(result.current.error).toBeTruthy())
    expect(result.current.notFound).toBe(true)
  })

  it('does not report notFound for other errors', async () => {
    analyticsApi.getPost.mockImplementation(() => Promise.reject(httpError(500)))
    const { result } = renderHook(() => useAnalyticsPost('a'.repeat(24)))
    await waitFor(() => expect(result.current.error).toBeTruthy())
    expect(result.current.notFound).toBe(false)
  })

  it('does not carry a 404 from a previous id over to a new id that fails differently', async () => {
    const idA = 'a'.repeat(24)
    const idB = 'b'.repeat(24)
    analyticsApi.getPost.mockImplementation((id) => Promise.reject(httpError(id === idA ? 404 : 500)))
    const { result, rerender } = renderHook(({ id }) => useAnalyticsPost(id), { initialProps: { id: idA } })
    await waitFor(() => expect(result.current.notFound).toBe(true))
    rerender({ id: idB })
    expect(result.current.notFound).toBe(false)
    await waitFor(() => expect(analyticsApi.getPost).toHaveBeenCalledWith(idB, expect.anything()))
    await waitFor(() => expect(result.current.error).toBeTruthy())
    expect(result.current.notFound).toBe(false)
  })
})
