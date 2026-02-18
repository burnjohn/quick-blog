---
name: react-best-practices
description: "Modern React best practices and anti-pattern catalog (2025-26). Use when writing, reviewing, or refactoring React components, hooks, and state management. Covers component design, state patterns, hooks misuse, React 19 features, performance, data fetching, and code organization."
---

# React Best Practices & Anti-Patterns

Modern React 19 conventions (JS or TypeScript). Covers what to do and what to avoid. For code examples, see [examples.md](examples.md).

## Severity Levels

- **CRITICAL** — Will cause bugs, security vulnerabilities, or data loss
- **HIGH** — Will cause reliability issues or performance problems
- **MEDIUM** — Will hurt maintainability or developer experience

---

## Component Design (HIGH)

- Function components only — no class components
- One component per file; co-locate helpers, types, and styles
- Keep components under ~150 lines — extract subcomponents or hooks when larger
- Props interface/object at the top of the file, exported if shared
- Use destructuring with defaults in the parameter list — never use `defaultProps`
- Prefer composition over prop-heavy monoliths — split into smaller focused components
- Use `children` prop and slots for layout flexibility instead of deep prop drilling
- Extract non-rendering logic (formatting, filtering, sorting) out of the component body into standalone helper functions at the top of the file or a separate helpers file
- Components must be pure during render — same props = same JSX output; side effects belong in event handlers and effects, not the render body

### Compound Components

Use compound components when building related UI groups that share implicit state (tabs, accordions, menus). Communicate through React Context internally; expose a declarative JSX API externally.

### `ref` as a Prop (React 19)

- In React 19 `ref` is a regular prop — `forwardRef` is no longer needed and is deprecated
- Simply accept `ref` in the props destructuring: `function Input({ ref, ...props })`
- Migrate existing `forwardRef` wrappers to plain props when upgrading

### Component Anti-Patterns

- NEVER put components inside other components — causes remounts on every render
- NEVER spread entire objects as props (`{...data}`) — makes data flow opaque. Spreading controlled DOM attributes (`{...rest}` after destructuring known props) is acceptable for wrapper components
- NEVER use array index as `key` for dynamic lists — causes state bugs on reorder/delete
- NEVER store JSX in state or refs — store data, derive JSX in render

---

## React 19 Features (HIGH)

### Actions & Form Handling

React 19 introduces **Actions** — async functions in transitions that handle pending state, errors, and optimistic updates automatically.

- **`useActionState`**: manages form submission state (error, submitAction, isPending) — replaces manual `useState` + `try/catch` for mutations
- **`<form action={fn}>`**: pass an Action function to the `action` prop; React handles FormData extraction and auto-resets the form on success
- **`useFormStatus`**: read the pending state of a parent `<form>` from within child components (submit buttons, spinners) without prop drilling
- **`useOptimistic`**: show an optimistic UI update immediately while the async Action is in flight; automatically reverts on error

### The `use` Hook

- `use(Context)` replaces `useContext(Context)` — and unlike `useContext`, it can be called conditionally (inside `if`/loops)
- `use(Promise)` reads a Promise's value during render — must be used inside a Suspense boundary
- NEVER create the Promise during render — pass it from a parent, loader, or cache

### Document Metadata

- React 19 hoists `<title>`, `<meta>`, and `<link>` tags rendered inside components into `<head>` automatically
- Use this for per-page SEO without external libraries

### Other React 19 Changes

- `ref` cleanup functions: effects that set refs can return a cleanup (like `useEffect` cleanup)
- Context as a provider: `<Context value={...}>` replaces `<Context.Provider value={...}>`
- Stylesheet precedence: `<link rel="stylesheet" precedence="..." />` for CSS loading order

---

## Hooks (CRITICAL)

### Rules of Hooks

- Call hooks ONLY at the top level of function components or custom hooks
- NEVER call hooks inside conditions, loops, callbacks, event handlers, or after early returns
- NEVER call hooks at module level outside components

### useState

- Use for simple, independent values (toggle, counter, form input)
- Initialize with a function when the initial value is expensive: `useState(() => computeExpensive())`
- Use the functional updater when new state depends on previous: `setCount(prev => prev + 1)`
- NEVER mutate state directly — always create new objects/arrays

