# Spec: Blog Analytics Dashboard

**Spec ID:** SPEC-ANALYTICS-1
**Status:** Approved for implementation
**Scope:** Admin analytics page (client) + view tracking and analytics API (server) + seed data
**Supersedes:** `docs/feature-requirements/2026-02-11-blog-analytics-dashboard-design.md` (design draft)

Every requirement below has an ID (`AC-x.y`) and uses *shall*. A PR that claims to implement this spec must reference it in the PR description (`Spec: docs/specs/analytics-dashboard-spec.md`) and list which ACs it covers. Anything not listed here is out of scope for that PR (see §11).

---

## 1. Navigation & access

| ID | Requirement |
|----|-------------|
| AC-1.1 | The admin sidebar shall show an **Analytics** item with a chart icon that opens `/admin/analytics`. |
| AC-1.2 | All `/api/admin/analytics/*` endpoints shall require a valid JWT **and** `role === 'admin'`. A valid token with any other role shall receive `403`. |
| AC-1.3 | All UI text, labels and column headers shall be in English; dates and numbers shall be formatted `en-US` (`Feb 11, 2026`, `1,234`) regardless of the browser locale. |

## 2. KPI cards

| ID | Requirement |
|----|-------------|
| AC-2.1 | **Total Views** shall count `BlogView` documents in the selected period, **excluding** views where `isAdminView` is true. |
| AC-2.2 | **Total Blogs** shall show the count with a published / drafts breakdown. |
| AC-2.3 | **Total Comments** shall show the count with an approved / pending breakdown. |
| AC-2.4 | **Avg Engagement** shall be the average number of comments per published post in the period. |
| AC-2.5 | **Approval Rate** shall be the percentage of approved comments among all comments in the period. |
| AC-2.6 | **Most Active Category** shall be the category with the most (non-admin) views in the period. |
| AC-2.7 | WHEN the period is a bounded range, each card shall show a trend (arrow + percent) versus the previous period of equal length. WHEN the period is **all time**, the trend shall be hidden. |

## 3. Charts

| ID | Requirement |
|----|-------------|
| AC-3.1 | **Views over time** shall bucket by day (≤ 31 days), week (≤ 90 days) or month (longer), with a tooltip showing date and count. |
| AC-3.2 | **Publications** shall be a stacked bar chart by month, split by category. |
| AC-3.3 | **Category distribution** shall be a donut chart; hovering shows category, count and percentage. |
| AC-3.4 | **Comment activity** shall be a grouped bar chart per month with two series: approved and pending. |
| AC-3.5 | **Views by category** shall be a horizontal bar chart **sorted from highest to lowest** views. The order shall come from the API response (the client shall not re-sort). |
| AC-3.6 | WHEN a category segment of the donut is clicked, the whole page shall filter by that category. |
| AC-3.7 | WHEN a point/bar of *Views over time* is clicked, a drill-down shall open listing posts viewed in that bucket with their view counts. WHEN the user closes the drill-down or clicks another bucket before the previous request completes, the earlier response shall be discarded. |

## 4. Tables

| ID | Requirement |
|----|-------------|
| AC-4.1 | **Top 5 viewed posts**: title (link to the public post), category, views, comments, publish date; sorted by views descending. |
| AC-4.2 | **Top 5 commented posts**: title, category, comments as `approved/total`, views; sorted by total comments descending. |
| AC-4.3 | **Recent comments**: last 5 comments with author name, a **plain-text** excerpt of at most 120 characters (HTML tags stripped, never rendered as HTML), blog title, date and status. |

## 5. Filters & export

| ID | Requirement |
|----|-------------|
| AC-5.1 | Period quick buttons: 7 days, 30 days, 90 days, 1 year, all time. Default: 30 days. |
| AC-5.2 | A custom date range (from – to) shall be available. WHEN a custom range is set, it shall take precedence over the quick period. |
| AC-5.3 | WHEN the period or the category changes, **every** section (KPI cards, all charts, all tables) shall re-fetch with the new filter. |
| AC-5.4 | The `to` date of a custom range shall be **inclusive**: views recorded at any time on that calendar day (UTC) shall be counted. |
| AC-5.5 | **Export CSV** shall download a file with columns `Title, Category, Publish Date, Views, Comment Count, Status` for all posts in the current period and category. |
| AC-5.6 | CSV cells shall be escaped for quotes, commas and newlines, and any cell starting with `=`, `+`, `-` or `@` shall be prefixed with a single quote so spreadsheet applications do not evaluate it. |
| AC-5.7 | Filter state (period, category, from, to) shall be reflected in the URL query string so the view is shareable. |

## 6. View tracking

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

## 7. Seed data

| ID | Requirement |
|----|-------------|
| AC-7.1 | Fixtures shall contain **at least 15** blog posts across all four categories, some drafts. |
| AC-7.2 | At least 80 comments with mixed status, unevenly distributed across posts and spread in time. |
| AC-7.3 | 500–1000 view records spread over the last 6 months with weekday > weekend and gradual growth; Technology > Lifestyle > Startup > Finance. |
| AC-7.4 | Post creation dates shall be spread over 6 months. |

## 8. States

| ID | Requirement |
|----|-------------|
| AC-8.1 | While loading, each section shall show a skeleton placeholder. |
| AC-8.2 | WHEN there are no blog posts at all, the page shall show a single empty state with a call to action to create the first post instead of empty charts. |
| AC-8.3 | WHEN a request fails, the affected section shall show an inline error; other sections stay usable. |

## 9. Tests

| ID | Requirement |
|----|-------------|
| AC-9.1 | Unit tests shall cover: `KpiCard` (trend arrow up/down/hidden), `FilterBar` (period and category callbacks), and the `useAnalytics*` hooks (re-fetch on filter change). |
| AC-9.2 | Server-side tests shall cover CSV escaping (AC-5.6) and view deduplication (AC-6.5). |

## 10. Non-functional

| ID | Requirement |
|----|-------------|
| AC-10.1 | No secrets, keys or tokens shall be committed; configuration comes from `.env` only. Client code shall never import from `server/`. |
| AC-10.2 | Authorization headers and tokens shall never be written to logs. |
| AC-10.3 | Every migration shall be reversible: `down` restores the previous schema **without deleting data**. |
| AC-10.4 | Each analytics endpoint shall issue a bounded number of database queries independent of the number of posts (aggregations, not per-post queries). |
| AC-10.5 | Data shall load on page open and on filter change only; there shall be no background polling. |

## 11. Out of scope for the implementing PR

- Changes to the existing admin **Dashboard** page.
- Changes to global rate limits, CORS or security middleware.
- Tests for components unrelated to analytics.
- Search / free-text filtering of posts.
- Real-time updates.
