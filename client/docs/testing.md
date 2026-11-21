# Testing

Unit and component tests use **Vitest 4** with **jsdom**, **React Testing Library** (`@testing-library/react`, `user-event`, `jest-dom`) and **MSW 2** for network-level tests.

## Running

From `client/`:

| Command | What it does |
|---|---|
| `npm test` | `vitest run`: single run of every `src/**/*.test.{js,jsx}` |
| `npm run test:watch` | `vitest` in watch mode |
| `npx vitest run src/components/blog` | Run one folder or file |
| `npm run test:coverage` | `vitest run --coverage` (needs a coverage provider, see Known gaps) |

State at the time of writing: 43 test files, 142 tests, all passing.

## Configuration

`client/vitest.config.js` merges `vite.config.js` (so the React and Tailwind plugins apply) and sets:

| Option | Value |
|---|---|
| `environment` | `jsdom` |
| `globals` | `true` (`describe`/`it`/`expect` available without import; most files still import them from `vitest`) |
| `setupFiles` | `./src/test/setup.js`: imports `@testing-library/jest-dom/vitest` |
| `include` | `src/**/*.test.{js,jsx}` |
| `css` | `true` |
| `env.VITE_BASE_URL` | `http://localhost:5001` (MSW handlers use full URLs on this host) |

jsdom has no `IntersectionObserver`. The motion presets detect this (`canObserve()` in `ui/Reveal/motionPresets.js`, `CAN_OBSERVE` in `admin/shared/motion.js`) and render scroll-revealed content and `CountUp` values in their final state, so tests can assert on them without waiting for animations.

## Where tests live

Colocate the test with the unit: `Component/Component.test.jsx`, `useHook/useHook.test.js`, `helpers.test.js` next to `helpers.js`.

| Area | Files |
|---|---|
| `components/ui/` | `Button`, `Card`, `Input` |
| `components/layout/` | `Navbar` (also an older `layout/Navbar.test.jsx`), `Footer.test.jsx` |
| `components/blog/` | `BlogCard`, `BlogHeader`, `BlogList`, `CategoryFilter`, `CategoryTicker`, `Gallery`, `LeadCard`, `helpers.test.js`; older `BlogContent.test.jsx`, `BlogHeader.test.jsx`, `SocialShare.test.jsx` at folder level |
| `components/comment/` | `CommentForm`, `CommentItem`, `CommentList` (each also has an older folder-level copy) |
| `components/forms/` | `NewsletterForm`, `SearchBar` |
| `components/admin/` | `auth/Login` |
| `context/` | `AppContext` |
| `hooks/` | Every core hook, `useBlog`, `useBlogs`, `useComments`, `useBlogActions`, `useCommentActions`, `useBlogGenerator` and `useCreateBlog` (folder level), `useForm`, `useDebounce` |
| `pages/` | `public/Home`, `public/BlogDetail`, `admin/AddBlog.test.jsx` (folder level) |

## Conventions

- **Query by role and accessible name** (`getByRole('heading', { name: /quick links/i })`, `getByRole('region', …)`, `getByRole('link', { name })`). Section components set `aria-labelledby`, so sections are findable as regions.
- **User interaction** through `userEvent.setup()`; assert outcomes, not implementation.
- **Async**: `findBy*` or `waitFor`; page tests pass a `timeout` of up to 2000ms for data to arrive.
- **Routing**: wrap anything that renders `Link`, `NavLink` or uses `useNavigate` in `<MemoryRouter>`.
- **Context**: page and context tests render the real `<AppProvider>` and stub the network with MSW (`setupServer` + `http.get('http://localhost:5001/api/…')`, `server.listen/resetHandlers/close` in `beforeAll/afterEach/afterAll`). See `pages/public/Home/Home.test.jsx`, `context/AppContext/AppContext.test.jsx`.
- **Module boundaries**: component tests mock the module they read from rather than its internals, for example `vi.mock('../../../context/AppContext', () => ({ useAppContext: vi.fn(() => ({ blogs, input: '' })) }))` in `BlogList.test.jsx`; drive other states with `mockReturnValue`.
- **Hook tests** use `renderHook` and mock collaborators (`useApiMutation`, `useAppContext`, `marked`).
- **Toasts**: `vi.mock('react-hot-toast', () => ({ default: { success: vi.fn(), error: vi.fn() } }))`.
- **Third-party widgets**: `AddBlog.test.jsx` mocks `quill` with a constructor that exposes `root.innerHTML`.
- **Pure logic** (`components/blog/helpers.js`) gets table-driven tests with `it.each`.
- For a new section or page, cover: loading, empty, error (or hidden-on-error), populated, and the main interaction.

## Known gaps

- `@vitest/coverage-v8` (or another provider) is not in `devDependencies`, so `npm run test:coverage` will prompt to install one.
- Duplicate tests: several components have both a colocated test and an older folder-level one (`components/comment/*.test.jsx`, `components/blog/BlogHeader.test.jsx`, `components/layout/Navbar.test.jsx`, `hooks/core/useApiMutation.test.js`). New tests go into the component folder.
- `vite.config.js` also contains a `test` block (`css: false`, string `setupFiles`) that `vitest.config.js` overrides; the effective values are the ones above.
- `KpiCard.test.jsx` has two empty `it.skip` placeholders.
- Runs print `Not implemented: navigation to another Document` from jsdom; it does not fail the suite.
- No tests yet for `FrontCover`, `CategoryDesks`, `EditorsPicks`, `ArchiveList`, `ArticleAside`, `ReadNext`, `ArticleNotFound`, admin `Layout`, `Dashboard`, `ListBlog`, `Comments`, or any `admin/shared` component.
- `useBlogGenerator.test.js` asserts only that a `content` key exists, so it does not catch the stale-value bug described in [data-layer.md](data-layer.md#known-gaps).