### useReducer

- Use for complex state with multiple sub-values or state transitions that depend on each other
- Keep reducer pure — no side effects, no API calls inside
- Define action types as a discriminated union (TypeScript) or use string constants (JavaScript)

### useEffect

- `useEffect` is an escape hatch for syncing with external systems (subscriptions, DOM APIs, timers, WebSockets) — it is NOT a lifecycle method
- Before writing a `useEffect`, ask: is there an external system involved? If no, you probably don't need it
- ALWAYS return a cleanup function for subscriptions, listeners, and timers
- NEVER use `useEffect` to derive state from props/state — compute during render instead
- NEVER use `useEffect` + `useState` to transform data on render — use `useMemo` or compute inline
- NEVER ignore the dependency array — include all reactive values used inside
- NEVER suppress `eslint-disable react-hooks/exhaustive-deps` without fixing the underlying design issue

#### "You Might Not Need an Effect" — Common Traps

These patterns should NOT use `useEffect`:

| Instead of... | Do this |
|---|---|
| `useEffect` to derive/transform state from props | Compute inline during render or use `useMemo` |
| `useEffect` to reset state when a prop changes | Use `key` on the component to force a remount |
| `useEffect` to send analytics/POST on user action | Put it in the event handler, not an effect |
| `useEffect` to share logic between handlers | Extract a plain helper function, call from each handler |
| `useEffect` to subscribe to an external store | Use `useSyncExternalStore` |
| `useEffect` + `fetch` for data loading | Use TanStack Query (or a framework data loader) |

### useRef

- Use for DOM element access and mutable values that don't trigger re-renders
- NEVER read or write `ref.current` during render — only in effects and event handlers

### React 19: The Compiler & Memoization

- The React Compiler auto-memoizes in most cases — avoid manual `useMemo`, `useCallback`, and `memo` by default
- Only add manual memoization when profiling identifies an actual bottleneck
- Manual memoization is still needed for: third-party libs requiring stable refs, effect dependencies that cause infinite loops, truly expensive computations with fast-changing external data
- If not using the React Compiler yet, `useMemo` is still valuable for genuinely expensive computations — but profile first

---

## Custom Hooks (HIGH)

- Extract to a custom hook when logic is reused across 2+ components OR when it improves readability by separating concerns
- One hook = one responsibility; avoid giant `useAppMagic` hooks
- Name with `use` prefix + clear description: `useDebounce`, `useLocalStorage`, `useOnlineStatus`
- Type all inputs and outputs (TypeScript) or document with JSDoc (JavaScript)
- Return explicit objects for 3+ values; arrays are fine for simple `[value, setter]` pairs
- Handle production concerns: request cancellation (AbortController), stale request protection, cleanup, error states
- Keep one hook per file; group files by domain, not by hook type

### Data Fetching Hooks — Production Checklist

If building custom fetch hooks (instead of TanStack Query), they MUST handle:
- **AbortController** for request cancellation on unmount or dependency change
- **Stale closure protection** — check if the component is still mounted before `setState`
- **Race conditions** — cancel or ignore responses from outdated requests
- **Error states** — catch and expose errors, don't silently swallow
- **Loading states** — track pending, success, and error distinctly
- NEVER return state that was set asynchronously and expect it to be current in the same render cycle (state updates are async — the returned value is stale until next render)

---

## State Management (HIGH)

### The 4-Layer Model

1. **Local UI state** (`useState`, `useReducer`) — modal open, input values, accordion expanded
2. **Derived state** (`useMemo`, inline computation) — filtered lists, computed totals
3. **Global client state** (Zustand / Redux Toolkit / Context) — theme, auth, cart
4. **Server state** (TanStack Query) — API data, caching, sync

### Decision Framework

- **Context API**: theme, locale, auth tokens — low-frequency updates shared across the tree. Split contexts by update frequency. Memoize provider values.
- **Zustand**: preferred default for most apps — minimal boilerplate, ~2KB, granular re-renders
- **Redux Toolkit**: large enterprise apps with complex state logic, middleware, and strict patterns
- **Jotai**: atomic, granular state relationships in highly interactive UIs

