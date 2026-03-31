import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CommentList from '.';
import { MESSAGES } from '../../../constants/messages';

const mockComments = [
  { _id: '1', name: 'Alice', content: 'Great post!', createdAt: '2026-03-15T10:00:00Z' },
  { _id: '2', name: 'Bob', content: 'Nice read!', createdAt: '2026-03-16T10:00:00Z' },
];

describe('CommentList', () => {
  it('renders list of comments with count', () => {
    render(<CommentList comments={mockComments} />);

    expect(screen.getByText('Comments (2)')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('shows empty state when no comments', () => {
    render(<CommentList comments={[]} />);

    expect(screen.getByText('Comments (0)')).toBeInTheDocument();
    expect(screen.getByText(MESSAGES.INFO_NO_COMMENTS)).toBeInTheDocument();
  });
});
