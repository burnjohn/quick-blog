# Feature: Blog Analytics Dashboard — Backend

**Summary:** Backend support for an admin analytics dashboard: view tracking model and API, analytics aggregations, and CSV export. Enables KPIs, charts, tables, and filters for blog performance and reader engagement.

**Scope:** Backend only (Express, MongoDB/Mongoose)

**References:** Feature design (REQ-0.x through REQ-6.x); existing Blog, Comment, User models.

---

## 1. View Tracking System

### 1.1 BlogView Model

- Each view of a blog post on the public site MUST be recorded in a `BlogView` collection
- A view is recorded when a published blog post is successfully fetched via the public blog endpoint
- Tracking is anonymous — no reader authentication required
- Each document MUST store: `blog` (ref Blog), `viewedAt` (Date), `referrerSource` (enum), `isAdminView` (boolean), `visitorKey` (string)
- `referrerSource` MUST be one of: `direct`, `search`, `social`, `other`
- `isAdminView` MUST be `true` when the request includes a valid JWT (admin/author); otherwise `false`
- `visitorKey` is a stable identifier for deduplication: hash of (IP + User-Agent), or a client-provided `X-Visitor-ID` header when present
- Indexes REQUIRED: `(blog, visitorKey, viewedAt)`, `(blog, viewedAt)`, `(viewedAt)`

### 1.2 Deduplication

- One unique visitor (same `visitorKey`) counts at most once per blog per rolling 24-hour window
- When recording a view, the system MUST check if a view from the same `blog` + `visitorKey` exists within the last 24 hours; if so, the view is NOT recorded
- Deduplication applies only to non-admin views (`isAdminView: false`)

### 1.3 Referrer Classification

- Referrer source MUST be derived from the `Referer` HTTP header (or absence of it)
- `direct`: no Referer header, or referer is same-origin
- `search`: referer domain contains (case-insensitive) google, bing, yahoo, duckduckgo, baidu, yandex
- `social`: referer domain contains facebook, twitter, x.com, linkedin, instagram, reddit, pinterest, tiktok
- `other`: any other referer

### 1.4 Admin/Author Exclusion

- Views where `isAdminView` is `true` MUST be excluded from all analytics aggregations (KPIs, charts, tables)
- Admin detection: valid `Authorization` (Bearer JWT) with decoded user having role `admin` or `author`

### 1.5 Record View Endpoint

- A view MAY be recorded by either:
  - **Option A**: Extending `GET /api/blog/:blogId` to record a view internally (fire-and-forget, non-blocking) when the blog is published
  - **Option B**: A separate `POST /api/blog/:blogId/view` endpoint that the client calls when displaying a public blog post
- If Option A: recording happens only for published blogs, after successful fetch; must not affect response timing or fail the request
- Request MAY include `Referer` header for referrer classification
- Request MAY include `X-Visitor-ID` header for improved deduplication (client-generated stable ID)
- Response: no change to blog response (Option A), or `204 No Content` (Option B)
- Rate limiting RECOMMENDED on the view-recording path to prevent abuse

---

## 2. Analytics API Endpoints

### 2.1 Authentication

- All analytics endpoints MUST be protected by the existing `auth` middleware (JWT required)
- Only users with role `admin` or `author` MAY access analytics endpoints
- Unauthenticated or invalid token MUST return `401 Unauthorized`
- All analytics endpoints MUST live under `/api/admin/analytics/` (or equivalent admin-scoped path)

### 2.2 Query Parameters (Shared)

All analytics endpoints MUST accept and apply these query parameters:

| Parameter   | Type   | Default   | Description                                      |
|------------|--------|-----------|--------------------------------------------------|
| `period`   | string | `30`      | Preset: `7`, `30`, `90`, `365`, `all`           |
| `from`     | string | —         | ISO 8601 date (YYYY-MM-DD); used with `to`      |
| `to`       | string | —         | ISO 8601 date (YYYY-MM-DD); used with `from`    |
| `category` | string | `All`     | One of: `All`, `Technology`, `Startup`, `Lifestyle`, `Finance` |

- When `from` and `to` are both provided, they override `period`
- When `period` is `all`, no date filter applies
- `category` = `All` means no category filter; otherwise filter blogs by that category
- Invalid dates or category MUST result in validation error (`400 Bad Request`)

### 2.3 Period and Trend Calculation

- "Current period": the date range determined by `period` or `from`/`to`
- "Previous equivalent period": same length as current, immediately preceding it
  - Example: current = last 7 days → previous = 7 days before that
  - Example: current = custom Jan 1–Jan 15 → previous = Dec 17–Dec 31
