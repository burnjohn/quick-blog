# Spec: Home front page
**Spec ID:** SPEC-HOME-1   **Status:** As-built (chore/editorial-redesign-docs, 2026-11-20)
**Code:** `client/src/pages/public/Home/Home.jsx`, `client/src/context/AppContext/AppContext.jsx`, `client/src/components/layout/{Navbar,Footer,SectionHeading,PageTransition}/**`, `client/src/components/forms/{Header,SearchBar}/**`, `client/src/components/blog/{FrontCover,BlogList,BlogGrid,BlogCard,CategoryFilter,Gallery,CategoryDesks,EditorsPicks,ArchiveList}/**`, `client/src/components/blog/helpers.js`, `client/src/components/ui/Reveal/**`, `client/src/constants/categories.js`, `client/src/index.css` (section counter, reduced motion), `server/src/controllers/blogController.js` (`getAllBlogs`), `server/src/utils/imageUrl.js`

## Summary
The front page (`/`) is laid out like a newspaper edition: a masthead with search, a photo-led cover, a filterable "Latest stories" grid, and a run of editorial sections (In pictures, By the desk, Worth the evening, Still worth reading), then the newsletter and footer. Every section is built on the client from one list of published posts loaded at app start, so the page needs a single content request. Search and category filtering are simple client-side filters, so they are covered here and have no separate spec.

## Scope / Out of scope
**In scope:** `GET /api/blog/all`; app-level loading of posts; Navbar (dateline strip, section links, account button, mobile drawer with focus trap); masthead and search; FrontCover; Latest stories (category filter, search results, load more, empty state); Gallery; CategoryDesks; EditorsPicks; ArchiveList; Footer; section numbering; hash navigation; motion, accessibility and responsive behavior of these parts.

**Out of scope:**
- Newsletter block ([newsletter.md](newsletter.md)).
- Article page ([article-page.md](article-page.md)).
- Server-side search, pagination, SEO/SSR (not implemented).

## User-visible behavior
- **Navbar (sticky).** A thin ink strip (the dateline) reads `Vol. I · Nº <week>` on the left, the full date in the middle (from `sm`), and `<N> stories live` on the right. Below it is the paper bar with the `QuickBlog.` logo, section links (`Latest`, `Gallery`, `Desks`, `Editor's picks`, `Archive`) from `lg`, a `Login` / `Dashboard` button from `sm`, and a yellow hamburger below `lg`. Once the page scrolls past 48 px, the dateline slides out of view and the logo shrinks a little.
- **Mobile drawer.** The hamburger opens a dark panel from the right, titled `In this edition`, with large numbered section links and a full-width account button. Escape, the backdrop, the close button and any link close it.
- **Masthead.** A small kicker reads `The QuickBlog Journal — your own blogging platform`. The compact search sits on the right of the masthead on `lg` and under the cover below `lg`.
- **Cover.** One large lead photo (marked `★ Cover story`) with its headline on a dark scrim, next to an `Also on the cover` rail of up to four stories with thumbnails.
- **Latest stories.** A category chip bar and a 1/2/3-column card grid that shows 6 cards at first, with a `Load N more` button. Searching changes the heading to `Search results` and shows a `Showing X of Y · "term"` counter.
- **In pictures.** A bento grid of up to 7 cover images with its own category filter.
- **By the desk.** One panel per category: a lead picture, then up to three more headlines.
- **Worth the evening.** A dark band with the three longest posts that are not on the cover.
- **Still worth reading.** A two-column list of the 8 oldest posts that are not on the cover.
- **Newsletter, Footer.** The footer has an About blurb, three link groups, a large `QuickBlog.` wordmark and the copyright line.

## Acceptance criteria

