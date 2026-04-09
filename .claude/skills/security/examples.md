# Security Code Examples — Unsafe vs Safe Patterns

Each section shows a vulnerable pattern and its secure replacement, tailored to the Quick Blog stack (React 19, Express 5, MongoDB/Mongoose 8, JWT).

---

## 1. MongoDB NoSQL Injection

### UNSAFE — Operator injection via JSON body

```javascript
// POST /api/admin/login  body: { email: "admin@blog.com", password: { "$gt": "" } }
// The $gt operator makes the query match ANY password

export const adminLogin = async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email, password }) // password could be an operator object!
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
  res.json({ token })
}
```

### SAFE — Type casting + bcrypt comparison

```javascript
export const adminLogin = async (req, res) => {
  const email = String(req.body.email)    // Force string type
  const password = String(req.body.password) // Force string type — neutralizes operators

  const user = await User.findOne({ email, isActive: true })
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid credentials' }) // Same message for both
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d', algorithm: 'HS256' }
  )
  res.json({ success: true, token, user: user.toJSON() })
}
```

**Why it works:** `String({ "$gt": "" })` becomes `"[object Object]"` — a harmless string that won't match any password hash. The real defense is bcrypt comparison, which never puts the password in a query.

---

## 2. Cross-Site Scripting (XSS)

### UNSAFE — Rendering unsanitized HTML content

```jsx
// Blog post content from database (could contain stored XSS)
function BlogPost({ blog }) {
  return (
    <article>
      <h1>{blog.title}</h1>
      {/* VULNERABLE — content could be: <img src=x onerror=alert(document.cookie)> */}
      <div dangerouslySetInnerHTML={{ __html: blog.content }} />
    </article>
  )
}
```

### SAFE — DOMPurify sanitization

```jsx
import DOMPurify from 'dompurify'

function BlogPost({ blog }) {
  // Sanitize once, memoize for performance
  const sanitizedContent = useMemo(
    () => DOMPurify.sanitize(blog.content, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a', 'h2', 'h3', 'blockquote', 'code', 'pre'],
      ALLOWED_ATTR: ['href', 'target', 'rel'],
      ALLOW_DATA_ATTR: false
    }),
    [blog.content]
  )

  return (
    <article>
      <h1>{blog.title}</h1> {/* React auto-escapes this — safe */}
      <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
    </article>
  )
}
```

**Why it works:** DOMPurify strips all script tags, event handlers, and dangerous attributes. The allowlist approach only permits known-safe HTML elements.

---

## 3. URL-Based XSS

### UNSAFE — Rendering user-provided URLs without validation

```jsx
// Comment with a link — user could submit: javascript:alert(document.cookie)
function CommentLink({ url, text }) {
  return <a href={url}>{text}</a>
}
```

### SAFE — Protocol validation

```jsx
function CommentLink({ url, text }) {
  const safeUrl = useMemo(() => {
    try {
      const parsed = new URL(url)
      // Only allow http and https protocols
      return ['http:', 'https:'].includes(parsed.protocol) ? url : '#'
    } catch {
      return '#' // Invalid URL
    }
  }, [url])

  return (
    <a href={safeUrl} rel="noopener noreferrer" target="_blank">
      {text}
    </a>
  )
}
```

**Why it works:** `new URL('javascript:alert(1)')` parses successfully with `protocol: 'javascript:'`, which the allowlist rejects. `rel="noopener noreferrer"` prevents the opened page from accessing `window.opener`.

---

## 4. JWT Implementation

### UNSAFE — Weak secret, no expiry, no algorithm pinning

```javascript
// Secret is short, predictable, and hardcoded
const token = jwt.sign({ userId: user._id }, 'secret123')

// Verification doesn't check algorithm — vulnerable to "none" algorithm attack
const decoded = jwt.decode(token) // decode() does NOT verify! Just parses base64
```

### SAFE — Strong secret, explicit settings

```javascript
// Signing
const token = jwt.sign(
  { userId: user._id, email: user.email, name: user.name, role: user.role },
  process.env.JWT_SECRET, // 256+ bit secret from environment
  {
    expiresIn: '7d',
    algorithm: 'HS256' // Pin algorithm to prevent confusion attacks
  }
)

// Verification — jwt.verify() checks signature AND expiration
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  req.user = decoded
  next()
} catch (err) {
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expired' })
  }
  return res.status(401).json({ error: 'Invalid token' })
}
```

