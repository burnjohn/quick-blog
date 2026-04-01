import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from '.';

describe('Card', () => {
  it('renders compound components', () => {
    render(
      <Card>
        <Card.Image src="/test.jpg" alt="Test image" />
        <Card.Badge>Tech</Card.Badge>
        <Card.Body>
          <Card.Title>Test Title</Card.Title>
          <Card.Description>Test description text</Card.Description>
        </Card.Body>
      </Card>
    );

    expect(screen.getByAltText('Test image')).toBeInTheDocument();
    expect(screen.getByText('Tech')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test description text')).toBeInTheDocument();
  });
});
