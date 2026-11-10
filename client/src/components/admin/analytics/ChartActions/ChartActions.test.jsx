import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChartActions from '.'

describe('ChartActions', () => {
  it('renders sr-only buttons that call onSelect with the key', async () => {
    const onSelect = vi.fn()
    render(<ChartActions label='Filter' items={[{ key: 'a', label: 'Alpha', value: '5 views' }]} onSelect={onSelect} selected={['a']} />)
    expect(screen.getByRole('group', { name: 'Filter' })).toHaveClass('sr-only', 'focus-within:not-sr-only')
    const btn = screen.getByRole('button', { name: 'Alpha — 5 views' })
    expect(btn).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(btn)
    expect(onSelect).toHaveBeenCalledWith('a')
  })

  it('renders nothing without a handler', () => {
    const { container } = render(<ChartActions label='x' items={[{ key: 'a', label: 'A' }]} />)
    expect(container).toBeEmptyDOMElement()
  })
})