**Why it works:** `jwt.verify()` cryptographically validates the signature (unlike `jwt.decode()` which just parses). Pinning `algorithm: 'HS256'` prevents the "none" algorithm attack where an attacker forges tokens with no signature.

---

## 5. File Upload Validation

### UNSAFE — No validation, user-controlled filename

```javascript
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, file.originalname) // User controls filename: "../../etc/passwd"
  }
})

const upload = multer({ storage }) // No file filter, no size limit
```

### SAFE — Full validation pipeline

```javascript
import multer from 'multer'
import path from 'path'
import crypto from 'crypto'
import fs from 'fs'

const uploadDir = 'uploads/blogs'
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    // Server-generated name — unpredictable, no traversal possible
    const uniqueName = `blog-${Date.now()}-${crypto.randomInt(100000000, 999999999)}`
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${uniqueName}${ext}`)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false)
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 1                    // Single file only
  }
})
```

**Why it works:** Server-generated filenames eliminate path traversal. MIME type allowlisting blocks executables. Size limits prevent storage abuse. The `files: 1` limit prevents multipart abuse.

---

## 6. Auth Middleware — Missing Checks

### UNSAFE — Incomplete auth with fail-open

```javascript
export const auth = (req, res, next) => {
  const token = req.headers.authorization
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
  } catch (err) {
    console.log('Auth error') // Logs but doesn't return!
  }
  next() // ALWAYS calls next — even when auth fails!
}
```

### SAFE — Fail-closed with specific error messages

```javascript
export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'No token provided' })
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next() // Only reaches here if verification succeeds
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' })
    }
    return res.status(401).json({ success: false, message: 'Invalid token' })
  }
}
```

**Why it works:** The `return` before each error response ensures `next()` is only called on successful verification. This is the fail-closed pattern — errors deny access rather than granting it.

---

## 7. Error Handling — Stack Trace Leak

### UNSAFE — Exposing internals to client

```javascript
app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,     // Could reveal: "Cannot read property of undefined at /app/server/src/..."
    stack: err.stack,       // Full file paths, line numbers, dependency versions
    query: req.query,       // Could echo back malicious input
    env: process.env.NODE_ENV // Confirms environment to attacker
  })
})
```

### SAFE — Generic client response, detailed internal logging

```javascript
app.use((err, req, res, next) => {
  // Log full details internally
  logger.error({
    event: 'unhandled_error',
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userId: req.user?.userId
  })

  // Send minimal info to client
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? 'Internal Server Error' : err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})
```

**Why it works:** Production clients see a generic message. Stack traces are only included in development mode. Full error details are logged server-side for debugging.

---

## 8. Access Control — IDOR

### UNSAFE — No ownership check

```javascript
// DELETE /api/blog/delete/123 — any authenticated user can delete any blog
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id)
  if (!blog) return res.status(404).json({ error: 'Blog not found' })
  res.json({ success: true, message: 'Blog deleted' })
})
```

### SAFE — Verify ownership or admin role

```javascript
export const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(404).json({ success: false, message: 'Blog not found' })
  }

  // Authorization: only the author or an admin can delete
  const isOwner = blog.author.toString() === req.user.userId
  const isAdmin = req.user.role === 'admin'
  if (!isOwner && !isAdmin) {
    return res.status(403).json({ success: false, message: 'Not authorized' })
  }

  // Clean up uploaded image
  if (blog.image) {
    const filename = path.basename(blog.image)
    const filePath = path.resolve('uploads/blogs', filename)
    if (filePath.startsWith(path.resolve('uploads/blogs'))) {
      fs.unlink(filePath, (err) => {
        if (err) logger.error({ event: 'file_delete_failed', filename, error: err.message })
      })
    }
  }

  await blog.deleteOne()
  res.json({ success: true, message: 'Blog deleted' })
})
```

**Why it works:** Separating the find and delete operations allows an ownership check in between. The `.toString()` on ObjectId ensures proper comparison. Admin role provides an escape hatch for moderation.

---

## 9. Password Storage

### UNSAFE — Reversible or weak hashing

```javascript
// MD5 — broken, rainbow tables exist for all common passwords
import crypto from 'crypto'
const hash = crypto.createHash('md5').update(password).digest('hex')

