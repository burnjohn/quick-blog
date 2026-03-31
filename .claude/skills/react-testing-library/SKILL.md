---
name: react-testing-library
description: "General-purpose React Testing Library guide with Vitest. Use when writing, reviewing, or setting up React component and hook tests. Covers project setup from scratch, RTL query priority, userEvent, async patterns, mocking strategies, and common anti-patterns. Applicable to any Vite + React project."
---

# React Testing Library

General-purpose guide for testing React components and hooks with React Testing Library (RTL) and Vitest. Project-agnostic — works with any Vite + React setup.

## Philosophy: Fewer Tests, Real Scenarios

> "Write tests. Not too many. Mostly integration." — Kent C. Dodds

1. **Use-case coverage > code coverage** — aim for 100% use-case coverage, not 100% line coverage. Think about what the user can DO, not what the code does internally.
2. **Write fewer, longer tests** — one test that walks through a full user flow beats six isolated assertions. Combine related steps (render → interact → verify) into a single test.
3. **Test behavior, not implementation** — assert on what the user sees and can do. Never assert on internal state, hook calls, or DOM structure.
4. **Mock at boundaries only** — mock API calls and external services. Never mock your own components, hooks, or context internals.
5. **Each test must justify its existence** — if removing a test wouldn't reduce your confidence that the app works, delete it.

### The Testing Trophy (what to invest in)

```
    E2E        ← Few: critical user journeys only (Playwright/Cypress)
  Integration  ← MOST tests: components with real providers, MSW for APIs
  Unit         ← Some: complex pure logic, utilities, formatters
Static Analysis ← Always: TypeScript, ESLint
```

---

## Setup from Scratch

### 1. Install Dependencies

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Optional but recommended:
```bash
npm install -D msw                     # Network-level API mocking
npm install -D @vitest/coverage-v8     # Code coverage
```

### 2. Vitest Config

Create `vitest.config.js` at the client root (or extend `vite.config.js`):

```js
import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.js';

export default mergeConfig(viteConfig, defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: true,
    include: ['src/**/*.test.{js,jsx,ts,tsx}'],
  },
}));
```

### 3. Setup File

Create `src/test/setup.js`:

```js
import '@testing-library/jest-dom/vitest';
```

This registers matchers like `toBeInTheDocument()`, `toBeVisible()`, `toHaveTextContent()`.

### 4. Package Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## Test Scenarios by Component Type

Before writing tests, identify the component type and pick scenarios from this matrix. Write **1-3 tests per component** — each test covers a full user flow, not a single assertion.

### Form Component (e.g., BlogEditor, LoginForm, CommentForm)

| # | Test | What it covers |
|---|------|----------------|
| 1 | **Happy path: fill all fields → submit → success feedback** | Rendering, typing, validation passing, API call, success state |
| 2 | **Validation: submit empty/invalid → error messages appear** | Required fields, validation rules, error rendering |
| 3 | **API failure: fill valid → submit → server error shown** | Error handling, error UI, form stays filled |

### List/Table Component (e.g., BlogList, CommentList, Dashboard)

| # | Test | What it covers |
|---|------|----------------|
| 1 | **Happy path: data loads → items render → user interacts** | Loading state, data rendering, click/navigation |
| 2 | **Empty state: no data → empty message shown** | Zero-data handling |
| 3 | **Error state: API fails → error message shown** | Network failure handling |

### Detail/View Component (e.g., BlogDetail, UserProfile)

| # | Test | What it covers |
|---|------|----------------|
| 1 | **Happy path: data loads → full content renders → user actions work** | Data fetching, rendering, interactions (edit/delete/comment) |
| 2 | **Not found / error: invalid ID → appropriate message** | 404 handling, error boundaries |

### Auth-Gated Component (e.g., AdminPanel, ProtectedRoute)

| # | Test | What it covers |
|---|------|----------------|
| 1 | **Authenticated: user sees protected content and can interact** | Auth context, content rendering, user actions |
| 2 | **Unauthenticated: redirects or shows login prompt** | Guard behavior, redirect |

### Shared/Presentational Component (e.g., BlogCard, Button, Modal)

