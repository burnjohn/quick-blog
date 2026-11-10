import { describe, it, expect } from 'vitest'
import { widthClass } from './widthClass'

describe('widthClass', () => {
  it('quantizes the ratio to a Tailwind width class', () => {
    expect(widthClass(100, 100)).toBe('w-full')
    expect(widthClass(50, 100)).toBe('w-[50%]')
    expect(widthClass(0.5, 1)).toBe('w-[50%]')
  })

  it('falls back to the smallest bar for empty or invalid input', () => {
    expect(widthClass(0, 100)).toBe('w-[4%]')
    expect(widthClass(5, 0)).toBe('w-[4%]')
    expect(widthClass(undefined, undefined)).toBe('w-[4%]')
  })

  it('clamps values above max', () => {
    expect(widthClass(500, 100)).toBe('w-full')
  })
})
