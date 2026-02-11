# Express Best Practices — Code Examples

Good/bad patterns for each rule in [SKILL.md](SKILL.md).

---

## AsyncHandler Usage

```javascript
// BAD: Manual try-catch in every controller
export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json({ success: true, blogs });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// GOOD: Use asyncHandler wrapper
import { asyncHandler } from '../helpers/asyncHandler.js';

export const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find();
  sendData(res, { blogs }, blogs.length);
});
```

---

## Response Helpers

```javascript
// BAD: Inconsistent manual responses
res.status(200).json({ ok: true, data: blog });
res.status(400).json({ error: 'Not found' });
res.json({ result: blogs, total: blogs.length });

// GOOD: Use response helpers consistently
import { sendSuccess, sendError, sendData } from '../helpers/response.js';

// Success with message
sendSuccess(res, { blog }, 'Blog created successfully', 201);

// Error response
sendError(res, 'Blog not found', 404);

// Data list response
sendData(res, { blogs }, blogs.length);
```

---

## Route Design

```javascript
// BAD: Business logic in routes
router.post('/blogs', auth, async (req, res) => {
  const { title, content, category } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  const blog = new Blog({ title, content, category, author: req.user.id });
  await blog.save();
  res.status(201).json({ success: true, blog });
});

// GOOD: Routes are thin, delegate to controllers
router.post('/blogs', auth, validateBlog, asyncHandler(createBlog));
```

---

## Controller Design

```javascript
// BAD: Fat controller with everything mixed in
export const createBlog = async (req, res) => {
  // validation (should be in middleware)
  if (!req.body.title) return res.status(400).json({ error: 'Title required' });

  // business logic + response mixed
  const blog = new Blog(req.body);
  blog.author = req.user.id;
  await blog.save();

  // raw response (should use helper)
  res.status(201).json({ success: true, blog });
};

// GOOD: Thin controller using helpers
export const createBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.create({
    ...req.body,
    author: req.user.id,
  });
  sendSuccess(res, { blog }, 'Blog created successfully', 201);
});
```

---

## Error Handling

```javascript
// BAD: Swallowing errors
export const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.json({ blog });
  } catch (error) {
    // Error silently swallowed — client gets nothing useful
    res.json({ blog: null });
  }
};

// BAD: Exposing internal errors to client
catch (error) {
  res.status(500).json({ error: error.stack }); // Security risk!
}

// GOOD: Let asyncHandler + errorHandler manage it
export const getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return sendError(res, 'Blog not found', 404);
  }
  sendData(res, { blog });
});
```

---

## Mongoose Schema Design

```javascript
// BAD: Loose schema with no validation
const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String,
});

// GOOD: Strict schema with validation, indexes, and timestamps
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  category: {
    type: String,
    required: true,
    enum: ['Technology', 'Startup', 'Lifestyle', 'Economy'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  image: String,
}, {
  timestamps: true,
});

blogSchema.index({ category: 1, createdAt: -1 });
blogSchema.index({ author: 1 });
```

---

## Query Optimization

```javascript
// BAD: Returning all fields, no pagination
const blogs = await Blog.find();

// GOOD: Select fields, paginate, use lean
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || 10;
const skip = (page - 1) * limit;

const [blogs, total] = await Promise.all([
  Blog.find({ isPublished: true })
    .select('title category image createdAt')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean(),
  Blog.countDocuments({ isPublished: true }),
]);
```

---

## Auth Middleware

```javascript
// BAD: No error handling, silent skip
const auth = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  }
  next(); // Silently allows unauthenticated access!
};

// GOOD: Proper verification with clear errors
const auth = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return sendError(res, 'Authentication required', 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
});
```

---

## Security

```javascript
// BAD: Wide-open CORS
app.use(cors());

// GOOD: Restricted CORS
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

// BAD: No rate limiting on auth
router.post('/login', loginController);

// GOOD: Rate limited auth endpoint
import { authLimiter } from '../middleware/rateLimiter.js';
router.post('/login', authLimiter, asyncHandler(loginController));
```

---

## Validation

```javascript
// BAD: Validation mixed into controller
export const createBlog = asyncHandler(async (req, res) => {
  if (!req.body.title) return sendError(res, 'Title required');
  if (!req.body.content) return sendError(res, 'Content required');
  if (req.body.title.length > 200) return sendError(res, 'Title too long');
  // ... business logic
});

// GOOD: Separate validation middleware
// validators/blogValidator.js
export const validateBlog = (req, res, next) => {
  const { title, content, category } = req.body;
  const errors = [];

  if (!title?.trim()) errors.push('Title is required');
  if (!content?.trim()) errors.push('Content is required');
  if (title && title.length > 200) errors.push('Title cannot exceed 200 characters');

  if (errors.length) return sendError(res, errors.join(', '), 400);
  next();
};

// In routes
router.post('/blogs', auth, validateBlog, asyncHandler(createBlog));
```