### Server
| ID | Requirement |
|----|-------------|
| AC-HOME-01 | WHEN `GET /api/blog/all` is called THE SYSTEM SHALL respond `200 { success:true, count, blogs }` with only blogs where `isPublished:true`, without authentication and without server-side ordering. |
| AC-HOME-02 | THE SYSTEM SHALL return each blog's `image` as an absolute URL: unchanged if it starts with `http://` or `https://`, otherwise prefixed with `SERVER_URL` or, if that is unset, with `<req.protocol>://<host>`. |

### Data
| ID | Requirement |
|----|-------------|
| AC-HOME-03 | WHEN the app mounts THE SYSTEM SHALL request `GET /api/blog/all` once (in `AppProvider`) and store `blogs` in `AppContext`; IF the request fails or returns `success:false` THEN THE SYSTEM SHALL show an error toast with the server `message`, falling back to `Failed to fetch blogs.` |
| AC-HOME-04 | THE Home page SHALL order posts newest first by `createdAt`. A missing or invalid date counts as time 0. |
| AC-HOME-05 | THE SYSTEM SHALL treat a post as having a photo cover WHEN its `image` path (ignoring `?query` and `#hash`) contains `/photos/` or ends in `.png`, `.jpg`, `.jpeg`, `.webp` or `.avif` (case-insensitive). Any other image counts as an illustration. |
| AC-HOME-06 | WHILE no search term is set THE SYSTEM SHALL pick the cover as the first 5 posts of the newest-first list after a stable photo-first sort (photos first, original order kept within each group); WHILE a search term is set the cover SHALL be empty. |
| AC-HOME-07 | THE SYSTEM SHALL render Gallery and CategoryDesks only WHILE no search term is set AND there are at least 6 posts; EditorsPicks only WHEN that condition holds AND it has more than 1 pick; ArchiveList only WHEN that condition holds AND the archive is not empty. |

### Page composition and navigation
| ID | Requirement |
|----|-------------|
| AC-HOME-08 | THE Home page SHALL render, in this order: skip link, Navbar, `<main id="main" tabIndex=-1>` containing [masthead with FrontCover and search] → [Latest stories, Gallery, CategoryDesks, EditorsPicks, ArchiveList] → Newsletter, then Footer after `main`. |
| AC-HOME-09 | THE section headings inside the numbered group SHALL be prefixed with a counter shaped like `01 — ` (CSS counter, two digits with a leading zero). Hidden sections SHALL NOT use up a number. |
| AC-HOME-10 | WHEN the URL has a hash AND posts have loaded THE SYSTEM SHALL scroll the element with that id to the top of the viewport (`block:'start'`). Section anchors are `latest`, `gallery`, `desks`, `picks`, `archive`. |
| AC-HOME-11 | WHEN the page is first shown THE content of `main` SHALL fade in and rise 12 px over 0.45 s (`PageTransition`). |

### Navbar
| ID | Requirement |
|----|-------------|
| AC-HOME-12 | THE dateline SHALL show `Vol. I · Nº <n>`, where `n = ceil(((today − Jan 1) / 1 day + weekday(Jan 1) + 1) / 7)`; the date as `formatDateline` (`en-US`, e.g. `Friday, November 20, 2026`), shown only from `sm` up; and `<N> stories live` WHEN `N = blogs.length > 0`, else `Live edition`. |
| AC-HOME-13 | WHEN the window scroll position goes above 48 px THE header SHALL move up 32 px (hiding the dateline), scale the wordmark to 0.9 and show a 4 px ink rule under the bar; WHEN it returns to 48 px or less THE SYSTEM SHALL undo all three. |
| AC-HOME-14 | THE logo SHALL be a button with `aria-label="QuickBlog — go to home"` that navigates to `/`. |
| AC-HOME-15 | THE desktop nav (`aria-label="Sections"`, from `lg` up) SHALL list the links `Latest` → `/#latest`, `Gallery` → `/#gallery`, `Desks` → `/#desks`, `Editor's picks` → `/#picks`, `Archive` → `/#archive`, as plain `<a href>` elements. |
| AC-HOME-16 | THE account button (visible from `sm` up) SHALL read `Dashboard` WHEN a token is present in context and `Login` otherwise, and SHALL navigate to `/admin`. |
| AC-HOME-17 | BELOW `lg` THE Navbar SHALL show a 44×44 px menu button with `aria-label="Open menu"`, `aria-controls="mobile-menu"` and `aria-expanded` showing whether the drawer is open. |

