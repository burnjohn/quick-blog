import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  getServerBaseUrl,
  toFullImageUrl,
  transformBlogImage,
  transformBlogsImages,
} from '../src/utils/imageUrl.js'

function createMockReq() {
  return {
    protocol: 'http',
    get: (header) => {
      if (header === 'host') return 'localhost:5000'
      return undefined
    },
  }
}

describe('getServerBaseUrl', () => {
  const originalEnv = process.env.SERVER_URL

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.SERVER_URL = originalEnv
    } else {
      delete process.env.SERVER_URL
    }
  })

  it('returns SERVER_URL env var when set', () => {
    process.env.SERVER_URL = 'https://api.example.com'
    const result = getServerBaseUrl(createMockReq())
    expect(result).toBe('https://api.example.com')
  })

  it('constructs URL from request when no env var', () => {
    delete process.env.SERVER_URL
    const result = getServerBaseUrl(createMockReq())
    expect(result).toBe('http://localhost:5000')
  })
})

describe('toFullImageUrl', () => {
  const req = createMockReq()

  beforeEach(() => {
    delete process.env.SERVER_URL
  })

  it('returns null/undefined as-is', () => {
    expect(toFullImageUrl(null, req)).toBeNull()
    expect(toFullImageUrl(undefined, req)).toBeUndefined()
  })

  it('returns absolute URLs unchanged', () => {
    expect(toFullImageUrl('https://cdn.example.com/img.jpg', req)).toBe(
      'https://cdn.example.com/img.jpg'
    )
    expect(toFullImageUrl('http://cdn.example.com/img.jpg', req)).toBe(
      'http://cdn.example.com/img.jpg'
    )
  })

  it('prepends base URL to relative paths', () => {
    expect(toFullImageUrl('/uploads/blogs/test.jpg', req)).toBe(
      'http://localhost:5000/uploads/blogs/test.jpg'
    )
  })
})

describe('transformBlogImage', () => {
  it('converts blog document image to full URL', () => {
    delete process.env.SERVER_URL
    const blog = {
      toObject: () => ({
        _id: '123',
        title: 'Test',
        image: '/uploads/blogs/test.jpg',
      }),
    }
    const req = createMockReq()

    const result = transformBlogImage(blog, req)

    expect(result.image).toBe('http://localhost:5000/uploads/blogs/test.jpg')
    expect(result.title).toBe('Test')
  })
})

describe('transformBlogsImages', () => {
  it('converts array of blogs', () => {
    delete process.env.SERVER_URL
    const blogs = [
      {
        toObject: () => ({ _id: '1', image: '/uploads/a.jpg' }),
      },
      {
        toObject: () => ({ _id: '2', image: '/uploads/b.jpg' }),
      },
    ]
    const req = createMockReq()

    const result = transformBlogsImages(blogs, req)

    expect(result).toHaveLength(2)
    expect(result[0].image).toBe('http://localhost:5000/uploads/a.jpg')
    expect(result[1].image).toBe('http://localhost:5000/uploads/b.jpg')
  })
})
