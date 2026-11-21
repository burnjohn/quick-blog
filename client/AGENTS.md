# client/ — agent guide

React 19 single-page app for QuickBlog: the public "front page" blog and the `/admin` editor's desk.
Stack: Vite 6, Tailwind CSS 4 (CSS-first `@theme` tokens), React Router 7, `motion/react`, Axios, Quill.
Visual language: "Ink & Signal" editorial design (paper / ink / signal yellow, hard offset shadows, no rounded corners).

## Commands (run from `client/`)

| Command | Purpose |
|---|---|
| `npm run dev` | Vite dev server (http://localhost:5173) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint (`eslint.config.js`) |
| `npm test` | Vitest, single run |
| `npm run test:watch` | Vitest watch mode |
| `npm run test:coverage` | Vitest with coverage |

Env: copy `.env.example` to `.env`; `VITE_BASE_URL` points at the API (default `http://localhost:5001`).

## Folder map (`client/src/`)

| Path | Contents |
|---|---|
| `App.jsx`, `main.jsx` | Router, `MotionConfig reducedMotion='user'`, toaster, `AppProvider` |
| `index.css` | Design tokens (`@theme`), custom utilities, `.rich-text` article styles |
| `api/` | Axios instance (`axiosConfig.js`) and endpoint wrappers |
| `constants/` | `routes.js`, `apiEndpoints.js`, `messages.js`, `categories.js` |
| `context/AppContext/` | Global state: token, published blogs, search input, `navigate` |
| `hooks/core/` | `useApiQuery`, `useApiMutation`, `useApiRequest` |
| `hooks/api/queries`, `hooks/api/mutations` | One hook per data need |
| `hooks/utils/` | `useForm`, `useDebounce` |
| `components/ui/` | Primitives: Button, Input, Textarea, Badge, Card, Sticker, Reveal, Loader, Skeleton |
| `components/layout/` | Navbar, Footer, SectionHeading, PageTransition, Container, Section |
| `components/blog/` | Front-page sections and article parts; `helpers.js` holds pure blog logic |
| `components/comment/`, `components/forms/` | Public comments, search, newsletter, front-page header |
| `components/admin/shared/` | Admin primitives: AdminTable, AdminPageHeader, Masthead, CountUp, SegmentedControl, EmptyState, Sidebar, `motion.js`, `editorial.js` |
| `components/admin/{blog,comment,dashboard,auth}/` | Admin feature components |
| `pages/public/`, `pages/admin/` | Route-level containers |
| `utils/` | `formatters.js`, `helpers.js` (`classNames`), `validators.js` |
| `test/setup.js` | Vitest setup (jest-dom matchers) |

## Conventions

### Code organization
- One component per folder: `Name/Name.jsx` + `Name/index.js` barrel. Keep components under ~200 lines; split sub-parts into sibling files (see `Gallery/`, `FrontCover/`).
- File order: imports, constants, helpers, component, export. Module-level constants for option maps, motion objects and limits.
- Pure helpers go to `components/blog/helpers.js`, `components/admin/shared/editorial.js` or `utils/`; never define them inside components.
- ES modules only. Never import from `../server` or anything outside `client/`.

### Components and state
- Pages are containers: they call hooks and handle loading, error and empty states with early returns. Section and leaf components receive props.
- Use `components/ui/` and `components/admin/shared/` before creating anything new. New shared primitives go there, not into a feature folder.
- Prefer local state and props. Context (`AppContext`) is only for auth token, the published blog list and the search term.
- Filter state that should survive reload goes into URL search params (`ListBlog` `?status=`).
- Derive, don't store: compute filtered lists, counts and labels during render. No `useState` + `useEffect` to mirror props.
- `useEffect` only to sync with something external (DOM, scroll, storage, Quill).

### Data
- All fetching lives in `hooks/api/queries` or `hooks/api/mutations`, built on `hooks/core`. Components never call Axios directly (exceptions listed in [docs/data-layer.md](docs/data-layer.md#known-gaps)).
- Endpoint paths belong in `constants/apiEndpoints.js`; user-facing strings in `constants/messages.js`; route paths in `constants/routes.js` (`getBlogDetailPath(id)` for article links).
- Notifications use `react-hot-toast`. Hooks already toast on error; do not toast twice.

### Design (see [docs/design-system.md](docs/design-system.md))
- Colors only from tokens: `paper`, `surface`, `ink`, `ink-muted`, `line`, `signal`, `danger`, `success`. No raw hex in JSX.
- No rounded corners, no blurred shadows. Depth = `shadow-hard-sm | shadow-hard | shadow-hard-lg | shadow-hard-signal(-lg)`.
- Interactive cards: `group lift` + `shadow-hard hover:shadow-hard-lg`.
- Typography roles: serif display, mono uppercase kickers (`font-mono text-[11px] uppercase tracking-[0.18em]`), mono `tabular-nums` for data, sans body.
- Section numbers come from CSS counters (`section-counter` parent, `section-no` kicker), never hard-coded.
- No more than two ink panels next to each other; one oversized element per page.
- Tailwind utilities only; no inline `style={}` except motion values (`style={{ y }}`).

### Motion (see [docs/motion.md](docs/motion.md))
- Library: `motion/react`. Public code imports presets from `components/ui/Reveal/motionPresets.js`; admin code from `components/admin/shared/motion.js`.
- Animate only `transform` and `opacity`. Never tween width, height, top or left (the admin sidebar uses a `layout` animation).
- Scroll reveals use `Reveal` / `revealOnScroll` with `viewport={{ once: true, margin: '-10% 0px' }}` and must render content immediately when `IntersectionObserver` is missing.
- `MotionConfig reducedMotion='user'` is global; CSS in `index.css` neutralizes transitions. Anything you add must be readable instantly with reduced motion.
- Shared `layoutId` indicators need a unique id per mounted instance.

### Accessibility
- Keep the global `:focus-visible` ring. Hit areas at least 44x44px (`min-h-11`, `h-11 w-11`).
- Drawers and dialogs: `role='dialog'`, `aria-modal`, focus trap, Escape to close, focus returns to the trigger.
- Decorative glyphs and duplicated numerals get `aria-hidden='true'`; animated numbers expose the final value via `sr-only` (see `CountUp`).

### Tests (see [docs/testing.md](docs/testing.md))
- Colocate `Name.test.jsx` inside the component folder. Vitest + React Testing Library; query by role and accessible name.
- Mock hooks at the module boundary (`vi.mock('../../../hooks/api/queries')`) or the network with MSW for page tests.

## Docs to read before changing X

| Changing | Read first |
|---|---|
| Colors, type, spacing, shadows, utilities | [docs/design-system.md](docs/design-system.md) |
| Any animation, transitions, reveals | [docs/motion.md](docs/motion.md) |
| A shared or section component | [docs/components.md](docs/components.md) |
| Page composition or routing | [docs/pages.md](docs/pages.md) |
| API calls, hooks, context | [docs/data-layer.md](docs/data-layer.md) |
| Tests or test setup | [docs/testing.md](docs/testing.md) |
| Behavior and acceptance criteria | Specs in [`../specs/`](../specs/): `public/`, `admin/` |
