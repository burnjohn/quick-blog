# Spec: Admin authentication
**Spec ID:** SPEC-AUTH-2   **Status:** As-built (branch chore/editorial-redesign-docs, 2026-11-20)
**Code:** `server/src/controllers/adminController.js` (`adminLogin`), `server/src/middleware/auth.js`, `server/src/middleware/rateLimiter.js` (`loginLimiter`), `server/src/models/User.js`, `server/src/routes/{adminRoutes,blogRoutes}.js`, `server/fixtures/users.js`, `client/src/components/admin/auth/Login/Login.jsx`, `client/src/context/AppContext/AppContext.jsx`, `client/src/api/{axiosConfig,adminApi}.js`, `client/src/App.jsx`, `client/src/pages/admin/Layout/Layout.jsx` (`handleLogout`), `client/src/constants/messages.js`

## Summary
The admin area is protected by a single email/password login that returns a 7-day JWT. The client keeps the token in `localStorage`, sends it on every request, and renders the Login screen in place of any `/admin` route while no token is held. The server verifies the token on every protected route; roles (`admin`, `author`) exist in the data model but are not used for authorization.

## Scope / Out of scope
**In scope:** `POST /api/admin/login`, the `auth` middleware and the list of routes it protects, the `User` model's password handling, the Login screen, token storage in `AppContext` and `localStorage`, the axios auth header, the global 401 handler, and logout.

**Out of scope:** registration, password reset, refresh tokens, token revocation and role-based authorization (none of these exist). The admin shell around authenticated pages is in [shell-and-navigation.md](shell-and-navigation.md).

## User-visible behavior
- Opening any `/admin` URL without a token shows a split-screen Login page. A dark aside shows the logo, `Editor's desk · Vol. 1`, `§ Restricted edition`, the animated headline `Write.` / `Edit.` / `Publish.` (the last word italic in signal yellow), a rotated `Staff only` sticker, and, from `md` up, `Manage stories, comments and drafts in one place.`
- The form panel shows the kicker `Restricted area`, the heading `Admin Login` (the word `Admin` highlighted), the line `Enter your credentials to access the admin panel`, the `Email` and `Password` fields, and a full-width `Login` button.
- When login succeeds the same URL re-renders as the admin layout and the toast `Login successful!` appears. When it fails, a toast shows the server's message.
- `Logout` in the admin top bar clears the session, goes to the public home page `/`, and shows the toast `Logout successful!`.

## Acceptance criteria

### Server
| ID | Requirement |
|----|-------------|
| AC-AUTH-01 | THE SYSTEM SHALL expose `POST /api/admin/login` without authentication, accepting a JSON body `{ email, password }`. |
| AC-AUTH-02 | THE SYSTEM SHALL limit `POST /api/admin/login` to 5 requests per 15 minutes per IP, counting both successful and failed attempts. WHEN the limit is exceeded THE SYSTEM SHALL respond `429 { success:false, message:'Too many login attempts. Please try again after 15 minutes.' }` with standard `RateLimit-*` headers. |
| AC-AUTH-03 | IF no user matches `{ email, isActive:true }` THEN THE SYSTEM SHALL respond `401 { success:false, message:'Invalid Credentials' }`. |
| AC-AUTH-04 | IF a user matches but the bcrypt comparison fails THEN THE SYSTEM SHALL respond with the same `401 { success:false, message:'Invalid Credentials' }`, so an unknown email and a wrong password cannot be told apart. |
| AC-AUTH-05 | WHEN the credentials are valid THE SYSTEM SHALL respond `200 { success:true, token, user:{ name, email, role } }`, where `token` is a JWT signed with `JWT_SECRET` that has the payload `{ userId, email, name, role }` and `expiresIn: '7d'`. |
| AC-AUTH-06 | THE login response SHALL NOT include the password hash or any other `User` field besides `name`, `email` and `role`. |
| AC-AUTH-07 | THE `auth` middleware SHALL respond `401 { success:false, message:'No token provided' }` WHEN the `Authorization` header is missing. |
| AC-AUTH-08 | THE `auth` middleware SHALL accept either `Bearer <token>` or a raw `<token>` as the `Authorization` value. |
| AC-AUTH-09 | IF the token is expired THEN THE `auth` middleware SHALL respond `401 { success:false, message:'Token expired' }`; IF it fails verification for any other reason THEN it SHALL respond `401 { success:false, message:'Invalid token' }`. |
| AC-AUTH-10 | WHEN the token is valid THE `auth` middleware SHALL set `req.user` to the decoded payload and pass control to the route. |
| AC-AUTH-11 | THE SYSTEM SHALL protect with `auth` every `/api/admin/*` route except `/login`, and `POST /api/blog/add`, `/delete`, `/publish`, `/unpublish` and `/generate`. |
| AC-AUTH-12 | THE SYSTEM SHALL let any active user log in and use every protected route, whatever their role (`admin` or `author`). No route checks `req.user.role`. |

### Data
| ID | Requirement |
|----|-------------|
| AC-AUTH-13 | THE `User` model SHALL require `name`, a unique `email` (stored lowercased and trimmed), and a `password` of at least 6 characters. `role` SHALL be one of `admin` or `author` (default `author`), and `isActive` SHALL default to `true`. |
| AC-AUTH-14 | THE SYSTEM SHALL bcrypt-hash the password (salt rounds 10) on save, but only when the `password` field was modified. |
| AC-AUTH-15 | THE `User.toJSON()` output SHALL omit `password`. |
| AC-AUTH-16 | THE seed SHALL create an `admin` user `admin@quickblog.com` (name `Michael Brown`) and an `author` user `sarah@quickblog.com`, both active. |

