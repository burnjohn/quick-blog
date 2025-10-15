## QuickBlog — Demo Project

QuickBlog is a simple full‑stack blog demo used to showcase Cursor’s capabilities in web development. It includes a React + Vite client and an Express + MongoDB server, with ImageKit for image hosting and Google Gemini for optional AI‑assisted content generation.

### Monorepo Structure
- `client/` — React app (Vite, Tailwind, React Router, Quill editor)
- `server/` — Express API (MongoDB/Mongoose, JWT auth, Multer, ImageKit, Gemini)

### Design
Figma reference: `https://www.figma.com/design/b0ILCMLfSEsx7NUclZAg3E/QuickBlog?node-id=0-1&m=dev&t=Jo8qI7kBgrtOqFZT-1`

For the full feature list, see `server/README.md`.

### First run order
1) Start the Server
2) Start the Client

### Quickstart
See `server/README.md` and `client/README.md` for detailed steps. Briefly:

**Server**
- Copy `server/.env.example` to `server/.env` and fill values
- `cd server && npm install && npm run setup` (starts DB + seeds data)
- `npm run server`

**Client**
- Copy `client/.env.example` to `client/.env` and set `VITE_BASE_URL`
- `cd client && npm install && npm run dev`

**Admin Login** (after seeding)
- Navigate to `/admin`
- Email: `admin@quickblog.com` / Password: `admin123`

### Environment Variables
See per‑app READMEs. Server requires `MONGODB_URI`, `JWT_SECRET`, ImageKit keys, and `GEMINI_API_KEY`.


