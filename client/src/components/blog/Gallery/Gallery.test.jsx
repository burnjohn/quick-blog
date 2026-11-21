import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Gallery from '.'

const blogs = [
  { _id: '1', title: 'Drawn tech', category: 'Technology', image: '/cover_1.svg', description: '<p>a</p>' },
  { _id: '2', title: 'Photo finance', category: 'Finance', image: '/pic_2.png', description: '<p>b</p>' },
  { _id: '3', title: 'Photo tech', category: 'Technology', image: '/pic_3.jpg', description: '<p>c</p>' },
  { _id: '4', title: 'Same photo again', category: 'Technology', image: '/pic_3.jpg', description: '<p>d</p>' },
]

const renderGallery = (items = blogs) => render(<MemoryRouter><Gallery blogs={items} /></MemoryRouter>)

describe('Gallery', () => {
  it('puts photo covers first and skips repeated images', () => {
    renderGallery()
    const images = screen.getAllByRole('img')
    expect(images.map((img) => img.getAttribute('alt'))).toEqual(['Photo finance', 'Photo tech', 'Drawn tech'])
    images.forEach((img) => expect(img).toHaveAttribute('loading', 'lazy'))
  })

  it('filters tiles by category', async () => {
    const user = userEvent.setup()
    renderGallery()

    await user.click(screen.getByRole('button', { name: 'Finance' }))

    expect(screen.getAllByRole('img').map((img) => img.alt)).toEqual(['Photo finance'])
    expect(screen.getByRole('button', { name: 'Finance' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('renders nothing without posts', () => {
    const { container } = renderGallery([])
    expect(container).toBeEmptyDOMElement()
  })
})
