import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FilterBar from '.'
import { DEFAULT_FILTERS } from '../../../../utils/analyticsFilters'

const meta = {
  tags: ['react'],
  authors: [{ id: 'a1', name: 'Sarah Johnson' }],
  sources: ['search', 'email'],
}

const setup = (props = {}) => {
  const h = {
    onPeriodChange: vi.fn(), onCustomRange: vi.fn(), onCompareChange: vi.fn(),
    onTagsChange: vi.fn(), onAuthorsChange: vi.fn(), onSourcesChange: vi.fn(),
    onReset: vi.fn(), onExport: vi.fn(),
  }
  render(
    <FilterBar
      filters={DEFAULT_FILTERS}
      meta={meta}
      dateBounds={{ min: '2025-11-11', max: '2026-11-10' }}
      hasActiveFilters={false}
      {...h}
      {...props}
    />
  )
  return h
}

describe('FilterBar', () => {
  it('toggles compare via a switch', async () => {
    const { onCompareChange } = setup()
    const toggle = screen.getByRole('switch', { name: /compare/i })
    expect(toggle).toHaveAttribute('aria-checked', 'true')
    await userEvent.click(toggle)
    expect(onCompareChange).toHaveBeenCalledWith(false)
  })

  it('calls export and shows busy state', async () => {
    const { onExport } = setup()
    await userEvent.click(screen.getByRole('button', { name: 'Export CSV' }))
    expect(onExport).toHaveBeenCalledTimes(1)
  })

  it('disables export while exporting', () => {
    setup({ exporting: true })
    expect(screen.getByRole('button', { name: /exporting/i })).toBeDisabled()
  })

  it('shows reset only with active filters and forwards selection', async () => {
    const user = userEvent.setup()
    const { onSourcesChange, onReset } = setup({ hasActiveFilters: true })
    await user.click(screen.getByRole('button', { name: 'Reset filters' }))
    expect(onReset).toHaveBeenCalled()
    await user.click(screen.getByRole('button', { name: /sources/i }))
    await user.click(screen.getByRole('checkbox', { name: 'Search' }))
    expect(onSourcesChange).toHaveBeenCalledWith(['search'])
  })

  it('hides reset without active filters', () => {
    setup()
    expect(screen.queryByRole('button', { name: 'Reset filters' })).not.toBeInTheDocument()
  })
})