- Trend comparison: percentage change from previous period to current period
- Trend direction: `up` if current > previous, `down` if current < previous, `unchanged` if equal

---

## 3. KPI Endpoint

### 3.1 GET /api/admin/analytics/kpis

Returns summary KPIs for the selected period and category filter.

**Response shape (each KPI with value, trend, previousValue):**

| KPI               | Description                                                       |
|-------------------|-------------------------------------------------------------------|
| totalViews        | Total unique views (deduplicated) across filtered blogs           |
| totalBlogs        | Count of blogs in filter; include `published` and `drafts` counts  |
| totalComments     | Count of comments on filtered blogs; include `approved` and `pending` |
| avgEngagement     | Average comments per post (comments / published blogs)            |
| approvalRate      | Percent of approved comments: (approved / total) × 100            |
| mostActiveCategory| Category with highest views in period; if tie, deterministic pick |

**Trend fields for each KPI where applicable:**
- `value`: number or string (e.g. category name)
- `trend`: `{ direction: 'up'|'down'|'unchanged', percentChange: number }`
- `previousValue`: value in previous equivalent period

- `mostActiveCategory` MAY have no meaningful trend; `previousValue` optional

---

## 4. Charts Data Endpoints

### 4.1 Views Over Time

- Endpoint: `GET /api/admin/analytics/charts/views-over-time`
- Returns time-series of views, bucketed by day/week/month based on period length
- Bucket size: &lt; 35 days → by day; 35–90 days → by week; &gt; 90 days → by month
- Response: `[{ date: string (ISO date), views: number }, ...]` sorted by date ascending
- Date format: `YYYY-MM-DD` for day bucket; first day of week/month for week/month buckets

### 4.2 Publications Over Time

- Endpoint: `GET /api/admin/analytics/charts/publications-over-time`
- Returns published blog count by month, stacked by category
- Response: `[{ month: string (YYYY-MM), total: number, byCategory: { [category]: number } }, ...]`
- Only includes months with at least one publication in the period
- Sorted by month ascending

### 4.3 Category Distribution

- Endpoint: `GET /api/admin/analytics/charts/category-distribution`
- Returns percentage of blogs per category within the filtered set
- Response: `[{ category: string, count: number, percent: number }, ...]`
- Categories with 0 blogs MAY be omitted or included with 0
- Sorted by count descending

### 4.4 Comment Activity

- Endpoint: `GET /api/admin/analytics/charts/comment-activity`
- Returns approved vs pending comments by month
- Response: `[{ month: string (YYYY-MM), approved: number, pending: number, total: number }, ...]`
- Sorted by month ascending

### 4.5 Views by Category

- Endpoint: `GET /api/admin/analytics/charts/views-by-category`
- Returns total views per category (horizontal bar chart data)
- Response: `[{ category: string, views: number }, ...]`
- Sorted by views descending (highest first)

---

## 5. Tables Data Endpoints

### 5.1 Top Viewed Posts

- Endpoint: `GET /api/admin/analytics/tables/top-viewed`
- Returns top 5 most viewed posts in the period
- Fields per row: `title`, `category`, `views`, `comments` (approved count), `publishDate`, `id` (blog ID)
- Sorted by views descending

### 5.2 Top Commented Posts

- Endpoint: `GET /api/admin/analytics/tables/top-commented`
- Returns top 5 most commented posts in the period
- Fields per row: `title`, `category`, `comments` (object: `approved`, `total`), `views`, `id`
- Sorted by total comments descending

### 5.3 Last Comments

- Endpoint: `GET /api/admin/analytics/tables/last-comments`
- Returns last 5 comments across filtered blogs
- Fields per row: `authorName`, `contentExcerpt` (truncated to ~50 chars), `blogTitle`, `blogId`, `createdAt`, `status` (`approved`|`pending`), `id`
- Sorted by `createdAt` descending

---

## 6. CSV Export Endpoint

### 6.1 GET /api/admin/analytics/export/csv

- Protected by auth (admin/author only)
- Accepts same query parameters: `period`, `from`, `to`, `category`
- Response: `Content-Type: text/csv`, `Content-Disposition: attachment; filename="analytics-{from}-{to}.csv"`
- Filename MUST use actual date range (e.g. `analytics-2026-01-01-2026-01-31.csv`)
- CSV columns: `Post Title`, `Category`, `Publish Date`, `Views`, `Comment Count`, `Status` (published/draft)
- One row per blog post in the filtered set
- Sorted by views descending
- Dates in en-US format (e.g. `Feb 11, 2026`)
- Numbers in en-US format (e.g. `1,234`)
- UTF-8 encoding with BOM for Excel compatibility

