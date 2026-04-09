---
name: security
description: "Web application security best practices based on OWASP Top 10:2025. Use when reviewing code for vulnerabilities, implementing auth/authorization, handling user input, working with file uploads, managing secrets, or building API endpoints. Covers React, Express, MongoDB, and JWT security."
---

# Security Best Practices — OWASP Top 10:2025

Comprehensive security guidance for full-stack web applications. Combines the OWASP Top 10:2025 taxonomy, ASVS 5.0 verification requirements, and Agentic AI security standards (OWASP 2026). Tailored for React + Express + MongoDB + JWT stacks.

See `examples.md` for unsafe/safe code pairs. See `checklists.md` for quick-reference checklists. See `references.md` for all sources.

---

## 1. Core Philosophy — Confidence-Based Security Review

Security analysis must be evidence-based, not pattern-matching. Before flagging any issue, **trace the data flow** and confirm the input source.

### Confidence Levels

| Level | Criteria | Action |
|-------|----------|--------|
| **HIGH** | Vulnerable pattern + attacker-controlled input confirmed | **Report** — include file, line, exploit scenario, and fix |
| **MEDIUM** | Vulnerable pattern, but input source unclear | **Note** — flag for manual verification, explain uncertainty |
| **LOW** | Theoretical or best-practice deviation only | **Do not report** as a finding — mention in recommendations if asked |

### What NOT to Flag

These patterns are **safe** and should not be reported as vulnerabilities:

- **Test files** — Unless they test security-specific functionality
- **Dead or commented code** — Flag for removal, not as a vulnerability
- **Server-controlled values** — Environment variables, config constants, hardcoded server URLs
- **Framework-mitigated patterns** — React's default JSX escaping, Mongoose's parameterized queries, Express middleware that sanitizes upstream
- **Development-only code** — Debug logging gated by `NODE_ENV === 'development'`

### The Golden Rule

> `requests.get(process.env.API_URL)` is **safe** (server-controlled).
> `requests.get(req.query.url)` is **vulnerable** (attacker-controlled).
>
> Always ask: **"Can an attacker control this value?"**

---

## 2. OWASP Top 10:2025 — Quick Reference

| # | Category | Stack Relevance | Key Risk |
|---|----------|-----------------|----------|
| A01 | **Broken Access Control** | Express middleware, MongoDB queries, React routes | Missing auth/authz on endpoints, IDOR |
| A02 | **Security Misconfiguration** | Helmet, CORS, Express error handler, Vite env | Default configs, debug mode in prod |
| A03 | **Supply Chain Failures** | npm dependencies, Vite plugins | Compromised packages, typosquatting |
| A04 | **Cryptographic Failures** | bcrypt, JWT secrets, TLS | Weak hashing, exposed secrets |
| A05 | **Injection** | MongoDB queries, React rendering, child_process | NoSQL injection, XSS, command injection |
| A06 | **Insecure Design** | API rate limiting, AI content generation | Missing threat model, no rate limits |
| A07 | **Authentication Failures** | JWT implementation, bcrypt, login flow | Weak tokens, brute force, credential stuffing |
| A08 | **Software/Data Integrity** | JSON parsing, Mongoose schemas, Multer | Unsafe deserialization, unvalidated uploads |
| A09 | **Logging & Alerting Failures** | Express request logging, audit trails | Missing auth event logs, sensitive data in logs |
| A10 | **Exceptional Conditions** | Express error middleware, MongoDB connection | Stack trace leaks, fail-open errors |

---

## 3. A01 — Broken Access Control

The #1 web application vulnerability. 3.73% of tested applications affected (OWASP 2025 data, 40 CWEs).

### Rules

1. **Deny by default** — Every route is protected unless explicitly marked public
2. **Verify on every request** — Never trust client-side auth state alone
3. **Check ownership, not just authentication** — Being logged in does not mean access to all resources
4. **Use middleware chains** — Auth → Authorization → Validation → Controller

### Express Middleware Pattern

Routes must apply auth middleware **before** any protected handler:

```javascript
// CORRECT — auth applied as middleware barrier
router.get('/all', getAllBlogs)              // Public
router.post('/add-comment', addComment)      // Public
router.use(auth)                             // ← Auth barrier
router.post('/add', addBlog)                 // Protected
router.delete('/delete/:id', deleteBlog)     // Protected
```

```javascript
// WRONG — auth applied per-route but easy to forget
router.post('/add', auth, addBlog)           // Works but fragile
router.delete('/delete/:id', deleteBlog)     // Forgot auth!
```

### IDOR Prevention (Insecure Direct Object Reference)

When a user requests a resource by ID, always verify ownership:

```javascript
// VULNERABLE — any authenticated user can delete any blog
const blog = await Blog.findByIdAndDelete(req.params.id)

// SECURE — verify ownership before action
const blog = await Blog.findById(req.params.id)
if (!blog) return res.status(404).json({ error: 'Not found' })
if (blog.author.toString() !== req.user.userId && req.user.role !== 'admin') {
  return res.status(403).json({ error: 'Not authorized' })
}
await blog.deleteOne()
```

