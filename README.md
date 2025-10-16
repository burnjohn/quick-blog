## QuickBlog — Demo Project

QuickBlog is a simple full‑stack blog demo used to showcase Cursor's capabilities in web development. It includes a React + Vite client and an Express + MongoDB server, with ImageKit for image hosting and Google Gemini for optional AI‑assisted content generation.

### Monorepo Structure
- [`client/`](client/README.md) — React 19 app (Vite, Tailwind, React Router, Quill editor, Marked, React Hot Toast)
- [`server/`](server/README.md) — Express 5 API (MongoDB/Mongoose via Docker, JWT auth, Multer, ImageKit, Gemini)

### Design
Figma reference: `https://www.figma.com/design/b0ILCMLfSEsx7NUclZAg3E/QuickBlog?node-id=0-1&m=dev&t=Jo8qI7kBgrtOqFZT-1`

For the full feature list and API documentation, see [`server/README.md`](server/README.md).

### First Run Order
1) Start the Server (starts local MongoDB via Docker + seeds data)
2) Start the Client

### Quickstart
See [`server/README.md`](server/README.md) and [`client/README.md`](client/README.md) for detailed steps. Briefly:

**Server**
- Copy `server/.env.example` to `server/.env` and fill in your credentials:
  - Database credentials (`MONGODB_USER`, `MONGODB_PASSWORD`, `MONGODB_DATABASE`)
  - JWT secret (`JWT_SECRET`)
  - ImageKit keys (`IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`)
  - Gemini API key (`GEMINI_API_KEY`)
- `cd server && npm install && npm run setup` (starts local MongoDB in Docker + creates schema + seeds test data)
- `npm run server` (starts API on port 5001)

**Client**
- Copy `client/.env.example` to `client/.env` and set:
  - `VITE_BASE_URL=http://localhost:5001`
- `cd client && npm install && npm run dev` (starts dev server on port 5173)

**Admin Login** (after seeding)
- Navigate to `http://localhost:5173/admin`
- Email: `admin@quickblog.com` / Password: `admin123`

### Database
This project uses a **local MongoDB database** running in Docker (no cloud database needed). The database is automatically set up when you run `npm run setup` in the server directory.

To view your data:
- **Mongo Express** (Web UI): `http://localhost:8081` (login with your `MONGODB_USER` / `MONGODB_PASSWORD`)
- **MongoDB Compass** (Desktop): Connect to `mongodb://quickblog:quickblog123@localhost:27017`

### Environment Variables
See [`server/README.md`](server/README.md) and [`client/README.md`](client/README.md) for complete environment configuration. Server requires database credentials, `JWT_SECRET`, ImageKit keys, and `GEMINI_API_KEY`. Client only needs `VITE_BASE_URL`.

### Demos & Workshop

Learn how to build features with Cursor by following these resources:

- **[Workshop Slides](https://gamma.app/docs/Cursor-AI-Development-Workshop-sk3zpe30t3tw2sz?mode=present#card-hajs9rr3zuclvbt)** — Cursor AI Development Workshop presentation covering key concepts, best practices, and development workflows.

- **[Implementing Comments Feature](DEMO-COMMENTS-FEATURE.md)** — Complete walkthrough showing how to use Cursor's planning mode with Figma designs to build a full admin comments management page, integrate with backend APIs, and test the entire workflow from comment creation to approval.

These demos showcase Cursor's AI capabilities including Figma integration, planning mode, code generation, and full-stack development.


