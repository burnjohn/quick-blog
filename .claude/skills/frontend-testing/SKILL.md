---
name: frontend-testing
description: "Use when writing, reviewing, or planning tests for React components, hooks, and utility functions in client/. Covers Vitest, React Testing Library, userEvent, accessible queries, async patterns, mocking, and project-specific conventions."
---

# Frontend Testing

Testing conventions for React code in `client/`. Uses Vitest as the runner and React Testing Library (RTL) for rendering and querying.

## Severity Levels

- **CRITICAL** — Tests will be flaky, misleading, or fail for wrong reasons
- **HIGH** — Tests will be hard to maintain or miss real bugs
- **MEDIUM** — Tests will be less readable or less useful

---

## Tooling

| Package | Purpose |
|---------|---------|
| `vitest` | Test runner (Vite-native, Jest-compatible API) |
| `@testing-library/react` | Component rendering (`render`, `screen`, `waitFor`) |
| `@testing-library/jest-dom` | DOM matchers (`toBeInTheDocument`, `toBeVisible`, `toHaveTextContent`) |
| `@testing-library/user-event` | Realistic user interaction simulation |
| `msw` | Network-level API mocking (optional, preferred over Axios mocks) |

---

## Import Rules (CRITICAL)

- Import `describe`, `it`, `expect`, `vi`, `beforeEach`, `afterEach` from `vitest`
- NEVER import from `jest` — use `vi.fn()`, `vi.spyOn()`, `vi.mock()`
- Use `userEvent` from `@testing-library/user-event` — NEVER `fireEvent`
- Use `screen` for all queries — NEVER destructure from `render()`

---

## React Testing Library Query Priority (CRITICAL)

RTL queries should reflect how users find elements. Follow this priority:

### Tier 1: Accessible Queries (prefer these)

| Query | When to Use |
|-------|-------------|
| `getByRole` | Buttons, links, headings, inputs, checkboxes — **primary choice** |
| `getByLabelText` | Form fields with associated `<label>` |
| `getByPlaceholderText` | Inputs when no label exists (prefer adding a label) |
| `getByText` | Non-interactive text content, paragraphs, spans |
| `getByDisplayValue` | Inputs with a current value |

### Tier 2: Semantic Queries

| Query | When to Use |
|-------|-------------|
| `getByAltText` | Images |
| `getByTitle` | Elements with `title` attribute |

### Tier 3: Last Resort

| Query | When to Use |
|-------|-------------|
| `getByTestId` | Only when no accessible query works — add `data-testid` attribute |

### Query Variants

| Variant | Behavior | Use for |
|---------|----------|---------|
| `getBy` | Throws if not found | Elements that must be present |
| `queryBy` | Returns `null` if not found | Asserting element does NOT exist |
| `findBy` | Awaits element (async) | Elements that appear after loading |
| `getAllBy` / `queryAllBy` / `findAllBy` | Multiple elements | Lists, repeated elements |

### Role Query Tips

```
getByRole('button', { name: /submit/i })      // button with text
getByRole('heading', { level: 2 })             // <h2>
getByRole('textbox', { name: /email/i })       // input with label
getByRole('link', { name: /read more/i })      // <a> tag
getByRole('checkbox', { name: /agree/i })      // checkbox
getByRole('combobox')                          // <select>
getByRole('status')                            // element with role="status"
```

---

## userEvent API (HIGH)

Always call `userEvent.setup()` first. Key methods:

| Method | Use for |
|--------|---------|
| `user.click(element)` | Click buttons, links, checkboxes |
| `user.dblClick(element)` | Double-click |
| `user.type(element, 'text')` | Type into input (appends) |
| `user.clear(element)` | Clear input value |
| `user.selectOptions(select, 'value')` | Select dropdown option |
| `user.tab()` | Tab to next focusable element |
| `user.keyboard('{Enter}')` | Press specific keys |
| `user.hover(element)` / `user.unhover(element)` | Hover interactions |
| `user.upload(input, file)` | File upload |

---

## What to Test (HIGH)

**DO test:**
- Rendered output — what the user sees
- User interactions — clicks, typing, form submission
- Conditional rendering — different states produce different output
- Loading, error, and empty states
- Form validation — error messages appear for invalid input
- Callbacks — called with correct arguments on interaction

**DO NOT test:**
- Internal state (`useState` values)
- Implementation details (hook internals, private functions)
- CSS classes or styling
- Third-party library internals
- Render counts or performance
- Snapshot tests (unless explicitly requested)

---

## Async Testing (CRITICAL)

- Use `findBy` queries (auto-waits) for elements that appear after async operations
- Use `await waitFor(() => ...)` for complex multi-assertion async checks
- NEVER use `setTimeout` or fixed delays — always use RTL's built-in waiting
- NEVER use `act()` directly unless testing hooks outside components — RTL handles it

---

## React Router Wrapping (HIGH)

Components using `<Link>`, `useNavigate`, `useParams`, or `useLocation` MUST be wrapped:

```jsx
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Simple wrapping
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

## Mocking Strategies (HIGH)

### Module Mocking (vi.mock)

```
vi.mock('../../api/blogApi', () => ({
  getBlogs: vi.fn(),
  createBlog: vi.fn(),
}));
```

- Mock at the API module level, not at Axios level
- Reset mocks in `beforeEach` with `vi.clearAllMocks()`

### MSW (Mock Service Worker) — Preferred for Integration Tests

- Intercepts at the network layer — most realistic
- Tests don't know about Axios/fetch internals
- Shared handlers across tests for consistent mock data

### Context Mocking

- Wrap components in a test provider with controlled values
- Don't mock Context internals — render with the real provider and test values

---

## Coverage Strategy (MEDIUM)

- **Always cover:** Default/happy path, primary user interaction, one error case
- **Cover if present:** Loading state, empty state, conditional rendering branch
- **Skip:** Trivial prop forwarding, edge cases that don't affect UX

Aim for: ~3-6 tests per component, ~2-4 per hook, ~3-5 per utility function.

---

## Test File Conventions (MEDIUM)

- Place test next to source: `BlogCard.jsx` → `BlogCard.test.jsx`
- Use `.test.jsx` extension (not `.spec.jsx`)
- One `describe` block per component/hook
- Test names describe user-visible behavior: `"shows error when form is submitted empty"`

---

## Anti-Patterns (CRITICAL)

- `fireEvent` when `userEvent` would work — `userEvent` is more realistic
- Destructuring queries from `render()` instead of using `screen`
- `getByTestId` as first choice instead of accessible queries
- Testing `useState` values or hook internals directly
- Fixed `setTimeout` delays instead of `waitFor` / `findBy`
- Snapshot tests as a substitute for behavior tests
- Over-mocking — mocking the thing you're testing
- Shared mutable state between tests (use `beforeEach` for setup)
- `container.querySelector()` for DOM traversal — use RTL queries
