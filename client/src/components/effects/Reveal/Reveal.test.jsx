import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Reveal from './Reveal'

const reducedMotion = vi.hoisted(() => ({ value: false }))

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useReducedMotion: () => reducedMotion.value }
})

describe('Reveal', () => {
  it('starts hidden and waits for the viewport when motion is allowed', () => {
    reducedMotion.value = false
    render(<Reveal>Signal</Reveal>)
    expect(screen.getByText('Signal')).toHaveStyle({ opacity: '0' })
  })

  it('renders the final visible state straight away under reduced motion', () => {
    reducedMotion.value = true
    render(<Reveal>Signal</Reveal>)
    expect(screen.getByText('Signal')).not.toHaveStyle({ opacity: '0' })
  })
})
