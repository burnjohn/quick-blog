# Spec: Blog analytics dashboard
**Spec ID:** SPEC-ANALYTICS-1   **Status:** Approved
**Code:** `client/src/pages/admin/Analytics.jsx`, `client/src/components/admin/analytics/**`, `client/src/hooks/api/queries/useAnalytics.js`, `client/src/api/analyticsApi.js`, `client/src/utils/{formatters,downloadFile}.js`, `server/src/routes/analyticsRoutes.js`, `server/src/controllers/analyticsController.js`, `server/src/helpers/analyticsAggregations.js`, `server/src/validators/analyticsValidator.js`, `server/src/models/BlogView.js`, `server/src/utils/viewTracking.js`, `server/src/configs/analytics.js`, `server/migrations/20260211000001-add-blogview-indexes.js`, `server/fixtures/{blogs,comments,views}.js`, `server/scripts/seed.js`, `client/vite.config.js`

## Summary
The admin analytics page `/admin/analytics`, the view-tracking endpoint, and the seed data behind them. Admins see how the blog is read and discussed: KPI cards, five charts, three tables, filters and a CSV export.

A PR that implements this spec references it in its description (`Spec: specs/analytics/analytics-dashboard.md`) and lists the ACs it covers. Anything not listed here is out of scope for that PR (see **Out of scope** below).

## Scope / Out of scope
**In scope:** navigation and access, KPI cards, five charts, three tables, filters and CSV export, view tracking, seed data, loading/empty/error states, tests, and non-functional constraints.

**Out of scope for the implementing PR:**
- Changes to the existing admin Dashboard page ([../admin/dashboard.md](../admin/dashboard.md)).
- Changes to global rate limits, CORS or security middleware.
- Tests for components unrelated to analytics.
- Search or free-text filtering of posts.
- Real-time updates.
- Any public-site feature other than recording a view.

## User-visible behavior
- The header shows the eyebrow `Insights` and the title `Analytics`. The FilterBar holds the period segmented control (`7d`, `30d`, `90d`, `1y`, `All`), `From date` and `To date` inputs, a category select (`All`, `Technology`, `Startup`, `Lifestyle`, `Finance`), and a yellow `Export CSV` button.
- A Masthead follows. Its dateline is `Quick Blog · Readership desk` · `<period label>` · `<long date>`. Below that: the label `Views`, the total in large digits, a trend sticker (for example `↑ 14.3% vs prev.`, or `Flat vs prev.`), and the sub-line `<Category> is the most read desk with <n> views.`. The insights are `§ Engagement`, `§ Conversation` and `§ The desk`.
- `Key metrics`: six KPI cards (`Total Views`, `Total Blogs`, `Total Comments`, `Avg Engagement`, `Approval Rate`, `Most Active Category`).
- Five chart panels (`Views Over Time` spans both columns and has the note `Click a point to drill down`), then the `Top Viewed Posts` and `Top Commented Posts` tables and a dark `Recent Comments` panel. Section kickers are auto-numbered (`01 —`, `02 —` …).

## Acceptance criteria

### 1. Navigation & access
| ID | Requirement |
|----|-------------|
| AC-1.1 | The admin sidebar shall show an **Analytics** item with a chart icon that opens `/admin/analytics`. |
| AC-1.2 | All `/api/admin/analytics/*` endpoints shall require a valid JWT **and** `role === 'admin'`. A valid token with any other role shall receive `403`. |
| AC-1.3 | All UI text, labels and column headers shall be in English. Dates and numbers shall be formatted `en-US` (`Feb 11, 2026`, `1,234`) regardless of the browser locale. |

### 2. KPI cards
| ID | Requirement |
|----|-------------|
| AC-2.1 | **Total Views** shall count `BlogView` documents in the selected period, **excluding** views where `isAdminView` is true. |
| AC-2.2 | **Total Blogs** shall show the count with a published / drafts breakdown. |
| AC-2.3 | **Total Comments** shall show the count with an approved / pending breakdown. |
| AC-2.4 | **Avg Engagement** shall be the average number of comments per published post in the period. |
| AC-2.5 | **Approval Rate** shall be the percentage of approved comments among all comments in the period. |
| AC-2.6 | **Most Active Category** shall be the category with the most (non-admin) views in the period. |
| AC-2.7 | WHEN the period is a bounded range, each card shall show a trend (arrow + percent) versus the previous period of equal length. WHEN the period is **all time**, the trend shall be hidden. |

