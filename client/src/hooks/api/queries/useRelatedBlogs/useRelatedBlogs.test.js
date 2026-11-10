import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import toast from 'react-hot-toast'
import { useRelatedBlogs } from '.'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('../../../../api', () => ({
  blogApi: {
    getRelated: vi.fn(),
  },
}))

import { blogApi } from '../../../../api'

const deferred = () => {
  let resolve
  const promise = new Promise((r) => {
    resolve = r
  })
  return { promise, resolve }
}

describe('useRelatedBlogs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts loading and then returns related blogs', async () => {
    blogApi.getRelated.mockResolvedValue({
      data: { success: true, blogs: [{ _id: '2', title: 'Related' }] },
    })

    const { result } = renderHook(() => useRelatedBlogs('1'))

    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.blogs).toEqual([{ _id: '2', title: 'Related' }])
    expect(result.current.error).toBeNull()
    expect(blogApi.getRelated).toHaveBeenCalledWith('1')
  })

  it('returns an empty list without a toast when the request fails', async () => {
    blogApi.getRelated.mockRejectedValue(new Error('Network down'))

    const { result } = renderHook(() => useRelatedBlogs('1'))

    await waitFor(() => expect(result.current.loading).toBe(false))

    expect(result.current.blogs).toEqual([])
    expect(result.current.error).toBe('Network down')
    expect(toast.error).not.toHaveBeenCalled()
  })

  it('skips the request when no id is given', () => {
    const { result } = renderHook(() => useRelatedBlogs(undefined))

    expect(result.current.loading).toBe(false)
    expect(result.current.blogs).toEqual([])
    expect(blogApi.getRelated).not.toHaveBeenCalled()
  })

  it('ignores a stale response after the id changes', async () => {
    const first = deferred()
    const second = deferred()
    blogApi.getRelated
      .mockReturnValueOnce(first.promise)
      .mockReturnValueOnce(second.promise)

    const { result, rerender } = renderHook(({ id }) => useRelatedBlogs(id), {
      initialProps: { id: '1' },
    })
    rerender({ id: '2' })

    second.resolve({ data: { success: true, blogs: [{ _id: 'b', title: 'For 2' }] } })
    await waitFor(() => expect(result.current.loading).toBe(false))
    first.resolve({ data: { success: true, blogs: [{ _id: 'a', title: 'For 1' }] } })
    await Promise.resolve()

    expect(result.current.blogs).toEqual([{ _id: 'b', title: 'For 2' }])
  })
})
