# Spec: Admin dashboard
**Spec ID:** SPEC-DASH-2   **Status:** As-built (branch chore/editorial-redesign-docs, 2026-11-20)
**Code:** `client/src/pages/admin/Dashboard/Dashboard.jsx`, `client/src/components/admin/shared/{Masthead,CountUp,AdminPageHeader,AdminTable,EmptyState}/*`, `client/src/components/admin/shared/{editorial,motion}.js`, `client/src/components/admin/dashboard/StatCard.jsx`, `client/src/components/admin/blog/BlogTableItem/BlogTableItem.jsx`, `client/src/hooks/api/queries/useAdminDashboard/useAdminDashboard.js`, `client/src/hooks/core/useApiQuery/useApiQuery.js`, `server/src/controllers/adminController.js` (`getDashboard`), `server/src/routes/adminRoutes.js`

## Summary
The admin index page `/admin` is an editorial front page. A dark Masthead shows the total number of stories as one large number with a `+N this month` sticker and three short insights. Below it are four stat cards and a `Latest Blogs` table with inline publish and delete actions. All of the data comes from one endpoint, `GET /api/admin/dashboard`.

## Scope / Out of scope
**In scope:** the Dashboard page, its loading and error behavior, and `GET /api/admin/dashboard`.

**Out of scope:** the shell around the page ([shell-and-navigation.md](shell-and-navigation.md)) and the row actions themselves ([blog-list.md](blog-list.md) AC-LIST-11…17).

## User-visible behavior
- The header shows the eyebrow `Overview`, the title `Dashboard`, and a yellow `✦ Write a story` button that opens Add Blog.
- The Masthead has a dateline row (`Vol. 1 · No. 42` · `Quick Blog · Editor’s desk` · `Friday, 20 November 2026`), the label `Stories on file`, the total story count in large serif digits, a rotated `+4 this month` sticker, and the italic line `2 stories went to press this month.`. Three insight columns follow:
  - `§ Pipeline`: **`34 of 42`** `stories are live on the site.`
  - `§ On the spike`: `8 drafts waiting for an editor's pass.`
  - `§ This month`: `4 stories written, 2 sent to press. 203 comments on record.`
- Four stat cards: `Comments` (`All time`), `Drafts` (halftone, `Unpublished`), `Written this month`, and `Published this month` (signal yellow). Each value is padded to two digits (`08`).
- A `Latest` / `Latest Blogs` section with an `All blogs →` link, and a table of the six newest blogs.

## Acceptance criteria

### Server
| ID | Requirement |
|----|-------------|
| AC-DASH-01 | `GET /api/admin/dashboard` SHALL require a valid JWT from any role ([auth.md](auth.md) AC-AUTH-07…12). |
| AC-DASH-02 | THE SYSTEM SHALL respond `200 { success:true, dashboardData }` with these counts: `blogs` = all Blog documents; `comments` = all Comment documents (approved or not); `drafts` = Blogs with `isPublished:false`. |
| AC-DASH-03 | THE SYSTEM SHALL set `blogsThisMonth` to the number of Blogs with `createdAt ≥` 00:00 on the 1st of the current month, in the server's local time zone. It SHALL set `publishedThisMonth` to the number of Blogs with `isPublished:true` AND `createdAt ≥` that same instant. |
| AC-DASH-04 | THE SYSTEM SHALL return in `recentBlogs` the 6 most recent Blogs by `createdAt` (published or not). Each SHALL have an absolute `image` URL and a `commentsCount` that counts all of its comments, approved or not. |
| AC-DASH-05 | THE SYSTEM SHALL return in `recentComments` the 6 most recent Comments, with `blog` not populated. |

