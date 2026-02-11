# Frontend Testing — Code Examples

Good/bad patterns for each rule in [SKILL.md](SKILL.md).

---

## Component Test — Full Example

```jsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { BlogCard } from './BlogCard';

describe('BlogCard', () => {
  const mockBlog = { _id: '1', title: 'Test Blog', category: 'Tech', createdAt: '2026-01-15' };

  const renderCard = (props = {}) =>
    render(
      <MemoryRouter>
        <BlogCard blog={mockBlog} {...props} />
      </MemoryRouter>
    );

  it('renders blog title and category', () => {
    renderCard();
    expect(screen.getByText('Test Blog')).toBeInTheDocument();
    expect(screen.getByText('Tech')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();

    renderCard({ onDelete });

    await user.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('navigates to blog detail on title click', () => {
    renderCard();
    const link = screen.getByRole('link', { name: /test blog/i });
    expect(link).toHaveAttribute('href', '/blogs/1');
  });
});
```

---

## Query Priority

```jsx
// BAD: Using testid when accessible query exists
screen.getByTestId('submit-button');

// GOOD: Role-based query with name
screen.getByRole('button', { name: /submit/i });

// BAD: Fragile DOM selector
container.querySelector('.blog-card .title');

// GOOD: Text or label query
screen.getByText('My Blog Title');
screen.getByLabelText('Email');

// GOOD: Role queries for various elements
screen.getByRole('heading', { level: 1, name: /welcome/i });
screen.getByRole('link', { name: /read more/i });
screen.getByRole('textbox', { name: /search/i });
screen.getByRole('combobox');  // <select>
```

---

## screen vs Destructuring

```jsx
// BAD: Destructuring from render — harder to refactor
const { getByText, getByRole } = render(<MyComponent />);
getByText('Hello');

// GOOD: Always use screen
render(<MyComponent />);
screen.getByText('Hello');
screen.getByRole('button', { name: /save/i });
```

---

## userEvent Setup

```jsx
// BAD: Using fireEvent
import { fireEvent } from '@testing-library/react';
fireEvent.click(button);
fireEvent.change(input, { target: { value: 'text' } });

// GOOD: userEvent with setup()
import userEvent from '@testing-library/user-event';

it('fills and submits the form', async () => {
  const user = userEvent.setup();
  render(<BlogForm onSubmit={mockSubmit} />);

  await user.type(screen.getByRole('textbox', { name: /title/i }), 'My Blog');
  await user.selectOptions(screen.getByRole('combobox', { name: /category/i }), 'Technology');
  await user.click(screen.getByRole('button', { name: /save/i }));

  expect(mockSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ title: 'My Blog', category: 'Technology' })
  );
});
```

---

## Async Testing

```jsx
// BAD: Fixed delay
render(<BlogList />);
await new Promise(resolve => setTimeout(resolve, 1000));
expect(screen.getByText('Blog Title')).toBeInTheDocument();

// GOOD: findBy (auto-waits, returns promise)
render(<BlogList />);
expect(await screen.findByText('Blog Title')).toBeInTheDocument();

// GOOD: waitFor for complex assertions
render(<BlogList />);
await waitFor(() => {
  expect(screen.getByRole('list')).toBeInTheDocument();
  expect(screen.getAllByRole('listitem')).toHaveLength(3);
});
```

---

## Asserting Absence

```jsx
// BAD: getBy throws if element is missing
expect(screen.getByText('Error')).not.toBeInTheDocument(); // throws!

// GOOD: queryBy returns null if not found
expect(screen.queryByText('Error')).not.toBeInTheDocument();

// GOOD: waitForElementToBeRemoved for disappearing elements
await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));
```

---

## Testing Loading / Error / Empty States

