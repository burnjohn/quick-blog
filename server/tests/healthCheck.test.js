import { describe, it, expect } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

describe('GET / (Health Check)', () => {
  it('returns 200 with success, message, version, timestamp', async () => {
    const res = await request(app).get('/')

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      success: true,
      message: 'API is Working',
      version: '1.0.0',
      timestamp: expect.any(String),
    })
  })

  it('response includes valid ISO timestamp', async () => {
    const res = await request(app).get('/')

    const parsed = new Date(res.body.timestamp)
    expect(parsed.toISOString()).toBe(res.body.timestamp)
  })
})
