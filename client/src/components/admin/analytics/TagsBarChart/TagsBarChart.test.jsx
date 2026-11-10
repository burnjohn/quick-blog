import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TagsBarChart from '.'

vi.mock('recharts', async (orig) => {
  const actual = await orig()
  return {
    ...actual,
    ResponsiveContainer: ({ children }) => React.cloneElement(children, { width: 800, height: 300 })
  }
})

const tags = [{ key: 'react', views: 2000, posts: 3 }, { key: 'node', views: 900, posts: 1 }]

describe('TagsBarChart', () => {
  it('has a data table and keyboard buttons that call onSelectTag', async () => {
    const onSelectTag = vi.fn()
    render(<TagsBarChart tags={tags} onSelectTag={onSelectTag} selectedTags={['node']} />)
    expect(screen.getByRole('table', { name: 'Views by tag' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /node/ })).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(screen.getByRole('button', { name: /react/ }))
    expect(onSelectTag).toHaveBeenCalledWith('react')
  })
})
