import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ReadNextCard from '.'

const blog = {
  _id: 'abc',
  title: 'Related title',
  subTitle: 'Related subtitle',
  category: 'Technology',
  image: 'http://localhost:5001/uploads/blogs/a.jpg',
}

const renderCard = () =>
  render(
    <MemoryRouter initialEntries={['/blog/current']}>
      <Routes>
        <Route path='/blog/current' element={<ReadNextCard blog={blog} />} />
        <Route path='/blog/:id' element={<p>Detail page</p>} />
      </Routes>
    </MemoryRouter>
  )

describe('ReadNextCard', () => {
  it('renders image, category, title and subtitle as a link to the post', () => {
    const { container } = renderCard()

    const link = screen.getByRole('link', { name: /related title/i })
    expect(link).toHaveAttribute('href', '/blog/abc')
    expect(screen.getByRole('heading', { name: 'Related title' })).toBeInTheDocument()
    expect(screen.getByText('Technology')).toBeInTheDocument()
    expect(screen.getByText('Related subtitle')).toBeInTheDocument()
    expect(container.querySelector('img')).toHaveAttribute('src', blog.image)
  })

  it('navigates to the post when activated with the keyboard', async () => {
    const user = userEvent.setup()
    renderCard()

    await user.tab()
    expect(screen.getByRole('link', { name: /related title/i })).toHaveFocus()
    await user.keyboard('{Enter}')

    expect(screen.getByText('Detail page')).toBeInTheDocument()
  })
})
