import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useBlogGenerator } from './useBlogGenerator'

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

vi.mock('react-hot-toast', () => ({
  default: { error: vi.fn(), success: vi.fn() }
}))

const mockParse = vi.fn((content) => `<p>${content}</p>`)
vi.mock('marked', () => ({
  parse: (content) => mockParse(content)
}))

describe('useBlogGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns initial state (isGenerating: false, generatedContent: null, error: null)', () => {
    const { result } = renderHook(() => useBlogGenerator())

    expect(result.current.isGenerating).toBe(false)
    expect(result.current.inProgress).toBe(false)
    expect(result.current.generatedContent).toBeNull()
    expect(result.current.error).toBeNull()
    expect(typeof result.current.generateContent).toBe('function')
    expect(typeof result.current.clearContent).toBe('function')
  })

  it('shows error toast when prompt is empty and returns { success: false }', async () => {
    const toast = (await import('react-hot-toast')).default
    const { result } = renderHook(() => useBlogGenerator())

    let resolved
    await act(async () => {
      resolved = await result.current.generateContent('')
    })

    expect(resolved).toEqual({ success: false, message: 'Title required' })
    expect(toast.error).toHaveBeenCalledWith('Please enter a title')
    expect(mockMutate).not.toHaveBeenCalled()
  })

  it('shows error toast when prompt is whitespace only and returns { success: false }', async () => {
    const toast = (await import('react-hot-toast')).default
    const { result } = renderHook(() => useBlogGenerator())

    let resolved
    await act(async () => {
      resolved = await result.current.generateContent('   ')
    })

    expect(resolved).toEqual({ success: false, message: 'Title required' })
    expect(toast.error).toHaveBeenCalledWith('Please enter a title')
    expect(mockMutate).not.toHaveBeenCalled()
  })

  it('calls mutate with correct API call and config when prompt is provided', async () => {
    mockMutate.mockResolvedValue({ success: true, data: { content: 'Generated text' } })

    const { result } = renderHook(() => useBlogGenerator())

    await act(async () => {
      await result.current.generateContent('My Title')
    })

    expect(mockMutate).toHaveBeenCalledTimes(1)
    const [apiCallFn, config] = mockMutate.mock.calls[0]

    expect(apiCallFn).toBeDefined()
    expect(typeof apiCallFn).toBe('function')
    expect(config).toMatchObject({
      successMessage: 'Content generated successfully!',
      errorMessage: 'Something went wrong. Please try again.'
    })
    expect(config.onSuccess).toBeDefined()

    // Verify apiCall posts to correct endpoint with prompt
    await apiCallFn()
    expect(mockPost).toHaveBeenCalledWith('/api/blog/generate', { prompt: 'My Title' })
  })

  it('returns { success: true } and updates generatedContent when mutate succeeds', async () => {
    const mockData = { content: 'Hello **world**', success: true }
    mockMutate.mockImplementation(async (apiCall, config) => {
      if (config.onSuccess) {
        config.onSuccess(mockData)
      }
      return { success: true, data: mockData }
    })

    const { result } = renderHook(() => useBlogGenerator())

    let resolved
    await act(async () => {
      resolved = await result.current.generateContent('My Title')
    })

    expect(resolved.success).toBe(true)
    expect(resolved).toHaveProperty('content')

    await waitFor(() => {
      expect(result.current.generatedContent).toBe('<p>Hello **world**</p>')
    })
  })

  it('returns mutate result when mutate fails', async () => {
    mockMutate.mockResolvedValue({ success: false, message: 'Generation failed' })

    const { result } = renderHook(() => useBlogGenerator())

    let resolved
    await act(async () => {
      resolved = await result.current.generateContent('My Title')
    })

    expect(resolved).toEqual({ success: false, message: 'Generation failed' })
  })

  it('clearContent resets generatedContent to null', async () => {
    const mockData = { content: 'Generated', success: true }
    mockMutate.mockImplementation(async (apiCall, config) => {
      if (config.onSuccess) config.onSuccess(mockData)
      return { success: true, data: mockData }
    })

    const { result } = renderHook(() => useBlogGenerator())

    await act(async () => {
      await result.current.generateContent('Title')
    })

    await waitFor(() => {
      expect(result.current.generatedContent).not.toBeNull()
    })

    act(() => {
      result.current.clearContent()
    })

    expect(result.current.generatedContent).toBeNull()
  })
})