### UI
| ID | Requirement |
|----|-------------|
| AC-DASH-06 | WHEN the page mounts THE client SHALL request `GET /api/admin/dashboard` once. |
| AC-DASH-07 | WHILE the first request is loading (no blogs and no `blogs` count yet) THE page SHALL render the full-screen `Loader` (`Loading…`, `role="status"`). Later refetches SHALL keep the page mounted. |
| AC-DASH-08 | THE header SHALL show the eyebrow `Overview`, an `h1` `Dashboard`, and a link `✦ Write a story` to `/admin/addBlog`. |
| AC-DASH-09 | THE Masthead dateline SHALL read `Vol. 1 · No. <blogs>`, `Quick Blog · Editor’s desk`, and today in `en-GB` long form (`weekday:'long', day:'numeric', month:'long', year:'numeric'`). |
| AC-DASH-10 | THE Masthead SHALL show the label `Stories on file` and the value `blogs`, formatted with `en-US` grouping (`1,234`). |
| AC-DASH-11 | THE Masthead SHALL show the sticker `+<blogsThisMonth> this month`. |
| AC-DASH-12 | THE Masthead SHALL show the italic sub-line `<n> story went to press this month.` WHEN `publishedThisMonth` is 1, and `<n> stories went to press this month.` otherwise. |
| AC-DASH-13 | THE Masthead SHALL show three insights in order: `§ Pipeline`: `<blogs − drafts> of <blogs>` (highlighted in signal) followed by ` stories are live on the site.`; `§ On the spike`: `<drafts> draft(s) waiting for an editor's pass.`; `§ This month`: `<blogsThisMonth> story/stories written, <publishedThisMonth> sent to press. <comments> comment(s) on record.` Singular and plural follow `plural()`: the singular form only WHEN the count is exactly 1. |
| AC-DASH-14 | THE page SHALL show four StatCards in this order: `Comments` (value `comments`, note `All time`, surface tone); `Drafts` (value `drafts`, note `Unpublished`, halftone tone); `Written this month` (value `blogsThisMonth`, no note); `Published this month` (value `publishedThisMonth`, signal tone). |
| AC-DASH-15 | EACH StatCard value SHALL be rounded and left-padded to at least two digits (`0` → `00`, `8` → `08`, `203` → `203`). A `null` or `undefined` value SHALL render as `00`. |
| AC-DASH-16 | THE page SHALL show a section with the kicker `Latest`, an `h2` `Latest Blogs` (`id="latest-blogs"`, used as the section's `aria-labelledby`), and a link `All blogs →` to `/admin/listBlog`. |
| AC-DASH-17 | THE Latest Blogs table SHALL have the columns `#`, `Blog Title`, `Date`, `Status` and `Actions`, with one `BlogTableItem` row per `recentBlogs` entry, numbered `01`…`06`. |
| AC-DASH-18 | WHEN `recentBlogs` is empty THE table SHALL show the empty state `No blogs found` with the hint `Write your first story to see it here`. |
| AC-DASH-19 | WHEN a row's publish toggle or delete succeeds THE page SHALL re-fetch `GET /api/admin/dashboard` without showing the Loader. Rows that leave the list SHALL animate out. |
| AC-DASH-20 | IF the request fails THEN THE client SHALL toast the server `message`, or else the transport error message, or else `Something went wrong. Please try again.`. It SHALL then render the page with zeros (`blogs`, `comments`, `drafts`, `blogsThisMonth`, `publishedThisMonth` = 0) and the empty table. |

### Accessibility & motion
| ID | Requirement |
|----|-------------|
| AC-DASH-21 | THE Masthead SHALL be a `<section aria-label="Stories on file overview">`. Its insights SHALL be an ordered list. |
| AC-DASH-22 | EACH animated number (the Masthead value and the StatCard values) SHALL expose the final value in a visually hidden span. The animated digits SHALL be `aria-hidden`. |
| AC-DASH-23 | WHEN a number first scrolls into view THE client SHALL count it up from its last shown value (0 initially) to the target over 0.9 s (ease-out cubic). WHEN reduced motion is requested, or `IntersectionObserver` is unavailable, THE client SHALL render the final value at once. |
| AC-DASH-24 | THE Masthead SHALL rise in on mount. Its sticker SHALL spring in after 0.55 s (from scale 0.7 and −14° to scale 1 and −3°). The halftone bar under the number SHALL grow from the left after 0.35 s, over 0.9 s. |
| AC-DASH-25 | THE StatCards and the Latest section SHALL rise in (20 px, 0.5 s) the first time they enter the viewport. StatCards SHALL stagger 0.06 s apart. |

### Responsive
| ID | Requirement |
|----|-------------|
| AC-DASH-26 | THE StatCards grid SHALL show 1 column below `sm`, 2 columns from `sm`, and 4 columns from `xl`. |
| AC-DASH-27 | THE Masthead SHALL stack the number block above the insights below `xl`, and place them side by side (5fr / 7fr) from `xl` up. The three insights SHALL stack below `md` and sit in 3 columns from `md` up. |
| AC-DASH-28 | BELOW `sm` THE `Date` and `Status` columns of the Latest Blogs table SHALL be hidden. The table SHALL scroll horizontally when it overflows. |
| AC-DASH-29 | THE page padding SHALL be 20 px below `md` and 40 px from `md` up. |

## Contracts

```http
GET /api/admin/dashboard
Authorization: <token>

200 {
  "success": true,
  "dashboardData": {
    "blogs": 42,
    "comments": 203,
    "drafts": 8,
    "blogsThisMonth": 4,
    "publishedThisMonth": 2,
    "recentBlogs": [ Blog & { "image": "http://<host>/uploads/...", "commentsCount": 5 } ],   // ≤ 6
    "recentComments": [ Comment ]                                                              // ≤ 6, unpopulated
  }
}
401  see auth.md
```

`Blog = { _id, title, subTitle, description, category, author, authorName, image, isPublished, createdAt, updatedAt, __v }`.

## Edge cases
- **Empty database:** the Loader shows while loading. Afterwards all numbers are `0`/`00`, the Pipeline insight reads `0 of 0 stories are live on the site.`, and the table shows its empty state.
- **Pipeline with one story:** `1 of 1 stories are live on the site.` The Pipeline text is not pluralized.
- **A row action removes a row** (delete): the table refetches, the row slides out to the left, and a seventh-newest blog (if any) slides in.
- **A blog created late on the last day of a month** in a time zone ahead of the server may be counted in either month (server-local boundary).

## Known gaps
- **`publishedThisMonth` is not "published this month".** It counts blogs *created* this month that are published now; there is no `publishedAt` field. The `sent to press` and `went to press` copy depends on this.
- **The month boundary uses the server's local time zone**, not UTC.
- **`recentComments` is never rendered.**
- **Comment counts run N+1 queries.** `recentBlogs` uses one `countDocuments` per blog (at most 6).
- **No error state.** A failed load looks like an empty site: zeros plus a toast, with no retry.
- **Two different date formats.** The dateline uses `en-GB`; the table uses Moment `MMMM Do YYYY`.

## Related specs
- [shell-and-navigation.md](shell-and-navigation.md): the shell around this page.
- [blog-list.md](blog-list.md): `BlogTableItem` row actions (publish/unpublish, delete).
- [blog-authoring.md](blog-authoring.md): the target of `✦ Write a story`.
