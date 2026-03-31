import { describe, it, expect } from 'vitest'
import { sendSuccess, sendError, sendData } from '../src/helpers/response.js'

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

describe('sendSuccess', () => {
  it('returns 200 with success: true and spreads data', () => {
    const res = createMockRes()

    sendSuccess(res, { blogs: [1, 2] })

    expect(res.statusCode).toBe(200)
    expect(res.body).toMatchObject({
      success: true,
      message: 'Success',
      blogs: [1, 2],
    })
  })

  it('uses custom status code and message', () => {
    const res = createMockRes()

    sendSuccess(res, { id: 1 }, 'Created', 201)

    expect(res.statusCode).toBe(201)
    expect(res.body).toMatchObject({
      success: true,
      message: 'Created',
      id: 1,
    })
  })
})

describe('sendError', () => {
  it('returns 400 with success: false', () => {
    const res = createMockRes()

    sendError(res)

    expect(res.statusCode).toBe(400)
    expect(res.body).toMatchObject({
      success: false,
      message: 'Error',
    })
  })

  it('uses custom status code', () => {
    const res = createMockRes()

    sendError(res, 'Not found', 404)

    expect(res.statusCode).toBe(404)
    expect(res.body).toMatchObject({
      success: false,
      message: 'Not found',
    })
  })
})

describe('sendData', () => {
  it('returns data with count when provided', () => {
    const res = createMockRes()

    sendData(res, { blogs: [1, 2] }, 2)

    expect(res.body).toMatchObject({
      success: true,
      count: 2,
      blogs: [1, 2],
    })
  })

  it('omits count when null', () => {
    const res = createMockRes()

    sendData(res, { blogs: [] })

    expect(res.body).toMatchObject({
      success: true,
      blogs: [],
    })
    expect(res.body).not.toHaveProperty('count')
  })
})
