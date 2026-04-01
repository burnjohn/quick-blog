import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../src/app.js'
import { createTestUser, generateToken, authHeader } from './fixtures.js'

describe('Auth Middleware', () => {
  let user, token

  beforeEach(async () => {
    user = await createTestUser()
    token = generateToken(user)
  })

  // Use /api/admin/dashboard as a protected endpoint to test auth middleware
  const protectedUrl = '/api/admin/dashboard'

  it('valid Bearer token passes auth and populates req.user', async () => {
    const res = await request(app)
      .get(protectedUrl)
      .set(authHeader(token))

    expect(res.status).toBe(200)
    expect(res.body.success).toBe(true)
  })

  it('missing Authorization header returns 401', async () => {
    const res = await request(app).get(protectedUrl)

    expect(res.status).toBe(401)
    expect(res.body).toMatchObject({
      success: false,
      message: 'No token provided',
    })
  })

  it('malformed/invalid token returns 401', async () => {
    const res = await request(app)
      .get(protectedUrl)
      .set('Authorization', 'Bearer invalid-garbage-token')

    expect(res.status).toBe(401)
    expect(res.body).toMatchObject({
      success: false,
      message: 'Invalid token',
    })
  })

  it('expired token returns 401 with "Token expired"', async () => {
    const expiredToken = jwt.sign(
      { userId: user._id, email: user.email, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '0s' }
    )

    // Small delay to ensure token is expired
    await new Promise((resolve) => setTimeout(resolve, 50))

    const res = await request(app)
      .get(protectedUrl)
      .set(authHeader(expiredToken))

    expect(res.status).toBe(401)
    expect(res.body).toMatchObject({
      success: false,
      message: 'Token expired',
    })
  })
})
