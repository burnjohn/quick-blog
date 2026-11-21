# Design system: "Ink & Signal" front page

The whole client (public blog and admin) uses one editorial, newspaper-style language: warm paper ground, black ink, one signal-yellow accent, hard offset shadows and no rounded corners. Tokens and utilities live in `client/src/index.css`.

Motion rules are in [motion.md](motion.md).

## Principles

1. **Hierarchy through scale.** Each page has one oversized element (a giant serif headline or number). Everything else is visibly smaller. Examples: the article title in `components/blog/BlogHeader/BlogHeader.jsx` (`text-5xl sm:text-7xl lg:text-8xl`), the `Masthead` number in `components/admin/shared/Masthead/Masthead.jsx` (`text-[clamp(88px,11vw,168px)]`), the footer wordmark (`text-[16vw] xl:text-[13rem]`).
2. **Color blocking, not identical white cards.** Mix three surfaces:
   - ink panels: `bg-ink text-paper` with `shadow-hard-signal`;
   - signal accents: `bg-signal`, or `halftone` for texture;
   - paper/surface panels: `bg-surface` with `shadow-hard`.
   Never put more than two ink panels next to each other. On Home, `EditorsPicks` is the one ink band (`components/blog/EditorsPicks/EditorsPicks.jsx`).
3. **Depth = hard offset shadows only.** No blur, no rounded corners.
4. **Interactive cards lift.** `group lift` plus `shadow-hard hover:shadow-hard-lg` (or the `-signal` pair).
5. **Print devices.** Halftone dots for "featured" or "uncertain" areas, auto-numbered section kickers, mono datelines, `§` for insights, rotated yellow stickers for categories, deltas and badges.
6. **Annotate, don't decorate.** Label values directly (for example the `+N this month` sticker next to the dashboard Masthead total) instead of relying on legends.

## Color tokens

Defined in the `@theme` block of `client/src/index.css`. Tailwind generates `bg-*`, `text-*`, `border-*`, etc. for each.

| Token | Value | Use |
|---|---|---|
| `paper` | `#F4F1EA` | Page background (`body`), text on ink |
| `surface` | `#FFFFFF` | Cards, inputs, tables |
| `ink` | `#111111` | Text, borders, ink panels, shadows |
| `ink-muted` | `#5E5A52` | Secondary text, metadata |
| `line` | `#D9D3C5` | Hairlines, image placeholders, skeletons |
| `signal` | `#FFCE00` | The single accent: stickers, active states, highlights, selection |
| `danger` | `#B42318` | Errors, destructive actions |
| `success` | `#1F7A3D` | Approved state |

Opacity modifiers are used for layered ink panels: `text-paper/70`, `border-paper/15`, `bg-ink/60` (drawer scrims), `bg-line/60` (skeletons).

`::selection` is signal on ink (`@layer base`).

## Typography

Fonts load from Google Fonts at the top of `index.css`.

| Token | Family | Role |
|---|---|---|
| `font-serif` | Libre Bodoni | Display: headlines, big numbers, pull quotes |
| `font-sans` | Public Sans | Body (default on `body`) |
| `font-mono` | JetBrains Mono | Kickers, labels, buttons, datelines, data |

| Role | Classes | Example |
|---|---|---|
| Display | `font-serif font-semibold tracking-tight`, tight leading (`leading-[0.85]`–`leading-[1]`) | `SectionHeading` title `text-5xl sm:text-6xl lg:text-7xl` |
| Kicker / label | `font-mono text-[11px] uppercase tracking-[0.18em]` | `SectionHeading` kicker, `Input` label (`tracking-[0.14em]`) |
| Data | `font-mono tabular-nums` | `ReadStats`, `StatCard`, table indexes |
| Body | `font-sans` 16–18px, `leading-relaxed` | Card excerpts `text-sm leading-relaxed text-ink-muted` |
| Buttons | `font-mono uppercase tracking-[0.12em]`–`[0.14em]` | `ui/Button` |
| Italic deck | `font-serif italic` | Article subtitle, `EditorsPicks` deck, `Masthead` sub |