```jsx
import { vi } from 'vitest';

// Mock the hook at module level
vi.mock('../../hooks/api/queries/useBlogs');
import { useBlogs } from '../../hooks/api/queries/useBlogs';

describe('BlogList', () => {
  it('shows loader while fetching', () => {
    vi.mocked(useBlogs).mockReturnValue({ data: null, loading: true, error: null });
    render(<BlogList />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows error message on failure', () => {
    vi.mocked(useBlogs).mockReturnValue({ data: null, loading: false, error: 'Failed' });
    render(<BlogList />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('shows empty state when no blogs exist', () => {
    vi.mocked(useBlogs).mockReturnValue({ data: { blogs: [] }, loading: false, error: null });
    render(<BlogList />);
    expect(screen.getByText(/no blogs/i)).toBeInTheDocument();
  });

  it('renders blog list on success', () => {
    vi.mocked(useBlogs).mockReturnValue({
      data: { blogs: [{ _id: '1', title: 'First' }, { _id: '2', title: 'Second' }] },
      loading: false,
      error: null,
    });
    render(<MemoryRouter><BlogList /></MemoryRouter>);
    expect(screen.getByText('First')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });
});
```

---

## Hook Test

```jsx
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useBlogs } from './useBlogs';

vi.mock('../../api/blogApi', () => ({
  getBlogs: vi.fn(() =>
    Promise.resolve({ data: { blogs: [{ _id: '1', title: 'Test' }] } })
  ),
}));

describe('useBlogs', () => {
  it('returns blogs on success', async () => {
    const { result } = renderHook(() => useBlogs());
    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data.blogs).toHaveLength(1);
  });

  it('starts in loading state', () => {
    const { result } = renderHook(() => useBlogs());
    expect(result.current.loading).toBe(true);
  });
});
```

---

## MSW (Mock Service Worker)

```jsx
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('/api/blogs', () => {
    return HttpResponse.json({
      success: true,
      blogs: [{ _id: '1', title: 'MSW Blog' }],
    });
  }),
  http.post('/api/blogs', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(
      { success: true, blog: { _id: '2', ...body } },
      { status: 201 }
    );
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Override for specific test
it('handles server error', async () => {
  server.use(
    http.get('/api/blogs', () => {
      return HttpResponse.json({ success: false, message: 'Server error' }, { status: 500 });
    }),
  );
  render(<BlogList />);
  expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
});
```

---

## Form Validation Test

```jsx
it('shows validation errors for empty form', async () => {
  const user = userEvent.setup();
  render(<BlogForm onSubmit={mockSubmit} />);

  // Submit without filling fields
  await user.click(screen.getByRole('button', { name: /save/i }));

  // Validation errors appear
  expect(screen.getByText(/title is required/i)).toBeInTheDocument();
  expect(screen.getByText(/content is required/i)).toBeInTheDocument();

  // onSubmit was NOT called
  expect(mockSubmit).not.toHaveBeenCalled();
});

it('clears errors when user starts typing', async () => {
  const user = userEvent.setup();
  render(<BlogForm onSubmit={mockSubmit} />);

  await user.click(screen.getByRole('button', { name: /save/i }));
  expect(screen.getByText(/title is required/i)).toBeInTheDocument();

  await user.type(screen.getByRole('textbox', { name: /title/i }), 'New Title');
  expect(screen.queryByText(/title is required/i)).not.toBeInTheDocument();
});
```

---

## Accessibility Testing

```jsx
it('has accessible form labels', () => {
  render(<BlogForm />);

  // All inputs should be findable by label
  expect(screen.getByRole('textbox', { name: /title/i })).toBeInTheDocument();
  expect(screen.getByRole('combobox', { name: /category/i })).toBeInTheDocument();
});

it('associates error messages with fields', async () => {
  const user = userEvent.setup();
  render(<BlogForm />);

  await user.click(screen.getByRole('button', { name: /save/i }));

  const titleInput = screen.getByRole('textbox', { name: /title/i });
  expect(titleInput).toHaveAttribute('aria-invalid', 'true');
  expect(titleInput).toHaveAccessibleDescription(/title is required/i);
});

it('icon button has accessible label', () => {
  render(<MemoryRouter><BlogCard blog={mockBlog} onDelete={vi.fn()} /></MemoryRouter>);
  expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
});
```
