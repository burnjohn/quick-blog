# Blog Analytics Dashboard — Backend Requirements

## Feature: Analytics Backend (Data Model, View Tracking & API)

**Summary:** Backend support for the Blog Analytics Dashboard — view tracking system, aggregated analytics API endpoints, and CSV export.

**Scope:** Backend (Express 5, MongoDB/Mongoose 8)

**References:**
- Design: Dashboard screenshots (KPIs, charts, tables, filters)
- Design document: REQ-2.x, REQ-3.x, REQ-4.x, REQ-5.x, REQ-6.x
- Existing: Blog, Comment, User models; BlogView model; analyticsAggregations helpers

---

## Dependency Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  View Tracking (REQ-6)                                           │
│  BlogView model, record endpoint, deduplication, referrer      │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│  Analytics API Endpoints                                        │
│  KPIs, Charts, Tables, Recent Comments, CSV Export              │
└─────────────────────────────────────────────────────────────────┘
```

- **REQ-6** (View Tracking) must be implemented first; analytics endpoints depend on BlogView data.
- **REQ-2, REQ-3, REQ-4** depend on REQ-6 for view-related metrics.
- **REQ-5** (Filters) applies to all API endpoints as query parameters.
- **REQ-5.9, REQ-5.10** (CSV Export) depend on all other analytics aggregations.

---

## 1. View Tracking System (REQ-6)

### 1.1 Data Model — BlogView

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-6.1 | Each blog post view on the public site is recorded | BlogView document is created when a public blog view is recorded |
| REQ-6.2 | Tracking is anonymous — no reader auth required | Recording does not require JWT; no user identity stored for visitors |
| REQ-6.3 | One unique user (session) counted once per post per 24 hours | Deduplication: same `visitorKey` + `blog` within last 24h does not create a new view |
| REQ-6.4 | Referrer source is tracked: direct, search, social, other | `referrerSource` field with enum `['direct','search','social','other']` |
| REQ-6.5 | Views from admins/authors are excluded from statistics | `isAdminView: true` when JWT present and user is admin/author; aggregation filters these out |

**Existing BlogView Schema (already present):**
- `blog` (ObjectId, ref Blog, required)
- `viewedAt` (Date, default now)
- `referrerSource` (enum: direct, search, social, other, default: direct)
- `isAdminView` (Boolean, default: false)
- `visitorKey` (String, required) — used for 24h deduplication

**Indexes (already present):**
- `{ blog: 1, visitorKey: 1, viewedAt: 1 }`
- `{ blog: 1, viewedAt: 1 }`
- `{ viewedAt: 1 }`

**Acceptance — Model:**
- [ ] Schema fields match above specification
- [ ] Indexes exist for efficient deduplication and time-range queries
- [ ] `visitorKey` is required (client generates, e.g. fingerprint or sessionId)

---

### 1.2 Record View Endpoint

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-6.1 | Public views are recorded | POST endpoint exists and creates BlogView when conditions met |
| REQ-6.2 | Anonymous | Endpoint does not require `Authorization` header |
| REQ-6.3 | Deduplication | Before insert: check if `blog` + `viewedAt`-within-24h for same `visitorKey` exists; if yes, return 200 without creating |
| REQ-6.4 | Referrer | Request accepts `referrerSource` (optional, default: direct) |
| REQ-6.5 | Admin exclusion | If `Authorization` present and user is admin/author, set `isAdminView: true`; still record for audit but exclude from stats |

**API Specification:**

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/blog/:blogId/view` | Optional | Record a blog view (anonymous or admin) |

**Request:**
- Params: `blogId` (required)
- Body (JSON): `{ referrerSource?: 'direct' \| 'search' \| 'social' \| 'other', visitorKey: string }`
- Headers: `Authorization: Bearer <token>` (optional — if present and admin/author, `isAdminView = true`)

**Response:**
- 200: View recorded (or skipped due to deduplication) — `{ success: true }`
- 400: Missing `visitorKey` or invalid `blogId`
- 404: Blog not found or not published

**Acceptance — Record Endpoint:**
- [ ] POST `/api/blog/:blogId/view` exists on public routes (no auth required)
- [ ] Validates `blogId` and `visitorKey`; rejects invalid input
- [ ] Deduplication: no new document if same `visitorKey` + `blog` within 24h
- [ ] `referrerSource` defaults to `direct` if omitted
- [ ] If JWT present and user.role in ['admin','author'], set `isAdminView: true`
- [ ] Rate limiting applied (e.g. per-IP or per visitorKey) to prevent abuse
- [ ] Returns 404 when blog does not exist or `isPublished: false`

