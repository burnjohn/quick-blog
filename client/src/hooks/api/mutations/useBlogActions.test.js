import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBlogActions } from './useBlogActions'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}))

const mockAxios = {
  post: vi.fn(),
}

vi.mock('../../../context/AppContext', () => ({
  useAppContext: () => ({ axios: mockAxios }),
}))

describe('useBlogActions', () => {
  it('deleteBlog calls API when confirmation accepted', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    mockAxios.post.mockResolvedValue({
      data: { success: true, message: 'Deleted' },
    })

    const { result } = renderHook(() => useBlogActions())

    await act(async () => {
      await result.current.deleteBlog('1')
    })

    expect(mockAxios.post).toHaveBeenCalledWith('/api/blog/delete', { id: '1' })

    window.confirm.mockRestore()
  })

  it('deleteBlog does not call API when confirmation denied', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    mockAxios.post.mockClear()

    const { result } = renderHook(() => useBlogActions())

    let response
    await act(async () => {
      response = await result.current.deleteBlog('1')
    })

    expect(response).toEqual({ success: false, cancelled: true })
    expect(mockAxios.post).not.toHaveBeenCalled()

    window.confirm.mockRestore()
  })
})
