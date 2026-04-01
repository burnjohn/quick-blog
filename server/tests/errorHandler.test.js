import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

describe('Error Handling', () => {
  it('unknown route returns 404 with correct shape', async () => {
    const res = await request(app).get('/api/nonexistent-route')

    expect(res.status).toBe(404)
    expect(res.body).toMatchObject({
      success: false,
      message: expect.stringContaining('Route not found'),
    })
  })

  it('invalid blog ID format triggers error handler', async () => {
    const res = await request(app).get('/api/blog/not-a-valid-objectid')

    // Mongoose CastError should be caught by asyncHandler and forwarded to errorHandler
    expect(res.status).toBe(500)
    expect(res.body.success).toBe(false)
  })
})
