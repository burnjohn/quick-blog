import { describe, it, expect } from 'vitest'
import User from '../src/models/User.js'

describe('User model', () => {
  it('hashes password on create (stored != plaintext)', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    })

    expect(user.password).not.toBe('password123')
    expect(user.password).toMatch(/^\$2[aby]\$/)
  })

  it('comparePassword returns true for correct password', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'compare-true@example.com',
      password: 'password123',
    })

    const isMatch = await user.comparePassword('password123')
    expect(isMatch).toBe(true)
  })

  it('comparePassword returns false for wrong password', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'compare-false@example.com',
      password: 'password123',
    })

    const isMatch = await user.comparePassword('wrongpassword')
    expect(isMatch).toBe(false)
  })

  it('toJSON excludes password field', async () => {
    const user = await User.create({
      name: 'Test User',
      email: 'tojson@example.com',
      password: 'password123',
    })

    const json = user.toJSON()
    expect(json).not.toHaveProperty('password')
    expect(json.name).toBe('Test User')
    expect(json.email).toBe('tojson@example.com')
  })
})
