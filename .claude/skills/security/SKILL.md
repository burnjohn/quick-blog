---
name: security
description: "Web application security best practices based on OWASP Top 10:2025. Use when reviewing code for vulnerabilities, implementing auth/authorization, handling user input, working with file uploads, managing secrets, or building API endpoints. Covers React, Express, MongoDB, and JWT security."
---

# Security Best Practices — OWASP Top 10:2025

Security guidance for React + Express + MongoDB + JWT stacks. See `examples.md` for unsafe/safe code pairs, `checklists.md` for quick checklists, `references.md` for all sources.

---

## Core Philosophy — Confidence-Based Review

Before flagging any issue, **trace the data flow** and confirm the input source.

| Confidence | Criteria | Action |
|------------|----------|--------|
| **HIGH** | Vulnerable pattern + attacker-controlled input confirmed | **Report** with file, line, exploit, and fix |
| **MEDIUM** | Vulnerable pattern, input source unclear | **Note** for manual verification |
| **LOW** | Theoretical / best-practice deviation | **Do not report** — mention only if asked |

**Do NOT flag**: test files, dead code, server-controlled values (env vars, config constants), framework-mitigated patterns (React JSX escaping, Mongoose parameterized queries), development-only code gated by `NODE_ENV`.

> **Golden rule**: `fetch(process.env.API_URL)` = safe. `fetch(req.query.url)` = vulnerable. Always ask: **"Can an attacker control this value?"**

---

## OWASP Top 10:2025

| # | Category | Key Risk in This Stack |
|---|----------|----------------------|
| A01 | **Broken Access Control** | Missing auth middleware, IDOR, no ownership checks |
| A02 | **Security Misconfiguration** | Helmet disabled, CORS wildcard, stack traces in prod |
| A03 | **Supply Chain Failures** | Compromised npm packages, typosquatting |
| A04 | **Cryptographic Failures** | Weak JWT secret, low bcrypt cost, hardcoded secrets |
| A05 | **Injection** | MongoDB operator injection, XSS, command injection |
| A06 | **Insecure Design** | Missing rate limiting, no threat model |
| A07 | **Authentication Failures** | jwt.decode() instead of verify(), brute force |
| A08 | **Integrity Failures** | Mass assignment via req.body spread, unvalidated uploads |
| A09 | **Logging Failures** | Passwords in logs, missing auth event audit trail |
| A10 | **Exceptional Conditions** | Fail-open auth, stack trace leaks, missing async error handling |

---

## A01 — Broken Access Control

