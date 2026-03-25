import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCreateBlog } from './useCreateBlog'

const mockPost = vi.fn()
vi.mock('../../../context/AppContext', () => ({
  useAppContext: vi.fn(() => ({ axios: { post: mockPost } }))
}))

const mockMutate = vi.fn()
vi.mock('../../core', () => ({
  useApiMutation: vi.fn(() => ({
    mutate: mockMutate,
    loading: false,
    error: null
  }))
}))

describe('useCreateBlog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns initial state (isCreating: false, error: null)', () => {
    const { result } = renderHook(() => useCreateBlog())

    expect(result.current.isCreating).toBe(false)
    expect(result.current.inProgress).toBe(false)
    expect(result.current.error).toBeNull()
    expect(typeof result.current.createBlog).toBe('function')
  })

  it('returns { success: false } when imageFile is falsy (null/undefined)', async () => {
    const { result } = renderHook(() => useCreateBlog())

    let resolved

    await act(async () => {
      resolved = await result.current.createBlog({ title: 'Test' }, null)
    })

    expect(resolved).toEqual({ success: false, message: 'Invalid image file' })
    expect(mockMutate).not.toHaveBeenCalled()
  })

  it('returns { success: false } when imageFile is boolean (false)', async () => {
    const { result } = renderHook(() => useCreateBlog())

    let resolved

    await act(async () => {
      resolved = await result.current.createBlog({ title: 'Test' }, false)
    })

    expect(resolved).toEqual({ success: false, message: 'Invalid image file' })
    expect(mockMutate).not.toHaveBeenCalled()
  })

  it('calls mutate with FormData containing blog JSON and image file when valid inputs provided', async () => {
    const appendSpy = vi.spyOn(FormData.prototype, 'append')
    const blogData = { title: 'My Blog', content: 'Content here' }
    const imageFile = new File(['content'], 'test.png', { type: 'image/png' })
    mockMutate.mockResolvedValue({ success: true })

    const { result } = renderHook(() => useCreateBlog())

    await act(async () => {
      await result.current.createBlog(blogData, imageFile)
    })

    expect(mockMutate).toHaveBeenCalledTimes(1)
    expect(mockMutate).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        successMessage: 'Blog created successfully!',
        errorMessage: 'Failed to create blog.'
      })
    )

    expect(appendSpy).toHaveBeenCalledWith('blog', JSON.stringify(blogData))
    expect(appendSpy).toHaveBeenCalledWith('image', imageFile)

    appendSpy.mockRestore()
  })

  it('passes correct success/error messages to mutate config', async () => {
    const blogData = { title: 'Test' }
    const imageFile = new File(['x'], 'image.png', { type: 'image/png' })
    mockMutate.mockResolvedValue({ success: true })

    const { result } = renderHook(() => useCreateBlog())

    await act(async () => {
      await result.current.createBlog(blogData, imageFile)
    })

    const [apiCallFn, config] = mockMutate.mock.calls[0]
    expect(config).toEqual({
      successMessage: 'Blog created successfully!',
      errorMessage: 'Failed to create blog.'
    })
    expect(typeof apiCallFn).toBe('function')
  })
})
