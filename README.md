## QuickBlog — Demo Project

![QuickBlog Hero](hero-image.png)

QuickBlog is a simple full‑stack blog demo used to showcase Claude Code / Cursor capabilities in web development. It includes a React + Vite client and an Express + MongoDB server, with local image storage and Google Gemini for optional AI‑assisted content generation.

---

**[📚 Implementing Comments Feature Demo](DEMO-COMMENTS-FEATURE.md)** — Complete hands-on walkthrough showing how to use Claude Code / Cursor planning mode with Figma designs to build a full admin comments management page.

**[✍️ Implementing Blog Creation Demo](DEMO-BLOG-CREATION.md)** — Step-by-step guide to building a feature-rich blog creation page with Quill editor, local image uploads, and AI content generation using Claude Code / Cursor planning mode.

**[📊 Implementing Analytics Dashboard Demo (Multi-Agent)](DEMO-ANALYTICS-FEATURE.md)** — Advanced tutorial demonstrating how to build a full analytics dashboard using Claude Code / Cursor multi-agent orchestration: requirements-planner, parallel implementors, plan-verifier, and dual code reviewers working simultaneously.

**[🐞 Debugging Demo (Systematic Debugging Skill)](DEMO-DEBUGGING.md)** — Guided walkthrough for investigating two pre-planted bugs on the `demo-debugging` branch using the `systematic-debugging` skill — root-cause analysis over guessing.

---

### Monorepo Structure
- [`client/`](client/README.md) — React 19 app (Vite, Tailwind, React Router, Quill editor, Marked, React Hot Toast)
- [`server/`](server/README.md) — Express 5 API (MongoDB/Mongoose via Docker, JWT auth, Multer, local image storage, Gemini)

### Design
Figma reference: `https://www.figma.com/design/b0ILCMLfSEsx7NUclZAg3E/QuickBlog?node-id=0-1&m=dev&t=Jo8qI7kBgrtOqFZT-1`

For the full feature list and API documentation, see [`server/README.md`](server/README.md).

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ installed
- **Docker** installed and running
- **npm** package manager

### First Run Order
1. Start the Server first (starts local MongoDB via Docker + seeds data)
2. Then start the Client

---

### Step 1: Setup Server

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file from example
cp .env.example .env

# Start MongoDB (Docker) + seed database with test data
npm run setup

# Start the API server (runs on port 5001)
npm run server
```

> **Note:** The `npm run setup` command starts Docker containers and seeds the database with sample users, blogs, and comments.

### Step 2: Setup Client

Open a **new terminal** and run:

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create environment file from example
cp .env.example .env

# Start the dev server (runs on port 5173)
npm run dev
```

### Step 3: Access the Application

- **Public Blog**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin

**Admin Login** (created by seed script):
- Email: `admin@quickblog.com`
- Password: `admin123`

---

## 📁 Environment Configuration

### Server (`server/.env`)
The server requires these environment variables (defaults work out of the box):

```bash
# Database (Docker)
MONGODB_USER=quickblog
MONGODB_PASSWORD=quickblog123
MONGODB_DATABASE=quickblog
MONGODB_URI=mongodb://quickblog:quickblog123@localhost:27017/quickblog

# Server
PORT=5001
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Authentication
JWT_SECRET=your_jwt_secret_key_change_this_in_production

# AI Content Generation (optional)
GEMINI_API_KEY=your_gemini_api_key_here
```

### Client (`client/.env`)
The client only needs the backend URL:

```bash
VITE_BASE_URL=http://localhost:5001
```

---

## 🗄️ Database

This project uses a **local MongoDB database** running in Docker (no cloud database needed).

### Database Commands
```bash
cd server

npm run db:start    # Start MongoDB containers
npm run db:stop     # Stop containers (data persists)
npm run db:restart  # Restart containers
npm run db:clean    # Stop and DELETE all data
npm run seed        # Re-seed database with test data
```

### View Your Data
- **Mongo Express** (Web UI): http://localhost:8081
  - Login: `quickblog` / `quickblog123`
- **MongoDB Compass** (Desktop): Connect to `mongodb://quickblog:quickblog123@localhost:27017`

---

## 🖼️ Image Storage

Blog images are stored **locally** on the server in `server/public/uploads/`:
- `uploads/blogs/` — User-uploaded blog images
- `uploads/seed/` — Seed data images

Images are served via the `/uploads` endpoint (e.g., `http://localhost:5001/uploads/seed/blog_pic_1.png`).

---

## 🔧 Troubleshooting

### Images not loading?
1. Make sure the server is running on port 5001
2. Check that `VITE_BASE_URL=http://localhost:5001` is set in `client/.env`
3. Verify images exist: `ls server/public/uploads/seed/`

### Database connection failed?
1. Ensure Docker is running: `docker ps`
2. Clean and restart: `cd server && npm run db:clean && npm run setup`

### Port already in use?
1. Kill the process: `lsof -ti:5001 | xargs kill -9` (for server)
2. Or change the port in `.env`

---

## 📚 More Documentation

- [`server/README.md`](server/README.md) — Full API documentation, database setup, and architecture
- [`client/README.md`](client/README.md) — Frontend setup and component documentation
- [`DEMO-COMMENTS-FEATURE.md`](DEMO-COMMENTS-FEATURE.md) — Tutorial on implementing comments
- [`DEMO-BLOG-CREATION.md`](DEMO-BLOG-CREATION.md) — Tutorial on implementing blog creation
- [`DEMO-ANALYTICS-FEATURE.md`](DEMO-ANALYTICS-FEATURE.md) — Multi-agent tutorial on implementing analytics dashboard
- [`DEMO-DEBUGGING.md`](DEMO-DEBUGGING.md) — Tutorial on investigating bugs with the `systematic-debugging` skill (uses `demo-debugging` branch)