| # | Test | What it covers |
|---|------|----------------|
| 1 | **Renders with props and handles user interaction** | Props → UI mapping, click/hover callbacks |
| 2 | **Conditional rendering: different props → different output** | Only if the component has meaningful branching |

---

## Complete Spec Template

This is what a well-structured test file looks like. Each test walks through a real user flow.

```jsx
// BlogList.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import BlogList from './BlogList';

// --- MSW setup: mock the API at the network level ---
const blogs = [
  { _id: '1', title: 'First Post', category: 'Technology', excerpt: 'About tech' },
  { _id: '2', title: 'Second Post', category: 'Startup', excerpt: 'About startups' },
];

const server = setupServer(
  http.get('/api/blogs', () => HttpResponse.json({ success: true, blogs })),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// --- Render helper (keeps tests DRY) ---
const renderBlogList = () =>
  render(<MemoryRouter><BlogList /></MemoryRouter>);

// --- Tests: 3 tests covering ALL real scenarios ---
describe('BlogList', () => {
  it('loads blogs and lets user navigate to a post', async () => {
    const user = userEvent.setup();
    renderBlogList();

    // Loading state appears first
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Blogs appear after fetch
    expect(await screen.findByText('First Post')).toBeInTheDocument();
    expect(screen.getByText('Second Post')).toBeInTheDocument();

    // User clicks a blog card
    await user.click(screen.getByRole('link', { name: /first post/i }));
    // Assert navigation happened (or verify detail view renders)
  });

  it('shows empty state when no blogs exist', async () => {
    server.use(
      http.get('/api/blogs', () => HttpResponse.json({ success: true, blogs: [] })),
    );
    renderBlogList();

    expect(await screen.findByText(/no blogs/i)).toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });

  it('shows error message when API fails', async () => {
    server.use(
      http.get('/api/blogs', () => HttpResponse.json(
        { success: false, message: 'Server error' },
        { status: 500 },
      )),
    );
    renderBlogList();

    expect(await screen.findByRole('alert')).toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });
});
```

### Form Spec Template

```jsx
// LoginForm.test.jsx
describe('LoginForm', () => {
  it('logs in with valid credentials and shows dashboard', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><LoginForm /></MemoryRouter>);

    // Fill form
    await user.type(screen.getByLabelText(/email/i), 'admin@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Success: redirected or success message
    expect(await screen.findByText(/welcome/i)).toBeInTheDocument();
  });

  it('shows validation errors when submitted empty', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><LoginForm /></MemoryRouter>);

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Both fields show errors
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();

    // Form is still visible (not redirected)
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows server error when API returns 401', async () => {
    server.use(
      http.post('/api/admin/login', () =>
        HttpResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 }),
      ),
    );
    const user = userEvent.setup();
    render(<MemoryRouter><LoginForm /></MemoryRouter>);

    await user.type(screen.getByLabelText(/email/i), 'admin@test.com');
    await user.type(screen.getByLabelText(/password/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
```

---

## Import Rules

```js
// Test runner — ALWAYS from vitest
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// RTL — render, screen, waitFor
import { render, screen, waitFor, within } from '@testing-library/react';

// User interaction — ALWAYS userEvent, NEVER fireEvent
import userEvent from '@testing-library/user-event';

// Hook testing
import { renderHook, act } from '@testing-library/react';
```

NEVER import from `jest`. Use `vi.fn()`, `vi.spyOn()`, `vi.mock()`.

---

## Query Priority

Queries are ordered by how closely they reflect user experience.

### Tier 1 — Accessible (default choice)

| Query | Use For |
|-------|---------|
| `getByRole` | Buttons, links, headings, inputs, checkboxes, comboboxes — **always try first** |
| `getByLabelText` | Form fields with a `<label>` |
| `getByPlaceholderText` | Inputs without a label (prefer adding a label instead) |
| `getByText` | Static text content — paragraphs, spans, error messages |
| `getByDisplayValue` | Input with a current value |

### Tier 2 — Semantic

| Query | Use For |
|-------|---------|
| `getByAltText` | Images |
| `getByTitle` | Elements with `title` attribute |

### Tier 3 — Last resort

| Query | Use For |
|-------|---------|
| `getByTestId` | Only when no accessible query works; requires `data-testid` |

### Query Variants

