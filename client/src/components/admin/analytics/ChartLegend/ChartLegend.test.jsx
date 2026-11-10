import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChartLegend from '.'

describe('ChartLegend', () => {
  it('reflects hidden keys in aria-pressed and calls the handler', async () => {
    const onToggle = vi.fn()
    render(
      <ChartLegend
        items={[{ key: 'views', label: 'Views', color: '#fff' }, { key: 'u', label: 'Unique', color: '#000' }]}
        hidden={['u']}
        onToggle={onToggle}
      />
    )
    expect(screen.getByRole('button', { name: 'Views' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Unique' })).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(screen.getByRole('button', { name: 'Views' }))
    expect(onToggle).toHaveBeenCalledWith('views')
  })
})
