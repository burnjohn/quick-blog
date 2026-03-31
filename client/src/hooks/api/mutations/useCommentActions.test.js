import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCommentActions } from './useCommentActions'

vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}))

const mockAxios = {
  post: vi.fn(),
}

vi.mock('../../../context/AppContext', () => ({
  useAppContext: () => ({ axios: mockAxios }),
}))

describe('useCommentActions', () => {
  it('approveComment calls the correct API endpoint', async () => {
    mockAxios.post.mockResolvedValue({
      data: { success: true, message: 'Approved' },
    })

    const { result } = renderHook(() => useCommentActions())

    await act(async () => {
      await result.current.approveComment('c1')
    })

    expect(mockAxios.post).toHaveBeenCalledWith('/api/admin/approve-comment', {
      id: 'c1',
    })
  })

  it('deleteComment shows confirmation and calls API when accepted', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    mockAxios.post.mockClear()
    mockAxios.post.mockResolvedValue({
      data: { success: true, message: 'Deleted' },
    })

    const { result } = renderHook(() => useCommentActions())

    await act(async () => {
      await result.current.deleteComment('c1')
    })

    expect(window.confirm).toHaveBeenCalledWith(
      'Are you sure you want to delete this comment?'
    )
    expect(mockAxios.post).toHaveBeenCalledWith('/api/admin/delete-comment', {
      id: 'c1',
    })

    window.confirm.mockRestore()
  })
})
