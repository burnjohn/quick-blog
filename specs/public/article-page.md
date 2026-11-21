# Spec: Article page
**Spec ID:** SPEC-ART-1   **Status:** As-built (chore/editorial-redesign-docs, 2026-11-20)
**Code:** `client/src/pages/public/BlogDetail/BlogDetail.jsx`, `client/src/hooks/api/queries/useBlog/useBlog.js`, `client/src/components/blog/{BlogHeader,BlogContent,ArticleAside,SocialShare,ReadNext,StoryTile,ArticleNotFound}/**`, `client/src/components/blog/helpers.js` (`buildArticleOutline`, `slugify`, `getRelatedPosts`, `getReadingTime`), `client/src/components/ui/Loader/Loader.jsx`, `client/src/index.css` (`.rich-text`, `.reading-progress`), `server/src/controllers/blogController.js` (`getBlogById`), `server/src/routes/blogRoutes.js`

## Summary
`/blog/:id` shows one post as a long-form article: a newspaper header with the byline and reading time, the cover image, the rich-text body, and a side rail with an "In this story" contents list and share actions. Below the article come the comments and a "Read next" row of related posts. If a post can't be loaded, the page shows an editorial 404 instead of an endless spinner.

## Scope / Out of scope
**In scope:** `GET /api/blog/:blogId`; loading, error and not-found states; header, cover, body, outline/contents, share, reading progress bar; Read next; page transition.

**Out of scope:**
- How comments are listed and submitted ([comments.md](comments.md)). This spec covers only where they sit on the page.
- Navbar, Footer, skip link ([home-front-page.md](home-front-page.md), AC-HOME-12…22, 52–54).

## User-visible behavior
- **While loading:** a full-screen `Loading…` spinner, with no navbar.
- **Not found / error:** Navbar, then a dark `404` card (`Stop the press`, `§ Story not found`, `This story isn’t on the press any more.`), optional `Details:` text and a `Back to the front page` button, then the Footer.
- **Article:** a yellow reading-progress bar along the top edge (only in browsers that support scroll-driven animations). A dateline row holds `← Front page`, the category sticker and `Published on <date>`. Then the large title, an optional italic subtitle, and a box with the initials avatar, `Written by <name>` and `<n> min` reading time. Next come a 16:9 cover and the body, with a rail to the left on `lg` (sticky) and above the body on smaller screens. The rail holds a numbered `§ In this story` list that highlights the section being read, and `Share this story` buttons, including `Copy link`.
- **Below the article:** a `Discussion` area (comment list and the `Letters to the editor` form), then `Read next` with up to three related stories.

## Acceptance criteria

### Server
| ID | Requirement |
|----|-------------|
| AC-ART-01 | WHEN `GET /api/blog/:blogId` is called with the id of an existing blog THE SYSTEM SHALL respond `200 { success:true, blog }`, with `image` turned into an absolute URL (AC-HOME-02), without authentication. |
| AC-ART-02 | IF no blog has that id THEN THE SYSTEM SHALL respond `404 { success:false, message:'Blog not found' }`. |

### Data
| ID | Requirement |
|----|-------------|
| AC-ART-04 | WHEN the page mounts or the route `id` changes THE SYSTEM SHALL request `GET /api/blog/<id>`, starting with `loading = true`. |
| AC-ART-05 | IF the response has `success:false` or the request fails THEN THE SYSTEM SHALL store the server `message` (falling back to the error message, then to `Failed to fetch blog details.`) as the error and show it as an error toast. |
| AC-ART-06 | THE SYSTEM SHALL request the approved comments for the route `id` when the page mounts (see [comments.md](comments.md)). |
| AC-ART-07 | THE related posts SHALL be up to 3 posts from `AppContext.blogs` (the published list, AC-HOME-03), never the current post: posts in the same category first, newest first, then the newest posts from other categories. |

### Loading and not-found states
| ID | Requirement |
|----|-------------|
| AC-ART-08 | WHILE the post is loading THE SYSTEM SHALL render only the full-screen `Loader` (`role="status"`, `aria-live="polite"`, text `Loading…`). |
| AC-ART-09 | IF loading has finished with an error, or with no blog, THEN THE SYSTEM SHALL render Navbar, `ArticleNotFound` inside `main#main`, and Footer. |
| AC-ART-10 | `ArticleNotFound` SHALL show an `aria-hidden` `404`, the sticker `Stop the press`, the kicker `§ Story not found`, the `h1` `This story isn’t on the press any more.`, the text `It may have been unpublished, moved or never existed.`, and, WHEN an error message is present, `Details: <message>`. It SHALL end with a `Back to the front page` link to `/`. |

