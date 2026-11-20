# Spec: Admin shell and navigation
**Spec ID:** SPEC-SHELL-1   **Status:** As-built (branch chore/editorial-redesign-docs, 2026-11-20)
**Code:** `client/src/App.jsx`, `client/src/pages/admin/Layout/Layout.jsx`, `client/src/components/admin/shared/Sidebar/{Sidebar,SidebarNav,MobileNavDrawer,navItems}.js*`, `client/src/components/admin/shared/motion.js`, `client/src/components/layout/PageTransition/PageTransition.jsx`, `client/src/constants/routes.js`, `client/src/assets/logo_mark.svg`

## Summary
Every authenticated `/admin` page renders inside one shell, the "Editor's desk". It has a dark top bar (logo, `ADMIN` tag, dateline, `Logout`), a dark sidebar on desktop that collapses to an icon rail and remembers that choice, and an off-canvas drawer on small screens. The page content cross-fades between routes, and the active page is announced to screen readers.

## Scope / Out of scope
**In scope:** the admin route tree, the top bar, the desktop sidebar and its collapse behavior, the mobile navigation drawer, the route transition, the live-region page announcement, and the responsive breakpoints of the shell.

**Out of scope:** the content of each page (see the related specs), the Login screen and the logout side effects ([auth.md](auth.md)), and the public site's navbar.

## User-visible behavior
- **Top bar** (70 px, dark): on the left a hamburger button (small screens only), then the logo mark, `QuickBlog.` and an `ADMIN` tag. In the center `EDITOR'S DESK · <date>`, for example `Editor's desk · Fri, 20 Nov 2026` (rendered uppercase). On the right a `LOGOUT` button.
- **Sidebar** (desktop): a `MENU` kicker, four links (`Dashboard`, `Add blogs`, `Blog lists`, `Comments`), and a `« COLLAPSE` button pinned to the bottom. A yellow block marks the active link and slides between links as you navigate. Collapsing shrinks the sidebar to an icon rail, with `§` in place of the `MENU` kicker.
- **Drawer** (mobile): the hamburger slides in a dark panel from the left with a `MENU` kicker, a `✕` close button and the same four links.

## Acceptance criteria

### Routing
| ID | Requirement |
|----|-------------|
| AC-SHELL-01 | THE client SHALL mount the admin routes under `/admin`: index → Dashboard, `addBlog` → Add Blog, `listBlog` → Blog list, `comments` → Comments. |
| AC-SHELL-02 | WHILE a token is held THE `/admin` route element SHALL be `Layout`. WHILE no token is held it SHALL be `Login` ([auth.md](auth.md) AC-AUTH-18). |

### UI: top bar
| ID | Requirement |
|----|-------------|
| AC-SHELL-03 | THE top bar SHALL show the logo mark, the wordmark `QuickBlog.` (the period in signal yellow) and an `Admin` tag, all in one button with `aria-label="QuickBlog — go to home"`. WHEN it is clicked THE client SHALL navigate to `/`. |
| AC-SHELL-04 | THE top bar SHALL show `Editor's desk · <date>`, where `<date>` is today in `en-GB` short form (`weekday:'short', day:'numeric', month:'short', year:'numeric'`, for example `Fri, 20 Nov 2026`). The date is computed on each render of `Layout`. |
| AC-SHELL-05 | THE top bar SHALL show a `Logout` button whose behavior is defined in [auth.md](auth.md) AC-AUTH-27. |

### UI: sidebar
| ID | Requirement |
|----|-------------|
| AC-SHELL-06 | THE navigation SHALL list, in order: `Dashboard` → `/admin` (exact match only), `Add blogs` → `/admin/addBlog`, `Blog lists` → `/admin/listBlog`, `Comments` → `/admin/comments`. Each link SHALL have an icon. |
| AC-SHELL-07 | WHEN a link's route is active THE link SHALL show a signal-yellow block behind it, with ink text and the icon at full color. Inactive links SHALL show paper text at 75% opacity and an inverted icon. |
| AC-SHELL-08 | WHEN the active route changes THE signal block SHALL animate from the old link to the new one (shared `layoutId`), taking 0.4 s. |
| AC-SHELL-09 | THE sidebar SHALL have a toggle button at the bottom. WHILE expanded the button SHALL read `Collapse` with a `«` glyph and have `aria-label="Collapse sidebar"` and `aria-expanded="true"`. WHILE collapsed it SHALL show only the `«` glyph rotated 180° and have `aria-label="Expand sidebar"` and `aria-expanded="false"`. |
| AC-SHELL-10 | WHEN the toggle is clicked THE sidebar SHALL switch between 256 px (`w-64`) and 76 px wide, using a layout (transform) animation of 0.4 s. Link labels SHALL fade out (0.12 s) or fade in with an 8 px slide (0.08 s delay). |
| AC-SHELL-11 | WHILE collapsed EACH link SHALL expose its label through `aria-label` and `title`, and the `MENU` kicker SHALL read `§`. |
| AC-SHELL-12 | WHEN the collapsed state changes THE client SHALL save it to `localStorage['admin.sidebarCollapsed']` as `'true'` or `'false'`. On mount it SHALL restore the state from that key, defaulting to expanded. IF storage is unavailable THEN it SHALL keep the state in memory only, without throwing. |

