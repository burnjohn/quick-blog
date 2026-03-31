import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryFilter from '.';

describe('CategoryFilter', () => {
  it('renders categories and calls onCategoryChange', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <CategoryFilter activeCategory="All" onCategoryChange={handleChange} />
    );

    expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /technology/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /technology/i }));
    expect(handleChange).toHaveBeenCalledWith('Technology');
  });
});
