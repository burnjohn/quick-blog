import { describe, it, expect, vi } from 'vitest'
import { validateComment } from '../src/validators/blogValidator.js'

function createMockRes() {
  const res = {
    statusCode: null,
    body: null,
    status(code) {
      res.statusCode = code
      return res
    },
    json(data) {
      res.body = data
      return res
    },
  }
  return res
}

describe('validateComment', () => {
  it('rejects missing blog ID', () => {
    const req = { body: { name: 'John', content: 'Great post!' } }
    const res = createMockRes()
    const next = vi.fn()

    validateComment(req, res, next)

    expect(res.statusCode).toBe(400)
    expect(res.body.success).toBe(false)
    expect(res.body.errors).toContain('Blog ID is required')
    expect(next).not.toHaveBeenCalled()
  })

  it('rejects short name (< 2 chars)', () => {
    const req = { body: { blog: '123', name: 'A', content: 'Great post!' } }
    const res = createMockRes()
    const next = vi.fn()

    validateComment(req, res, next)

    expect(res.statusCode).toBe(400)
    expect(res.body.errors).toContain('Name must be at least 2 characters')
    expect(next).not.toHaveBeenCalled()
  })

  it('rejects short content (< 5 chars)', () => {
    const req = { body: { blog: '123', name: 'John', content: 'Hi' } }
    const res = createMockRes()
    const next = vi.fn()

    validateComment(req, res, next)

    expect(res.statusCode).toBe(400)
    expect(res.body.errors).toContain('Content must be at least 5 characters')
    expect(next).not.toHaveBeenCalled()
  })

  it('passes valid input and calls next()', () => {
    const req = { body: { blog: '123', name: 'John', content: 'Great post!' } }
    const res = createMockRes()
    const next = vi.fn()

    validateComment(req, res, next)

    expect(next).toHaveBeenCalledOnce()
    expect(res.statusCode).toBeNull()
  })
})