### UI: mobile drawer
| ID | Requirement |
|----|-------------|
| AC-SHELL-13 | THE top bar SHALL have a hamburger button with `aria-label="Open menu"`, `aria-controls="admin-drawer"` and `aria-expanded` reflecting whether the drawer is open. WHEN it is clicked THE drawer SHALL open. |
| AC-SHELL-14 | THE drawer SHALL be a `role="dialog"` panel with `aria-modal="true"`, `aria-label="Admin menu"` and `id="admin-drawer"`. It SHALL be 288 px wide (`w-72`), capped at 85 vw, and slide in from the left over a 60%-ink overlay. |
| AC-SHELL-15 | THE drawer SHALL close WHEN the `✕` button (`aria-label="Close menu"`) is clicked, WHEN the overlay is clicked, WHEN `Escape` is pressed, or WHEN any navigation link is clicked. |
| AC-SHELL-16 | WHEN the drawer opens THE client SHALL move focus to its first focusable element. WHILE it is open `Tab` and `Shift+Tab` SHALL cycle inside the panel. WHEN it closes, focus SHALL return to the element that had focus before it opened. |

### UI: content area
| ID | Requirement |
|----|-------------|
| AC-SHELL-17 | THE content area SHALL fill the viewport below the top bar (`100dvh - 70px`) and scroll on its own, independently of the sidebar. |
| AC-SHELL-18 | WHEN the route changes THE outgoing page SHALL fade out while rising 12 px (0.25 s). Only then SHALL the incoming page fade in from 12 px below (0.45 s, ease `[0.22, 1, 0.36, 1]`), because `AnimatePresence` is used in `mode='wait'`, keyed by pathname. No transition runs on the first render. |
| AC-SHELL-19 | WHEN the outgoing page has finished exiting THE content area SHALL scroll to the top. |

### Accessibility & motion
| ID | Requirement |
|----|-------------|
| AC-SHELL-20 | THE sidebar and the drawer SHALL each wrap their links in `<nav aria-label="Admin">`. |
| AC-SHELL-21 | THE shell SHALL include a visually hidden `aria-live="polite"` region that reads `<Label> page` (for example `Comments page`) for the four navigation routes. A trailing slash in the path SHALL be ignored when matching. |
| AC-SHELL-22 | THE app SHALL wrap all routes in `MotionConfig reducedMotion='user'`, so transform and layout animations are skipped WHEN the OS requests reduced motion. |
| AC-SHELL-23 | ALL interactive controls in the shell (hamburger, logo button, `Logout`, nav links, collapse toggle, drawer close) SHALL be at least 44 px tall. |

### Responsive
| ID | Requirement |
|----|-------------|
| AC-SHELL-24 | BELOW `md` (768 px) THE desktop sidebar SHALL be hidden and the hamburger shown. FROM `md` up THE sidebar SHALL be shown, and the hamburger and drawer SHALL be hidden. |
| AC-SHELL-25 | BELOW `sm` (640 px) THE `Admin` tag SHALL be hidden. BELOW `lg` (1024 px) THE `Editor's desk · <date>` dateline SHALL be hidden. |
| AC-SHELL-26 | THE top bar SHALL use 16 px horizontal padding below `sm` and 32 px from `sm` up. |

## Contracts
No endpoints. Client-side contracts:

| Key / constant | Value |
|---|---|
| `localStorage['admin.sidebarCollapsed']` | `'true'` or `'false'` |
| `NAV_ITEMS` (`navItems.js`) | `{ to, label, icon, end? }[]`, the single source for the sidebar, the drawer and the live-region label |
| `pageMotion` (`motion.js`) | initial `{opacity:0,y:12}`, animate 0.45 s, exit `{opacity:0,y:-12}` 0.25 s |
| `SLIDE_TRANSITION` | `{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }` |

`PageTransition` (`components/layout/PageTransition`) is the public-site counterpart: the same 12 px, 0.45 s enter transition with no exit. The admin shell does not use it; it applies `pageMotion` directly.

## Edge cases
- **Unknown admin path** (for example `/admin/settings`): no route matches. Because there is no catch-all route, nothing renders at all, neither the shell nor a 404 page.
- **Collapsed preference with no storage** (private mode): the toggle still works for the session.
- **Resizing while the drawer is open:** at `md` and up the drawer is hidden with CSS, but it stays logically open (see Known gaps).
- **Navigating to the current route:** the `pathname` key does not change, so no transition runs. The drawer still closes.

## Known gaps
- **No 404 inside `/admin`.** Unknown sub-paths render a blank page.
- **The drawer keeps its keyboard handlers when hidden.** WHEN the viewport grows to `md` and up while the drawer is open, it is hidden only by `md:hidden`. Its `keydown` handler stays mounted, so `Tab` focus is still trapped inside an invisible panel, and `isDrawerOpen` is never reset.
- **The drawer does not lock page scroll**, and does not make the content behind it `inert`.
- **The `aria-live` region is empty for routes outside `NAV_ITEMS`** (none today).
- **The top-bar date does not update at midnight** until something re-renders `Layout`.

## Related specs
- [auth.md](auth.md): Login gate and `Logout` behavior.
- [dashboard.md](dashboard.md), [blog-authoring.md](blog-authoring.md), [blog-list.md](blog-list.md) and [comments-moderation.md](comments-moderation.md): pages rendered in the outlet.
