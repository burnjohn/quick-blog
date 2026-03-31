import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CommentItem from '.';

const mockComment = {
  _id: '1',
  name: 'Alice',
  content: 'Great post!',
  createdAt: '2026-03-15T10:00:00Z',
};

describe('CommentItem', () => {
  it('renders comment name, content, and relative time', () => {
    render(<CommentItem comment={mockComment} />);

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Great post!')).toBeInTheDocument();
    // formatRelativeTime returns something like "X months ago" or a relative string
    expect(screen.getByText(/ago|few/i)).toBeInTheDocument();
  });
});