---

## 2. Filter Parameters (REQ-5)

All analytics endpoints accept the same filter parameters. Parsing is handled by helpers in `analyticsAggregations.js`.

| Param | Type | Description | Example |
|-------|------|-------------|---------|
| `period` | string | Quick-select: `7`, `30`, `90`, `365`, `all` | `30` |
| `from` | ISO date string | Start of date range (overrides period when used with `to`) | `2026-02-01` |
| `to` | ISO date string | End of date range | `2026-02-11` |
| `category` | string | Filter by blog category; `All` = no filter | `Technology` |

**Helpers (already exist):**
- `getDateRange(period, from, to)` → `{ from, to }`
- `getPreviousPeriod(from, to)` → `{ from, to }` for trend comparison
- `buildBlogFilter({ from, to, category })` → Mongoose filter
- `buildViewFilter({ from, to }, blogIds)` → BlogView filter (excludes admin views)
- `getBucketSize(from, to)` → `'day'` \| `'week'` \| `'month'` for time-series

**Acceptance:**
- [ ] All analytics endpoints accept `period`, `from`, `to`, `category` as query params
- [ ] `category === 'All'` or omitted = no category filter
- [ ] Date range is parsed consistently across endpoints

---

## 3. KPI Endpoints (REQ-2)

### 3.1 KPI Summary Endpoint

**Purpose:** Single endpoint returning all 6 KPIs with trends.

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | `/api/admin/analytics/kpis` | Required (JWT) | Return all KPI stats with trends |

**Query params:** `period`, `from`, `to`, `category`

**Response shape:**
```json
{
  "success": true,
  "kpis": {
    "totalViews": { "value": 0, "trend": { "direction": "up", "percentChange": 0 } },
    "totalBlogs": { "value": 18, "published": 13, "drafts": 5, "trend": { "direction": "up", "percentChange": 100 } },
    "totalComments": { "value": 80, "approved": 63, "pending": 17, "trend": { "direction": "up", "percentChange": 100 } },
    "avgEngagement": { "value": 0, "trend": { "direction": "unchanged", "percentChange": 0 } },
    "approvalRate": { "value": 78.75, "trend": { "direction": "up", "percentChange": 100 } },
    "mostActiveCategory": { "value": "Technology", "count": 6 }
  }
}
```

**KPI Definitions:**

| KPI | Source | Calculation |
|-----|--------|-------------|
| totalViews | BlogView | Count of unique views (per REQ-6.3) in range, `isAdminView: false` |
| totalBlogs | Blog | Count in range; breakdown: published vs drafts |
| totalComments | Comment | Count in range; breakdown: approved vs pending |
| avgEngagement | Comment, Blog | `(comments / published posts)` × 100 or similar metric |
| approvalRate | Comment | `(approved / total) × 100` |
| mostActiveCategory | BlogView + Blog | Category with highest views in range |

**Trend Calculation:**
- For each KPI: compare current-period value with previous-period value
- Use `getPreviousPeriod(from, to)` to get prior range
- Use `calculateTrend(current, previous)` → `{ direction, percentChange }`
- When previous = 0 and current > 0: `direction: 'up', percentChange: 100`

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-2.1 | Total Views | Aggregation counts unique views (blog+visitorKey per 24h) in period, excludes admin |
| REQ-2.2 | Total Blogs | Count with published/drafts breakdown; trend vs previous period |
| REQ-2.3 | Total Comments | Count with approved/pending breakdown; trend vs previous period |
| REQ-2.4 | Avg Engagement | Average comments per published post in period |
| REQ-2.5 | Approval Rate | % approved; trend vs previous period |
| REQ-2.6 | Most Active Category | Category with most views in period; include post count |
| REQ-2.7 | Trend | Each KPI includes `{ direction, percentChange }` vs previous equivalent period |

**Acceptance:**
- [ ] GET `/api/admin/analytics/kpis` returns all 6 KPIs
- [ ] All KPIs respect `period`, `from`, `to`, `category`
- [ ] Trends compare to previous period of same length
- [ ] Empty/zero values handled (e.g. `—` or 0, no division by zero)

---

## 4. Chart Data Endpoints (REQ-3)

