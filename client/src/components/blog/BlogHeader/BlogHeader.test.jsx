import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BlogHeader from '.';

const mockBlog = {
  title: 'Test Blog',
  createdAt: '2026-03-01T00:00:00Z',
};

describe('BlogHeader', () => {
  it('renders blog title, date, and default author', () => {
    render(<BlogHeader blog={mockBlog} />);

    expect(screen.getByText('Test Blog')).toBeInTheDocument();
    expect(screen.getByText(/march/i)).toBeInTheDocument();
    expect(screen.getByText('Michael Brown')).toBeInTheDocument();
  });

  it('renders subtitle when present', () => {
    const blogWithSub = { ...mockBlog, subTitle: 'A great subtitle' };
    render(<BlogHeader blog={blogWithSub} />);

    expect(screen.getByText('A great subtitle')).toBeInTheDocument();
  });

  it('omits subtitle when absent', () => {
    const { container } = render(<BlogHeader blog={mockBlog} />);

    const h2 = container.querySelector('h2');
    expect(h2).not.toBeInTheDocument();
  });
});