---

## File Uploads

```javascript
// BAD: No file validation
const upload = multer({ dest: 'uploads/' });

// GOOD: Validate file type and size
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/blogs/'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
```

---

## Express 5: req.body Handling

```javascript
// BAD: Assumes req.body is always an object (breaks in Express 5)
const { title } = req.body;

// GOOD: Optional chaining for Express 5 compatibility
const title = req.body?.title;
const { title, content } = req.body ?? {};
```

---

## NoSQL Injection Prevention

```javascript
// BAD: Passes raw user input as query — client can send operators
const user = await User.findOne({
  email: req.body.email,
  password: req.body.password, // could be { "$ne": "" }
});

// BAD: $where executes arbitrary JavaScript
const results = await Blog.find({ $where: `this.title == '${req.query.title}'` });

// GOOD: Validate input types before querying
const { email, password } = req.body ?? {};
if (typeof email !== 'string' || typeof password !== 'string') {
  return sendError(res, 'Invalid input', 400);
}
const user = await User.findOne({ email });

// GOOD: Explicit field extraction — never pass raw body to queries
const blog = await Blog.create({
  title: req.body?.title,
  content: req.body?.content,
  category: req.body?.category,
  author: req.user.id,
});
```

---

## Prototype Pollution Prevention

```javascript
// BAD: Spread or merge untrusted input
const config = { ...JSON.parse(req.body) };
// Payload: {"__proto__": {"isAdmin": true}} pollutes Object.prototype

// GOOD: Explicit field extraction
const { title, content, category } = req.body ?? {};
const blog = { title, content, category };

// GOOD: Reject dangerous keys
const hasDangerousKeys = (obj) =>
  Object.keys(obj).some(key => ['__proto__', 'constructor', 'prototype'].includes(key));

if (hasDangerousKeys(req.body)) {
  return sendError(res, 'Invalid input', 400);
}
```

---

## Graceful Shutdown

```javascript
const server = app.listen(PORT, () => {
  logger.info({ port: PORT }, 'Server started');
});

function gracefulShutdown(signal) {
  logger.info({ signal }, 'Shutdown signal received');

  const forceTimeout = setTimeout(() => {
    logger.error('Forced shutdown — timeout exceeded');
    process.exit(1);
  }, 10_000);

  server.close(async () => {
    clearTimeout(forceTimeout);
    await mongoose.connection.close(false);
    logger.info('Shutdown complete');
    process.exit(0);
  });
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
```

---

## Database Connection Resilience

```javascript
// BAD: No connection options
await mongoose.connect(process.env.MONGODB_URI);

// GOOD: Explicit timeouts and pool settings
await mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  retryWrites: true,
  maxPoolSize: 10,
});

mongoose.connection.on('error', (err) => {
  logger.error({ err }, 'MongoDB connection error');
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});
```

---

## MongoDB Indexing (ESR Rule)

```javascript
// BAD: Index on low-cardinality field alone
blogSchema.index({ isPublished: 1 });

// GOOD: Compound index following Equality → Sort → Range
// Supports: find({ isPublished: true }).sort({ createdAt: -1 })
blogSchema.index({ isPublished: 1, createdAt: -1 });

// GOOD: Compound index for category + date queries
// Supports: find({ category: 'Tech' }).sort({ createdAt: -1 })
blogSchema.index({ category: 1, createdAt: -1 });

// Verify index usage in development
const explanation = await Blog.find({ category: 'Tech' })
  .sort({ createdAt: -1 })
  .explain('executionStats');
// Check: explanation.executionStats.executionStages.stage should be 'IXSCAN'
```

---

## Mongoose 8: Removed Methods

```javascript
// BAD: Removed in Mongoose 8
await Blog.findOneAndRemove({ _id: id });
const total = await Blog.count({ isPublished: true });
const result = await Blog.findOneAndUpdate(filter, update).rawResult();

// GOOD: Mongoose 8 equivalents
await Blog.findOneAndDelete({ _id: id });
const total = await Blog.countDocuments({ isPublished: true });
const result = await Blog.findOneAndUpdate(filter, update).includeResultMetadata();
```

---

## JWT Refresh Token Pattern

```javascript
// BAD: Long-lived access token (days/weeks)
const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '30d' });

// GOOD: Short access + long refresh
const accessToken = jwt.sign(
  { id: user._id, type: 'access' },
  JWT_SECRET,
  { expiresIn: '15m' },
);
const refreshToken = jwt.sign(
  { id: user._id, type: 'refresh', jti: crypto.randomUUID() },
  JWT_SECRET,
  { expiresIn: '7d' },
);

// Store refresh token hash in DB for revocation
await User.findByIdAndUpdate(user._id, {
  refreshTokenHash: await bcrypt.hash(refreshToken, 10),
});
```