### Mobile drawer
| ID | Requirement |
|----|-------------|
| AC-HOME-18 | WHEN the menu button is pressed THE SYSTEM SHALL open `#mobile-menu` with `role="dialog"`, `aria-modal="true"` and `aria-label="Site menu"`, sliding in from the right (0.45 s; exit 0.27 s), `min(88vw, 24rem)` wide, over an ink backdrop at 60 % opacity. |
| AC-HOME-19 | THE drawer SHALL show the kicker `In this edition`, a close button `aria-label="Close menu"`, a `nav aria-label="Mobile"` with the same five links as AC-HOME-15, each prefixed `01`…`05`, and an account button labelled as in AC-HOME-16. |
| AC-HOME-20 | WHEN Escape is pressed, the backdrop is clicked, the close button is pressed or a drawer link is activated THE SYSTEM SHALL close the drawer. WHEN the account button is pressed THE SYSTEM SHALL close it and navigate to `/admin`. |
| AC-HOME-21 | WHILE the drawer is open THE SYSTEM SHALL move focus to its first focusable element, wrap Tab and Shift+Tab inside the panel, and set `document.body.style.overflow='hidden'`. WHEN it closes THE SYSTEM SHALL restore the previous overflow value and return focus to the menu button. |
| AC-HOME-22 | THE drawer SHALL render only below `lg` (`lg:hidden`). |

### Masthead and search
| ID | Requirement |
|----|-------------|
| AC-HOME-23 | THE masthead SHALL render `<h1 id="hero-title">The QuickBlog Journal</h1>`, with the suffix ` — your own blogging platform` shown only from `sm` up. |
| AC-HOME-24 | THE search form (`role="search"`) SHALL contain a `type="search"` `required` input with `aria-label` and placeholder `Search for blogs` and a `Search` submit button. It sits in the masthead from `lg` up and below the cover below `lg`. |
| AC-HOME-25 | WHEN the search form is submitted with a value whose trimmed length is above 0 THE SYSTEM SHALL set `AppContext.input` to the untrimmed value; IF the trimmed value is empty THEN THE SYSTEM SHALL do nothing. |
| AC-HOME-26 | WHILE a search term is set THE SYSTEM SHALL show a `✕ Clear Search` button next to the form; WHEN it is pressed THE SYSTEM SHALL empty that input and set `input` to `''`. |

### Front cover
| ID | Requirement |
|----|-------------|
| AC-HOME-27 | IF the cover list is empty THEN FrontCover SHALL render nothing. |
| AC-HOME-28 | THE first cover story SHALL be a link to `/blog/<id>` showing the cover image (`alt` = title, `fetchPriority="high"`, zooming from 1.08 to 1 over 1.4 s), a `★ Cover story` sticker, the category, a `<time>` with the short date, `· <n> min read`, the title as `h2`, and (from `sm` up) `subTitle` or, if that is missing, the first 150 characters of the description with tags removed. |
| AC-HOME-29 | WHEN there are 2 or more cover stories THE lead SHALL take 7 of 12 columns on `lg` and the rest SHALL appear in a rail headed `Also on the cover` with a count padded to two digits (e.g. `04`). Each brief SHALL link to its post and show a 4:3 thumbnail (`alt` = title), `<category> · <n> min read`, the title clamped to 3 lines, and (from `sm` up) the short date. WHEN there is only 1 cover story the lead SHALL span the full width. |
| AC-HOME-30 | THE reading time SHALL be `max(1, round(words / 220))` minutes, where words are counted in the description after tags are removed, and shown as `<n> min read`. |

