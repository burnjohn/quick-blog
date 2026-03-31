import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import BlogCard from '.';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockBlog = {
  _id: '123',
  title: 'Test Blog Title',
  description: '<p>Some blog content here</p>',
  category: 'Technology',
  image: '/test-image.jpg',
};

describe('BlogCard', () => {
  it('renders blog data and navigates on click', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <BlogCard blog={mockBlog} />
      </MemoryRouter>
    );

    expect(screen.getByText('Test Blog Title')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByAltText('Test Blog Title')).toBeInTheDocument();

    await user.click(screen.getByText('Test Blog Title'));
    expect(mockNavigate).toHaveBeenCalledWith('/blog/123');
  });
});
