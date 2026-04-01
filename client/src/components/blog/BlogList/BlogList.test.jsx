import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import BlogList from '.';

const mockBlogs = [
  { _id: '1', title: 'Tech Post', description: '<p>Desc</p>', category: 'Technology', image: '/img1.jpg' },
  { _id: '2', title: 'Life Post', description: '<p>Desc</p>', category: 'Lifestyle', image: '/img2.jpg' },
];

vi.mock('../../../context/AppContext', () => ({
  useAppContext: vi.fn(() => ({
    blogs: mockBlogs,
    input: '',
  })),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('BlogList', () => {
  it('renders blogs and filters by category', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <BlogList />
      </MemoryRouter>
    );

    expect(screen.getByText('Tech Post')).toBeInTheDocument();
    expect(screen.getByText('Life Post')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Technology' }));

    expect(screen.getByText('Tech Post')).toBeInTheDocument();
    expect(screen.queryByText('Life Post')).not.toBeInTheDocument();
  });
});