- **Deny by default** — every route is protected unless explicitly public
- Apply `auth` middleware as a **barrier** (via `router.use(auth)`) rather than per-route to prevent omissions
- **Always check ownership** on update/delete — being authenticated does not mean authorized for all resources
- Compare `resource.author.toString() === req.user.userId` plus admin role escape hatch
- React route guards are UX only — **server must enforce all access control**
- Test both horizontal (user A → user B's data) and vertical (author → admin endpoints) escalation

---

## A02 — Security Misconfiguration

- **Helmet**: Enable with `crossOriginResourcePolicy: 'cross-origin'` for uploads. If CSP disabled, implement custom CSP restricting `script-src` to `'self'`
- **CORS**: Explicit origin allowlist with `credentials: true`. Never `origin: '*'` or `origin: true` with credentials
- **Error handler**: Generic message in production, stack traces only when `NODE_ENV === 'development'`
- **Vite env vars**: `VITE_*` prefixed vars are **public in the client bundle** — never put secrets there
- **MongoDB**: Require auth + TLS in production, never expose port 27017 to internet, use `serverSelectionTimeoutMS`
- **Defaults**: Change seed credentials, disable debug middleware in production

---

## A03 — Supply Chain Failures

- Run `npm audit` before every release. Commit `package-lock.json` always.
- Pin exact versions for security-sensitive packages
- Before adding a dependency: check CVEs, maintenance activity (< 6 months), download count (> 10K/week), scope of access (network/fs/env)
- Watch for typosquatting (`expres` vs `express`)
- Vite plugins run with full Node.js access during build — use only well-known publishers

---

## A04 — Cryptographic Failures

- **Passwords**: bcrypt with salt rounds >= 10 (never MD5, SHA-1/256, or plain text). Preferred: Argon2id > bcrypt > scrypt
- **JWT secret**: Minimum 256-bit (32 bytes) cryptographically random, from `process.env.JWT_SECRET`
- **JWT signing**: Explicitly set `algorithm: 'HS256'` and `expiresIn`. Never allow `none` algorithm
- **JWT verification**: Always `jwt.verify()`, never `jwt.decode()` (decode doesn't check signature)
- **JWT payload**: Never store sensitive data (it's base64-encoded, not encrypted)
- **Transit**: HTTPS in production, `Strict-Transport-Security` header via Helmet
- **At rest**: Encrypt sensitive fields if storing PII. Never store raw credentials in MongoDB

---

## A05 — Injection

### MongoDB NoSQL Injection
- **Cast input types explicitly**: `String(req.body.email)` — neutralizes operator objects like `{ "$gt": "" }`
- Never put user input in `$where`, `$expr`, or `$function` (server-side JS execution)
- Never construct regex from user input without escaping (`str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`)
- Use Mongoose strict schemas with type definitions. Consider `mongo-sanitize` to strip `$` keys

### Cross-Site Scripting (XSS)
- React auto-escapes JSX — that's your default safety net
- **Never** use `dangerouslySetInnerHTML` without DOMPurify sanitization (allowlist tags/attributes)
- Validate URLs before `href`/`src` — reject `javascript:` protocol, allow only `http:`/`https:`
- Blog content and AI-generated content are high-risk for stored XSS — sanitize on input AND output
- Set CSP headers to mitigate any XSS that slips through

### Command Injection
- Never use `exec()` or `spawn({ shell: true })` with user input
- Use `execFile()` which passes arguments directly without shell interpretation

---

## A06 — Insecure Design

**Rate limiting strategy:**

| Endpoint | Limit | Window |
|----------|-------|--------|
| Login | 5 req | 15 min |
| Comments | 5 req | 1 min |
| AI generation | 3 req | 1 min |
| File upload | 10 req | 1 min |
| General API | 100 req | 1 min |

- **AI content generation**: Sanitize AI output before storing (XSS risk), validate prompt length, set request timeouts, never expose API keys to client, log prompts for audit
- **Comments**: Rate limit + sanitize + moderation (`isApproved` flag)

---

## A07 — Authentication Failures

- **Login**: Find user by email with `isActive: true`, compare with bcrypt, return generic "Invalid credentials" for both wrong email and wrong password (prevents enumeration)
- **JWT claims**: `{ userId, email, name, role }` — minimum viable
- **Token extraction**: Support `Bearer <token>` from Authorization header
- **Auth middleware must be fail-closed**: `next()` only called on successful `jwt.verify()`. Missing `return` before error response = fail-open vulnerability
- **Rate limit login**: `loginLimiter` on login endpoint (5 attempts / 15 min)
- **Password model**: Hash in `pre('save')` hook only if modified, `comparePassword` instance method, `toJSON` strips password from all responses
- Consider account lockout, progressive delays, CAPTCHA after N failures

---

## A08 — Software and Data Integrity

- **Mass assignment prevention**: Destructure only expected fields from `req.body` — never `Model.create(req.body)` (attacker can set `role: 'admin'`)
- **Mongoose schemas**: Use `enum` for fixed values, `required` on mandatory fields, `minlength`/`maxlength`, `strict: true` (default)
- **File upload integrity**: MIME type allowlist, check magic bytes for high-security. MIME types can be spoofed
- **CSP**: Restrict `script-src`, `frame-ancestors 'none'`, `object-src 'none'`

---

## A09 — Logging and Alerting

**Log these**: Login success/failure, token rejection, admin actions, file uploads, rate limit hits, 5xx errors, 403 denials
**Never log**: Passwords, JWT tokens, API keys, credit cards, SSNs

- Redact sensitive fields (`password`, `token`, `secret`, `authorization`) before logging — replace with `***`
- Use structured JSON logging for production (searchable, integrates with aggregation)
- Log auth events with userId, IP, timestamp, and action

---

## A10 — Exceptional Conditions

- **Fail-closed**: Errors must deny access, not grant it. `catch` blocks must `return` error response before any `next()` call
- **Global error handler**: Must have 4 params `(err, req, res, next)`. Return generic message in production.
- **Async wrapper**: Use `asyncHandler` to catch Promise rejections — eliminates need for try-catch in every controller
- **DB connection**: `serverSelectionTimeoutMS: 5000`, `process.exit(1)` on connection failure
- **404 handler**: Catch-all for unmatched routes (`app.use('*', ...)`)

---

## File Upload Security

- **MIME allowlist**: `['image/jpeg', 'image/png', 'image/gif', 'image/webp']` — whitelist, not blacklist
- **Size limit**: `5 * 1024 * 1024` (5MB) via `multer.limits`
- **Filename**: Server-generated (`blog-{timestamp}-{random9digits}.{ext}`) — never user-provided
- **Path traversal**: Use `path.basename()` to strip directory components. Validate `path.resolve()` starts with upload directory before deletion
- **Cleanup**: Delete uploaded file when resource is deleted, validate path is within uploads dir
- **Serving**: `crossOriginResourcePolicy: 'cross-origin'` for static files, no directory listing

---

## Secret Detection

Scan for these patterns in all code and config:

| Type | Pattern |
|------|---------|
| AWS Key | `AKIA[0-9A-Z]{16}` |
| Google API | `AIza[0-9A-Za-z_-]{35}` |
| JWT/Generic | `(secret\|key\|token\|password)\s*[:=]\s*['"][^'"]{8,}` |
| MongoDB URI | `mongodb(\+srv)?://[^:]+:[^@]+@` |
| Private Key | `-----BEGIN .* PRIVATE KEY-----` |
| GitHub Token | `gh[ps]_[A-Za-z0-9]{36,}` |
| npm Token | `npm_[A-Za-z0-9]{36}` |
| Slack Token | `xox[bpsa]-[0-9a-zA-Z-]+` |

**Never commit**: `.env`, `.env.local`, `.env.production`, `logs/`, `uploads/`

---

## Agentic AI Security (OWASP 2026)

Relevant to AI content generation features (Gemini API):

- **ASI01 Goal Hijacking**: Sanitize prompt input, set max length, strip control characters
- **ASI02 Tool Misuse**: AI should not have access to system tools without explicit scoping
- **ASI03 Identity Abuse**: API keys server-side only, short-lived if possible
- **ASI05 Code Execution**: Never execute AI-generated code without review
- **ASI09 Trust Exploitation**: Label AI-generated content, validate before storing
- Sanitize AI output before storing — it could contain XSS, malicious links, or script tags

---

## Framework Security Quirks

### JavaScript/Node.js
- Prototype pollution via `__proto__`/`constructor.prototype` — validate object keys
- `JSON.parse()` throws on malformed input — always wrap in try-catch
- `RegExp(userInput)` enables ReDoS — escape special characters
- `path.join()` with user input allows traversal — use `path.basename()` first
- `setTimeout(string)` is implicit eval — always pass a function

### MongoDB/Mongoose
- Query operator injection via JSON body `{ password: { "$gt": "" } }` — cast to `String()`
- `$where` clause = server-side JS execution — never use with user input
- Unbounded queries exhaust memory — always `.limit()` and `.skip()`
- `strict: false` accepts arbitrary fields — keep default `strict: true`

### React
- `dangerouslySetInnerHTML` bypasses escaping — require DOMPurify
- `href={userUrl}` allows `javascript:` XSS — validate protocol
- `VITE_*` env vars are public — never prefix secrets

### Express
- Middleware ordering matters — auth bypass if `router.use(auth)` placed after unprotected routes
- `req.query` values are always strings — validate and cast types
- Error handler must have exactly 4 params — missing `next` breaks error handling
- Set `trust proxy` behind reverse proxy — otherwise rate limiter gets wrong IP

---

## Security Review Process

1. **Detect context** — API endpoint, auth logic, DB query, file handling, frontend, config, or dependency change
2. **Load relevant rules** — Only the OWASP categories that apply to this context
3. **Trace data flow** — Where does the input come from? Is it attacker-controlled?
4. **Check upstream controls** — Middleware, framework defaults, validation already applied?
5. **Verify exploitability** — Can an attacker actually reach and control this?
6. **Report HIGH confidence only** — Include file, line, exploit scenario, specific fix

---

## Severity Classification

| Severity | Criteria | Stack Examples |
|----------|----------|----------------|
| **CRITICAL** | Direct exploit, no auth required | NoSQL injection auth bypass, hardcoded prod secrets, missing auth on admin endpoint, RCE |
| **HIGH** | Exploitable with conditions | Stored XSS in blog content, IDOR on delete, JWT with weak secret, passwords in logs |
| **MEDIUM** | Specific conditions, limited impact | Missing rate limiter, CORS misconfiguration, verbose prod errors, missing input validation |
| **LOW** | Defense-in-depth | Low bcrypt cost, missing security event logging, sequential ObjectId exposure |

---

## ASVS 5.0 Quick Reference

**Level 1 (All Apps)**: 12+ char passwords, breached list check, login rate limiting, 128+ bit session entropy, HTTPS, server-side validation, generic error messages

**Level 2 (Sensitive)**: + MFA for sensitive ops, crypto key management, comprehensive security logging, schema-based input validation, CSRF protection

**Level 3 (Critical)**: + HSM key storage, documented threat model, anomaly detection, penetration testing, supply chain verification
