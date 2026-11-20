# Component catalog

All paths are relative to `client/src/components/`. Each component lives in `Name/Name.jsx` with an `index.js` barrel unless noted. Folder barrels (`ui/index.js`, `layout/index.js`, `blog/index.js`, `forms/index.js`, `comment/index.js`, `admin/index.js`) re-export the main components; some newer components (for example `FrontCover`, `Gallery`) are imported by path instead.

Before adding a component, check `ui/` (public and admin) and `admin/shared/` (admin). Styling rules: [design-system.md](design-system.md). Motion specs: [motion.md](motion.md).

## `ui/` — primitives

| Component | Purpose | Key props | Used in |
|---|---|---|---|
| `Button` | Mono uppercase button with variants | `variant` (`primary` ink, `accent` signal, `secondary`, `outline`, `danger`, `ghost`), `size` (`sm` 40px, `md` 44px, `lg` 52px), `loading`, `fullWidth`, `type` (default `'button'`) | `SearchBar`, `CommentForm`, `NewsletterForm`, `Login`, `AddBlog` |
| `Input` | Labelled text input with error message | `label`, `error`, `required`, `containerClassName`, `id` (auto via `useId`) | `CommentForm`, `Login`, `AddBlog` |
| `Textarea` | Labelled textarea, same API as `Input` | `label`, `error`, `rows` (4) | `CommentForm` |
| `Badge` | Flat mono label | `variant` (`primary`, `secondary`, `success`, `warning`, `danger`, `info`), `size` | `CommentTableItem` ("Approved") |
| `Sticker` | Rotated print badge | `tone` (`signal`, `ink`, `paper`), `tilt` (`left`, `right`, `none`), `size` | Cards, `CoverLead`, `BlogHeader`, `DeskPanel`, `EditorsPicks`, `ArticleNotFound`, `NewsletterForm` |
| `Reveal` | Scroll-triggered fade + rise; also re-exports motion presets | `as`, `index`, `y` | Most public sections (see [motion.md](motion.md#reveal-componentsuirevealrevealjsx)) |
| `Loader` | Full-screen loading state (`role='status'`) | none | `BlogDetail`, admin `Dashboard`, `ListBlog`, `Comments` |
| `Skeleton` (`ui/Skeleton.jsx`, no folder) | Pulsing placeholder block | `className`, `width`, `height` | Not used |
| `Card` | Compound card (`Card.Image`, `.Badge`, `.Body`, `.Title`, `.Description`) | `hover`, `onClick` | Not used by pages; tested in `Card.test.jsx` |

## `layout/`

| Component | Purpose | Key props | Used in |
|---|---|---|---|
| `Navbar` | Sticky masthead: ink dateline strip (volume, issue number = week of year, date, live story count), logo, section links, account button, hamburger. Condenses on scroll | none (reads `navigate`, `token`, `blogs` from context) | `Home`, `BlogDetail` |
| `Navbar/MobileDrawer.jsx` | Right-side ink drawer with numbered section links and account CTA | `open`, `onClose`, `onAccount`, `accountLabel`, `returnFocusRef` | `Navbar` (below `lg`) |
| `Navbar/useFocusTrap.js` | Focus trap, Escape, body scroll lock, focus return | `{ active, containerRef, returnFocusRef, onEscape }` | `MobileDrawer` |
| `Navbar/navLinks.js` | Section hash links: Latest, Gallery, Desks, Editor's picks, Archive (`/#latest`, …) | — | `Navbar`, `MobileDrawer` |
| `Footer` | Ink footer: about text, link columns from `assets.footer_data`, giant wordmark, copyright | none | `Home`, `BlogDetail` |
| `SectionHeading` | Numbered kicker (`section-no`) + serif title + optional right-side slot + drawn rule | `id` (for `aria-labelledby`), `kicker`, `title`, `tone` (`paper`, `ink`), `children` | All Home sections, `ReadNext` |
| `PageTransition` | Route enter fade + 12px rise | `className` | `Home`, `BlogDetail` |
| `Container` | Max-width wrapper | `size` (`sm`, `default`, `lg`, `full`) | Not used |
| `Section` | `<section className='py-10'>` | — | Not used |

## `blog/`

Shared logic is in `blog/helpers.js` (pure, no imports): `sortByNewest`, `getReadingTime` / `formatReadingTime` (220 wpm), `padIndex`, `getIssueNumber`, `formatDateline`, `isPhotoCover` / `photosFirst` / `uniqueByImage` / `withPhotoLead`, `groupByCategory`, `pickLongReads`, `getRelatedPosts`, `filterBlogs`, `slugify`, `buildArticleOutline`.

### Front page sections

| Component | Purpose | Key props | Used in |
|---|---|---|---|
| `FrontCover` | Above-the-fold cover: lead (7 of 12 cols) + "Also on the cover" rail | `stories` (lead first; returns `null` when empty) | `Home` (inside `forms/Header`) |
| `FrontCover/CoverLead.jsx` | Full-bleed lead photo with ink scrim, "★ Cover story" sticker, headline, deck | `blog` | `FrontCover` |
| `FrontCover/CoverBrief.jsx` | Secondary story: 4:3 thumb + category, reading time, headline, date | `blog` | `FrontCover` |
| `BlogList` | "Latest stories" (`#latest`): result count, `CategoryFilter`, `BlogGrid`, "Load N more" (page size 6). Switches to "Search results" when a search is active | `excludeIds` (skipped only when unfiltered) | `Home` |
| `BlogGrid` | Staggered 1/2/3-column grid of `BlogCard`, or a dashed empty state with optional reset | `blogs`, `onReset`, `staggerFrom` | `BlogList` |
| `BlogCard` | Story card: photo, category sticker, title, excerpt, `Nº` index, date, reading time. Whole card is `role='link'` | `blog`, `index` | `BlogGrid` |
| `CategoryFilter` | Category chips with sliding signal indicator, `aria-pressed` | `activeCategory`, `onCategoryChange`, `indicatorId`, `label` | `BlogList`, `Gallery` |
| `Gallery` | "In pictures" (`#gallery`): 7-tile bento of covers, photos first, no repeated images, own category filter | `blogs` | `Home` |
| `Gallery/GalleryTile.jsx` | Image tile with category sticker and caption | `blog`, `featured` | `Gallery` |
| `CategoryDesks` | "By the desk" (`#desks`): one panel per category (excluding cover stories) | `blogs`, `excludeIds` | `Home` |
| `CategoryDesks/DeskPanel.jsx` | Desk: italic category title, story-count sticker, lead photo + headline, up to 3 more headlines with square thumbs | `category`, `posts`, `total` | `CategoryDesks` |
| `EditorsPicks` | "Worth the evening" (`#picks`): the ink band, three longest posts not on the cover, numbered signal stickers | `picks` | `Home` |
| `ArchiveList` | "Still worth reading" (`#archive`): two-column numbered index of the oldest posts | `blogs` | `Home` |
| `CategoryTicker` | Signal marquee of category names | none | Not rendered (tested only) |
| `LeadCard` | Halftone lead card with parallax | `blog` | Not rendered (tested only) |

### Article

| Component | Purpose | Key props | Used in |
|---|---|---|---|
| `BlogHeader` | Dateline row (slot for back link, category sticker, publish date), giant title, subtitle, byline + reading-time box | `blog`, `author` (falls back to `blog.authorName`, then `'Michael Brown'`), `children` | `BlogDetail` |
| `BlogContent` | Cover figure + `.rich-text` body (via `dangerouslySetInnerHTML`); optional side rail | `image`, `title`, `content`, `children` (rail) | `BlogDetail` |
| `ArticleAside` | Sticky rail: "§ In this story" contents with active section, plus `SocialShare` | `headings` (`{ id, text }[]` from `buildArticleOutline`) | `BlogDetail` |
| `ArticleAside/useActiveHeading.js` | Returns the id of the last heading above 30% of the viewport | `ids` | `ArticleAside` |
| `SocialShare` | Facebook, Twitter, Google+ buttons and "Copy link" (clipboard + toast) | `title` | `ArticleAside` |
| `ReadNext` | "Read next": 3 related posts as `StoryTile`s; kicker "More from {category}" when all share the category | `posts`, `category` | `BlogDetail` |
| `StoryTile` | Secondary story tile (`surface` or `signal` tone, optional halftone header instead of image) | `blog`, `index`, `tone`, `showImage` | `ReadNext` |
| `ArticleNotFound` | Ink 404 panel ("Stop the press") with back link and optional error detail | `message` | `BlogDetail` |

## `comment/`

| Component | Purpose | Key props | Used in |
|---|---|---|---|
| `CommentList` | Numbered "Conversation" kicker, "Comments (n)" title, list or empty state (`MESSAGES.INFO_NO_COMMENTS`) | `comments` | `BlogDetail` |
| `CommentItem` | Initials avatar, name, relative time, serif comment text; rendered as a `Reveal` `<li>` | `comment`, `index` | `CommentList` |
| `CommentForm` | "Letters to the editor" form: name + comment, clears on `{ success: true }` | `onSubmit` (async, returns result), `loading` | `BlogDetail` |

## `forms/`

| Component | Purpose | Key props | Used in |
|---|---|---|---|
| `Header` | Slim front-page masthead: "The QuickBlog Journal" `h1` kicker, compact search (in the rule on `lg`, under the cover below `lg`), cover slot | `children` (the cover) | `Home` |
| `SearchBar` | `role='search'` form, submits non-empty input; "Clear Search" button when a term is active | `onSearch`, `onClear`, `hasSearchTerm`, `compact` | `Header` |
| `NewsletterForm` | "Never miss a blog!" section with ink sign-up form. Validates email, then simulates success after 1s (no API) | none | `Home` |
| `Newsletter` | Alias that renders `NewsletterForm` | none | Not used |

## `admin/shared/`

| Component / module | Purpose | Key props | Used in |
|---|---|---|---|
| `AdminPageHeader` | Page title block: signal-square eyebrow, serif `h1`, right-side controls slot | `eyebrow`, `title`, `children` | `Dashboard`, `AddBlog`, `ListBlog`, `Comments` |
| `AdminTable` | Table frame: ink header row, hard shadow, animated rows, `EmptyState` row | `columns` (`{ label, className }[]`), `isEmpty`, `emptyMessage`, `emptyHint`, `children` | `Dashboard`, `ListBlog`, `Comments` |
| `AdminTable/AdminTableRow.jsx` | `<motion.tr>` that rises in and slides out | `index`, `className` | `BlogTableItem`, `CommentTableItem` |
| `Masthead` | Ink front-page block: dateline, label, giant number (`CountUp`), sticker, italic sub, row of "§" insights | `dateline` (string[]), `label`, `value`, `sticker`, `sub`, `insights` (`{ kicker, text }[]`) | `Dashboard` |
| `CountUp` | Animated integer with screen-reader final value | `value`, `format` (stable fn), `className` | `Masthead`, `StatCard` |
| `SegmentedControl` | Toggle group (`aria-pressed`) with sliding ink indicator and optional 2-digit counts | `options` (`{ value, label, count? }[]`), `value`, `onChange`, `label`, `layoutId` | `ListBlog`, `Comments` |
| `EmptyState` | Halftone "∅" stamp, serif title, mono hint | `title`, `hint` | `AdminTable` |
| `Sidebar` | Desktop ink sidebar (from `md`), collapsible to a 76px icon rail | `collapsed`, `onToggle` | `Layout` |
| `Sidebar/SidebarNav.jsx` | `NavLink` list with sliding signal indicator | `collapsed`, `indicatorId`, `onNavigate` | `Sidebar`, `MobileNavDrawer` |
| `Sidebar/MobileNavDrawer.jsx` | Left ink drawer (below `md`) with focus trap | `isOpen`, `onClose` | `Layout` |
| `Sidebar/navItems.js` | `NAV_ITEMS` (Dashboard, Add blogs, Blog lists, Comments) and `getNavLabel(pathname)` | — | `SidebarNav`, `Layout` |
| `motion.js` | Admin motion presets | — | See [motion.md](motion.md#clientsrccomponentsadminsharedmotionjs) |
| `editorial.js` | `pad2`, `plural(count, one, many)`, `longDateLabel(date)` (en-GB) | — | `Dashboard` |

## `admin/blog/`

| Component | Purpose | Key props | Used in |
|---|---|---|---|
| `CoverUpload` | Dashed drop area with halftone placeholder or image preview; hidden file input `#image` (`accept='image/*'`) | `image` (File or `false`), `onChange(file)`, `disabled` | `AddBlog` |
| `CategorySelect` | Native `<select id='category'>` of categories without "All", styled for the ink panel | `value`, `onChange(value)`, `disabled` | `AddBlog` |
| `PublishToggle` | Native checkbox `#isPublished` drawn as a switch; caption "Goes live on save" / "Saved as a draft" | `checked`, `onChange(bool)`, `disabled` | `AddBlog` |
| `AiDraftButton` | "✦ Generate with AI" button with busy label, `aria-busy`, `aria-describedby` hint | `onClick`, `disabled`, `isGenerating`, `hintId` | `AddBlog` |
| `AiDraftButton/AiDraftOverlay.jsx` | Halftone overlay "Drafting from your headline…" over the editor | `isGenerating` | `AddBlog` |
| `BlogTableItem` | Table row: index, title, date, status pill, Publish/Unpublish and delete (✕) actions via `useBlogActions` | `blog`, `index` (1-based), `onUpdate` | `Dashboard`, `ListBlog` |

## `admin/comment/`

| Component | Purpose | Key props | Used in |
|---|---|---|---|
| `CommentTableItem` | Row with blog / name / comment definition list, date, Approve (or "Approved" badge) and delete, via `useCommentActions` | `comment`, `index`, `onUpdate` | `Comments` |

## `admin/dashboard/`

| Component | Purpose | Key props | Used in |
|---|---|---|---|
| `StatCard` (`dashboard/StatCard.jsx`, no folder) | Stat tile with 2-digit `CountUp`, label and note | `label`, `value`, `tone` (`surface`, `signal`, `halftone`, `ink`), `note`, `index` | `Dashboard` |

## `admin/auth/`

| Component | Purpose | Key props | Used in |
|---|---|---|---|
| `Login` | Split screen: ink aside ("Write. Edit. Publish.", "Staff only" sticker) and login form. On success stores the token in context and `localStorage` | none | `App.jsx` (rendered at `/admin` when there is no token) |

## Known gaps

- Not rendered anywhere: `ui/Card`, `ui/Skeleton`, `layout/Container`, `layout/Section`, `blog/CategoryTicker`, `blog/LeadCard`, `forms/Newsletter`. They are still exported and some have tests.
- `SocialShare`: the Facebook, Twitter and Google+ buttons have no click handler; only "Copy link" works.
- `NewsletterForm` does not call an API; it shows a success toast after a `setTimeout`.
- `Footer` links all point to `href='#'`.
- `BlogHeader` falls back to a hard-coded author name (`'Michael Brown'`).
- `CommentForm` supports `loading`, but `BlogDetail` never passes it, so the submit button has no busy state.
- `CoverUpload` calls `URL.createObjectURL(image)` on every render and never revokes the URL.
- `BlogCard` is an `<article role='link'>` with a click handler (Enter key only, via `getLinkKeyHandler`) while other cards use real `<Link>` elements.
- `StatCard` and `ui/Skeleton` do not follow the folder-per-component layout.
