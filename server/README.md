# Quick Blog — Server API

Express server with blog CRUD, comments, admin auth, ImageKit uploads, and AI content generation.

## Tech Stack
- **Backend:** Express 5, Mongoose 8, JWT, Multer
- **Database:** MongoDB (local via Docker)
- **Integrations:** ImageKit, Google Gemini AI
- **Dev Tools:** migrate-mongo, Docker Compose
- **Logging:** Custom database change tracker

> **Note:** This setup uses a **local MongoDB database** running in Docker. No cloud database needed for development!

---

## 🚀 Quick Start

### Recommended: Complete Setup
```bash

npm install
npm run setup    # Starts Docker + creates schema + seeds test data

# Daily: Start the server
npm run server   # Start the API server (port 5000)
```

### Manual Step-by-Step
```bash
# 1. Install dependencies
npm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your API keys (ImageKit, Gemini, JWT secret)

# 3. Start MongoDB with Docker (init-db.js creates schema automatically)
npm run db:start

# 4. Wait 5 seconds for DB to be ready, then seed test data
npm run seed    # Creates 2 users, 6 blogs, 9 comments

# 5. Start development server
npm run server
```

> **Important:** The database schema, collections, and indexes are **automatically created** by `/init-scripts/init-db.js` when Docker starts. You don't need to run migrations for initial setup. Migrations are only for future schema changes.

---

## 🔧 Environment Configuration

### Setup (.env)
```bash
# Local MongoDB (Docker)
MONGODB_URI=mongodb://admin:admin123@localhost:27017

# Server
PORT=5000
NODE_ENV=development

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_here

# ImageKit (for image uploads)
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id

# Google Gemini AI (for content generation)
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 🐳 Docker Local Database

When you run `npm run db:start`, Docker starts **two containers**:

1. **MongoDB** - Your actual database (required)
2. **Mongo Express** - Web UI to view your data (optional, can be removed)

Both run on your local machine. No cloud, no remote connections.

### Commands
```bash
npm run db:start      # Start local MongoDB + Web UI
npm run db:stop       # Stop (keeps your data)
npm run db:restart    # Restart
npm run db:logs       # View database logs
npm run db:clean      # Delete everything (fresh start)
```

### Access
- **API:** `http://localhost:5000`
- **Database:** `mongodb://admin:admin123@localhost:27017/quickblog`
- **Web UI:** `http://localhost:8081` (admin/admin123) ← View your data here
- **Shell:** `docker exec -it quickblog-mongodb mongosh -u admin -p admin123`

### Verify Setup
```bash
docker-compose ps      # Check containers status
npm run db:logs        # View MongoDB logs
curl http://localhost:5000/api/blog/all  # Test API (after starting server)
```

---

## 📦 Database Migrations

> **Note:** Initial database setup (collections, indexes) is handled automatically by `/init-scripts/init-db.js` when Docker starts. Use migrations only for **future schema changes**.

### Migration Commands
```bash
npm run migrate:status    # Check migration status
npm run migrate:up        # Run pending migrations (if any)
npm run migrate:down      # Rollback last migration
npm run migrate:create    # Create new migration
```

### Current State
The existing migration files (`20241014000001-add-blog-indexes.js`, etc.) are **examples only**. The indexes they create already exist via `init-db.js`, so they will fail if you try to run them. They're kept as reference for creating future migrations.

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
   import dbLogger from '../utils/dbLogger.js'
   
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

### Best Practices
✅ Test on development first  
✅ Implement both `up` and `down` functions  
✅ One logical change per migration  
✅ Use descriptive names  
✅ Add logging with `dbLogger`  
✅ Don't duplicate what's in `init-db.js`  

---

## 📝 Database Logging

All database changes are logged to `/logs/db-changes.log`

### Usage
```javascript
import dbLogger from './utils/dbLogger.js'

// CRUD operations
dbLogger.logCreate('blogs', blogData)
dbLogger.logUpdate('blogs', blogId, updates)
dbLogger.logDelete('blogs', blogId)

// Migrations
dbLogger.logMigration('migration-name', 'SUCCESS', 'Details')

// Errors
dbLogger.logError('operation-name', error)

// Events
dbLogger.logEvent('DATABASE_SEEDED', 'Added 100 test blogs')
```

### Log Format
```
2024-10-14T12:00:00.000Z | CREATE | blogs | ID: 507f... | Data: {...}
2024-10-14T12:05:00.000Z | UPDATE | blogs | ID: 507f... | Updates: {...}
2024-10-14T12:10:00.000Z | DELETE | blogs | ID: 507f...
2024-10-14T12:15:00.000Z | MIGRATION | add-indexes | SUCCESS
```

---

## 🗄️ View Your Local Database

### Option 1: Mongo Express (Web UI) ✨
Built-in web interface to view and manage your data:
1. Start Docker: `npm run db:start`
2. Open browser: `http://localhost:8081`
3. Login: `admin` / `admin123`
4. Browse your data visually