// SHA-256 — fast hash, not designed for passwords (billions per second on GPU)
const hash = crypto.createHash('sha256').update(password).digest('hex')

// Plain text — the worst option
user.password = req.body.password
```

### SAFE — bcrypt with pre-save hook

```javascript
import bcrypt from 'bcryptjs'

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

// CRITICAL — never return password in API responses
userSchema.methods.toJSON = function() {
  const obj = this.toObject()
  delete obj.password
  return obj
}
```

**Why it works:** bcrypt is purposefully slow (~100ms per hash at cost 10), making brute force infeasible. The pre-save hook ensures every password write goes through hashing. `toJSON` strips the hash from all API responses automatically.

---

## 10. CORS Configuration

### UNSAFE — Wildcard with credentials

```javascript
// Browsers actually reject this combination, but it shows the wrong mindset
app.use(cors({
  origin: '*',
  credentials: true
}))

// Even worse — reflect the requester's origin (any site can make credentialed requests)
app.use(cors({
  origin: true,
  credentials: true
}))
```

### SAFE — Explicit allowlist with validation

```javascript
const allowedOrigins = [
  process.env.CLIENT_URL,   // Production frontend URL
  ...(process.env.NODE_ENV === 'development'
    ? ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175']
    : [])
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
```

**Why it works:** Only explicitly listed origins can make credentialed cross-origin requests. Development origins are only included when `NODE_ENV` is `development`. The `filter(Boolean)` removes undefined values if `CLIENT_URL` isn't set.

---

## 11. Command Injection

### UNSAFE — Shell execution with user input

```javascript
import { exec } from 'child_process'

// Image processing with user-controlled filename
// Attacker uploads file named: "image.jpg; rm -rf /"
export const processImage = (req, res) => {
  exec(`convert uploads/${req.file.originalname} -resize 800x600 output.jpg`, (err) => {
    if (err) return res.status(500).json({ error: 'Processing failed' })
    res.json({ success: true })
  })
}
```

### SAFE — execFile with argument array

```javascript
import { execFile } from 'child_process'

export const processImage = (req, res) => {
  const inputPath = path.join('uploads/blogs', path.basename(req.file.filename))
  const outputPath = path.join('uploads/blogs', `thumb-${req.file.filename}`)

  // execFile does NOT spawn a shell — semicolons, pipes, etc. are treated as literal characters
  execFile('convert', [inputPath, '-resize', '800x600', outputPath], (err) => {
    if (err) return res.status(500).json({ error: 'Processing failed' })
    res.json({ success: true })
  })
}
```

**Why it works:** `execFile` passes arguments directly to the process without shell interpretation. Characters like `;`, `|`, `&&`, and backticks are treated as literal text, not shell metacharacters.

---

## 12. Rate Limiting

### UNSAFE — No rate limiting on sensitive endpoint

```javascript
// Login endpoint with no rate limit — attacker can try millions of passwords
adminRouter.post('/login', adminLogin)

// Comment endpoint with no rate limit — bot can flood with spam
blogRouter.post('/add-comment', validateComment, addComment)
```

### SAFE — Endpoint-specific rate limiters

```javascript
import rateLimit from 'express-rate-limit'

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,                    // 5 attempts
  message: { success: false, message: 'Too many login attempts, try again in 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false
})

export const commentLimiter = rateLimit({
  windowMs: 60 * 1000,  // 1 minute
  max: 5,                // 5 comments
  message: { success: false, message: 'Too many comments, slow down' },
  standardHeaders: true,
  legacyHeaders: false
})

// Applied in routes
adminRouter.post('/login', loginLimiter, adminLogin)
blogRouter.post('/add-comment', commentLimiter, validateComment, addComment)
```

**Why it works:** `express-rate-limit` tracks requests per IP address within a time window. The `standardHeaders: true` option returns `RateLimit-*` headers so clients know their remaining quota. Different endpoints get different limits based on their abuse potential.

---

## 13. Input Validation

### UNSAFE — Raw request body used directly

```javascript
export const addBlog = asyncHandler(async (req, res) => {
  // No validation — title could be empty, category could be anything
  const blog = await Blog.create({
    ...req.body,           // Mass assignment — client could send { role: 'admin', isPublished: true }
    author: req.user.userId
  })
  res.status(201).json({ success: true, blog })
})
```

### SAFE — Explicit field extraction with validation middleware

```javascript
// Validator middleware
export const validateBlogInput = (req, res, next) => {
  const errors = []
  const { title, description, category } = req.body

  if (!title || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters')
  }
  if (!description || description.trim().length < 10) {
    errors.push('Description must be at least 10 characters')
  }
  if (!category) {
    errors.push('Category is required')
  }
  if (!req.file) {
    errors.push('Blog image is required')
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors })
  }
  next()
}