Headline hover: `decoration-signal decoration-[3px] underline-offset-4 group-hover:underline` (cards); `decoration-4 underline-offset-[6px]` on large leads.

### Article body (`.rich-text`)

Editor HTML is styled by `.rich-text` in `index.css` (unlayered) and extra Tailwind arbitrary variants in `components/blog/BlogContent/BlogContent.jsx`:

- 18px / 1.75 body, `max-width: 68ch`;
- `h1`–`h4` serif; `h5`/`h6` mono uppercase muted;
- links underlined in signal (3px), signal background on hover;
- `blockquote`: serif italic; in articles it becomes a ruled pull quote with a rotated signal `“` sticker;
- `pre` on ink, inline `code` on surface with a line border;
- drop cap on the first paragraph (`.rich-text > p:first-child::first-letter`, 4.5rem serif);
- every `h2` gets a top rule and `scroll-mt-32` so the table of contents lands below the sticky header.

Quill's toolbar and container in the admin are re-skinned with `line` borders and `surface` background (`.ql-toolbar.ql-snow`, `.ql-container.ql-snow`).

## Shadows and easing

| Token | Value | Typical use |
|---|---|---|
| `shadow-hard-sm` | `4px 4px 0 0 ink` | Buttons, stickers, small controls |
| `shadow-hard` | `6px 6px 0 0 ink` | Cards, panels, forms |
| `shadow-hard-lg` | `9px 9px 0 0 ink` | Hover state of `shadow-hard` |
| `shadow-hard-signal` | `6px 6px 0 0 signal` | Ink panels |
| `shadow-hard-signal-lg` | `9px 9px 0 0 signal` | Hover state of ink panels, modals |
| `ease-editorial` | `cubic-bezier(0.22, 1, 0.36, 1)` | All CSS transitions (`ease-editorial` class) |

## Custom utilities

Declared with `@utility` in `index.css`.

| Utility | What it does | Used in |
|---|---|---|
| `halftone` | Signal ground with 1.1px ink dots on a 7px grid | `BlogHeader` reading-time box, `LeadCard`, `StatCard tone='halftone'`, empty states, `AiDraftOverlay` |
| `halftone-signal` | Signal dots on a transparent ground (for ink panels) | `EditorsPicks` corner, `MobileDrawer` footer, `Login` aside, `CoverUpload` placeholder, `Masthead` base strip |
| `lift` | `translate(-2px,-2px)` on hover, 200ms `ease-editorial` on transform and shadow | All clickable cards and primary CTAs |
| `section-counter` | `counter-reset: section` on a parent | `Home` sections wrapper, `BlogDetail` discussion wrapper, admin `Dashboard`, `AddBlog` |
| `section-no` | `::before` prints `01 — `, `02 — `… in `ink-muted` | `SectionHeading` kicker, `CommentList` kicker, admin section kickers |

Because numbering is a CSS counter, hiding a section (for example Gallery when there are too few posts) renumbers the rest automatically.

### Other CSS hooks

| Class | Purpose |
|---|---|
| `.reading-progress` | Scroll-driven progress bar (`animation-timeline: scroll(root block)`). Hidden in browsers without `animation-timeline`. Used in `pages/public/BlogDetail/BlogDetail.jsx` |
| `.marquee-track`, `.marquee-clone` | Marquee track and its duplicate row; both disabled under reduced motion. Used by `CategoryTicker` |
| `animate-marquee` | `marquee 40s linear infinite` (translateX 0 → -50%) |

Scrollbars are hidden globally (`::-webkit-scrollbar { display: none }`).

## Stickers

`components/ui/Sticker/Sticker.jsx` is the print-style rotated badge: `border-2`, mono uppercase.