### Latest stories (search and category filter)
| ID | Requirement |
|----|-------------|
| AC-HOME-31 | THE section (`id="latest"`) SHALL have the kicker `Latest` and the title `Latest stories`; WHILE a search term is set they SHALL be `Search` and `Search results`. |
| AC-HOME-32 | THE heading SHALL show `Showing <visible> of <matched>` in an `aria-live="polite"` element, followed by ` · "<term>"` WHILE a search term is set. |
| AC-HOME-33 | WHILE no search term is set AND the category is `All` THE pool SHALL be all posts except the cover stories, BUT cover stories SHALL be excluded only WHEN there are at least 8 posts. WHILE searching or filtering by category THE pool SHALL be all posts. |
| AC-HOME-34 | THE SYSTEM SHALL keep a post WHEN the trimmed, lower-cased search term is empty or is a substring of the post's lower-cased `title` or `category`, AND the selected category is `All` or equal to the post's `category`. |
| AC-HOME-35 | THE category filter (`nav aria-label="Filter by category"`) SHALL show buttons `All`, `Technology`, `Startup`, `Lifestyle`, `Finance` with `aria-pressed` on the selected one (default `All`). WHEN a category is selected THE SYSTEM SHALL reset the visible count to 6. |
| AC-HOME-36 | THE grid SHALL show the first 6 matched posts, newest first. WHILE more remain THE SYSTEM SHALL show a `Load <min(remaining, 6)> more ↓` button; WHEN it is pressed THE SYSTEM SHALL show 6 more. |
| AC-HOME-37 | EACH card SHALL be an `article` with `role="link"`, `tabIndex=0` and `aria-label` = title, that opens `/blog/<id>` on click or Enter. It SHALL show a 4:3 lazy-loaded image (`alt` = title), a category sticker, the title as `h3`, 110 characters of the description with tags removed, `Nº <NN> · <short date>` and `<n> min read →`. |
| AC-HOME-38 | IF no posts match THEN THE SYSTEM SHALL show `Nothing on this page`, `No blogs found.` and `Try another search term or pick a different category.`; WHILE searching or filtering THE empty state SHALL also offer `Show all stories`, which sets the category to `All` and the search term to `''`. |

### Gallery ("In pictures")
| ID | Requirement |
|----|-------------|
| AC-HOME-39 | THE Gallery (`id="gallery"`) SHALL have the kicker `Gallery`, the title `In pictures` and the text `The edition through its covers. Pick a desk to narrow it down.` It SHALL render nothing IF it receives no posts. |
| AC-HOME-40 | THE Gallery tiles SHALL be built from the posts not on the cover, newest first: filtered by the gallery's own category, photo covers first, skipping any post with no image or with an image already used, and capped at 7. |
| AC-HOME-41 | THE gallery filter SHALL be a separate CategoryFilter with `aria-label="Filter gallery by category"`, default `All`, and the same five categories as AC-HOME-35. The tile list SHALL be `aria-live="polite"`. |
| AC-HOME-42 | THE tiles SHALL follow a bento layout: on `lg`, 4 columns with tile 0 at 2×2, tile 2 at 1×2, tile 4 at 2×1 and the rest 1×1; below `lg`, 2 columns. Each tile SHALL link to its post with a lazy-loaded image (`alt` = title), a category sticker, the title, and (from `sm` up) `<n> min read →`. |
| AC-HOME-43 | ON devices that support hover THE tile caption SHALL stay hidden until the tile is hovered or focused; ON devices without hover it SHALL always be visible. |

