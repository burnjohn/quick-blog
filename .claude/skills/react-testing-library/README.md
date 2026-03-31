# React Testing Library Skill

## Motivation

The original skill was a solid API reference — query priority, matchers, userEvent methods — but it guided toward writing **too many small, isolated tests** ("3-6 tests per component"). This produced test suites with high test counts but low real confidence: lots of `it('renders title')`, `it('renders content')` tests that break on any refactor but miss actual user-flow bugs.

The rewrite shifts the philosophy toward **fewer, longer integration-style tests** that walk through real user journeys. Instead of 6 tests checking individual elements exist, you write 2-3 tests that simulate what a user actually does: fill a form and submit, load a list and click an item, see an error when the API fails.

### Key changes from the original

| Before | After |
|--------|-------|
| "3-6 tests per component" | **1-3 user-flow tests per component** |
| No scenario guidance | **Scenario matrix by component type** (Form, List, Detail, Auth-gated, Shared) |
| `vi.mock` as primary mocking | **MSW (Mock Service Worker) as primary**, `vi.mock` as fallback |
| Reference-heavy, strategy-light | **Philosophy section + complete spec templates** |
| Flat "What to Test" checklist | **User-flow-oriented** testing (render → interact → verify) |

## Sources

These sources informed the rewrite:

### Core philosophy

- [Write fewer, longer tests — Kent C. Dodds](https://kentcdodds.com/blog/write-fewer-longer-tests) — The key argument against splitting every assertion into its own `it()` block. Combine related steps into integration-style tests.
- [Write tests. Not too many. Mostly integration. — Kent C. Dodds](https://kentcdodds.com/blog/write-tests) — The origin of the Testing Trophy model. Integration tests give the best return on investment.
- [The Testing Trophy and Testing Classifications — Kent C. Dodds](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications) — Defines the trophy layers: Static Analysis → Unit → Integration → E2E, with integration as the widest band.
- [Does the Testing Trophy need updating for 2025? — Kent C. Dodds](https://kentcdodds.com/calls/05/02/does-the-testing-trophy-need-updating-for-2025) — Discussion on whether E2E should grow relative to integration given Playwright/Vitest Browser Mode improvements.

### Practical patterns

- [React Testing Library docs](https://testing-library.com/docs/react-testing-library/intro/) — Official documentation, query priority, guiding principles.
- [Best Practices for React Testing Library — Medium](https://medium.com/@ignatovich.dm/best-practices-for-using-react-testing-library-0f71181bb1f4) — Accessible queries, userEvent over fireEvent, async handling.
- [React Functional Testing Best Practices — daily.dev](https://daily.dev/blog/react-functional-testing-best-practices) — Use-case coverage over code coverage, AAA pattern, test isolation.
- [Best Practices for React UI Testing in 2026 — Trio](https://trio.dev/best-practices-for-react-ui-testing/) — Current tooling recommendations, test structure patterns.
- [React Testing Library Basics & Guidelines — PatternFly](https://github.com/patternfly/patternfly-react/wiki/React-Testing-Library-Basics,-Best-Practices,-and-Guidelines) — Real-world team guidelines for RTL adoption.

### MSW (Mock Service Worker)

- [MSW documentation](https://mswjs.io/) — Network-level API mocking that doesn't couple tests to HTTP client internals.

### Tooling

- [Vitest documentation](https://vitest.dev/) — Test runner used in this project, Vite-native.
- [React Testing Library: Your Guide 2026 — ThinKSys](https://thinksys.com/qa-testing/react-testing-library-complete-guide-2023/) — Updated guide covering current RTL + Vitest patterns.