### 3. Charts
| ID | Requirement |
|----|-------------|
| AC-3.1 | **Views over time** shall bucket by day (≤ 31 days), week (≤ 90 days) or month (longer), with a tooltip showing date and count. |
| AC-3.2 | **Publications** shall be a stacked bar chart by month, split by category. |
| AC-3.3 | **Category distribution** shall be a donut chart; hovering shows category, count and percentage. |
| AC-3.4 | **Comment activity** shall be a grouped bar chart per month with two series: approved and pending. |
| AC-3.5 | **Views by category** shall be a horizontal bar chart **sorted from highest to lowest** views. The order shall come from the API response (the client shall not re-sort). |
| AC-3.6 | WHEN a category segment of the donut is clicked, the whole page shall filter by that category. |
| AC-3.7 | WHEN a point/bar of *Views over time* is clicked, a drill-down shall open listing posts viewed in that bucket with their view counts. WHEN the user closes the drill-down or clicks another bucket before the previous request completes, the earlier response shall be discarded. |

### 4. Tables
| ID | Requirement |
|----|-------------|
| AC-4.1 | **Top 5 viewed posts**: title (a link to the public post page `/blog/:id`), category, views, comments, publish date; sorted by views descending. |
| AC-4.2 | **Top 5 commented posts**: title, category, comments as `approved/total`, views; sorted by total comments descending. |
| AC-4.3 | **Recent comments**: last 5 comments with author name, a **plain-text** excerpt of at most 120 characters (HTML tags stripped, never rendered as HTML), blog title, date and status. |

### 5. Filters & export
| ID | Requirement |
|----|-------------|
| AC-5.1 | Period quick buttons: 7 days, 30 days, 90 days, 1 year, all time. Default: 30 days. |
| AC-5.2 | A custom date range (from – to) shall be available. WHEN a custom range is set, it shall take precedence over the quick period. |
| AC-5.3 | WHEN the period or the category changes, **every** section (KPI cards, all charts, all tables) shall re-fetch with the new filter. |
| AC-5.4 | The `to` date of a custom range shall be **inclusive**: views recorded at any time on that calendar day (UTC) shall be counted. |
| AC-5.5 | **Export CSV** shall download a file with columns `Title, Category, Publish Date, Views, Comment Count, Status` for all posts in the current period **and category**. |
| AC-5.6 | CSV cells shall be escaped for quotes, commas and newlines, and any cell starting with `=`, `+`, `-` or `@` shall be prefixed with a single quote so spreadsheet applications do not evaluate it. |
| AC-5.7 | Filter state (period, category, from, to) shall be reflected in the URL query string so the view is shareable. |

### 6. View tracking
| ID | Requirement |
|----|-------------|
| AC-6.1 | WHEN a public blog post page is opened, the client shall send `POST /api/blog/:blogId/view` once per page load. |
| AC-6.2 | The endpoint shall not require authentication. |
| AC-6.3 | The visitor key shall be derived **on the server** as `sha256(ip + user-agent)` or, if present, `sha256(X-Visitor-ID header)`. The request body shall **not** be able to set the visitor key. |
| AC-6.4 | The referrer source (`direct`, `search`, `social`, `other`) shall be classified on the server from the `Referer` header. |
| AC-6.5 | Views from the same visitor key for the same post within 24 hours shall be deduplicated: the endpoint shall respond `200` without creating a new document. Deduplication shall never surface as an error to the client. |
| AC-6.6 | IF the request carries a valid JWT with role `admin` **or** `author`, the view shall be stored with `isAdminView: true` and excluded from all statistics. |
| AC-6.7 | The endpoint shall have its own rate limit of 30 requests per minute per IP. The existing global API limit (100 req/min) shall remain unchanged. |
| AC-6.8 | Views shall only be recorded for published posts; unpublished or unknown posts return `404`. |

### 7. Seed data
| ID | Requirement |
|----|-------------|
| AC-7.1 | Fixtures shall contain **at least 15** blog posts across all four categories, some drafts. |
| AC-7.2 | At least 80 comments with mixed status, unevenly distributed across posts and spread in time. |
| AC-7.3 | 500–1000 view records spread over the last 6 months with weekday > weekend and gradual growth; Technology > Lifestyle > Startup > Finance. |
| AC-7.4 | Post creation dates shall be spread over 6 months. |

### 8. States
| ID | Requirement |
|----|-------------|
| AC-8.1 | While loading, each section shall show a skeleton placeholder. |
| AC-8.2 | WHEN there are no blog posts at all, the page shall show a single empty state with a call to action to create the first post instead of empty charts. |
| AC-8.3 | WHEN a request fails, the affected section shall show an inline error; other sections stay usable. |