### Category desks ("By the desk")
| ID | Requirement |
|----|-------------|
| AC-HOME-44 | THE section (`id="desks"`) SHALL have the kicker `The desks`, the title `By the desk` and the text `Every beat we cover: a lead picture up top, the latest headlines below.` |
| AC-HOME-45 | THE SYSTEM SHALL render one panel per category, in the order `Technology`, `Startup`, `Lifestyle`, `Finance`, built from posts not on the cover. It SHALL skip categories with no such posts and render nothing IF all are empty. |
| AC-HOME-46 | EACH panel (`article id="desk-<slug>"`) SHALL show the category as an `h3` and a sticker `<total> story`/`<total> stories`, where the total counts every post in the category, cover stories included. |
| AC-HOME-47 | EACH panel's lead SHALL be its first post with a photo cover, falling back to its newest post. The lead SHALL show a 16:9 image (`alt` = title), `Desk lead · <short date> · <n> min read` and the title. Up to 3 more posts SHALL follow as headline links with a 56 px square thumbnail and the short date. |

### Editor's picks ("Worth the evening")
| ID | Requirement |
|----|-------------|
| AC-HOME-48 | THE picks SHALL be up to 3 posts not on the cover, ranked by word count in the description (tags removed), longest first. |
| AC-HOME-49 | THE section (`id="picks"`) SHALL render an ink band with the sticker `Hand-picked · long reads`, the kicker `Editor's picks` and the title `Worth the evening`, and an ordered list, 3 columns from `md` up. Each item SHALL link to its post and show a 4:3 image (`alt` = title), a rank sticker `1`–`3`, `§ <category> · <n> min read`, the title as `h3`, `subTitle` or the first 110 characters of the description with tags removed, and `Read it →`. |

### Archive ("Still worth reading")
| ID | Requirement |
|----|-------------|
| AC-HOME-50 | THE archive SHALL be the posts not on the cover, oldest first, capped at 8. |
| AC-HOME-51 | THE section (`id="archive"`) SHALL have the kicker `From the archive`, the title `Still worth reading` and the text `Oldest first · <N> entries`, with an ordered list, 2 columns from `md` up. Each row SHALL link to its post and show a padded index (`01`…), a 4:3 thumbnail (`alt` = title, 35 % grayscale until hover), the title clamped to 2 lines, `<category> · <short date>`, and (from `xl` up) `<n> min read`. |

### Footer
| ID | Requirement |
|----|-------------|
| AC-HOME-52 | THE Footer SHALL show the kicker `About` and the text `An independent journal of essays and notes on technology, startups, lifestyle and money.`, plus a `nav aria-label="Footer"` with the groups `Quick Links`, `Need Help?` and `Follow Us` taken from `footer_data`. |
| AC-HOME-53 | THE Footer SHALL show an `aria-hidden` `QuickBlog.` wordmark and the lines `© <current year> QuickBlog. All rights reserved.` and `Made with ink & signal`. |

### Accessibility & motion
| ID | Requirement |
|----|-------------|
| AC-HOME-54 | THE page SHALL start with a `Skip to content` link to `#main` that is visually hidden until focused. |
| AC-HOME-55 | EACH home section SHALL be a `section` with `aria-labelledby` pointing to its heading id (`hero-title`, `latest-title`, `gallery-title`, `desks-title`, `picks-title`, `archive-title`). Sections that are hash targets SHALL use `scroll-mt-28` so the sticky header does not cover them. |
| AC-HOME-56 | WHEN an item wrapped in `Reveal` scrolls into view (10 % inset margin, first time only) THE SYSTEM SHALL fade it in and raise it (20 px by default) over 0.55 s, with a 0.06 s stagger per item for up to 8 items. IF `IntersectionObserver` is not available THEN the content SHALL be visible right away. |
| AC-HOME-57 | THE app SHALL wrap routes in `MotionConfig reducedMotion="user"`. WHILE `prefers-reduced-motion: reduce` is set THE CSS SHALL turn off smooth scrolling, cut animation and transition durations to 0.01 ms (except `.reading-progress`) and remove hover/active transforms. |
| AC-HOME-58 | Interactive controls in the Navbar, drawer, category filters and Latest SHALL have a minimum height of 44 px (`min-h-11` or larger). |

