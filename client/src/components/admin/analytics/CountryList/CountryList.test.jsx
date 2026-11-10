import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CountryList from '.'

const countries = Array.from({ length: 12 }, (_, i) => ({ code: i === 0 ? 'US' : 'DE', views: 1000 - i, share: 0.1 }))

describe('CountryList', () => {
  it('ranks the top 10 with a flag and a table', () => {
    render(<CountryList countries={countries} />)
    expect(screen.getAllByRole('row')).toHaveLength(11)
    expect(screen.getByText('🇺🇸')).toBeInTheDocument()
    expect(screen.getAllByText('United States').length).toBeGreaterThan(0)
  })
})
