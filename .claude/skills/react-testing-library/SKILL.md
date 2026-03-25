---
name: react-testing-library
description: "General-purpose React Testing Library guide with Vitest. Use when writing, reviewing, or setting up React component and hook tests. Covers project setup from scratch, RTL query priority, userEvent, async patterns, mocking strategies, and common anti-patterns. Applicable to any Vite + React project."
---

# React Testing Library

General-purpose guide for testing React components and hooks with React Testing Library (RTL) and Vitest. Project-agnostic — works with any Vite + React setup.

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

## Core Philosophy

RTL tests should answer: **"Does this component work correctly from the user's perspective?"**

- Query elements the way a user finds them — by visible text, labels, roles
- Interact the way a user would — click, type, select
- Assert what the user sees — text, visibility, enabled/disabled states
- Never test implementation details — internal state, hook calls, DOM structure

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

### Testing loading / error / empty states

Mock the data source (hook or API) to return each state, then assert the corresponding UI.

---

## Hook Testing

Use `renderHook` for testing hooks in isolation:

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

### Module mock (`vi.mock`)

```js
vi.mock('../../api/blogApi', () => ({
  getBlogs: vi.fn(),
}));
```

- Mock at the API/hook level, not at Axios/fetch level
- Reset in `beforeEach`: `vi.clearAllMocks()`
- Use `vi.mocked(fn)` for type-safe access to mock methods

### MSW (Mock Service Worker) — preferred for integration tests

- Intercepts at the network layer — most realistic
- Tests don't couple to HTTP client internals
- Share handlers across tests for consistent mock data

Setup pattern:
```js
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(/* ...handlers */);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

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

**Test:**
- Rendered output (what the user sees)
- User interactions (click, type, submit)
- Conditional rendering (different props/states produce different UI)
- Loading, error, and empty states
- Form validation (error messages appear for invalid input)
- Callbacks invoked with correct arguments
- Accessibility (elements findable by role/label)

**Skip:**
- Internal state (`useState` values)
- Implementation details (hook calls, private functions)
- CSS classes or inline styles
- Third-party library internals
- Render counts or performance
- Snapshot tests (unless explicitly requested)
- Constants or static data

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
- Test names describe user-visible behavior: `"shows error when form is submitted empty"`
- Use `vi.fn()` for all mock functions
- Call `userEvent.setup()` before `render()`
- Always use `screen` — never destructure from `render()`
- 3-6 tests per component, 2-4 per hook, 3-5 per utility

---

## Anti-Patterns

| Anti-Pattern | Fix |
|-------------|-----|
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
