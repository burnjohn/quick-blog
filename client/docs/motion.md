# Motion system

All animation uses [`motion`](https://motion.dev) (`import { motion } from 'motion/react'`, package `motion@^12`) plus a few CSS transitions. Motion expresses cause and effect: content arriving, a selection changing, a panel opening. The only continuous animation is the (currently unused) category marquee.

Visual tokens are in [design-system.md](design-system.md).

## Rules

| Rule | Detail |
|---|---|
| Properties | Animate only `transform` (x, y, scale, rotate, scaleX) and `opacity`. Never width, height, top or left. The admin sidebar resizes with a `layout` animation, not a width tween |
| Easing | `[0.22, 1, 0.36, 1]` everywhere (`EASE_EDITORIAL`, CSS `ease-editorial`). Count-up uses ease-out cubic `[0.33, 1, 0.68, 1]` |
| Enter | Fade + rise 12–24px, 0.45–0.6s |
| Stagger | 60ms per item, capped (see presets) |
| Exit | About 60% of the enter duration |
| Hover | 150–200ms CSS transitions |
| Scroll reveal | `whileInView` with `viewport={{ once: true, margin: '-10% 0px' }}` |
| No IntersectionObserver | Content must render in its final state immediately (jsdom tests, old browsers) |
| Reduced motion | Everything readable instantly; see [Reduced motion](#reduced-motion) |
| Shared layout | `layoutId` indicators must be unique per mounted instance |

## Preset modules

There are two preset modules with the same easing. Public components import from `ui/Reveal`; admin components import from `admin/shared/motion`.

### `client/src/components/ui/Reveal/motionPresets.js` (re-exported by `ui/Reveal/index.js`)

| Export | Value |
|---|---|
| `EASE_EDITORIAL` | `[0.22, 1, 0.36, 1]` |
| `STAGGER_SECONDS` | `0.06` |
| `MAX_STAGGERED` | `8` |
| `VIEWPORT_ONCE` | `{ once: true, margin: '-10% 0px' }` |
| `canObserve()` | `true` when `IntersectionObserver` exists (function, checked per render) |
| `getStaggerDelay(i)` | `min(i, 8) * 0.06` (max 0.48s) |

### `client/src/components/admin/shared/motion.js`

| Export | Spec |
|---|---|
| `EASE_EDITORIAL`, `EASE_OUT_CUBIC` | `[0.22, 1, 0.36, 1]`, `[0.33, 1, 0.68, 1]` |
| `staggerDelay(i)` | `min(i, 7) * 0.06` (max 0.42s) |
| `VIEWPORT_ONCE` | `{ once: true, margin: '-10% 0px' }` |
| `riseIn` | variants `hidden { opacity 0, y 20 }` → `show(i) { opacity 1, y 0 }`, 0.5s, staggered by `custom` |
| `rowMotion` | `hidden { opacity 0, y 16 }` → `show(i)` 0.45s; `exit { opacity 0, x -32 }` 0.28s |
| `pageMotion` | `initial { opacity 0, y 12 }` → `animate` 0.45s; `exit { opacity 0, y -12 }` 0.25s |
| `HOVER_TRANSITION` | 0.18s (exported, currently unused) |
| `SLIDE_TRANSITION` | 0.4s, editorial easing (sidebar, drawers, indicators, toggles) |
| `CAN_OBSERVE` | `IntersectionObserver` check, evaluated once at module load |
| `revealOnScroll(i, variants = riseIn)` | Spread props: `whileInView` reveal when observable, otherwise `animate='show'` with `initial={false}` |

## Building blocks

### `Reveal` (`components/ui/Reveal/Reveal.jsx`)

Scroll-triggered fade + rise for public sections.

| Prop | Default | Notes |
|---|---|---|
| `as` | `'div'` | Any `motion.*` element (`'li'` in lists) |
| `index` | `0` | Stagger position (capped at 8) |
| `y` | `20` | Rise distance in px (lists use `12`) |

Transition: 0.55s, `EASE_EDITORIAL`, delay `getStaggerDelay(index)`. Without IntersectionObserver, `initial={false}` renders content at rest.

Used by `BlogGrid`, `Gallery`, `CategoryDesks`, `EditorsPicks`, `ArchiveList`, `ReadNext`, `CommentItem`, `NewsletterForm`. `BlogGrid` passes `index - staggerFrom` so each "Load more" page restarts its stagger from 0. `ArchiveList` staggers by row (`Math.floor(index / 2)`) in its two-column layout.

### `PageTransition` (`components/layout/PageTransition/PageTransition.jsx`)

Public route enter: `opacity 0, y 12` → rest, 0.45s. Enter only (no exit). `Home` wraps its content; `BlogDetail` keys it by `id` so it replays when navigating between articles.

### Admin route transition (`pages/admin/Layout/Layout.jsx`)

`<AnimatePresence mode='wait' initial={false}>` around `<motion.div key={location.pathname} {...pageMotion}>` containing the outlet (captured with `useOutlet()` so the exiting page keeps its content). `onExitComplete` scrolls `<main>` back to the top. `<motion.main layout='position' layoutScroll>` follows the sidebar width change with `SLIDE_TRANSITION`.

### `CountUp` (`components/admin/shared/CountUp/CountUp.jsx`)

Counts from the last shown value to `value` with `animate()` (0.9s, `EASE_OUT_CUBIC`) the first time it enters the viewport (`onViewportEnter`, `once: true`). Writes digits straight to a DOM node (no re-render per frame). The visible digits are `aria-hidden`; a `sr-only` span holds the final formatted value. With reduced motion or no IntersectionObserver it renders the final value immediately. `format` must be a stable module-level function.

Used by `Masthead` (when `value` is a number) and `StatCard`.

### Marquee (`components/blog/CategoryTicker/CategoryTicker.jsx`)

CSS only: `.marquee-track` with `animate-marquee` (`marquee 40s linear infinite`, translateX 0 → -50%) over two copies of the row; the second copy has `.marquee-clone` and `aria-hidden`. Under reduced motion the track stops and the clone is hidden. The component exists and is tested but is not rendered by any page.

### Reading progress (`pages/public/BlogDetail/BlogDetail.jsx`)

A fixed 4px signal bar with `.reading-progress`: a CSS scroll-driven animation (`animation-timeline: scroll(root block)`, scaleX 0 → 1). It is the one animation kept under reduced motion because it follows the user's own scroll.

## Catalog by component

### Public

| Component | What moves | Spec |
|---|---|---|
| `Navbar` | Header condenses after 48px of scroll: slides up by the 32px dateline height; wordmark scales to 0.9; a 4px ink rule fades in | 0.35s editorial (`useScroll` + `useMotionValueEvent`); rule is a 300ms CSS opacity transition |
| `Navbar` links | Underline `scale-x-0` → `100` on hover / focus-visible | 200ms CSS |
| `MobileDrawer` | Scrim fade; panel `x: 100%` → `0`; links slide `x 24` → `0` | Panel 0.45s, exit 0.27s; links delay `0.1 + getStaggerDelay(i)` |
| `FrontCover` | Lead fades/rises `y 16`; briefs rise `y 12` | Lead 0.55s; briefs 0.5s, delay `0.15 + stagger` (on mount, not on scroll) |
| `CoverLead` | Photo settles `scale 1.08` → `1` | 1.4s |
| `SectionHeading` | Bottom rule draws `scaleX 0` → `1` from the left | 0.8s, `whileInView` once |
| `CategoryFilter` | Signal block slides between chips (`layoutId`, default `'category-indicator'`) | Spring, stiffness 500, damping 38 |
| `ReadsBar` | Bar draws `scaleX 0` → ratio | 0.9s, `whileInView` once |
| `BlogHeader` | Title, subtitle, byline box rise `y 20` | 0.6s, delays 0.05 / 0.15 / 0.25 |
| `BlogContent` | Cover fades in and settles `scale 1.08` → `1` | 1.2s |
| `ArticleAside` | Active TOC bar slides (`layoutId='contents-indicator'`); TOC click scrolls smoothly unless reduced motion | Spring 500 / 40 |
| `LeadCard` (unused) | Parallax `y -4%` → `4%` while scrolling, disabled with `useReducedMotion`; photo `scale 1.12` → `1` | 1.6s |
| Cards and tiles | `lift` (`translate(-2px,-2px)`); image `group-hover:scale-105`; arrow nudges `translate-x-1` | 200ms; images 500–700ms CSS |
| `GalleryTile` | Caption rises `translate-y-4` → `0` on hover/focus (hover devices only) | 300ms CSS |

### Admin

| Component | What moves | Spec |
|---|---|---|
| `Sidebar` | `motion.aside layout` between `w-64` and `w-[76px]`; « chevron rotates 180°; labels fade in `x -8` → `0` | `SLIDE_TRANSITION`; labels delay 0.08s, exit 0.12s |
| `SidebarNav` | Signal block behind the active link (`layoutId` `'sidebar-active'` or `'drawer-active'`) | `SLIDE_TRANSITION` |
| `MobileNavDrawer` | Scrim fade 0.25s / exit 0.2s; panel `x -100%` → `0` | 0.4s, exit 0.25s |
| `AdminPageHeader` | `riseIn` on mount | 0.5s |
| `Masthead` | Section `riseIn`; halftone strip draws `scaleX 0` → `1`; sticker springs in (`scale 0.7, rotate -14` → `scale 1, rotate -3`); insights `riseIn` with `custom = i + 2` | Strip 0.9s delay 0.35s; sticker spring 380 / 18, delay 0.55s |
| `StatCard` | `revealOnScroll(index)` + `lift` | 0.5s, staggered |
| `AdminTable` / `AdminTableRow` | Rows rise in staggered, slide left on removal; siblings glide (`layout='position'`); empty row fades | `rowMotion`; empty 0.3s delay 0.15s |
| `BlogTableItem` status pill | Swap Published / Unpublished (`AnimatePresence mode='wait'`, `y 8` / `-8`) | 0.3s, exit 0.18s |
| `SegmentedControl` | Ink block slides to the active option (`layoutId` from props) | `SLIDE_TRANSITION` |
| `Comments` page | Table panel swaps when the filter changes (`y 10` in, `y -6` out) | 0.35s, exit 0.2s |
| `PublishToggle` | Knob `x 0` ↔ `20` | `SLIDE_TRANSITION` |
| `AiDraftButton` | Label swaps idle ↔ busy (`y 6` / `-6`) | 0.2s, exit 0.12s |
| `AiDraftOverlay` | Halftone overlay fades over the editor | 0.25s, exit 0.2s |
| `Login` | "Write. Edit. Publish." lines rise `y 28`; "Staff only" sticker springs; form `riseIn` (`custom 2`) | 0.6s, delay `0.1 + i * 0.08`; sticker spring 380 / 18 delay 0.6s |

## Reduced motion

Two layers:

1. **JS**: `App.jsx` wraps the app in `<MotionConfig reducedMotion='user'>`. When the OS asks for reduced motion, `motion` skips transform animations and keeps opacity fades. Components that animate imperatively check `useReducedMotion()` themselves (`CountUp`, `LeadCard`, `ArticleAside`).
2. **CSS** (`index.css`, `@media (prefers-reduced-motion: reduce)`):
   - `scroll-behavior: auto`;
   - every element except `.reading-progress`: animation and transition durations forced to `0.01ms`, one iteration;
   - `transform: none !important` on `.group:hover`, its descendants and `*:active` (removes image zooms, arrow nudges, logo tilt, `lift`);
   - `.marquee-track` stopped, `.marquee-clone` hidden.

Spinners (`animate-spin`) and skeletons (`animate-pulse`) are also stopped by the CSS rule.

## Known gaps

- Two preset modules duplicate the same tokens with slightly different stagger caps (`ui/Reveal`: up to index 8, 0.48s; `admin/shared/motion`: up to index 7, 0.42s) and different observer checks (function vs module constant).
- `HOVER_TRANSITION` in `admin/shared/motion.js` is exported but not used.
- `PageTransition` and the admin outlet use the same 12px / 0.45s spec but the public one has no exit animation.
- Full-page screenshots of Home show empty areas because `whileInView` reveals do not fire in headless captures; this is expected, not a layout bug.
