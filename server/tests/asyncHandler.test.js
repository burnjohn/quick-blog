import { describe, it, expect, vi } from 'vitest'
import { asyncHandler } from '../src/helpers/asyncHandler.js'

describe('asyncHandler', () => {
  it('calls the wrapped async function with req, res, next', async () => {
    const fn = vi.fn().mockResolvedValue(undefined)
    const req = {}
    const res = {}
    const next = vi.fn()

    const wrapped = asyncHandler(fn)
    await wrapped(req, res, next)

    expect(fn).toHaveBeenCalledWith(req, res, next)
  })

  it('calls next with error when wrapped function rejects', async () => {
    const error = new Error('async failure')
    const fn = vi.fn().mockRejectedValue(error)
    const next = vi.fn()

    const wrapped = asyncHandler(fn)
    await wrapped({}, {}, next)

    expect(next).toHaveBeenCalledWith(error)
  })

  it('propagates sync throw as an unhandled error', () => {
    const error = new Error('sync throw')
    const fn = vi.fn().mockImplementation(() => {
      throw error
    })
    const next = vi.fn()

    const wrapped = asyncHandler(fn)
    // asyncHandler uses Promise.resolve(fn(...)).catch(next)
    // A sync throw from fn happens before Promise.resolve wraps it,
    // so it propagates as a thrown error (Express catches these at the framework level)
    expect(() => wrapped({}, {}, next)).toThrow('sync throw')
  })
})
