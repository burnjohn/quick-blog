import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import SocialShare from './SocialShare'

vi.mock('../../assets/assets', () => ({
  assets: {
    facebook_icon: 'facebook_icon.svg',
    twitter_icon: 'twitter_icon.svg',
    googleplus_icon: 'googleplus_icon.svg',
  },
}))

describe('SocialShare', () => {
  it('renders default title "Share this article on social media"', () => {
    render(<SocialShare />)
    expect(screen.getByText('Share this article on social media')).toBeInTheDocument()
  })

  it('renders custom title when passed as prop', () => {
    render(<SocialShare title="Share with your friends" />)
    expect(screen.getByText('Share with your friends')).toBeInTheDocument()
  })

  it('renders three social share buttons (Facebook, Twitter, Google Plus)', () => {
    render(<SocialShare />)
    expect(screen.getByRole('button', { name: /share on facebook/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /share on twitter/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /share on google plus/i })).toBeInTheDocument()
  })

  it('renders social media icons', () => {
    render(<SocialShare />)
    expect(screen.getByAltText('Facebook')).toBeInTheDocument()
    expect(screen.getByAltText('Twitter')).toBeInTheDocument()
    expect(screen.getByAltText('Google Plus')).toBeInTheDocument()
  })
})
