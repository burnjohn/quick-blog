import { describe, it, expect } from 'vitest'
import { isPhotoCover, photosFirst, uniqueByImage, withPhotoLead } from './helpers'

const svg = (id) => ({ _id: id, image: `http://x/uploads/seed/cover_${id}.svg` })
const photo = (id, ext = 'png') => ({ _id: id, image: `http://x/uploads/seed/blog_pic_${id}.${ext}` })

describe('isPhotoCover', () => {
  it.each([
    ['/uploads/seed/blog_pic_1.png', true],
    ['https://cdn.example.com/a.JPG', true],
    ['/a.jpeg?w=800', true],
    ['/a.webp#x', true],
    ['/uploads/seed/photos/lead', true],
    ['/uploads/seed/cover_tech_01.svg', false],
    ['', false],
    [undefined, false],
  ])('%s → %s', (image, expected) => {
    expect(isPhotoCover(image)).toBe(expected)
  })
})

describe('photosFirst', () => {
  it('moves photo covers ahead of illustrations, keeping order within each group', () => {
    const result = photosFirst([svg('a'), photo('b'), svg('c'), photo('d', 'jpg')])
    expect(result.map((b) => b._id)).toEqual(['b', 'd', 'a', 'c'])
  })

  it('returns an empty array by default', () => {
    expect(photosFirst()).toEqual([])
  })
})

describe('withPhotoLead', () => {
  it('moves only the first photo to the front', () => {
    const result = withPhotoLead([svg('a'), svg('b'), photo('c'), photo('d')])
    expect(result.map((b) => b._id)).toEqual(['c', 'a', 'b', 'd'])
  })

  it('returns the input when there is no photo or it already leads', () => {
    const noPhotos = [svg('a'), svg('b')]
    expect(withPhotoLead(noPhotos)).toBe(noPhotos)
    const leads = [photo('a'), svg('b')]
    expect(withPhotoLead(leads)).toBe(leads)
  })
})

describe('uniqueByImage', () => {
  it('keeps the first post per cover image and drops posts without one', () => {
    const result = uniqueByImage([
      { _id: '1', image: '/a.png' },
      { _id: '2', image: '/b.png' },
      { _id: '3', image: '/a.png' },
      { _id: '4', image: '' },
    ])
    expect(result.map((b) => b._id)).toEqual(['1', '2'])
  })
})
