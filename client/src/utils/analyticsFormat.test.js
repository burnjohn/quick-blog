import { describe, it, expect } from 'vitest'
import {
  formatNumber, formatCompact, formatPercent, formatDuration,
  formatDate, formatDateRange, formatByType,
} from './analyticsFormat'

describe('analyticsFormat (en-US)', () => {
  it('formats numbers with grouping', () => {
    expect(formatNumber(12345)).toBe('12,345')
    expect(formatNumber(null)).toBe('—')
  })

  it('formats compact numbers', () => {
    expect(formatCompact(1234)).toBe('1.2K')
    expect(formatCompact(2500000)).toBe('2.5M')
  })

  it('formats percentages', () => {
    expect(formatPercent(12.25)).toBe('12.3%')
    expect(formatPercent(64)).toBe('64%')
    expect(formatPercent(undefined)).toBe('—')
  })

  it('formats durations', () => {
    expect(formatDuration(45)).toBe('45s')
    expect(formatDuration(210)).toBe('3m 30s')
    expect(formatDuration(3900)).toBe('1h 5m')
  })

  it('formats dates in UTC', () => {
    expect(formatDate('2026-10-12')).toBe('Oct 12, 2026')
    expect(formatDate('bad')).toBe('—')
    expect(formatDateRange('2026-10-12', '2026-11-10')).toBe('Oct 12, 2026 – Nov 10, 2026')
  })

  it('formats by KPI type', () => {
    expect(formatByType(210, 'duration')).toBe('3m 30s')
    expect(formatByType(6.1, 'percent')).toBe('6.1%')
    expect(formatByType(1000, 'number')).toBe('1,000')
  })
})
