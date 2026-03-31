import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '.';
import { ROUTES } from '../../../constants/routes';

const mockNavigate = vi.fn();

vi.mock('../../../context/AppContext', () => ({
  useAppContext: vi.fn(() => ({
    navigate: mockNavigate,
    token: null,
  })),
}));

// Get reference to the mock so we can change return values per test
import { useAppContext } from '../../../context/AppContext';

describe('Navbar', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders logo and navigates home on click', async () => {
    const user = userEvent.setup();

    render(<Navbar />);

    const logo = screen.getByAltText('logo');
    expect(logo).toBeInTheDocument();

    await user.click(logo);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.HOME);
  });

  it('shows "Login" when no token', () => {
    useAppContext.mockReturnValue({ navigate: mockNavigate, token: null });

    render(<Navbar />);

    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows "Dashboard" when token exists', () => {
    useAppContext.mockReturnValue({ navigate: mockNavigate, token: 'abc123' });

    render(<Navbar />);

    expect(screen.getByRole('button', { name: /dashboard/i })).toBeInTheDocument();
  });
});