| Prop | Values |
|---|---|
| `tone` | `signal` (default, ink text), `ink` (signal text), `paper` |
| `tilt` | `left` (`-rotate-3`, default), `right` (`rotate-2`), `none` |
| `size` | `sm`, `md`, `lg` |

Hand-rolled stickers with the same recipe (`-rotate-3 border-2 border-ink bg-signal`) appear in `CommentForm`, `CommentList`, `Masthead` and `Login`.

## Layout and breakpoints

Tailwind 4 default breakpoints: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px, `2xl` 1536px.

| Pattern | Classes |
|---|---|
| Public content width | `mx-auto max-w-7xl px-5 sm:px-8` |
| Public section rhythm | `py-16 sm:py-24`, `scroll-mt-28` on anchored sections |
| Front-page grids | 12-column at `lg` (`lg:grid-cols-12`), cards `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` |
| Admin page padding | `p-5 md:p-10` inside the scrollable `<main>` |
| Public nav switch | Desktop links from `lg`; hamburger + `MobileDrawer` below `lg` |
| Admin nav switch | `Sidebar` from `md`; `MobileNavDrawer` below `md` |

Images use fixed aspect ratios (`aspect-[4/3]`, `16/10`, `16/9`, `6/5`) with `object-cover` and a `bg-line` placeholder, so layout does not shift while loading. The Gallery uses a dense bento grid (`grid-flow-row-dense`, fixed `auto-rows`).

## Accessibility rules

| Rule | Implementation |
|---|---|
| Visible focus everywhere | Global `:focus-visible { outline: 3px solid ink; outline-offset: 3px; box-shadow: 0 0 0 6px signal }`. Inside clipped containers, components shift the outline inward (`focus-visible:outline-offset-[-3px]`) instead of removing it |
| 44px hit areas | `min-h-11` / `h-11 w-11` on buttons and links; `ui/Button` sizes are `min-h-10`, `min-h-11`, `min-h-13` |
| Skip link | `Navbar` renders "Skip to content" targeting `#main` |
| Landmarks | `<main id='main'>`, labelled `<nav>`s (`Sections`, `Mobile`, `Footer`, `Admin`), sections with `aria-labelledby` |
| Dialogs | `role='dialog'`, `aria-modal`, focus trap, Escape, focus return (`Navbar/useFocusTrap.js`, `Sidebar/MobileNavDrawer.jsx`) |
| Decorative content | Numerals, arrows, glyphs and duplicate marquee rows are `aria-hidden` |
| Live regions | Result counts in `BlogList` (`aria-live='polite'`), admin route announcements in `Layout` |
| Form errors | `ui/Input` and `ui/Textarea` wire `aria-invalid` and `aria-describedby` to a `role='alert'` message |
| Reduced motion | See [motion.md](motion.md#reduced-motion) |
| Touch vs hover | `GalleryTile` keeps captions visible on touch devices and only hides them behind `@media(hover:hover)` |

## Known gaps

- Circular spinners (`rounded-full`) in `ui/Button`, `ui/Loader`, `AiDraftButton` and `AiDraftOverlay` are the only round shapes; they contradict "no rounded corners" but are intentional loading indicators.
- `components/ui/Skeleton.jsx` sets width/height through an inline `style` object and still has a `rounded` prop, which the design rules forbid. It is also the only `ui/` component without its own folder and barrel.
- `components/forms/SearchBar/SearchBar.jsx` uses arbitrary shadows (`shadow-[6px_6px_0_0_var(--color-ink)]`, `shadow-[3px_3px_0_0_var(--color-signal)]`) instead of the shadow tokens; the 3px signal variant has no token.
- `App.jsx` styles toasts with `!`-prefixed utilities and an arbitrary `shadow-[4px_4px_0_0_var(--color-ink)]` (equal to `shadow-hard-sm`).
- `ui/Card` is styled with the tokens but is not used by any page (cards are bespoke per section).