### State Anti-Patterns

- NEVER store derived values in state — compute during render
- NEVER duplicate server data into client state — use TanStack Query as the cache
- NEVER use a single giant context for everything — split by domain and update frequency (auth, theme, UI state should be separate contexts)
- NEVER mutate state objects directly — always produce new references
- NEVER put navigation functions (`useNavigate`) or API instances into Context — these are not state; import them where needed

### Push State Down, Lift Content Up

- Move state consumption as close as possible to the components that render based on it
- If a parent doesn't influence how children render, move child rendering up and pass as `children`
- Use `key` to reset a child's entire state when its identity changes (e.g., `<Form key={selectedItemId} />`)

---

## Data Fetching (HIGH)

- Use **TanStack Query** (React Query) for all server state — handles caching, dedup, stale-while-revalidate, race conditions, and request cancellation
- NEVER fetch in `useEffect` + `useState` for production code — it lacks caching, dedup, error recovery, cancellation, and race condition handling
- Use `useSuspenseQuery` with Suspense boundaries for cleaner loading states and guaranteed-defined data
- Prefetch data before component render (on hover, route transition, or server-side) to avoid request waterfalls
- Separate query key factories into a dedicated file for consistency
- Use `select` option to transform/filter server data instead of post-processing in components

### If Using Custom Fetch Hooks (without TanStack Query)

- ALWAYS use `AbortController` — pass `signal` to `fetch`/`axios` and abort in the cleanup
- Use a `cancelled` flag or `AbortController.signal.aborted` to prevent setState on stale responses
- NEVER return a value from a mutation hook that depends on async state — the state won't be updated yet in the same call

---

## Performance (MEDIUM)

### Code Splitting

- Split by route using `React.lazy()` + `Suspense` — users rarely visit every page in one session
- Lazy-load heavy components (charts, rich-text editors, admin panels) below the fold
- Always wrap `lazy` components in a `Suspense` boundary with a meaningful fallback
- Use Vite dynamic import for anticipated routes: `import(/* @vite-ignore */ './HeavyPage')`

### Rendering

- Avoid creating new objects/arrays/functions in JSX props that change every render — hoist them or memoize when it matters
- Use `key` strategically to reset component state when identity changes
- Virtualize long lists (1000+ items) with `react-window` or `@tanstack/react-virtual`
- Profile with React DevTools Profiler before optimizing — measure, don't guess
- Use `useTransition` for expensive state updates that can be deferred (search filtering, tab switching)

### Bundle

- Monitor bundle size with `vite-plugin-inspect` or `source-map-explorer`
- Prefer tree-shakeable imports: `import { map } from 'lodash-es'` not `import _ from 'lodash'`
- Separate vendor chunks for better caching

### Memory Leaks

- Revoke object URLs (`URL.revokeObjectURL`) in cleanup when using `URL.createObjectURL`
- Remove event listeners in effect cleanup
- Cancel ongoing network requests on unmount

---

## Forms (MEDIUM)

### React 19 Approach (Recommended for New Code)

- Use `<form action={fn}>` with `useActionState` for form submissions — React handles pending state, errors, and form reset automatically
- Use `useFormStatus` in child components to read form pending state without prop drilling
- Use `useOptimistic` for instant feedback while the form action is in flight

### React Hook Form Approach

- Use **React Hook Form** for complex forms with many fields — uncontrolled inputs via refs, minimal re-renders, Zod/Yup integration
- Validate with schema libraries (Zod preferred) — co-locate schema with the form

### General Form Practices

- Use controlled inputs (`useState`) only for simple, single-field interactions
- Show validation errors inline, near the offending field
- Disable submit button during submission; show loading state
- Use `aria-invalid` and `aria-describedby` to link errors to fields for accessibility

---

## Error Handling (HIGH)

- Wrap feature boundaries with `ErrorBoundary` (use `react-error-boundary` library)
- Place error boundaries at multiple granularities: app-level, layout-level, and component-level
- Error boundaries catch render errors only — use try/catch for event handlers and async code
- Use `useErrorBoundary` hook to surface async/event errors into the nearest boundary
- React 19: use `onUncaughtError` and `onCaughtError` callbacks on `createRoot` for centralized logging
- React 19: Actions automatically show error boundaries when a request fails
- Always provide a user-friendly fallback UI with a retry action