### React Route Protection

Client-side route guards are a UX convenience, not a security boundary. The server MUST enforce all access control.

```jsx
// UX guard only — prevents UI flash, not unauthorized access
<Route element={<ProtectedRoute />}>
  <Route path="/admin/*" element={<AdminPanel />} />
</Route>
```

### Checklist

- [ ] Every admin/author endpoint has `auth` middleware
- [ ] Resource operations verify ownership (not just authentication)
- [ ] Role checks use server-side `req.user.role`, not client claims
- [ ] API responses exclude data the user shouldn't see (filter fields)
- [ ] Horizontal privilege escalation tested (user A accessing user B's resources)
- [ ] Vertical privilege escalation tested (author accessing admin endpoints)

---

## 4. A02 — Security Misconfiguration

Moved from #5 to #2 in 2025. 3.00% of tested applications affected (16 CWEs).

### Helmet.js Configuration

Helmet sets secure HTTP headers. Critical settings:

```javascript
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // Required for serving uploads
  contentSecurityPolicy: false // Only disable if you have a custom CSP
}))
```

**If CSP is disabled**, you MUST implement a custom Content-Security-Policy header that at minimum:
- Restricts `script-src` to `'self'` (no inline scripts without nonce)
- Restricts `connect-src` to known API origins
- Sets `frame-ancestors 'none'` to prevent clickjacking

### CORS Configuration

```javascript
// SECURE — explicit origin allowlist with validation
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173' // Development only
].filter(Boolean)

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
```

```javascript
// VULNERABLE — never do this in production
app.use(cors({ origin: '*', credentials: true }))
// credentials: true + origin: * is rejected by browsers,
// but origin: true (reflect requester) with credentials is equally dangerous
```

### Express Error Handler

```javascript
// SECURE — stack traces only in development
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})
```

### Vite Environment Variable Exposure

Vite exposes all `VITE_` prefixed env vars to the client bundle. They are embedded in the JavaScript at build time and visible to anyone.

```bash
# SAFE — server-side only (not in client bundle)
JWT_SECRET=my-secret
MONGODB_URI=mongodb://...
GEMINI_API_KEY=AIza...

# EXPOSED TO CLIENT — treat as public, never put secrets here
VITE_API_URL=http://localhost:3000/api
```

**Rule**: Never prefix a secret with `VITE_`. If the client needs to call an API that requires authentication, proxy through your Express server.

### MongoDB Connection Security

```javascript
// REQUIRED checks
if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined')
}

// RECOMMENDED — connection timeout to fail fast
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000
})
```

In production:
- Use MongoDB authentication (username/password or x.509 certificates)
- Enable TLS for MongoDB connections (`tls: true`)
- Use IP allowlisting or VPC peering
- Never expose MongoDB port (27017) to the internet

### Checklist

- [ ] Helmet enabled with appropriate policy
- [ ] CORS uses explicit origin allowlist (not wildcard)
- [ ] Error handler hides stack traces in production
- [ ] No `VITE_` prefixed secrets in client code
- [ ] MongoDB connection uses auth and TLS in production
- [ ] `NODE_ENV=production` set in production
- [ ] Debug/dev middleware disabled in production
- [ ] Default credentials changed (seed users, admin passwords)

---

## 5. A03 — Supply Chain Failures

New expanded category in 2025 (formerly part of A08). Covers compromised dependencies, build systems, and distribution infrastructure (5 CWEs).

### npm Dependency Security

```bash
# Regular audit — run before every release
npm audit

# Fix automatically where possible
npm audit fix

# Check for known vulnerabilities in production deps only
npm audit --production
```

### Rules

1. **Lock files are security artifacts** — Always commit `package-lock.json`. Review lockfile changes in PRs.
2. **Pin exact versions for critical deps** — Use `"express": "5.0.1"` not `"express": "^5.0.1"` for security-sensitive packages
3. **Review new dependencies before adding** — Check: maintenance activity, download count, known vulnerabilities, what it accesses (network, filesystem, env vars)
4. **Avoid deep dependency trees** — Each transitive dependency is an attack surface
5. **Never run `postinstall` scripts blindly** — Malicious packages often use install scripts for code execution

### Dependency Review Checklist

Before adding a new dependency:
- [ ] Does it have known CVEs? (check `npm audit`, Snyk, or GitHub advisories)
- [ ] Is it actively maintained? (last commit < 6 months)
- [ ] Does it have a reasonable number of downloads? (> 10K/week for production deps)
- [ ] What permissions does it need? (filesystem, network, env vars)
- [ ] Can you achieve the same thing with built-in Node.js APIs?
- [ ] Is the package name correct? (watch for typosquatting: `expres` vs `express`)

### Vite Plugin Security

Vite plugins run during build with full Node.js access. A compromised plugin can:
- Read environment variables (including secrets)
- Modify built output (inject malicious scripts)
- Exfiltrate source code

Only use well-known Vite plugins from verified publishers.

---

## 6. A04 — Cryptographic Failures

Dropped from #2 to #4 in 2025. 3.80% of tested applications affected (32 CWEs).

### Password Hashing

```javascript
// SECURE — bcrypt with sufficient cost factor
import bcrypt from 'bcryptjs'

const salt = await bcrypt.genSalt(10) // Cost factor 10 = ~100ms per hash
const hash = await bcrypt.hash(password, salt)

// Verification
const isMatch = await bcrypt.compare(candidatePassword, hash)
```

**Cost factor guidance:**
- **10** — Minimum acceptable (current project default). Good for most applications.
- **12** — Recommended for high-value targets. ~400ms per hash.
- **Never below 10** — Below 10 is too fast and vulnerable to brute force.

**Never use** for password storage: MD5, SHA-1, SHA-256 (even with salt), plain text.

**Preferred algorithms** (in order): Argon2id > bcrypt > scrypt > PBKDF2

### JWT Secret Management

```javascript
// VULNERABLE — weak, hardcoded, or short secret
const token = jwt.sign(payload, 'secret123', { expiresIn: '7d' })

// SECURE — strong secret from environment, reasonable expiry
const token = jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: '7d',
  algorithm: 'HS256' // Explicitly set algorithm
})
```

**JWT Rules:**
1. Secret must be at least 256 bits (32 bytes) of cryptographically random data
2. Store in environment variable, never in code
3. Set explicit expiration (`expiresIn`)
4. Explicitly set the `algorithm` parameter to prevent algorithm confusion attacks
5. Validate the `iss` (issuer) and `aud` (audience) claims when applicable
6. Never store sensitive data in the JWT payload (it's base64, not encrypted)
7. Implement token refresh for long-lived sessions instead of very long expiry

### Data in Transit

- **Always use HTTPS** in production (terminate TLS at load balancer or reverse proxy)
- Set `Strict-Transport-Security` header (done by Helmet)
- Use `secure: true` on cookies in production
- Never transmit credentials over HTTP

### Data at Rest

- Encrypt sensitive fields in MongoDB if required (MongoDB Client-Side Field Level Encryption)
- Never store raw credit card numbers, SSNs, or other PII without encryption
- Use environment variables or secret managers for API keys, not config files

---

## 7. A05 — Injection

Fell from #3 to #5 in 2025 but still critical. 38 CWEs, ranging from XSS (high frequency) to SQL injection (high impact).

### MongoDB NoSQL Injection

MongoDB is vulnerable to operator injection when user input is passed directly to query operators.

```javascript
// VULNERABLE — attacker can send { "$gt": "" } as password
const user = await User.findOne({
  email: req.body.email,
  password: req.body.password  // If body is parsed as JSON, this could be an object
})

// SECURE — explicitly cast to string, use bcrypt for password comparison
const user = await User.findOne({ email: String(req.body.email) })
if (!user || !(await bcrypt.compare(String(req.body.password), user.password))) {
  return res.status(401).json({ error: 'Invalid credentials' })
}
```

**MongoDB Injection Vectors:**
- `$gt`, `$ne`, `$regex` — Operator injection via JSON body
- `$where` — JavaScript execution in query (NEVER use with user input)
- `$expr`, `$function` — Server-side JavaScript execution
- Regex injection — `new RegExp(userInput)` can cause ReDoS

**Prevention:**
1. Always validate/cast input types explicitly (`String()`, `Number()`, `mongoose.Types.ObjectId()`)
2. Use Mongoose schemas with strict type definitions
3. Never use `$where` with user-controlled data
4. Never construct regex from user input without escaping
5. Use `mongo-sanitize` or manually strip keys starting with `$` from user input

### Cross-Site Scripting (XSS)

React escapes JSX expressions by default, but there are escape hatches:

```jsx
// SAFE — React auto-escapes this
<p>{userComment}</p>

// VULNERABLE — bypasses React's escaping
<div dangerouslySetInnerHTML={{ __html: userContent }} />

// VULNERABLE — URL-based XSS
<a href={userProvidedUrl}>Click</a>  // Could be javascript:alert(1)
```

**XSS Prevention Rules:**
1. Never use `dangerouslySetInnerHTML` with user-generated content without sanitization
2. If you must render HTML (e.g., blog content from rich text editor), sanitize with DOMPurify:
   ```javascript
   import DOMPurify from 'dompurify'
   <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />
   ```
3. Validate URLs before rendering in `href` or `src` — reject `javascript:` protocol
4. Set CSP headers to mitigate impact of any XSS that slips through
5. For stored content (blog posts, comments), sanitize on input AND output

**Stored XSS in Blog Content:**
Blog posts with rich text or AI-generated content are high-risk for stored XSS. The content is saved to MongoDB and rendered to all visitors. Always sanitize before storage and before rendering.

### Command Injection

```javascript
// VULNERABLE — shell injection
import { exec } from 'child_process'
exec(`convert ${req.file.path} -resize 800x600 output.jpg`) // filename could contain ; rm -rf /

// SECURE — use execFile with argument array (no shell interpretation)
import { execFile } from 'child_process'
execFile('convert', [req.file.path, '-resize', '800x600', 'output.jpg'])
```

**Rule**: Never use `exec()` or `spawn()` with `shell: true` when any argument contains user input. Use `execFile()` or `spawn()` without shell.

### Checklist

- [ ] MongoDB queries use explicit type casting for user input
- [ ] No `$where` or `$function` with user-controlled data
- [ ] No `dangerouslySetInnerHTML` without DOMPurify sanitization
- [ ] URLs validated before rendering in `href`/`src` attributes
- [ ] No `exec()` with string interpolation from user input
- [ ] Blog content sanitized before storage and rendering
- [ ] Comment content escaped/sanitized before display
- [ ] Search queries escaped before use in MongoDB regex

---

## 8. A06 — Insecure Design

Slipped from #4 to #6 in 2025. Focuses on missing threat models and security controls in the design phase.

### Rate Limiting Strategy

Different endpoints need different limits based on their abuse potential:

| Endpoint Type | Limit | Window | Rationale |
|---------------|-------|--------|-----------|
| Login | 5 requests | 15 min | Brute force prevention |
| Registration | 3 requests | 1 hour | Account spam prevention |
| Comments | 5 requests | 1 min | Comment spam prevention |
| AI Generation | 3 requests | 1 min | Cost + abuse prevention |
| General API | 100 requests | 1 min | DDoS mitigation |
| File Upload | 10 requests | 1 min | Storage abuse prevention |

```javascript
import rateLimit from 'express-rate-limit'

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many login attempts, try again in 15 minutes' },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false
})
```

### AI Content Generation — SSRF Risk

When the application calls external AI APIs (e.g., Google Gemini) based on user-provided prompts:

1. **Never pass user input directly as URLs** to the AI API
2. **Validate AI-generated content** before storing — it could contain XSS payloads, malicious links, or prompt injection artifacts
3. **Set timeouts** on AI API calls to prevent hanging requests
4. **Rate limit AI endpoints** aggressively (cost and abuse prevention)
5. **Log AI interactions** for audit trail and abuse detection

### Comment Spam Prevention

- Rate limit comment submissions per IP
- Validate comment length (minimum and maximum)
- Consider honeypot fields for bot detection
- Sanitize comment content before storage
- Implement comment moderation (isApproved flag)

### Threat Model — Blog Application

| Asset | Threats | Controls |
|-------|---------|----------|
| User credentials | Brute force, credential stuffing | Rate limiting, bcrypt, account lockout |
| Blog content | XSS injection, unauthorized modification | Input sanitization, auth middleware, IDOR checks |
| File uploads | Malicious files, path traversal, storage abuse | MIME validation, size limits, safe naming |
| Admin panel | Unauthorized access, privilege escalation | JWT auth, role checks, CORS restriction |
| AI generation | Prompt injection, cost abuse, SSRF | Rate limiting, output sanitization, input validation |
| Comments | Spam, XSS, phishing links | Rate limiting, sanitization, moderation |
| API keys | Exposure, unauthorized use | Environment variables, .gitignore, rotation |

---

## 9. A07 — Authentication Failures

Retained #7 position in 2025. 36 CWEs related to identification and authentication weaknesses.

### JWT Implementation Rules

1. **Token Structure**: `{ userId, email, name, role }` — minimum viable claims
2. **Expiration**: 7 days maximum for access tokens. Use refresh tokens for longer sessions.
3. **Algorithm**: Explicitly set `HS256` (symmetric) or `RS256` (asymmetric). Never allow `none`.
4. **Secret Strength**: Minimum 256-bit (32 bytes) cryptographically random value
5. **Extraction**: Support `Bearer <token>` format from Authorization header
6. **Verification**: Always verify with `jwt.verify()`, never just `jwt.decode()`
7. **Error Handling**: Return 401 with specific message for expired vs invalid tokens
8. **Payload**: Never store sensitive data (passwords, full SSN, credit card) in JWT

### Token Verification Pattern

```javascript
// SECURE — proper JWT verification middleware
export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : authHeader

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
}
```

### Login Security

```javascript
// SECURE login pattern
const user = await User.findOne({ email, isActive: true })
if (!user || !(await user.comparePassword(password))) {
  // Generic message prevents username enumeration
  return res.status(401).json({ error: 'Invalid credentials' })
}
```

**Rules:**
- Always use the same error message for "user not found" and "wrong password"
- Check `isActive` flag to prevent login to deactivated accounts
- Apply `loginLimiter` middleware to login endpoint
- Never return the password hash in any API response
- Use `toJSON` transform on User model to strip password field

### Brute Force Protection

```javascript
// Applied to login route
adminRouter.post('/login', loginLimiter, adminLogin)
```

Consider also:
- Account lockout after N failed attempts (with admin unlock)
- Progressive delays between attempts
- CAPTCHA after N failed attempts
- IP-based blocking for distributed attacks

### Password Requirements

- **Minimum length**: 6 characters (current project) — consider increasing to 8-12 for production
- **Check against breached password lists** (HIBP API) for high-security apps
- **Never limit maximum length** below 128 characters (bcrypt truncates at 72 bytes)
- **Never restrict character types** — allow all Unicode characters
- **Hash on the server** — never send pre-hashed passwords from the client

---

## 10. A08 — Software and Data Integrity Failures

Maintained #8 ranking. Focuses on trust boundary failures.

### Mongoose Schema Validation

Mongoose schemas are your first line of defense for data integrity:

```javascript
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'author'], // Prevent arbitrary role assignment
    default: 'author'
  }
})
```

**Rules:**
- Define `enum` for fields with fixed values (role, status, category)
- Set `required` on mandatory fields
- Use `minlength`/`maxlength` for string constraints
- Apply `lowercase`/`trim` transforms for consistent data
- Never trust client-sent role or permission values

### Mass Assignment Prevention

```javascript
// VULNERABLE — accepts any field from request body
const user = await User.create(req.body) // Attacker could send { role: 'admin' }

// SECURE — explicit field selection
const user = await User.create({
  email: req.body.email,
  password: req.body.password,
  name: req.body.name
  // role defaults to 'author' via schema
})
```

### File Upload Integrity (Multer)

```javascript
// SECURE — validate MIME type AND file extension
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP allowed.'), false)
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
})
```

**MIME types can be spoofed.** For high-security applications, also check file magic bytes (file signatures) using a library like `file-type`.

### Content Security Policy

CSP headers prevent inline script execution, mitigating XSS impact:

```javascript
// Recommended CSP for this project
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // Required for Tailwind
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", process.env.CLIENT_URL],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"]
    }
  }
}))
```

---

## 11. A09 — Security Logging and Alerting Failures

Held #9 position. 5 CWEs. Emphasizes alerting functionality.

### What to Log

| Event | Priority | Data to Capture |
|-------|----------|-----------------|
| Login success | HIGH | User ID, IP, timestamp |
| Login failure | HIGH | Email attempted, IP, timestamp, reason |
| Auth token rejection | HIGH | Token type (expired/invalid), IP |
| Admin actions | HIGH | User ID, action, target resource, timestamp |
| File upload | MEDIUM | User ID, filename, size, MIME type |
| Rate limit triggered | MEDIUM | IP, endpoint, limit exceeded |
| Server errors (5xx) | HIGH | Error message, stack (internal only), request details |
| Permission denied (403) | HIGH | User ID, attempted resource, IP |

### What NEVER to Log

- Passwords (even hashed)
- Full JWT tokens
- Credit card numbers
- Session secrets
- API keys
- Personal identification numbers (SSN, etc.)

### Sensitive Data Redaction Pattern

```javascript
// SECURE — redact sensitive fields before logging
const sanitizeBody = (body) => {
  if (!body) return body
  const sanitized = { ...body }
  const sensitiveFields = ['password', 'token', 'secret', 'authorization', 'creditCard']
  for (const field of sensitiveFields) {
    if (sanitized[field]) sanitized[field] = '***'
  }
  return sanitized
}

// In HTTP logger middleware
logger.info({
  method: req.method,
  url: req.url,
  ip: req.ip,
  body: sanitizeBody(req.body),
  status: res.statusCode,
  duration: `${Date.now() - start}ms`
})
```

### Structured Logging

Use structured (JSON) logging for production — it's searchable, parseable, and integrates with log aggregation tools:

```javascript
// PREFERRED — structured JSON
logger.info({ event: 'login_success', userId: user._id, ip: req.ip })

// AVOID — unstructured string
logger.info(`User ${user._id} logged in from ${req.ip}`)
```

---

## 12. A10 — Mishandling of Exceptional Conditions

New in 2025. 24 CWEs for improper error handling, logical errors, and failing open.

### Fail-Closed Pattern

Errors should **deny access**, not grant it:

```javascript
// VULNERABLE — fail-open (error grants access)
try {
  const decoded = jwt.verify(token, secret)
  req.user = decoded
} catch (err) {
  // Missing return! Falls through to next() and grants access
  console.error('Token error:', err)
}
next()

// SECURE — fail-closed (error denies access)
try {
  const decoded = jwt.verify(token, secret)
  req.user = decoded
  next()
} catch (err) {
  return res.status(401).json({ error: 'Authentication failed' })
}
```

### Express Global Error Handler

```javascript
// Catch-all for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// Global error handler (MUST have 4 parameters)
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})
```

### Async Error Handling

Every async controller must catch errors. Use a wrapper to avoid repetitive try-catch:

```javascript
// asyncHandler wraps controller to catch Promise rejections
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next)
}

// Usage
export const getAllBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ isPublished: true })
  res.json({ success: true, blogs })
})
// No try-catch needed — errors automatically forwarded to global error handler
```

### MongoDB Connection Error Handling

```javascript
// SECURE — fail fast, don't serve requests without database
mongoose.connection.on('error', (err) => {
  logger.error({ event: 'db_error', error: err.message })
})

mongoose.connection.on('disconnected', () => {
  logger.warn({ event: 'db_disconnected' })
})

// Connection with timeout
await mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000
})
```

### Error Information Disclosure

| Environment | Show to Client | Log Internally |
|-------------|---------------|----------------|
| Development | Full error + stack trace | Full error + stack trace |
| Production | Generic message only | Full error + stack trace + request context |

---

## 13. File Upload Security

File uploads are a critical attack surface combining multiple vulnerability classes.

### Complete Secure Upload Configuration

```javascript
import multer from 'multer'
import path from 'path'
import crypto from 'crypto'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/blogs/') // Dedicated directory outside web root if possible
  },
  filename: (req, file, cb) => {
    // Unpredictable filename prevents enumeration
    const uniqueName = `blog-${Date.now()}-${crypto.randomInt(100000000, 999999999)}`
    cb(null, `${uniqueName}${path.extname(file.originalname).toLowerCase()}`)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type'), false)
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1                    // Single file only
  }
})
```

### Path Traversal Prevention

```javascript
// VULNERABLE — user-controlled filename
const filePath = path.join('uploads', req.body.filename) // Could be ../../../etc/passwd

// SECURE — extract only the basename, discard any directory components
const safeName = path.basename(req.file.filename) // Strips directory traversal
const filePath = path.join('uploads/blogs', safeName)
```

### File Deletion Safety

```javascript
// SECURE — validate file is within expected directory before deletion
const deleteUploadedFile = (fileUrl) => {
  const filename = path.basename(fileUrl)
  const filePath = path.join('uploads/blogs', filename)
  const resolvedPath = path.resolve(filePath)
  const uploadsDir = path.resolve('uploads/blogs')

  // Ensure resolved path is within uploads directory
  if (!resolvedPath.startsWith(uploadsDir)) {
    throw new Error('Invalid file path')
  }

  fs.unlink(resolvedPath, (err) => {
    if (err) logger.error({ event: 'file_delete_failed', path: filename, error: err.message })
  })
}
```

### Upload Checklist

- [ ] MIME type whitelist (not blacklist)
- [ ] File size limit enforced
- [ ] Filename generated server-side (not user-provided)
- [ ] File extension validated against MIME type
- [ ] Upload directory is not within web application source
- [ ] No directory traversal possible in file paths
- [ ] Static file serving configured with appropriate headers
- [ ] Old files cleaned up on resource deletion

---

## 14. Secret Detection Patterns

Scan code and config files for accidentally committed secrets.

### Patterns to Detect

| Secret Type | Pattern | Example |
|-------------|---------|---------|
| AWS Access Key | `AKIA[0-9A-Z]{16}` | `AKIAIOSFODNN7EXAMPLE` |
| AWS Secret Key | `[A-Za-z0-9/+=]{40}` near AWS context | |
| JWT Secret | `JWT_SECRET=` followed by value | `JWT_SECRET=mysecret123` |
| MongoDB URI with password | `mongodb(\+srv)?://[^:]+:[^@]+@` | `mongodb://user:pass@host` |
| Google API Key | `AIza[0-9A-Za-z_-]{35}` | `AIzaSyA1234...` |
| Generic API Key | `[aA][pP][iI][_-]?[kK][eE][yY].*=\s*['"][^'"]{8,}['"]` | |
| Private Key | `-----BEGIN (RSA|EC|DSA|OPENSSH) PRIVATE KEY-----` | |
| Slack Token | `xox[bpsa]-[0-9a-zA-Z-]+` | |
| npm Token | `npm_[A-Za-z0-9]{36}` | |
| GitHub Token | `gh[ps]_[A-Za-z0-9]{36,}` | |

### .gitignore Requirements

These files must NEVER be committed:

```gitignore
# Environment variables
.env
.env.local
.env.production

# Logs (may contain sensitive request data)
logs/
*.log

# Upload directory (user content)
uploads/

# IDE and OS files
.DS_Store
.vscode/settings.json  # May contain secrets in extensions
```

### Pre-Commit Check

Before committing, verify:
1. No `.env` files staged: `git diff --cached --name-only | grep -E '\.env'`
2. No hardcoded secrets: `git diff --cached | grep -E '(password|secret|key|token)\s*[:=]'`
3. No private keys: `git diff --cached | grep -E 'BEGIN.*PRIVATE KEY'`

---

## 15. Agentic AI Security (OWASP 2026)

The OWASP Agentic AI Security framework defines 10 risk categories for AI-powered applications. Relevant to any feature that uses AI APIs (e.g., Google Gemini for blog content generation).

### Applicable Risks

| Risk | Category | Relevance to Blog App |
|------|----------|-----------------------|
| ASI01 | **Goal Hijacking** | User prompts could manipulate AI to generate malicious content |
| ASI02 | **Tool Misuse** | If AI has access to system tools, it could be tricked into misuse |
| ASI03 | **Identity & Privilege Abuse** | AI API keys could be stolen for unauthorized use |
| ASI04 | **Supply Chain** | Third-party AI SDKs/plugins could be compromised |
| ASI05 | **Code Execution** | AI-generated code should never be executed without review |
| ASI06 | **Memory Poisoning** | Persistent context could be corrupted by malicious inputs |
| ASI09 | **Human-Agent Trust** | Users may over-trust AI-generated blog content |

### AI Content Generation Security Rules

1. **Sanitize AI output** — AI-generated blog content could contain XSS payloads, malicious links, or script tags. Always sanitize before storing.
2. **Rate limit AI endpoints** — Prevent cost abuse and prompt flooding (current: 3 req/min)
3. **Validate prompt input** — Set maximum prompt length, strip control characters
4. **Never expose API keys** — Gemini API key stays server-side, never in client code
5. **Log AI interactions** — Record prompts and response metadata (not full responses) for audit
6. **Set timeouts** — AI API calls should have request timeouts to prevent hanging connections
7. **Label AI content** — Consider flagging AI-generated blog posts for transparency

### Prompt Injection Prevention

```javascript
// VULNERABLE — raw user input sent to AI
const response = await gemini.generate(req.body.prompt)

// SECURE — sanitized input with system instruction boundary
const sanitizedPrompt = req.body.prompt
  .slice(0, 2000)           // Length limit
  .replace(/[^\w\s.,!?-]/g, '') // Strip special characters

const response = await gemini.generate({
  systemInstruction: 'You are a blog content assistant. Generate only blog post content.',
  prompt: sanitizedPrompt
})
```

---

## 16. Language and Framework Security Quirks

Specific gotchas for the technologies in this stack.

### JavaScript / Node.js

| Quirk | Risk | Prevention |
|-------|------|------------|
| Prototype pollution | Object injection via `__proto__`, `constructor.prototype` | Use `Object.create(null)` for lookup maps, validate keys |
| Type coercion | `'0' == false` is true, bypassing checks | Always use `===` strict equality |
| `eval()` / `Function()` | Code execution from strings | Never use with any external input |
| `JSON.parse()` crash | Malformed JSON throws synchronously | Always wrap in try-catch |
| `Buffer.from(str)` | Default encoding changed across Node versions | Always specify encoding explicitly |
| `RegExp(userInput)` | ReDoS (Regular Expression Denial of Service) | Escape user input or use string methods |
| `path.join()` with user input | Path traversal | Always use `path.basename()` first |
| `setTimeout(string)` | Implicit eval | Always pass a function, never a string |

### MongoDB / Mongoose

| Quirk | Risk | Prevention |
|-------|------|------------|
| Query operator injection | `{ password: { $gt: '' } }` bypasses auth | Cast to `String()`, use `mongo-sanitize` |
| `$where` clause | Server-side JS execution | Never use with user input |
| Unbounded queries | Memory exhaustion from large result sets | Always use `.limit()` and `.skip()` |
| Default `_id` exposure | Sequential ObjectIds leak creation timing | Use `select('-__v')` to reduce info, or UUID |
| Schema `strict: false` | Accepts arbitrary fields | Keep default `strict: true` |
| Index injection | `db.collection.find().sort(userInput)` | Validate sort field against allowlist |

### React

| Quirk | Risk | Prevention |
|-------|------|------------|
| `dangerouslySetInnerHTML` | XSS if content not sanitized | Always use DOMPurify |
| `href={userUrl}` | `javascript:` protocol XSS | Validate URL protocol (http/https only) |
| Client-side routing guards | No actual security (client bypass) | Always enforce server-side |
| Environment variables | `VITE_*` vars are public in bundle | Never prefix secrets with `VITE_` |
| Error boundaries | Can hide errors from monitoring | Log errors in error boundary `componentDidCatch` |
| `useEffect` cleanup | Missing cleanup leaks subscriptions/timers | Return cleanup function |

### Express

| Quirk | Risk | Prevention |
|-------|------|------------|
| Middleware ordering | Auth bypass if order wrong | Place auth middleware before protected routes |
| `req.query` typing | All values are strings (or arrays) | Always validate and cast types |
| Trust proxy | Incorrect IP in rate limiter if proxy not configured | Set `app.set('trust proxy', 1)` behind reverse proxy |
| Error handler signature | Must have 4 params `(err, req, res, next)` | Missing `next` param breaks error handling |
| Body parser limit | Large payloads cause memory issues | Set `express.json({ limit: '10mb' })` |
| Static file serving | Directory listing, source code exposure | Configure appropriate paths and options |

---

## 17. Security Review Process

When reviewing code for security issues, follow this 6-step workflow.

### Step 1: Detect Context

Identify what type of code you're reviewing:
- API endpoint (controller/route)
- Authentication/authorization logic
- Database query or model
- File handling (upload/download/delete)
- Frontend rendering (React component)
- Configuration (env, CORS, headers)
- Dependency change (package.json)

### Step 2: Load Relevant Rules

Based on the context, activate the relevant sections of this skill:
- API endpoint → A01 (access control), A05 (injection), A07 (auth), A10 (error handling)
- Database query → A05 (NoSQL injection), A01 (access control)
- File handling → A08 (integrity), File Upload Security section
- Frontend → A05 (XSS), A02 (CSP/headers)
- Dependencies → A03 (supply chain)

### Step 3: Research Before Flagging

Before reporting any issue:
1. **Trace the data flow** — Where does the input come from? Is it attacker-controlled?
2. **Check upstream middleware** — Is there validation, sanitization, or auth already applied?
3. **Check framework behavior** — Does the framework mitigate this by default?
4. **Check the full handler chain** — `router.use(auth)` applied earlier covers routes below it

### Step 4: Verify Exploitability

For each potential finding:
- Can an attacker actually control the input? (Not just theoretically)
- Does an upstream control already mitigate this? (Middleware, framework default)
- Is this code actually reachable? (Not dead code, commented out, or test-only)

### Step 5: Classify Severity

| Severity | Criteria | Examples |
|----------|----------|----------|
| **CRITICAL** | Direct exploit, no auth required, high impact | RCE, NoSQL injection with auth bypass, hardcoded production secrets |
| **HIGH** | Exploitable with some conditions | Stored XSS, SSRF to internal services, IDOR |
| **MEDIUM** | Specific conditions required, limited impact | Reflected XSS, CSRF, missing rate limiting |
| **LOW** | Defense-in-depth, minimal direct risk | Missing security headers, verbose errors in dev mode |

### Step 6: Report HIGH Confidence Only

Format each finding as:

```
### [SEVERITY] — Finding Title

**File**: path/to/file.js:LINE
**Confidence**: HIGH | MEDIUM
**Category**: OWASP A0X — Category Name

**Description**: What the vulnerability is and why it matters.

**Proof**: How an attacker would exploit this (request example).

**Fix**: Specific code change to resolve the issue.
```

**Do not report LOW confidence findings as vulnerabilities.** Mention them as recommendations if explicitly asked.

---

## 18. Severity Classification — Stack-Specific Examples

### CRITICAL — Must Fix Before Merge

| Finding | Category | Example in This Stack |
|---------|----------|-----------------------|
| NoSQL injection with auth bypass | A05 | `User.findOne({ email, password: req.body.password })` where password could be `{ "$gt": "" }` |
| Hardcoded production secrets | A04 | `JWT_SECRET = 'mysecret123'` in committed code |
| Missing auth on admin endpoint | A01 | Admin route handler without `auth` middleware |
| Remote Code Execution | A05 | `exec('convert ' + userInput)` |
| Unrestricted file upload | A08 | Multer without file filter or size limit |

### HIGH — Must Fix Before Deploy

| Finding | Category | Example in This Stack |
|---------|----------|-----------------------|
| Stored XSS in blog content | A05 | `dangerouslySetInnerHTML` with unsanitized AI/user content |
| IDOR on blog operations | A01 | Blog delete without ownership check |
| JWT with weak secret | A04 | JWT_SECRET shorter than 32 characters |
| Sensitive data in logs | A09 | Logging full request body including passwords |
| Mass assignment | A08 | `User.create(req.body)` accepting role field |

### MEDIUM — Should Fix

| Finding | Category | Example in This Stack |
|---------|----------|-----------------------|
| Missing rate limiting on endpoint | A06 | New endpoint without rate limiter |
| CORS misconfiguration | A02 | Origin validation allowing subdomain bypass |
| Missing CSP headers | A02 | `contentSecurityPolicy: false` without replacement |
| Verbose error in production | A10 | Stack trace in 500 response |
| Missing input validation | A05 | Controller accepting unvalidated body fields |

### LOW — Track / Recommend

| Finding | Category | Example in This Stack |
|---------|----------|-----------------------|
| bcrypt cost factor low | A04 | Salt rounds < 10 |
| Missing security event logging | A09 | No log on failed login attempts |
| Sequential ObjectId exposure | A01 | Leaking creation time via default `_id` |
| Missing `Referrer-Policy` header | A02 | Not set by Helmet default config |

---

## ASVS 5.0 Quick Reference

Application Security Verification Standard — key requirements by level.

### Level 1 — All Applications

- Passwords: 12+ character minimum, check against breached lists
- Authentication: Rate limiting on login, 128+ bit session token entropy
- Transport: HTTPS enforced on all endpoints
- Input: Server-side validation on all user input
- Output: Context-aware output encoding (HTML, URL, JS, CSS)
- Error handling: Generic error messages to clients

### Level 2 — Sensitive Data

All Level 1 requirements, plus:
- MFA for sensitive operations (admin actions, password change)
- Cryptographic key management (rotation, storage)
- Comprehensive security event logging
- Universal input validation with schema enforcement
- CSRF protection on all state-changing operations

### Level 3 — Critical Systems

All Level 1/2 requirements, plus:
- Hardware security modules for key storage
- Documented threat model (reviewed annually)
- Advanced monitoring and alerting with anomaly detection
- Penetration testing validation
- Supply chain integrity verification

---

## When This Skill Activates

This skill should be loaded when:
- Reviewing code changes for security vulnerabilities
- Implementing authentication or authorization
- Handling user input or form data
- Working with file uploads
- Managing secrets or environment variables
- Building or modifying API endpoints
- Adding or updating dependencies
- Configuring CORS, headers, or middleware
- Working with AI content generation features
- Writing database queries with user-provided parameters