### Option 2: MongoDB Compass (Desktop App)
Professional desktop application:
1. Download: [mongodb.com/compass](https://www.mongodb.com/products/compass)
2. Connect: `mongodb://admin:admin123@localhost:27017`
3. View: `quickblog` database

### Option 3: Command Line
```bash
# Enter database shell
docker exec -it quickblog-mongodb mongosh -u admin -p admin123

# Query your data
use quickblog
db.blogs.find().pretty()
db.blogs.countDocuments()
exit
```

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
// Success
{ success: true, data: result }

// Error
{ success: false, message: 'Error description' }
```

---

## 💡 Daily Workflow

### Start Your Day
```bash
npm run dev  # Starts DB + Server
```

### Reset Database
```bash
npm run db:clean      # Delete all data and volumes
npm run db:start      # Fresh start (init-db.js runs automatically)
npm run seed          # Add test data
```

### Check Status
```bash
docker-compose ps           # Container status
npm run db:logs             # MongoDB logs
tail -f logs/db-changes.log # Database changes
```

---

## 🚀 Deployment Notes

This setup is optimized for **local development**. For production:

1. Use a hosted database service (e.g., MongoDB Atlas, Railway, etc.)
2. Update `MONGODB_URI` in your deployment environment
3. Run migrations: `npm run migrate:up`
4. Deploy to your platform (Vercel, etc.)

---

## 📦 Docker Setup Details

### What's Running Locally

**MongoDB Container** (Your Database):
- Local database server on port `27017`
- Username: `admin`, Password: `admin123`
- Database: `quickblog`
- Data persists in Docker volumes

**Mongo Express Container** (Optional Web UI):
- Web interface on port `8081`
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

## 🔧 Customization

### Change Database Credentials
1. Edit `docker-compose.yml`:
   ```yaml
   MONGO_INITDB_ROOT_USERNAME: your_username
   MONGO_INITDB_ROOT_PASSWORD: your_password
   ```

2. Update `.env`:
   ```bash
   MONGODB_URI=mongodb://your_username:your_password@localhost:27017
   ```

### Change Ports
Edit `docker-compose.yml`:
```yaml
ports:
  - '27018:27017'  # Use port 27018 instead
```

### Remove Mongo Express (Optional)
If you don't need the web UI, remove the `mongo-express` service from `docker-compose.yml`

---

## 🐛 Troubleshooting

### Connection Issues
```bash
npm run db:restart    # Restart containers
docker-compose ps     # Check status
npm run db:logs       # View errors
```

### Port Conflicts
```bash
lsof -i :27017  # Check what's using port
lsof -i :8081   # Check Mongo Express port
```

### Migration Errors
```bash
npm run migrate:status  # Check current state
npm run migrate:down    # Rollback
# Fix migration file
npm run migrate:up      # Try again
```

### Fresh Start
```bash
npm run db:clean    # Delete all data
npm run db:start    # Restart (init-db.js creates schema)
npm run seed        # Add test data
```

### Common Issues
1. **Docker not running:** Start Docker Desktop
2. **Port in use:** Stop conflicting services
3. **Connection timeout:** Wait 5-10 seconds after `db:start`
4. **Lost data:** Ran `db:clean` - data is gone

---

## ✨ Why This Setup?

### What You Get
1. **Local MongoDB** - Database runs on your machine
2. **Web UI** - Visual interface to view data
3. **Migrations** - Version control for database changes
4. **Logging** - Track all database operations
5. **Docker** - Consistent setup across all machines

### Benefits
- ⚡ **Fast** - No network latency
- 💰 **Free** - No cloud costs
- 🔒 **Private** - Data stays on your computer
- 🧪 **Easy Testing** - Reset anytime
- 📦 **Portable** - Works on any machine with Docker
- 🔄 **Reversible** - Undo with migrations

---

## 📚 Additional Resources

- **[migrations/README.md](./migrations/README.md)** - Migration documentation
- **[.env.example](./.env.example)** - Environment template
- [MongoDB Documentation](https://docs.mongodb.com/)
- [migrate-mongo GitHub](https://github.com/seppevs/migrate-mongo)
- [Docker Compose Docs](https://docs.docker.com/compose/)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)

---

## 📁 Project Structure

```
server/
├── configs/          # DB, ImageKit, Gemini configs
├── controllers/      # Business logic
├── fixtures/         # Test data (users, blogs, comments)
├── init-scripts/     # DB initialization (runs on Docker start)
├── middleware/       # Auth, multer, validation
├── migrations/       # Database migrations (future changes)
├── models/           # Mongoose schemas
├── routes/           # API route definitions
├── scripts/          # Seeding and utility scripts
├── utils/            # Database logger
├── logs/             # Database change logs
├── docker-compose.yml
├── .env.example
└── server.js
```

---

**Ready to code!** 🚀

```bash
npm run dev
```

## 👥 Database Schema

### Collections

#### 1. Users
```javascript
{
  name: String (required)
  email: String (required, unique)
  password: String (required, hashed with bcrypt)
  role: String (enum: ['admin', 'author'])
  bio: String
  avatar: String
  isActive: Boolean
  createdAt: Date
  updatedAt: Date
}
```

#### 2. Blogs
```javascript
{
  title: String (required)
  subTitle: String
  description: String (required)
  category: String (required)
  author: ObjectId (ref: 'User', required)
  authorName: String (required)
  image: String (required)
  isPublished: Boolean
  createdAt: Date
  updatedAt: Date
}
```

#### 3. Comments
```javascript
{
  blog: ObjectId (ref: 'Blog', required)
  name: String (required)
  content: String (required)
  isApproved: Boolean
  createdAt: Date
  updatedAt: Date
}
```

---

## 🌱 Seeding Test Data

### Quick Setup
```bash
# Complete setup (start DB, run migrations, seed data)
npm run setup
```

### Manual Steps
```bash
# 1. Start database
npm run db:start

# 2. Run migrations
npm run migrate:up

# 3. Seed test data
npm run seed
```

### Test Credentials
After seeding, use these credentials to login:

**Admin Account:**
- Email: `admin@quickblog.com`
- Password: `admin123`

**Author Account:**
- Email: `sarah@quickblog.com`
- Password: `sarah123`

### What Gets Created
- ✅ 2 test users (admin & author)
- ✅ 6 blog posts with realistic content
- ✅ 9 comments across multiple blogs
- ✅ All passwords securely hashed

---