### UI
| ID | Requirement |
|----|-------------|
| AC-AUTH-17 | WHEN the app mounts THE client SHALL read `localStorage.token` into `AppContext.token`. The initial value before that effect runs is `null`. |
| AC-AUTH-18 | WHILE `AppContext.token` is falsy THE client SHALL render the `Login` screen for any `/admin` route, in place of the admin `Layout`, and SHALL keep the URL unchanged. |
| AC-AUTH-19 | THE Login form SHALL contain `Email` (`type="email"`, `autocomplete="email"`, placeholder `your email id`, required) and `Password` (`type="password"`, `autocomplete="current-password"`, placeholder `your password`, required). Each label SHALL show a `*` marker. |
| AC-AUTH-20 | THE Login form SHALL rely on native HTML validation for the required fields, and SHALL NOT send a request while either field is empty or `Email` is not a valid email. |
| AC-AUTH-21 | WHEN the form is submitted THE client SHALL `POST /api/admin/login` with `{ email, password }`. WHILE the request is in flight the `Login` button SHALL be disabled and show a spinner with `Loading...`. |
| AC-AUTH-22 | WHEN the response has `success:true` THE client SHALL put the token into context and into `localStorage.token`, and toast `Login successful!`. The current `/admin/*` route then renders inside the admin layout, with no extra navigation. |
| AC-AUTH-23 | IF login fails THEN THE client SHALL toast the server `message` (for example `Invalid Credentials` or the rate-limit text). IF there is no server message THEN it SHALL toast the transport error message, and only after that fall back to `Login failed. Please check your credentials.` |
| AC-AUTH-24 | THE client SHALL add the stored token to every axios request as `Authorization: <token>`, without a `Bearer` prefix. |
| AC-AUTH-25 | THE client SHALL send `Content-Type: application/json` on every request except those whose body is `FormData`. |
| AC-AUTH-26 | WHEN any API response has status `401` THE client SHALL remove `localStorage.token` and hard-navigate (`window.location.href`) to `/admin`. |
| AC-AUTH-27 | WHEN `Logout` is clicked THE client SHALL remove `localStorage.token`, set the context token to `null`, navigate to `/`, and toast `Logout successful!`. |

### Accessibility & motion
| ID | Requirement |
|----|-------------|
| AC-AUTH-28 | EACH Login input SHALL have a programmatically associated `<label>` (via `useId`). The decorative logo image SHALL have `alt=""`. |
| AC-AUTH-29 | THE headline words SHALL rise in with a stagger (0.6 s each, 0.08 s apart) and the `Staff only` sticker SHALL spring in after 0.6 s. Under `prefers-reduced-motion: reduce` these animations SHALL be reduced by the app-wide `MotionConfig reducedMotion='user'`. |

### Responsive
| ID | Requirement |
|----|-------------|
| AC-AUTH-30 | BELOW `md` (768 px) the aside SHALL stack above the form, and the `Manage stories…` line SHALL be hidden. FROM `md` up the aside and the form SHALL sit side by side, with the aside taking half the width. |

## Contracts

```http
POST /api/admin/login
Content-Type: application/json
{ "email": "admin@quickblog.com", "password": "••••••" }

200 { "success": true, "token": "<jwt>", "user": { "name": "Michael Brown", "email": "admin@quickblog.com", "role": "admin" } }
401 { "success": false, "message": "Invalid Credentials" }
429 { "success": false, "message": "Too many login attempts. Please try again after 15 minutes." }

Any protected route, Authorization missing / invalid / expired
401 { "success": false, "message": "No token provided" | "Invalid token" | "Token expired" }
```

JWT payload: `{ userId, email, name, role, iat, exp }` (`exp = iat + 7 days`).

## Edge cases
- **Logged-in reload:** for the first render `token` is `null`, so the Login screen flashes briefly before the admin layout replaces it.
- **Token expires while working:** the next API call returns `401`. The interceptor clears the token and reloads `/admin`, which then shows Login. Any unsaved form input (such as an Add Blog draft) is lost.
- **Deep link while logged out:** `/admin/comments` shows Login. After login the Comments page renders at the same URL.
- **Deactivated user (`isActive:false`):** cannot log in (`Invalid Credentials`), but tokens issued before deactivation stay valid until they expire.
- **Author account:** logs in and gets the full admin area.

## Known gaps
- **No role-based authorization.** An `author` token can call every admin endpoint; the server never checks `req.user.role`.
- **A failed login reloads the page.** `Invalid Credentials` comes back as `401`, so the global interceptor sets `window.location.href = '/admin'` and the error toast disappears with the reload.
- **The login body is not validated.** A missing `password` makes `bcrypt.compare` throw, which returns `500`. A non-string `email` (for example `{"$ne":null}`) is passed straight into `User.findOne`, which allows operator injection (a matching password is still needed).
- **Token handling is weak.** The token lives in `localStorage` (readable by XSS) for 7 days. Logout does not revoke it, and the client never checks `exp`.
- **The test app has no rate limiter.** `server/src/app.js` (used by the Supertest suites) does not mount `loginLimiter`, so AC-AUTH-02 is not covered by tests.
- **The 401 handler applies to every endpoint.** That includes public ones, if any of them ever returns `401`.

## Related specs
- [shell-and-navigation.md](shell-and-navigation.md): the admin layout rendered after login, including the `Logout` button.
- [dashboard.md](dashboard.md), [blog-authoring.md](blog-authoring.md), [blog-list.md](blog-list.md), [comments-moderation.md](comments-moderation.md): protected pages.