| Variant | Returns | Use When |
|---------|---------|----------|
| `getBy` | Element or throws | Element **must** be present |
| `queryBy` | Element or `null` | Asserting element does **not** exist |
| `findBy` | Promise\<Element\> | Element appears **after** an async operation |
| `*AllBy` | Array variants | Multiple matching elements |

### Role Query Patterns

```
getByRole('button', { name: /submit/i })
getByRole('heading', { level: 2 })
getByRole('textbox', { name: /email/i })
getByRole('link', { name: /read more/i })
getByRole('checkbox', { name: /agree/i })
getByRole('combobox')              // <select>
getByRole('status')                // role="status"
getByRole('alert')                 // role="alert"
getByRole('dialog')                // <dialog> or role="dialog"
getByRole('navigation')            // <nav>
```

---

## userEvent

Always call `userEvent.setup()` before rendering. All methods are async.

| Method | Purpose |
|--------|---------|
| `user.click(el)` | Click |
| `user.dblClick(el)` | Double-click |
| `user.type(el, 'text')` | Type text (appends to existing value) |
| `user.clear(el)` | Clear input value |
| `user.selectOptions(el, 'value')` | Select dropdown option |
| `user.tab()` | Tab to next focusable element |
| `user.keyboard('{Enter}')` | Press a key |
| `user.hover(el)` / `user.unhover(el)` | Mouse hover |
| `user.upload(el, file)` | File upload |

Pattern:
```js
const user = userEvent.setup();
render(<Component />);
await user.click(screen.getByRole('button', { name: /save/i }));
```

---

## Async Testing

### `findBy` — element appears after async work

```js
render(<BlogList />);
expect(await screen.findByText('Blog Title')).toBeInTheDocument();
```

### `waitFor` — multiple assertions, complex conditions

```js
await waitFor(() => {
  expect(screen.getAllByRole('listitem')).toHaveLength(3);
});
```

### `waitForElementToBeRemoved` — element disappears

```js
render(<BlogList />);
await waitForElementToBeRemoved(() => screen.queryByText('Loading...'));
```

### Rules

- **Never** use `setTimeout` or fixed delays
- **Never** use `act()` directly unless testing hooks outside components — RTL wraps it
- `findBy` is preferred over `waitFor` + `getBy` for single-element waits
- `waitFor` retries until the callback passes or times out (default 1000ms)

---

## Component Testing Patterns

### Basic render + interaction

```
1. Arrange — render the component with props/providers
2. Act — simulate user interaction via userEvent
3. Assert — check what the user would see
```

Combine all three into a single test when they form one user flow. Don't split Arrange/Act/Assert into separate `it()` blocks.

### Render helper

Create a local `renderComponent` function when the component needs providers:

```js
const renderComponent = (props = {}) =>
  render(
    <MemoryRouter>
      <MyComponent defaultProp="value" {...props} />
    </MemoryRouter>
  );
```

### Asserting absence

```js
// queryBy returns null — safe with .not
expect(screen.queryByText('Error')).not.toBeInTheDocument();
```

### Scoping queries with `within`

```js
const card = screen.getByRole('article');
expect(within(card).getByText('Title')).toBeInTheDocument();
```

---

## Hook Testing

Use `renderHook` for hooks with **complex pure logic** only. If a hook just fetches data or manages simple state, test it through the component that uses it instead.

```js
import { renderHook, act } from '@testing-library/react';

const { result } = renderHook(() => useCounter());
act(() => result.current.increment());
expect(result.current.count).toBe(1);
```

For hooks needing providers, pass a `wrapper`:

```js
renderHook(() => useAuth(), {
  wrapper: ({ children }) => <AuthProvider>{children}</AuthProvider>,
});
```

---

## React Router Wrapping

Components using `<Link>`, `useNavigate`, `useParams`, or `useLocation` must be wrapped:

```js
// Simple
render(<MemoryRouter><MyComponent /></MemoryRouter>);

// With route params
render(
  <MemoryRouter initialEntries={['/blogs/123']}>
    <Routes>
      <Route path="/blogs/:id" element={<BlogDetail />} />
    </Routes>
  </MemoryRouter>
);
```

---

## Mocking Strategies

### MSW (Mock Service Worker) — preferred for all data-fetching components