### Header
| ID | Requirement |
|----|-------------|
| AC-ART-11 | THE dateline row SHALL contain a `← Front page` link to `/`, a category sticker WHEN `category` is set, and `Published on <time dateTime=createdAt>` formatted as `MMMM Do YYYY` (e.g. `November 20th 2026`). |
| AC-ART-12 | THE title SHALL render as the page `h1`. WHEN `subTitle` is set it SHALL render below the title as an `h2` with a signal-colored left rule. |
| AC-ART-13 | THE byline box SHALL show `Written by` and the author: the `author` prop, else `blog.authorName`, else `Michael Brown`. It SHALL also show an `aria-hidden` avatar with up to 2 upper-case initials. |
| AC-ART-14 | THE byline box SHALL show the reading time as `<n> min` with the label `Reading time`, where `n = max(1, round(words / 220))` (AC-HOME-30). |
| AC-ART-15 | THE title, subtitle and byline box SHALL rise 20 px and fade in over 0.6 s, with delays of 0.05 s, 0.15 s and 0.25 s. |

### Cover and body
| ID | Requirement |
|----|-------------|
| AC-ART-16 | WHEN `image` is set THE SYSTEM SHALL render it in a `figure` at 16:9 with `alt` `Cover image for “<title>”`, fading in and scaling from 1.08 to 1 over 1.2 s. |
| AC-ART-17 | BEFORE rendering THE SYSTEM SHALL parse the description HTML with `DOMParser` and give every `h2` with non-empty text the id `section-<slug>`. The slug is the text lower-cased and trimmed, with characters other than `a-z 0-9 space -` removed, spaces turned into `-`, and a 60-character limit, falling back to `index + 1`. A duplicate id SHALL get `-<index + 1>` appended until it is unique. |
| AC-ART-18 | THE SYSTEM SHALL render the processed HTML in a `.rich-text` container (max width 68ch), with a serif drop cap on the first letter of the first paragraph and `h2` scroll margins that leave room for the sticky header. |
| AC-ART-19 | WHILE the browser supports `animation-timeline: scroll()` THE SYSTEM SHALL show a fixed, `aria-hidden`, 4 px signal bar at the top of the viewport whose width follows the page's scroll progress; otherwise the bar SHALL be `display:none`. Reduced-motion settings SHALL NOT disable it. |
| AC-ART-20 | WHEN the route `id` changes THE article content SHALL play the page transition again (`PageTransition` keyed by `id`). |

### Article rail ("In this story" and sharing)
| ID | Requirement |
|----|-------------|
| AC-ART-21 | THE rail SHALL be an `aside aria-label="Article tools"`. On `lg` it SHALL take 3 of 12 columns and stick at `top-28`, with the body in columns 5–12; below `lg` it SHALL appear above the body. |
| AC-ART-22 | WHEN the outline has 1 or more headings THE rail SHALL show a `nav` labelled by `§ In this story`, with an ordered list of links `#<id>`, each prefixed `01`, `02`, …; WHEN there are no headings the list SHALL be omitted. |
| AC-ART-23 | THE active heading SHALL be the last outline `h2` whose top is at or above 30 % of the viewport height, recalculated on scroll and resize (once per animation frame). The active link SHALL get `aria-current="location"`, bold text, a signal highlight and an ink indicator bar. |
| AC-ART-24 | WHEN a contents link is activated THE SYSTEM SHALL scroll its heading to the top (`behavior:'smooth'`, or `'auto'` WHILE reduced motion is preferred) and replace the URL hash with `#<id>` without adding a history entry. |
| AC-ART-25 | THE rail SHALL show `Share this story` with the buttons `Facebook` (`aria-label="Share on Facebook"`), `Twitter` (`aria-label="Share on Twitter"`), `Google+` (`aria-label="Share on Google Plus"`) and `Copy link`. |
| AC-ART-26 | WHEN `Copy link` is pressed THE SYSTEM SHALL write `window.location.href` to the clipboard and toast `Link copied`; IF the write fails THEN THE SYSTEM SHALL toast `Could not copy the link`. |

