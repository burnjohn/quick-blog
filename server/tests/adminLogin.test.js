import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import { createTestUser } from './fixtures.js'

describe('POST /api/admin/login', () => {
  let user

  beforeEach(async () => {
    user = await createTestUser()
  })

  it('successful login returns token and user data', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ email: 'admin@test.com', password: 'password123' })

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({
      success: true,
      token: expect.any(String),
      user: {
        name: 'Test Admin',
        email: 'admin@test.com',
        role: 'admin',
      },
    })
  })

  it('invalid email returns 401', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ email: 'wrong@test.com', password: 'password123' })

    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
  })

  it('invalid password returns 401', async () => {
    const res = await request(app)
      .post('/api/admin/login')
      .send({ email: 'admin@test.com', password: 'wrongpassword' })

    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
  })

  it('inactive user cannot login', async () => {
    await createTestUser({
      email: 'inactive@test.com',
      isActive: false,
    })

    const res = await request(app)
      .post('/api/admin/login')
      .send({ email: 'inactive@test.com', password: 'password123' })

    expect(res.status).toBe(401)
    expect(res.body.success).toBe(false)
  })
})
