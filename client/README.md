## Client — QuickBlog Web App

React + Vite single‑page app for browsing blogs, reading posts, commenting, and administering content.

### Tech
- React 19, React Router, Axios, Tailwind, Quill editor, Marked, React‑Hot‑Toast

### Environment
Copy `.env.example` to `.env` and set:

```
VITE_BASE_URL=http://localhost:5001
```

### Run
```
cd client
npm install
npm run dev
```

For the full feature list and endpoints, see `../server/README.md`.

### Notes
- Axios `baseURL` is `import.meta.env.VITE_BASE_URL`
- On login, JWT is stored and attached to `Authorization` header
- Rich text HTML is stored in the database; Quill renders/edit

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
