# Pages and routes

Routes are declared in `client/src/App.jsx`; paths live in `client/src/constants/routes.js`. Pages are containers: they read context and hooks and pass data down. Components are described in [components.md](components.md).

| Path | Constant | Element |
|---|---|---|
| `/` | `ROUTES.HOME` | `pages/public/Home/Home.jsx` |
| `/blog/:id` | `ROUTES.BLOG_DETAIL` (`getBlogDetailPath(id)`) | `pages/public/BlogDetail/BlogDetail.jsx` |
| `/admin` | `ROUTES.ADMIN` / `ADMIN_DASHBOARD` | `Layout` with index `Dashboard` when a token exists, otherwise `Login` |
| `/admin/addBlog` | `ROUTES.ADMIN_ADD_BLOG` | `pages/admin/AddBlog/AddBlog.jsx` |
| `/admin/listBlog` | `ROUTES.ADMIN_LIST_BLOG` | `pages/admin/ListBlog/ListBlog.jsx` |
| `/admin/comments` | `ROUTES.ADMIN_COMMENTS` | `pages/admin/Comments/Comments.jsx` |

Global wrappers (`main.jsx`, `App.jsx`): `BrowserRouter` → `AppProvider` → `MotionConfig reducedMotion='user'` → `Toaster` (bottom-right, ink-bordered) + `Routes`. Quill's `quill.snow.css` is imported in `App.jsx`.

Without a token, every `/admin/*` path renders `Login`, because `Login` replaces the `Layout` parent and has no outlet.

## Home (`/`)

Data: `blogs` and `input` (search term) from `AppContext`. Home makes no requests of its own.

Derived in `Home.jsx` (constants at the top of the file):

| Value | Rule |
|---|---|
| `newest` | `sortByNewest(blogs)` (the API returns oldest first) |
| `cover` | First 5 of `photosFirst(newest)`; empty while searching |
| `latestExcludes` | Cover ids, only when there are at least 8 posts (`MIN_TO_EXCLUDE_COVER`) |
| `showSections` | Not searching and at least 6 posts (`MIN_FOR_SECTIONS`) |
| `offCover` | `newest` without the cover stories |
| `picks` | `pickLongReads(newest, coverIds)`: the 3 posts with the most words |
| `archive` | `offCover` reversed (oldest first), first 8 |

Top to bottom:

1. **Navbar**: skip link, ink dateline (Vol. I · Nº {week} · date · "{n} stories live"), logo, section links (`lg+`), "Login" / "Dashboard" button, hamburger + `MobileDrawer` below `lg`.
2. `<main id='main'>` inside `PageTransition`:
   1. **Header** (`forms/Header`): "The QuickBlog Journal" kicker `h1`, compact `SearchBar` (in the top rule on `lg`, below the cover on smaller screens), then **FrontCover**: `CoverLead` and up to four `CoverBrief`s under "Also on the cover".
   2. A `section-counter` wrapper, so kickers read `01 — Latest`, `02 — Gallery`, … (hidden sections take no number):
      - **BlogList** `#latest` "Latest stories": category filter (All, Technology, Startup, Lifestyle, Finance), 6 cards per page, "Load N more". While searching the kicker becomes "Search" and the title "Search results"; search matches title or category and ignores `excludeIds`.
      - **Gallery** `#gallery` "In pictures" (if `showSections`): 7 tiles from `offCover`, own category filter.
      - **CategoryDesks** `#desks` "By the desk" (if `showSections`): one panel per category that has posts outside the cover.
      - **EditorsPicks** `#picks` "Worth the evening" (if at least 2 picks): ink band with the long reads.
      - **ArchiveList** `#archive` "Still worth reading" (if the archive is not empty): oldest stories.
   3. **NewsletterForm** "Never miss a blog!" (outside the counter, unnumbered).
3. **Footer**.

Hash links (`/#gallery` from the navbar or another page) are handled by an effect that scrolls to the section once `blogs` have loaded, since the sections do not exist before that.

## BlogDetail (`/blog/:id`)

Data: `useBlog(id)`, `useComments(id)`, `blogs` from context (for related posts). `buildArticleOutline(blog.description)` (memoized) adds ids to every `h2` and returns the table of contents.

States:

| State | Render |
|---|---|
| Loading | Full-screen `Loader` (no navbar) |
| Error or no blog | Navbar + `ArticleNotFound` (404 panel, error text as detail) + Footer |
| Loaded | See below |

Top to bottom when loaded:

1. Fixed signal **reading-progress** bar (CSS scroll timeline).
2. **Navbar**.
3. `PageTransition` keyed by `id`:
   1. `<article>`:
      - **BlogHeader**: dateline row with "← Front page" link, category sticker, "Published on {date}"; title; subtitle (if any); byline and reading-time box.
      - **BlogContent**: cover image, then a 12-column grid with the **ArticleAside** rail (3 cols, sticky on `lg`: "§ In this story" contents with the active section highlighted, then **SocialShare**) and the `.rich-text` body (cols 5–12).
   2. A `section-counter` wrapper:
      - **Discussion** (`aria-label='Discussion'`): `CommentList` (7 cols) and a sticky `CommentForm` (5 cols). Comments come from `POST /api/blog/comments`, which returns approved comments only (newest first); a new comment appears after an admin approves it.
      - **ReadNext** "Read next": up to 3 related posts (same category first, then newest), as `StoryTile`s.
