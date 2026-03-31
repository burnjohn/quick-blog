import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './Input';

describe('Input', () => {
  it('renders with label, handles input, and shows error', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    const { rerender } = render(
      <Input label="Email" onChange={handleChange} />
    );

    expect(screen.getByText('Email')).toBeInTheDocument();

    const input = screen.getByRole('textbox');
    await user.type(input, 'a');
    expect(handleChange).toHaveBeenCalled();

    rerender(<Input label="Email" error="Required field" onChange={handleChange} />);
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });
});