### 4.1 Views Over Time (REQ-3.1)

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/admin/analytics/views-over-time` | Required |

**Query params:** `period`, `from`, `to`, `category`

**Response:** Time-series array
```json
{
  "success": true,
  "data": [
    { "date": "2026-02-01", "views": 12 },
    { "date": "2026-02-02", "views": 8 }
  ]
}
```

- Bucket by `getBucketSize(from, to)` — day, week, or month
- Date format: `YYYY-MM-DD` (day), `YYYY-Wnn` (week), `YYYY-MM` (month)
- Views = unique count per bucket (deduplicated per REQ-6.3)
- Exclude `isAdminView: true`

**Acceptance:**
- [ ] Returns array of `{ date, views }` sorted by date ascending
- [ ] Bucket size adapts to range (≤31d→day, ≤90d→week, else month)
- [ ] Empty array when no data

---

### 4.2 Publications Over Time (REQ-3.3, REQ-3.4)

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/admin/analytics/publications` | Required |

**Response:** Stacked bar data by category
```json
{
  "success": true,
  "data": [
    { "date": "2026-02", "Technology": 2, "Lifestyle": 1, "Startup": 0, "Finance": 0 }
  ]
}
```

- Group by month (`YYYY-MM`)
- Count published blogs per category per month
- All categories in `CATEGORIES` (excluding 'All') must appear in each row, 0 if none

**Acceptance:**
- [ ] Returns `{ date, ...categoryCounts }` for each month
- [ ] Bars can be stacked (frontend splits by category)
- [ ] Respects category filter: when filtered, only that category has values

---

### 4.3 Category Distribution (REQ-3.5)

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/admin/analytics/category-distribution` | Required |

**Response:** Donut chart data
```json
{
  "success": true,
  "data": [
    { "category": "Technology", "count": 6 },
    { "category": "Lifestyle", "count": 4 }
  ]
}
```

- Count of blogs per category in date range
- Excludes drafts if design specifies published-only; otherwise clarify

**Acceptance:**
- [ ] Returns array of `{ category, count }`
- [ ] Sum of counts = total blogs in scope
- [ ] Categories with 0 can be omitted or included as 0

---

### 4.4 Comment Activity (REQ-3.7)

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/admin/analytics/comment-activity` | Required |

**Response:** Grouped bar (approved vs pending by month)
```json
{
  "success": true,
  "data": [
    { "date": "2026-02", "approved": 15, "pending": 3 },
    { "date": "2026-01", "approved": 20, "pending": 5 }
  ]
}
```

- Group comments by month
- Split by `isApproved`: approved count, pending count
- Filter comments by blog category when category filter applied

**Acceptance:**
- [ ] Returns `{ date, approved, pending }` per month
- [ ] When category filter: only comments on blogs in that category

---

### 4.5 Views by Category (REQ-3.9, REQ-3.10)

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/admin/analytics/views-by-category` | Required |

**Response:** Horizontal bar, sorted high to low
```json
{
  "success": true,
  "data": [
    { "category": "Technology", "views": 71 },
    { "category": "Lifestyle", "views": 47 }
  ]
}
```

- Aggregate views per blog category
- Sorted by views descending
- Deduplicated views, exclude admin views

**Acceptance:**
- [ ] Returns `{ category, views }` sorted by views descending
- [ ] Category filter narrows to that category only

---

## 5. Table Data Endpoints (REQ-4)

### 5.1 Top Viewed Posts (REQ-4.1, REQ-4.2)

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/admin/analytics/top-viewed` | Required |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "title": "Automating Tests with Vitest and Playwright",
      "category": "Technology",
      "views": 20,
      "comments": 3,
      "publishDate": "2026-02-11"
    }
  ]
}
```

- Top 5 posts by view count
- Columns: title, category, views, comments, publish date
- Sorted by views descending
- Respect period, category filter

**Acceptance:**
- [ ] Returns up to 5 posts
- [ ] Includes `title`, `category`, `views`, `comments`, `publishDate`
- [ ] Sorted by views descending

---

### 5.2 Top Commented Posts (REQ-4.4, REQ-4.5)

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/admin/analytics/top-commented` | Required |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "title": "Pricing Strategy for SaaS",
      "category": "Startup",
      "commentsApproved": 11,
      "commentsTotal": 15,
      "views": 6
    }
  ]
}
```

- Top 5 by total comment count
- Columns: title, category, comments (approved/total), views
- Sorted by comment count descending

**Acceptance:**
- [ ] Returns up to 5 posts
- [ ] `commentsApproved` and `commentsTotal` for ratio display (e.g. "11/15")
- [ ] Sorted by total comments descending

---

### 5.3 Recent Comments (REQ-4.6)

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/admin/analytics/last-comments` | Required |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "author": "Avery U.",
      "content": "Simple yet effective. Well written.",
      "blogTitle": "Automating Tests with Vitest and Playwright",
      "createdAt": "2026-02-10T...",
      "isApproved": true
    }
  ]
}
```

- Last 5 comments by `createdAt` descending
- Populate blog title; author = `Comment.name`
- Filter by blog category when category filter applied

**Acceptance:**
- [ ] Returns up to 5 comments
- [ ] Includes `author` (name), `content` (excerpt), `blogTitle`, `createdAt`, `isApproved`
- [ ] Sorted by createdAt descending

---

## 6. CSV Export (REQ-5.9, REQ-5.10)

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/admin/analytics/export-csv` | Required |

