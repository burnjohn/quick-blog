# Client documentation

Documentation for `client/`. It describes the code as it currently is. Where the code is unfinished or inconsistent, each page has a **Known gaps** section; those are defects, not intended behavior.

| Document | Covers |
|---|---|
| [design-system.md](design-system.md) | "Ink & Signal" tokens, typography roles, custom utilities, layout and breakpoints, accessibility rules |
| [motion.md](motion.md) | `motion/react` setup, preset modules, reveal, page and drawer transitions, count-up, marquee, reduced motion |
| [components.md](components.md) | Component catalog by folder: purpose, key props, where used |
| [pages.md](pages.md) | Every route and what it renders, top to bottom |
| [data-layer.md](data-layer.md) | Axios config, API wrappers, endpoints, core and API hooks, `AppContext` |
| [testing.md](testing.md) | Vitest + React Testing Library setup, layout, conventions |
| [analytics-ui.md](analytics-ui.md) | Admin Analytics page, charts, filters, drill-down, export |

Related:

- [../AGENTS.md](../AGENTS.md): short guide for coding agents (commands, folder map, conventions)
- [../../specs/](../../specs/): behavior specs (`public/`, `admin/`)
- [../../server/README.md](../../server/README.md): API
