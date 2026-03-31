import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useForm } from './useForm'

describe('useForm', () => {
  it('manages form state via handleChange and clears errors', () => {
    const { result } = renderHook(() =>
      useForm({ name: '', email: '' })
    )

    expect(result.current.values).toEqual({ name: '', email: '' })

    // Set an error first so we can verify it gets cleared
    act(() => {
      result.current.setFieldError('name', 'Required')
    })
    expect(result.current.errors.name).toBe('Required')

    act(() => {
      result.current.handleChange('name', 'Alice')
    })

    expect(result.current.values.name).toBe('Alice')
    expect(result.current.errors.name).toBeNull()
  })

  it('validates on submit and blocks submission when errors exist', async () => {
    const onSubmit = vi.fn()
    const validate = (values) => {
      const errors = {}
      if (!values.name) errors.name = 'Name is required'
      return errors
    }

    const { result } = renderHook(() => useForm({ name: '' }))

    await act(async () => {
      await result.current.handleSubmit(onSubmit, validate)
    })

    expect(result.current.errors.name).toBe('Name is required')
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