**Query params:** `period`, `from`, `to`, `category`

**Response:**
- Content-Type: `text/csv`
- Content-Disposition: `attachment; filename="analytics-YYYY-MM-DD.csv"`
- Body: CSV with columns — post title, category, date, views, comment count, status (published/draft)

**CSV Columns (REQ-5.10):**
- Title
- Category
- Publish Date (or createdAt)
- Views
- Comment Count
- Status (published/draft)

**Acceptance:**
- [ ] Returns CSV file for download
- [ ] All columns present
- [ ] Filtered by period and category
- [ ] Rows = all blogs in scope (or top N if design constrains)

---

## 7. Drill-Down (Optional)

Client references `getDrillDown(date, params)`. If drill-down is required:

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/admin/analytics/drill-down` | Required |

**Query params:** `date`, `period`, `from`, `to`, `category`

**Purpose:** Return detailed breakdown for a single date bucket (e.g. day/week/month). Shape TBD by frontend needs.

**Acceptance:**
- [ ] Endpoint exists if drill-down feature is implemented
- [ ] Returns data scoped to the given date bucket

---

## 8. Implementation Order

| Phase | Scope | Dependencies |
|-------|-------|--------------|
| **1** | View Tracking | — |
| | BlogView model verification (schema, indexes) | — |
| | POST `/api/blog/:blogId/view` | BlogView model |
| | Deduplication logic (24h, visitorKey) | — |
| | Admin detection (`isAdminView`) | auth middleware |
| **2** | Admin routes & KPIs | Phase 1 |
| | Create `/api/admin/analytics/*` routes, auth | — |
| | GET `/api/admin/analytics/kpis` | Phase 1, aggregations |
| **3** | Chart endpoints | Phase 2 |
| | views-over-time, publications, category-distribution | Phase 2 |
| | comment-activity, views-by-category | Phase 2 |
| **4** | Table endpoints | Phase 3 |
| | top-viewed, top-commented, last-comments | Phase 3 |
| **5** | CSV Export | Phase 4 |
| | GET `/api/admin/analytics/export-csv` | Phase 4 |
| **6** | Drill-down (if needed) | Phase 5 |

---

## 9. Aggregation Pipelines (Summary)

MongoDB aggregations will use:

- **$match** — date range, category, `isAdminView: false` (views)
- **$group** — by date bucket, category, blog
- **$lookup** — join BlogView → Blog for category; Comment → Blog
- **$project** — shape output
- **$sort** — by date or by metric
- **$limit** — top 5, etc.

Deduplication for views (REQ-6.3):
- Option A: `$group` by `{ blog, visitorKey, $dateToString: { viewedAt, format: '%Y-%m-%d' } }` then count groups
- Option B: Pre-aggregate or use `$addToSet` on visitorKey per 24h window

---

## 10. Acceptance Criteria Summary

### View Tracking
- [ ] BlogView schema has required fields and indexes
- [ ] POST `/api/blog/:blogId/view` records views with deduplication
- [ ] Anonymous tracking works; admin views excluded from stats
- [ ] Referrer source stored when provided

### Filters
- [ ] All analytics endpoints accept period, from, to, category
- [ ] Date range and category filters applied consistently

### KPIs
- [ ] All 6 KPIs returned with correct values and trends
- [ ] Trends compare to previous equivalent period

### Charts
- [ ] Views over time: time-series with adaptive bucket
- [ ] Publications: by month, by category
- [ ] Category distribution: counts per category
- [ ] Comment activity: approved vs pending by month
- [ ] Views by category: sorted descending

### Tables
- [ ] Top 5 viewed: title, category, views, comments, date
- [ ] Top 5 commented: title, category, comments ratio, views
- [ ] Last 5 comments: author, excerpt, blog title, date, status

### Export
- [ ] CSV download with required columns
- [ ] Filtered by period and category
