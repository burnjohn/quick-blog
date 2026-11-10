import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TopPostsBarChart from '.'

vi.mock('recharts', async (orig) => {
  const actual = await orig()
  return {
    ...actual,
    ResponsiveContainer: ({ children }) => React.cloneElement(children, { width: 800, height: 300 })
  }
})

const posts = Array.from({ length: 12 }, (_, i) => ({ id: 'p' + i, title: 'Post ' + i, views: 1000 - i }))

describe('TopPostsBarChart', () => {
  it('lists the top 10 and calls onOpenPost', async () => {
    const onOpenPost = vi.fn()
    render(<TopPostsBarChart posts={posts} onOpenPost={onOpenPost} />)
    expect(screen.getByRole('table', { name: 'Top posts by views' })).toBeInTheDocument()
    expect(screen.getAllByRole('button')).toHaveLength(10)
    await userEvent.click(screen.getByRole('button', { name: /Post 2 —/ }))
    expect(onOpenPost).toHaveBeenCalledWith('p2')
  })
})