---

## 7. Data Aggregation Logic

### 7.1 Scope of Filtering

- All analytics (KPIs, charts, tables, export) MUST respect `period`/`from`/`to` and `category`
- Blog scope: blogs with `createdAt` within the date range (or all time if `period=all`), and `category` match when filter is not `All`
- View scope: views with `viewedAt` within the date range, `isAdminView: false`
- Comment scope: comments on blogs that match the blog scope; comment `createdAt` used where applicable (e.g. comment activity chart)

### 7.2 View Count Rules

- "Views" in analytics = count of distinct `(blog, visitorKey)` within the 24-hour rolling window per view record
- Equivalently: count of BlogView documents where `isAdminView: false`, deduplicated per (blog, visitorKey, 24h)
- Aggregations MAY rely on pre-deduplicated writes (only one view per visitor per blog per 24h is ever stored) for correctness

### 7.3 Draft vs Published

- Blog count MUST split `published` and `drafts` (`isPublished: true` vs `false`)
- Views only exist for published blogs (public endpoint serves only published)
- Comments may exist on both; filter by blog scope

### 7.4 Empty and Edge Cases

- No blogs in scope: return zeros and empty arrays; `mostActiveCategory` MAY be `null` or empty string
- No views: all view-related KPIs and chart points are 0
- No comments: `totalComments`, `avgEngagement`, `approvalRate` handle division by zero (e.g. 0, 0, 0)
- Single blog/comment: aggregations still valid

---

## 8. Error Handling and Validation

### 8.1 Validation Errors

- Invalid `from`/`to` (malformed, `from` &gt; `to`): `400 Bad Request` with clear message
- Invalid `period` (not in allowed set): `400 Bad Request`
- Invalid `category` (not in allowed set): `400 Bad Request`
- Missing required query params when custom range expected: treat as invalid

### 8.2 Not Found

- Analytics endpoints do not return 404 for "no data"; they return valid structures with zeros/empty arrays

### 8.3 Server Errors

- Database or aggregation failures MUST be caught and return `500 Internal Server Error`
- Error responses MUST follow existing project shape: `{ success: false, message: string }`
- Sensitive details MUST NOT be exposed to the client

### 8.4 Rate Limiting

- Analytics endpoints MAY use stricter rate limits than general API to prevent heavy aggregation abuse
- View recording endpoint MUST be rate-limited to prevent spam

---

## 9. Performance and Indexes

### 9.1 Indexes

- `BlogView`: `(blog, visitorKey, viewedAt)`, `(blog, viewedAt)`, `(viewedAt)`
- Existing `Blog` indexes for category and date filtering
- Existing `Comment` indexes for blog ref and approval status
- Additional compound indexes on `Blog` and `Comment` RECOMMENDED for common analytics queries (e.g. `category`, `createdAt`, `isPublished`)

### 9.2 Aggregation Performance

- Analytics queries MAY use MongoDB aggregation pipeline
- For long date ranges, consider limiting or warning when range exceeds a threshold (e.g. 2 years)
- Avoid blocking the event loop; use async aggregation throughout

---

## Acceptance Criteria

### View Tracking

- [ ] BlogView model created with required fields and indexes
- [ ] View recorded when public blog post is viewed (or via dedicated endpoint)
- [ ] Deduplication: one view per visitor per blog per 24 hours
- [ ] Referrer source correctly classified from Referer header
- [ ] Admin/author views excluded from analytics (isAdminView or equivalent)
- [ ] View recording does not fail or delay blog fetch response

### Analytics API

- [ ] All analytics endpoints require JWT auth (admin/author)
- [ ] Query params `period`, `from`, `to`, `category` applied consistently
- [ ] KPI endpoint returns all required KPIs with trend data
- [ ] All chart endpoints return correctly structured, sorted data
- [ ] All table endpoints return top 5 / last 5 as specified
- [ ] Empty data returns valid structures (zeros, empty arrays)
- [ ] Invalid params return 400 with clear message

### CSV Export

- [ ] CSV endpoint returns file with correct columns and filename
- [ ] Dates and numbers in en-US format
- [ ] Export respects period and category filters

### Error Handling

- [ ] 400 for invalid query parameters
- [ ] 401 for missing or invalid JWT
- [ ] 500 for unexpected server errors without leaking internals
