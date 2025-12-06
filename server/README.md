# Quick Blog — Server API

Express server with blog CRUD, comments, admin auth, local image uploads, and AI content generation.

## Tech Stack
- **Backend:** Express 5, Mongoose 8, JWT, Multer
- **Database:** MongoDB (local via Docker)
- **Image Storage:** Local filesystem (served via Express static)
- **Integrations:** Google Gemini AI
- **Dev Tools:** migrate-mongo, Docker Compose
- **Logging:** HTTP requests/responses + Database changes

> **Note:** This setup uses a **local MongoDB database** running in Docker. No cloud database needed for development!

---

## 🚀 Quick Start

### Recommended: Complete Setup
```bash

npm install
npm run setup    # Starts Docker + creates schema + seeds test data
npm run server   # Start the API server (port 5001)
```

### Manual Step-by-Step
```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your credentials:
# - Database credentials (MONGODB_USER, MONGODB_PASSWORD, MONGODB_DATABASE)
# - API keys (Gemini)
# - JWT secret

# 3. Start MongoDB with Docker (init scripts create schema automatically)
npm run db:start

# 4. Wait 5 seconds for DB to be ready, then seed test data
npm run seed    # Creates 2 users, 6 blogs, 9 comments

# 5. Start development server
npm run server
```

> **Important:** The database schema, collections, and indexes are **automatically created** by `/init-scripts/*.sh` scripts when Docker starts. These scripts use credentials from your `.env` file. You don't need to run migrations for initial setup. Migrations are only for future schema changes.

---

## 🔧 Environment Configuration

### Setup (.env)
```bash
# Local Database (used by Docker and application)
MONGODB_USER=quickblog
MONGODB_PASSWORD=quickblog123
MONGODB_DATABASE=quickblog
MONGODB_URI=mongodb://quickblog:quickblog123@localhost:27017/quickblog

# Server
PORT=5001
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_here

# Google Gemini AI (for content generation)
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 🖼️ Image Storage

Blog images are stored locally on the server filesystem instead of a cloud service.

### Upload Directory Structure
```
server/
├── public/
│   └── uploads/
│       ├── blogs/     # User-uploaded blog images
│       └── seed/      # Seed data images
```

### How It Works
1. When a blog is created, the image is uploaded via Multer
2. The image is saved to `public/uploads/blogs/` with a unique filename
3. The image URL stored in the database is a relative path like `/uploads/blogs/blog-1234567890.png`
4. Express serves static files from the `public/uploads` directory
5. Frontend accesses images via the full URL: `http://localhost:5001/uploads/blogs/blog-1234567890.png`

### Supported Formats
- JPEG/JPG
- PNG
- GIF
- WebP

### File Size Limit
- Maximum: 10MB per image

---

## 📦 Database Migrations

> **Note:** Initial database setup (collections, indexes) is handled automatically by `/init-scripts/*.sh` scripts when Docker starts. These scripts read credentials from your `.env` file via Docker environment variables. Use migrations only for **future schema changes**.

### Migration Commands
```bash
npm run migrate:status    # Check migration status
npm run migrate:up        # Run pending migrations (if any)
npm run migrate:down      # Rollback last migration
npm run migrate:create    # Create new migration
```

### Current State
The existing migration files (`20241014000001-add-blog-indexes.js`, etc.) are **examples only**. The indexes they create already exist via init scripts, so they will fail if you try to run them. They're kept as reference for creating future migrations.

