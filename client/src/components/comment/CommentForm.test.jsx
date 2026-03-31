import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommentForm from './CommentForm';

describe('CommentForm', () => {
  it('fills name and comment, submits, and form clears on success', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockResolvedValue({ success: true });

    render(<CommentForm onSubmit={handleSubmit} />);

    const nameInput = screen.getByPlaceholderText('Name');
    const commentInput = screen.getByPlaceholderText('Comment');

    await user.type(nameInput, 'Alice');
    await user.type(commentInput, 'Great post!');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(handleSubmit).toHaveBeenCalledWith({ name: 'Alice', content: 'Great post!' });

    // Fields should clear after successful submit
    expect(nameInput).toHaveValue('');
    expect(commentInput).toHaveValue('');
  });

  it('disables submit button while loading', () => {
    render(<CommentForm onSubmit={vi.fn()} loading={true} />);

    const button = screen.getByRole('button', { name: /loading/i });
    expect(button).toBeDisabled();
  });
});