### Discussion and Read next
| ID | Requirement |
|----|-------------|
| AC-ART-27 | BELOW the article THE SYSTEM SHALL render a `section aria-label="Discussion"` with the comment list (7 of 12 columns on `lg`) and the comment form (5 of 12, sticky at `top-28` on `lg`), stacked below `lg`. |
| AC-ART-28 | IF there are no related posts THEN Read next SHALL render nothing. Otherwise it SHALL render a section titled `Read next`, with the kicker `More from <category>` WHEN every related post shares the article's category, else `Keep reading`. |
| AC-ART-29 | EACH Read next tile SHALL link to `/blog/<id>` and show the cover (lazy-loaded, `alt=""`), or a halftone block with the padded index WHEN there is no image. It SHALL also show a category sticker, `Nº <NN>`, the title as `h3`, the first 120 characters of the description with tags removed, and `<short date> · <n> min read`. The middle tile SHALL use the signal tone. Tiles SHALL sit in 3 columns from `md` up. |
| AC-ART-30 | THE `Conversation` and `Read next` kickers SHALL be numbered by the section counter (AC-HOME-09), starting at `01`. |

### Accessibility & motion
| ID | Requirement |
|----|-------------|
| AC-ART-31 | THE article, the not-found state and their surroundings SHALL render inside `<main id="main" tabIndex=-1>`, so the Navbar skip link works. |
| AC-ART-32 | Motion SHALL follow AC-HOME-56/57: entrance animations respect `prefers-reduced-motion`, and Reveal shows content right away when `IntersectionObserver` is not available. |
| AC-ART-33 | THE `Front page`, contents and share controls SHALL be at least 44 px tall (`min-h-11`). |

### Responsive
| ID | Requirement |
|----|-------------|
| AC-ART-34 | THE title SHALL scale through `text-5xl`, `sm:text-7xl` and `lg:text-8xl`. On `lg` THE header SHALL use a 9/3 split (title / byline box); below `lg` the byline box SHALL sit under the title as a horizontal strip. |

## Contracts
```http
GET /api/blog/:blogId
200 { "success": true, "blog": Blog }
404 { "success": false, "message": "Blog not found" }
500 { "success": false, "message": "Cast to ObjectId failed for value \"<id>\" ...", "stack"?: "..." }   // malformed id; stack only when NODE_ENV=development
```
`Blog` as in [home-front-page.md](home-front-page.md#contracts).

## Edge cases
- **Malformed id** (e.g. `/blog/notanid`): the server responds `500` with a Mongoose CastError message; the client shows the not-found card with `Details: Cast to ObjectId failed…` and the same text in a toast.
- **Valid but unknown id:** `404 Blog not found`; the not-found card shows `Details: Blog not found`.
- **Article with no `h2`:** no contents box; the rail shows only the share block.
- **Headings with the same text:** the ids become `section-x`, `section-x-<n>`, and so on.
- **A heading of only symbols** (slug is empty): the id falls back to `section-<index + 1>`.
- **Published list not loaded yet, or failed:** Read next is empty and hidden; it appears once `AppContext.blogs` arrives.
- **Moving between articles through Read next:** `useBlog` goes back to loading, so the full-screen Loader replaces the page until the new post arrives.

## Known gaps
- **Unpublished drafts are publicly readable.** `getBlogById` doesn't check `isPublished`, so anyone with the URL can read a draft, even though the not-found copy talks about "unpublished".
- **Malformed ids return a raw 500.** The CastError reaches the global handler, so readers see the internal Mongoose message in `Details:` and in a toast, and in development the response includes a stack trace.
- **Unsanitized HTML.** The body is rendered with `dangerouslySetInnerHTML` and nothing is sanitized on the client or the server. Editor-authored or AI-generated HTML reaches readers as is, including event-handler attributes such as `<img onerror>`.
- **Three share buttons do nothing.** `Facebook`, `Twitter` and `Google+` have no handler, and Google+ no longer exists. Only `Copy link` works.
- **The Loader replaces the whole shell** (no Navbar). Clicking a Read next tile flashes a blank screen with a spinner.
- **No scroll reset on route change.** The router has no scroll restoration or scroll-to-top, so where the new page lands depends on browser clamping, not on intent.
- The byline fallback `Michael Brown` is hard-coded.
- The error state shows the message twice: in the toast and in `Details:`.

## Related specs
- [comments.md](comments.md): discussion section
- [home-front-page.md](home-front-page.md): Navbar, Footer, shared motion rules, `GET /api/blog/all`
