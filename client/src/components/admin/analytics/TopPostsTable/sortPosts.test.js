import { describe, it, expect } from 'vitest'
import { sortPosts, nextSort } from './sortPosts'

const posts = [
  { id: 'a', title: 'beta', views: 10 },
  { id: 'b', title: 'Alpha', views: 30 },
  { id: 'c', title: 'Gamma', views: 20 },
  { id: 'd', title: 'Delta' },
]

describe('sortPosts', () => {
  it('sorts numbers desc/asc with missing values last', () => {
    expect(sortPosts(posts, 'views', 'desc').map((p) => p.id)).toEqual(['b', 'c', 'a', 'd'])
    expect(sortPosts(posts, 'views', 'asc').map((p) => p.id)).toEqual(['a', 'c', 'b', 'd'])
  })
  it('sorts titles case-insensitively', () => {
    expect(sortPosts(posts, 'title', 'asc').map((p) => p.id)).toEqual(['b', 'a', 'd', 'c'])
  })
  it('does not mutate input', () => {
    const copy = [...posts]
    sortPosts(posts, 'title', 'desc')
    expect(posts).toEqual(copy)
  })
})

describe('nextSort', () => {
  it('toggles on same column and uses defaults for new ones', () => {
    expect(nextSort('views', 'views', 'desc')).toEqual({ sort: 'views', dir: 'asc' })
    expect(nextSort('title', 'views', 'desc')).toEqual({ sort: 'title', dir: 'asc' })
    expect(nextSort('likes', 'views', 'asc')).toEqual({ sort: 'likes', dir: 'desc' })
  })
})