// Controller — explicit field extraction
export const addBlog = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body // Only extract expected fields

  const blog = await Blog.create({
    title: title.trim(),
    description: description.trim(),
    category,
    image: `/uploads/blogs/${req.file.filename}`,
    author: req.user.userId,
    authorName: req.user.name
  })
  res.status(201).json({ success: true, blog })
})
```

**Why it works:** The validation middleware rejects invalid input before the controller runs. Explicit field destructuring prevents mass assignment — only the expected fields are passed to `Blog.create()`. Server-side validation catches anything that bypasses client-side checks.

---

## 14. Sensitive Data in Logs

### UNSAFE — Logging full request bodies

```javascript
// Logs everything including passwords, tokens, and personal data
app.use((req, res, next) => {
  console.log('Request:', {
    method: req.method,
    url: req.url,
    body: req.body, // { email: "user@test.com", password: "MyS3cretP@ss!" }
    headers: req.headers // { authorization: "Bearer eyJhbGciOi..." }
  })
  next()
})
```

### SAFE — Redact sensitive fields

```javascript
const SENSITIVE_FIELDS = ['password', 'token', 'secret', 'authorization', 'creditCard', 'ssn']

const redactBody = (body) => {
  if (!body || typeof body !== 'object') return body
  const redacted = { ...body }
  for (const field of SENSITIVE_FIELDS) {
    if (redacted[field]) redacted[field] = '***'
  }
  return redacted
}

const redactHeaders = (headers) => {
  const redacted = { ...headers }
  if (redacted.authorization) redacted.authorization = 'Bearer ***'
  if (redacted.cookie) redacted.cookie = '***'
  return redacted
}

app.use((req, res, next) => {
  logger.info({
    event: 'http_request',
    method: req.method,
    url: req.url,
    ip: req.ip,
    body: redactBody(req.body),
    userAgent: req.headers['user-agent']
    // Don't log full headers — they contain tokens
  })
  next()
})
```

**Why it works:** Sensitive fields are replaced with `***` before logging. Authorization headers are masked. The logger only captures what's needed for debugging, not the full request dump.

---

## 15. Mass Assignment Prevention

### UNSAFE — Spreading entire request body

```javascript
// User registration — attacker sends: { email, password, role: 'admin', isActive: true }
export const register = asyncHandler(async (req, res) => {
  const user = await User.create(req.body) // Accepts ANY field including role!
  res.status(201).json({ success: true, user })
})
```

### SAFE — Explicit field extraction

```javascript
export const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body // Only expected fields

  const user = await User.create({
    email,
    password,
    name
    // role defaults to 'author' via schema
    // isActive defaults to true via schema
  })

  res.status(201).json({ success: true, user: user.toJSON() })
})
```

**Why it works:** By destructuring only the expected fields, any extra fields sent by the client (like `role` or `isActive`) are silently ignored. Schema defaults handle the rest.

---

## 16. MongoDB Regex Injection (ReDoS)

### UNSAFE — User input directly in regex

```javascript
// Search endpoint — attacker sends: query = "(a+)+"
export const searchBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({
    title: new RegExp(req.query.q, 'i') // ReDoS: catastrophic backtracking
  })
  res.json({ success: true, blogs })
})
```

### SAFE — Escape special regex characters

```javascript
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const searchBlogs = asyncHandler(async (req, res) => {
  const query = String(req.query.q || '').slice(0, 100) // Type cast + length limit
  const blogs = await Blog.find({
    title: new RegExp(escapeRegex(query), 'i') // Special chars escaped
  }).limit(20)

  res.json({ success: true, blogs })
})
```

**Why it works:** `escapeRegex` neutralizes all regex metacharacters, preventing an attacker from crafting a pattern that causes catastrophic backtracking. The length limit adds defense in depth. `.limit(20)` prevents memory exhaustion from large result sets.
