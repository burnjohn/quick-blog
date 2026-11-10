import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ReadNextSkeleton from '.'

describe('ReadNextSkeleton', () => {
  it('announces a busy loading status with three placeholder cards', () => {
    render(<ReadNextSkeleton />)

    const status = screen.getByRole('status', { name: /loading related posts/i })
    expect(status).toHaveAttribute('aria-busy', 'true')
    expect(screen.getAllByTestId('read-next-skeleton-card')).toHaveLength(3)
  })
})