### When to Use Migrations
- Adding new fields to existing collections
- Creating new indexes (that don't exist yet)
- Data transformations
- Schema updates after initial setup

### Creating a Migration

1. **Generate file:**
   ```bash
   npm run migrate:create add-blog-views
   ```

2. **Edit `/migrations/TIMESTAMP-add-blog-views.js`:**
   ```javascript
   import dbLogger from '../src/utils/dbLogger.js'
   
   export async function up(db) {
     dbLogger.logMigration('add-blog-views', 'STARTING')
     await db.collection('blogs').updateMany({}, { $set: { views: 0 } })
     dbLogger.logMigration('add-blog-views', 'SUCCESS')
   }
   
   export async function down(db) {
     await db.collection('blogs').updateMany({}, { $unset: { views: '' } })
   }
   ```

3. **Apply:**
   ```bash
   npm run migrate:up
   ```

---

## 🗄️ View Your Local Database

> **Note:** All credentials are configured in your `.env` file. Default values are `quickblog` / `quickblog123`.

### Option 1: Mongo Express (Web UI) ✨
Built-in web interface to view and manage your data:
1. Start Docker: `npm run db:start`
2. Open browser: `http://localhost:8081`
3. Login with your `MONGODB_USER` / `MONGODB_PASSWORD` (default: `quickblog` / `quickblog123`)
4. Browse your data visually

### Option 2: MongoDB Compass (Desktop App)
Professional desktop application:
1. Download: [mongodb.com/compass](https://www.mongodb.com/products/compass)
2. Connect using your `MONGODB_URI` from `.env` (default: `mongodb://quickblog:quickblog123@localhost:27017`)
3. View: `quickblog` database

---

## 🔌 REST API

### Auth (Admin)
- `POST /api/admin/login` — body: `{ email, password }` → `{ token }`

### Admin (JWT required)
- `GET /api/admin/blogs` — list all blogs
- `GET /api/admin/comments` — list all comments
- `POST /api/admin/delete-comment` — body: `{ id }`
- `POST /api/admin/approve-comment` — body: `{ id }`
- `GET /api/admin/dashboard` — counts + recent blogs

### Public Blog
- `GET /api/blog/all` — published blogs
- `GET /api/blog/:blogId` — blog by id
- `POST /api/blog/add-comment` — body: `{ blog, name, content }`
- `POST /api/blog/comments` — body: `{ blogId }` → approved comments

### Blog Management (JWT required)
- `POST /api/blog/add` — multipart form:
  - `blog` (JSON string: `{ title, subTitle, description, category, isPublished }`)
  - `image` (file)
- `POST /api/blog/delete` — body: `{ id }`
- `POST /api/blog/toggle-publish` — body: `{ id }`
- `POST /api/blog/generate` — body: `{ prompt }` → AI-generated HTML content

### Response Format
```javascript
// Success with data
{ success: true, count: 6, blogs: [...] }

// Success with message
{ success: true, message: 'Blog added successfully' }

// Error
{ success: false, message: 'Error description' }
```

> **Note:** List endpoints (blogs, comments) now include a `count` field showing the number of items returned.

---

## 📝 Logging

All HTTP requests/responses and database changes are automatically logged.

### HTTP Logging
- **Location:** `/logs/http.log`
- **Console:** All requests and responses with emojis + metadata
- **Format:** `[Timestamp] | [REQUEST/RESPONSE] | Method URL | Status | Duration | Metadata`
- **Features:**
  - ✅ Success (2xx)
  - 🔄 Redirect (3xx)
  - ⚠️  Client Error (4xx)
  - ❌ Server Error (5xx)
  - Shows response metadata (success, count)
  - Sanitizes sensitive data (passwords, tokens)
  
**Example:**
```
📥 REQUEST  | GET /api/blog/all | IP: ::1
✅ RESPONSE | GET /api/blog/all | Status: 200 | Duration: 15ms | success: true, count: 6
```

### Database Logging
- **Location:** `/logs/db-changes.log`
- **Tracks:** CREATE, UPDATE, DELETE, MIGRATIONS, EVENTS
- **Format:** `[Timestamp] | [Operation] | Collection | Details`

---

## 📦 Docker Setup Details

### What's Running Locally

**MongoDB Container** (Your Database):
- Local database server on port `27017`
- Credentials configured via `.env` file (`MONGODB_USER`, `MONGODB_PASSWORD`)
- Default: `quickblog` / `quickblog123`
- Database: `quickblog` (or `MONGODB_DATABASE` from `.env`)
- Data persists in Docker volumes

**Mongo Express Container** (Optional Web UI):
- Web interface on port `8081`
- Uses same credentials from `.env`
- View and manage your local data
- Can be removed if you don't need it

### Your Data
**Persists when you:**
- ✅ Restart containers (`npm run db:restart`)
- ✅ Stop containers (`npm run db:stop`)
- ✅ Reboot your computer

**Gets deleted when you:**
- ❌ Run `npm run db:clean`
- ❌ Run `docker-compose down -v`

---


## 📁 Project Structure

```
server/
├── src/                      # 🎯 Application Code
│   ├── configs/             # DB, Gemini configs
│   ├── constants/           # Status codes, messages, enums
│   ├── controllers/         # Route handlers (thin, delegate to services)
│   ├── helpers/             # Response formatters, async handlers
│   ├── middleware/          # Auth, error handling, file uploads (Multer)
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API route definitions
│   ├── services/            # Business logic layer
│   ├── utils/               # HTTP & Database loggers
│   └── validators/          # Input validation middleware
│
├── public/                  # Static files
│   └── uploads/             # Uploaded images
│       ├── blogs/           # User-uploaded blog images
│       └── seed/            # Seed data images
│
├── fixtures/                # Test/seed data
├── scripts/                 # Database seeding scripts
├── migrations/              # Database migrations
├── init-scripts/            # Docker initialization
├── logs/                    # HTTP & Database logs (gitignored)
├── docker-compose.yml       # Docker configuration
├── .env.example             # Environment template
└── server.js                # Application entry point
```

### Key Structure Improvements
- **Separation of Concerns**: All application code in `src/`, infrastructure at root
- **Service Layer**: Business logic separated from controllers
- **Response Helpers**: Consistent API responses via helper functions
- **Constants**: Centralized messages and status codes
- **Validators**: Input validation middleware for clean controllers
- **Local Image Storage**: Images stored in `public/uploads/` directory

---

## 🎯 Best Practices Implemented

### Architecture Patterns
✅ **MVC Pattern** - Models, Views (JSON responses), Controllers
✅ **Service Layer** - Business logic separated from HTTP layer
✅ **Middleware Chain** - CORS → Body Parser → Cache Control → Logging → Routes → Error Handlers
✅ **Centralized Error Handling** - 404 handler + global error handler
✅ **Environment-Based Configuration** - Different behavior for dev/prod

### Code Quality
✅ **Consistent Response Format** - All endpoints return `{ success, ...data }`
✅ **Response Metadata** - List endpoints include `count` field
✅ **No Magic Strings** - Constants for messages and status codes
✅ **Input Validation** - Middleware validates before hitting controllers
✅ **Security** - CORS configuration, JWT authentication, input sanitization

### Developer Experience
✅ **Enhanced Logging** - HTTP requests show metadata (status, count, duration)
✅ **Clean Imports** - All app code under `src/` namespace
✅ **Documentation** - Comprehensive README and inline comments
✅ **Database Seeding** - Quick setup with test data
✅ **Hot Reload** - Nodemon for development

### Performance
✅ **Cache Control** - Disabled in development for fresh data
✅ **Local Image Storage** - Fast access, no external dependencies
✅ **Lean Queries** - Mongoose query optimization
✅ **Async/Await** - Non-blocking operations throughout

---

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [migrate-mongo GitHub](https://github.com/seppevs/migrate-mongo)