### Responsive
| ID | Requirement |
|----|-------------|
| AC-HOME-59 | THE layout SHALL be capped at `max-w-7xl` with 20 px side padding (32 px from `sm`). Below `lg` THE cover SHALL stack (lead above the rail). The Latest grid SHALL use 1 / 2 / 3 columns at base / `sm` / `lg`, and desks 1 / 2 columns at base / `md`. |
| AC-HOME-60 | THE category chip bars SHALL scroll horizontally (`overflow-x-auto`) rather than wrap when they don't fit. |

## Contracts
```http
GET /api/blog/all
200 { "success": true, "count": 34, "blogs": [Blog] }
```
`Blog = { _id, title, subTitle?, description (HTML), category, author, authorName, image (absolute URL), isPublished: true, createdAt, updatedAt, __v }`

Categories (client constant): `['All', 'Technology', 'Startup', 'Lifestyle', 'Finance']`.

Section ids (hash targets): `latest`, `gallery`, `desks`, `picks`, `archive`.

## Edge cases
- **0 posts (or while `/all` is still loading):** no cover, Latest shows the `No blogs found.` empty state without a reset button, the other sections are hidden, and the dateline reads `Live edition`.
- **1–5 posts:** cover plus Latest (cover stories included, because fewer than 8 posts). Gallery, desks, picks and archive are hidden.
- **6–7 posts:** all sections can appear; Latest still repeats the cover stories (exclusion starts at 8).
- **Search active:** cover, Gallery, desks, picks and archive are all hidden. Only the masthead, Latest (as `Search results`) and the newsletter remain, and the section numbers start again at `01`.
- **All covers are SVG illustrations:** photo-first ordering keeps the original order, so the newest posts fill the cover.
- **Only 1 long read off the cover:** EditorsPicks is hidden (needs more than 1).
- **Hash link to a hidden section** (e.g. `/#gallery` with fewer than 6 posts): no element has that id, so nothing scrolls.
- **Gallery filter with no matching posts:** an empty tile list with no message.

## Known gaps
- **No loading state.** `AppContext` has no `loading` flag, so while `/api/blog/all` is in flight (and after it fails) Latest shows the `No blogs found.` empty state, and the dateline shows `Live edition`.
- **Section links can lead nowhere.** Navbar and drawer links point at sections that may not be rendered (search active, fewer than 6 posts, 1 or fewer picks). They are plain `<a>` elements, so from an article page they trigger a full page reload instead of a client-side route change.
- **Search inputs are uncontrolled and duplicated.** The masthead (`lg` and up) and the bar below the cover (below `lg`) are two separate SearchBar instances. `Show all stories` and the other instance's `Clear Search` reset `AppContext.input` but leave the typed text in the input.
- **The search term does not reset paging.** Only a category change resets `visibleCount` to 6; a new search keeps the previous count.
- Search matches only `title` and `category`, not `subTitle` or body text.
- **Desk sticker counts don't match the panel.** The total includes cover stories, but the panel's headlines leave them out.
- **Footer links are placeholders.** Every link is `href="#"`, and the copy is left over from an e-commerce template (`Best Sellers`, `Offers & Deals`, `Track your Order`, `Return & Refund Policy`).
- **The dateline date never updates.** `TODAY` is computed once when the module loads, so a tab left open past midnight shows a stale date and issue number. `Vol. I` is hard-coded.
- **Cards are not real links.** `BlogCard` is an `article role="link"` driven by JS, so middle-click, "open in new tab" and link context menus don't work. Every other home card uses a real `<Link>`.
- The logo `<img alt="logo">` inside a button that already has an `aria-label` is redundant.
- **The drawer can leave the page locked.** If the window is resized to `lg` while the drawer is open, the drawer is hidden but body scroll stays locked until the state changes.
- **`/api/blog/all` sends full post bodies.** It returns the full `description` HTML of every published post with no projection, ordering or pagination, so the payload grows with the archive.

## Related specs
- [newsletter.md](newsletter.md): the newsletter block
- [article-page.md](article-page.md): where every card links to
- [comments.md](comments.md)
