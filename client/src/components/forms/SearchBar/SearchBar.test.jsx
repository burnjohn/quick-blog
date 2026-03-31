import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '.';

describe('SearchBar', () => {
  it('submits search term', async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();

    render(<SearchBar onSearch={handleSearch} onClear={vi.fn()} />);

    const input = screen.getByPlaceholderText('Search for blogs');
    await user.type(input, 'React');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(handleSearch).toHaveBeenCalledWith('React');
  });

  it('shows and handles clear button', async () => {
    const user = userEvent.setup();
    const handleClear = vi.fn();

    render(<SearchBar onSearch={vi.fn()} onClear={handleClear} hasSearchTerm={true} />);

    const clearButton = screen.getByRole('button', { name: /clear search/i });
    expect(clearButton).toBeInTheDocument();

    await user.click(clearButton);
    expect(handleClear).toHaveBeenCalledTimes(1);
  });

  it('does not submit empty/whitespace input', async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();

    render(<SearchBar onSearch={handleSearch} onClear={vi.fn()} />);

    // The input has required attribute, but the handleSubmit checks trim()
    // We need to type whitespace, then submit via button
    const input = screen.getByPlaceholderText('Search for blogs');
    await user.type(input, '   ');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(handleSearch).not.toHaveBeenCalled();
  });
});