4. **Footer**.

## Admin layout (`pages/admin/Layout/Layout.jsx`)

| Area | Behavior |
|---|---|
| Top bar (70px, ink) | Hamburger (below `md`, opens `MobileNavDrawer`), logo button to `/` with "Admin" tag, "Editor's desk · {date}" (`lg+`), Logout |
| Logout | Removes `token` from `localStorage`, clears it in context, navigates to `/`, toasts `MESSAGES.SUCCESS_LOGOUT` |
| Sidebar (`md+`) | `w-64`, collapses to a 76px icon rail; state persisted in `localStorage['admin.sidebarCollapsed']` (falls back to memory if storage is unavailable) |
| Mobile drawer (below `md`) | Left slide-in, focus trapped, Escape and link click close it |
| Content | Scrollable `<main>` with the animated outlet; scroll resets to top after each route change |
| Announcements | `sr-only` `aria-live` region reads "{Page} page" on navigation |

Navigation items (`components/admin/shared/Sidebar/navItems.js`): Dashboard, Add blogs, Blog lists, Comments.

## Dashboard (`/admin`)

Data: `useAdminDashboard()` (`GET /api/admin/dashboard`). A full-screen `Loader` shows only on the first load; refetches keep the table mounted so rows can animate out.

Top to bottom (inside `section-counter`):

1. **AdminPageHeader** "Overview" / "Dashboard" with "✦ Write a story" link to Add Blog.
2. **Masthead**: dateline (`Vol. 1 · No. {blogs}`, "Quick Blog · Editor's desk", long date), "Stories on file" giant count, "+{n} this month" sticker, "{n} stories went to press this month", insights "Pipeline" (live of total), "On the spike" (drafts), "This month" (written, published, comments).
3. Four **StatCards**: Comments (all time), Drafts (halftone), Written this month, Published this month (signal).
4. **Latest Blogs**: numbered kicker, "All blogs →" link, `AdminTable` of `recentBlogs` with `BlogTableItem` rows (publish toggle, delete). Actions call `refetch`.

## Add Blog (`/admin/addBlog`)

A single `<form noValidate>` inside `section-counter`.

1. **AdminPageHeader** "New story" / "Add Blog", with "Filing to the front page" or "Filing as draft".
2. Two columns on `lg` (`1fr` + 360px):
   - **Headline panel** (surface): "01 — Headline"; Blog Title (serif input); Sub Title; "Blog Description" label with **AiDraftButton** (disabled until there is a title) and its hint; Quill editor (`theme: 'snow'`, created once in an effect) with **AiDraftOverlay** while generating.
   - **Publishing aside** (ink, sticky): "02 — Cover & filing"; **CoverUpload**; **CategorySelect** (default `Startup`); **PublishToggle** (default off); "Add Blog" submit (`accent`, loading while creating).

Submit validates in order and toasts the first failure: title, sub title, image, category, description (empty or `<p><br></p>`). It then calls `useCreateBlog().createBlog(blog, image)` (multipart `POST /api/blog/add`) and resets the form on success. "Generate with AI" calls `useBlogGenerator().generateContent(title)` and writes the returned HTML into the editor.

## List Blog (`/admin/listBlog`)

Data: `useAdminBlogs()` (`GET /api/admin/blogs`).

1. **AdminPageHeader** with eyebrow "{n} total", title "All Blogs", and a **SegmentedControl** All / Published / Drafts with counts.
2. **AdminTable** (#, Blog Title, Date, Status, Actions; date and status hidden below `sm`) with `BlogTableItem` rows.

The filter is stored in the URL (`?status=published|drafts`, removed for "All", `replace: true`). Each filter has its own empty message ("Nothing published yet", "No drafts on the spike").

## Comments (`/admin/comments`)

Data: `useAdminComments()` (`GET /api/admin/comments`).

1. **AdminPageHeader** "Moderation" / "Comments" with a **SegmentedControl** Approved / Not Approved (default "Not Approved") and counts.
2. **AdminTable** (Details, Date, Actions) with `CommentTableItem` rows; the panel cross-fades when the filter changes. Approve moves a comment to the other tab; delete asks for confirmation (`window.confirm`).

## Login (`/admin` without a token)

`components/admin/auth/Login/Login.jsx`. Ink aside (logo, "Editor's desk · Vol. 1", "§ Restricted edition", "Write. Edit. Publish.", "Staff only" sticker) and the form panel ("Restricted area", "Admin Login", Email, Password, Login button). Calls `adminApi.login`; on success stores the token (`setToken` + `localStorage`) and toasts; the route then renders `Layout`.

## Known gaps

- No catch-all route: unknown paths render an empty page.
- `BlogDetail` does not show a loading state for comments and does not pass `loading` to `CommentForm`.
- Related posts come from the context list of published posts; if that list fails to load, "Read next" is empty.
- The Comments filter lives in component state, while List Blog keeps its filter in the URL.
- `AddBlog` keeps each field in its own `useState` (it does not use `hooks/utils/useForm`) and logs the form payload with `console.log` on submit.
- AI drafting: `useBlogGenerator` returns `generatedContent` captured before the request, so the first "Generate with AI" call can return `null` and leave the editor empty. See [data-layer.md](data-layer.md#known-gaps).