Intercepts at the network layer. Tests don't couple to HTTP client internals. Most realistic approach.

```js
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  // Default happy-path handlers
  http.get('/api/blogs', () => HttpResponse.json({ success: true, blogs: [...] })),
  http.post('/api/blogs', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ success: true, blog: { _id: '1', ...body } }, { status: 201 });
  }),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Override for specific tests:
it('handles error', async () => {
  server.use(
    http.get('/api/blogs', () => HttpResponse.json({ success: false }, { status: 500 })),
  );
  // ...
});
```

### Module mock (`vi.mock`) — fallback when MSW is overkill

```js
vi.mock('../../api/blogApi', () => ({
  getBlogs: vi.fn(),
}));
```

- Mock at the API/hook level, not at Axios/fetch level
- Reset in `beforeEach`: `vi.clearAllMocks()`
- Use `vi.mocked(fn)` for type-safe access to mock methods

### Context mocking

Wrap component in a test provider with controlled values. Don't mock context internals — render with the real provider.

### Timers

```js
vi.useFakeTimers();
// ... render and trigger timer-dependent code
vi.advanceTimersByTime(3000);
vi.useRealTimers(); // restore in afterEach
```

---

## What to Test / What to Skip

**Test (as user-visible flows):**
- User journeys: form fill → submit → feedback
- Data display: loading → loaded → interaction
- State transitions: empty → filled, logged out → logged in
- Error boundaries: API failure → error message
- Conditional UI: different user roles see different things

**Skip:**
- Internal state (`useState` values)
- Implementation details (hook calls, private functions)
- CSS classes or inline styles
- Third-party library internals
- Render counts or performance
- Snapshot tests (unless explicitly requested)
- Constants or static data
- Individual assertions that belong inside a longer flow test

---

## jest-dom Matchers Reference

| Matcher | Checks |
|---------|--------|
| `toBeInTheDocument()` | Element is in the DOM |
| `toBeVisible()` | Element is visible to the user |
| `toBeEnabled()` / `toBeDisabled()` | Enabled/disabled state |
| `toHaveTextContent(/text/i)` | Contains text |
| `toHaveValue('val')` | Input/select current value |
| `toHaveAttribute('href', '/path')` | HTML attribute |
| `toBeChecked()` | Checkbox/radio is checked |
| `toHaveFocus()` | Element has focus |
| `toBeRequired()` | Input is required |
| `toHaveClass('cls')` | Has CSS class (use sparingly) |
| `toHaveAccessibleDescription()` | `aria-describedby` text |
| `toBeEmptyDOMElement()` | No visible content |

---

## Test File Conventions

- Place tests next to source: `BlogCard.jsx` -> `BlogCard.test.jsx`
- Use `.test.jsx` extension (not `.spec.jsx`)
- One `describe` per component/hook
- Test names describe user-visible behavior: `"user fills form and sees success message"`
- Use `vi.fn()` for all mock functions
- Call `userEvent.setup()` before `render()`
- Always use `screen` — never destructure from `render()`
- **1-3 tests per component** (user flows), 1-2 per hook, 2-3 per utility

---

## Anti-Patterns

| Anti-Pattern | Fix |
|-------------|-----|
| Many tiny tests with one assertion each | Combine into fewer flow tests that walk through a user journey |
| `fireEvent.click()` | Use `await user.click()` from `userEvent.setup()` |
| Destructuring from `render()` | Use `screen.getByRole(...)` |
| `getByTestId` as first choice | Try `getByRole`, `getByLabelText`, `getByText` first |
| Testing `useState` / hook internals | Test the rendered output instead |
| `setTimeout` / fixed delays | Use `findBy` or `waitFor` |
| Snapshot tests replacing behavior tests | Write explicit assertions |
| `container.querySelector()` | Use RTL queries |
| Shared mutable state between tests | Reset in `beforeEach` |
| Importing from `jest` | Import from `vitest` (`vi.fn()`, `vi.mock()`) |
| Mocking what you're testing | Mock dependencies, not the subject |
| `act()` wrapping RTL calls | RTL handles `act()` internally |
| Mocking Axios/fetch directly | Use MSW for network-level mocking |
| Testing every prop combination | Test the meaningful user-facing differences only |