### 9. Tests
| ID | Requirement |
|----|-------------|
| AC-9.1 | Unit tests shall cover: `KpiCard` (trend arrow up/down/hidden), `FilterBar` (period and category callbacks), and the `useAnalytics*` hooks (re-fetch on filter change). |
| AC-9.2 | Server-side tests shall cover CSV escaping (AC-5.6) and view deduplication (AC-6.5). |

### 10. Non-functional
| ID | Requirement |
|----|-------------|
| AC-10.1 | No secrets, keys or tokens shall be committed; configuration comes from `.env` only. Client code shall never import from `server/`. |
| AC-10.2 | Authorization headers and tokens shall never be written to logs. |
| AC-10.3 | Every migration shall be reversible: `down` restores the previous schema **without deleting data**. |
| AC-10.4 | Each analytics endpoint shall issue a bounded number of database queries independent of the number of posts (aggregations, not per-post queries). |
| AC-10.5 | Data shall load on page open and on filter change only; there shall be no background polling. |
| AC-11.1 | No search filter shall be in scope (see **Out of scope**). |

## Contracts

Every endpoint below is `GET /api/admin/analytics/<name>` and requires `Authorization` with `role === 'admin'` (other roles → `403`). They share the query `period` (`7|30|90|365|all`, default `30`), optional `from`/`to` (`YYYY-MM-DD`) and `category` (`All|Technology|Startup|Lifestyle|Finance`, default `All`). An invalid query returns `400 { success:false, message:'<error>; <error>' }`. The client omits `category=All` and sends `from`/`to` only when both are set.

Date window: with `from`/`to`, the window is `from 00:00:00Z` → `to 23:59:59.999Z`, whatever the `period`. Otherwise it is `now − period days` → now, and for `period=all` it starts at the first recorded data.

| Endpoint | 200 body |
|---|---|
| `kpis` | `{ success, kpis: { totalViews:{value,trend}, totalBlogs:{value,published,drafts,trend}, totalComments:{value,approved,pending,trend}, avgEngagement:{value,trend}, approvalRate:{value,trend}, mostActiveCategory:{value,count} } }`, with `trend = { direction:'up'|'down'|'unchanged', percentChange }`, or `trend = null` for `period=all` |
| `views-over-time` | `{ success, data:[{ date, views }] }` |
| `publications` | `{ success, data:[{ month, Technology, Startup, Lifestyle, Finance }] }` |
| `category-distribution` | `{ success, data:[{ category, count }] }` (published only, sorted by count descending) |
| `comment-activity` | `{ success, data:[{ month, approved, pending }] }` |
| `views-by-category` | `{ success, data:[{ category, views }] }` (sorted by views descending) |
| `top-viewed` | `{ success, data:[{ id, title, category, views, comments, publishDate }] }` (≤ 5) |
| `top-commented` | `{ success, data:[{ id, title, category, comments:{approved,total}, views }] }` (≤ 5) |
| `last-comments` | `{ success, data:[{ id, authorName, contentExcerpt, blogTitle, blogId, createdAt, status:'approved'|'pending' }] }` (≤ 5; `contentExcerpt` is plain text, ≤ 120 characters) |
| `drill-down` | plus `date=YYYY-MM-DD|YYYY-Wnn|YYYY-MM` → `{ success, data:[{ id, title, category, views, publishDate }] }`; a bad date → `400 'Invalid drill-down date format'` |
| `export-csv` | `text/csv; charset=utf-8`, `Content-Disposition: attachment; filename="analytics-export-<YYYY-MM-DD>.csv"` |

```http
POST /api/blog/:blogId/view            (public, no body required)
200 { "success": true }                 recorded, or deduplicated within 24 h
404 { "success": false, "message": "Blog not found" }    unknown or unpublished post
429                                     more than 30 requests per minute from one IP
```

`BlogView = { blog, viewedAt (default now), referrerSource (enum, default 'direct'), isAdminView (default false), visitorKey (required), createdAt, updatedAt }`. The indexes are `{blog,visitorKey,viewedAt}`, `{blog,viewedAt}` and `{viewedAt}`.

## Edge cases
- **Custom range with only one date:** nothing extra is sent, and the quick period stays in effect.
- **`from > to`:** the server returns `400 'from must be less than or equal to to'`, and every section shows its inline error.
- **Drill-down on a week bucket:** the modal title reads `Posts for 2026-W46`. The range is that ISO week, Monday 00:00Z to Sunday 23:59:59.999Z.
- **Clicking a donut segment while that category is already active** writes the same value, so nothing changes.

## Related specs
- [../admin/shell-and-navigation.md](../admin/shell-and-navigation.md): the sidebar entry and the shell.
- [../admin/auth.md](../admin/auth.md): JWT and roles (AC-1.2).
- [../admin/dashboard.md](../admin/dashboard.md): the Masthead component this page shares.
