import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TopPostsTable from '.'

const posts = [
  { id: 'a', title: 'Alpha', category: 'Tech', tags: ['react'], views: 10 },
  { id: 'b', title: 'Beta', category: 'Life', tags: [], views: 30 },
]

const titles = () =>
  screen.getAllByRole('rowheader').map((el) => within(el).getByRole('button').textContent)

describe('TopPostsTable', () => {
  it('sorts rows and sets aria-sort', () => {
    render(<TopPostsTable posts={posts} sort='views' dir='desc' />)
    expect(titles()).toEqual(['Beta', 'Alpha'])
    expect(screen.getByRole('columnheader', { name: /Views/ })).toHaveAttribute('aria-sort', 'descending')
    expect(screen.getByRole('columnheader', { name: /Unique/ })).toHaveAttribute('aria-sort', 'none')
  })

  it('toggles direction by click and keyboard', async () => {
    const user = userEvent.setup()
    const onSortChange = vi.fn()
    render(<TopPostsTable posts={posts} sort='views' dir='desc' onSortChange={onSortChange} />)
    await user.click(within(screen.getByRole('columnheader', { name: /Views/ })).getByRole('button'))
    expect(onSortChange).toHaveBeenLastCalledWith('views', 'asc')
    within(screen.getByRole('columnheader', { name: /Post/ })).getByRole('button').focus()
    await user.keyboard('{Enter}')
    expect(onSortChange).toHaveBeenLastCalledWith('title', 'asc')
  })

  it('reflects ascending order', () => {
    render(<TopPostsTable posts={posts} sort='views' dir='asc' />)
    expect(titles()).toEqual(['Alpha', 'Beta'])
    expect(screen.getByRole('columnheader', { name: /Views/ })).toHaveAttribute('aria-sort', 'ascending')
  })

  it('opens a post from the title button with the trigger element', async () => {
    const user = userEvent.setup()
    const onOpenPost = vi.fn()
    render(<TopPostsTable posts={posts} onOpenPost={onOpenPost} />)
    const button = screen.getByRole('button', { name: 'Alpha' })
    await user.click(button)
    expect(onOpenPost).toHaveBeenCalledWith('a', button)
  })
})