---

## TypeScript (HIGH)

> If using JavaScript, apply the same structural principles with JSDoc annotations and PropTypes where possible.

### Props

- Define props with `interface` (extendable) — use `type` for unions and intersections
- Use string literal unions for constrained values: `variant: 'primary' | 'secondary'`
- Extend native element props: `React.ComponentPropsWithoutRef<'button'>` — avoids re-inventing `onClick`, `className`, etc.
- Use `React.PropsWithChildren<T>` only when children are explicitly expected
- React 19: `ref` is a regular prop — no need for `forwardRef` or `React.ComponentPropsWithRef`

### Generics

- Use generic components for data-driven UI (tables, lists, selects) — `DataTable<T>`
- Keep generic constraints minimal — if you need 5+ type params, refactor

### Utility Types

- Use `Pick`, `Omit`, `Partial`, `Required` to derive types from existing interfaces — stay DRY
- Use discriminated unions for complex state machines and conditional rendering
- Use `as const` for literal tuples and enums
- Use `unknown` instead of `any` for truly unknown data — then narrow with type guards

### Anti-Patterns

- NEVER use `any` — use `unknown` and narrow
- NEVER use `as` type assertions unless absolutely unavoidable — prefer type guards
- NEVER suppress `@ts-ignore` without a comment explaining why

---

## Security (CRITICAL)

- React auto-escapes JSX expressions `{}` — this is your primary XSS protection
- NEVER use `dangerouslySetInnerHTML` with unsanitized input — always sanitize with DOMPurify first, with an explicit allowlist of tags and attributes
- NEVER use `javascript:` URLs — validate all user-provided URLs start with `http:` or `https:`
- NEVER use `ref.current.innerHTML` to inject content — bypasses React's escaping
- Sanitize ALL user/AI-generated HTML before rendering — server-side sanitization alone is not sufficient; always sanitize on the client too
- Validate and sanitize URLs used in `<img src>`, `<a href>`, and `<iframe src>`
- Implement Content Security Policy headers
- Keep dependencies updated — run `npm audit` regularly

---

## Accessibility (HIGH)

- Use semantic HTML elements first (`<button>`, `<nav>`, `<main>`, `<section>`) — ARIA is a supplement, not a replacement
- Every interactive element must be keyboard-accessible
- Every `<img>` needs `alt`; decorative images use `alt=""`
- Associate `<label>` with inputs via `htmlFor`
- Use `aria-live` regions for dynamic content updates (toasts, loading states)
- Maintain WCAG 2.1 AA color contrast ratios
- Manage focus programmatically after route changes and modal open/close
- Test with keyboard navigation and a screen reader

---

## Testing (MEDIUM)

- Test **behavior and user experience**, not implementation details
- Use React Testing Library — query by role, label, text (what users see), not by test IDs or CSS classes
- Use Mock Service Worker (MSW) for network mocking — avoids coupling tests to fetch implementation
- Use Vitest as the test runner
- Test: critical user paths, error states, edge cases (empty data, extremes), accessibility (keyboard, screen reader)
- NEVER test internal state, CSS classes, or component instance methods
- Wrap async assertions in `waitFor` — don't use arbitrary timers

---

## Code Organization (MEDIUM)

- Feature-based folder structure for medium+ apps — group by domain, not file type
- Co-locate component, styles, tests, and types in the same feature folder
- Barrel exports (`index.js` / `index.ts`) per feature for clean imports — avoid deep import paths
- Constants, messages, and route paths in dedicated `constants/` files — no hardcoded strings
- API layer in `api/` or `services/` — components never call `fetch`/`axios` directly
- Max ~150 lines per component file — extract hooks and helpers when larger
- Name files by what they export: `UserProfile.jsx`, `useAuth.js`, `formatDate.js`
- Remove `console.log` before merging — use a proper logger or conditional debug logging

---

## Additional Resources

For code examples of all patterns above, see [examples.md](examples.md).
