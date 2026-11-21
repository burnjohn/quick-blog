# QuickBlog client

React 19 + Vite 6 single-page app: the public blog ("front page") and the `/admin` panel.
Styling is Tailwind CSS 4 with the "Ink & Signal" editorial tokens; animation uses `motion/react`.

## Run

```bash
cd client
cp .env.example .env      # VITE_BASE_URL=http://localhost:5001
npm install
npm run dev               # http://localhost:5173
```

The API must be running (see [`../server/README.md`](../server/README.md)). After `npm run seed` on the server, log in at `/admin` with `admin@quickblog.com` / `admin123`.

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` / `npm run preview` | Production build / serve it |
| `npm run lint` | ESLint |
| `npm test` / `npm run test:watch` / `npm run test:coverage` | Vitest |

## Routes

| Path | Page |
|---|---|
| `/` | Front page |
| `/blog/:id` | Article |
| `/admin` | Login, or the dashboard when a token is stored |
| `/admin/addBlog`, `/admin/listBlog`, `/admin/comments` | Admin pages |

## Documentation

Start at [docs/README.md](docs/README.md).

- [Design system](docs/design-system.md): tokens, typography, utilities, layout, accessibility
- [Motion](docs/motion.md): presets, reveals, transitions, reduced motion
- [Components](docs/components.md): catalog by folder
- [Pages](docs/pages.md): what each route renders
- [Data layer](docs/data-layer.md): Axios, API wrappers, hooks, context
- [Testing](docs/testing.md): Vitest + React Testing Library

Agents should read [AGENTS.md](AGENTS.md) first.

## Notes

- Deployed as a static SPA; `vercel.json` rewrites every path to `/`.
