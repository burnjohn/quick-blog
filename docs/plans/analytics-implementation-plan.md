# Analytics Dashboard — Implementation Plan

**Branch:** `emdash/analytics-implementation-475`
**Date:** 2026-04-02

---

## Overview

Full-stack analytics dashboard for the Quick Blog admin panel. Covers 3 requirement documents:
- **Frontend Requirements** (REQ-1.x through REQ-8.x) — page layout, KPIs, charts, tables, states
- **Backend Requirements** (REQ-2 through REQ-6) — view tracking, API endpoints, CSV export
- **Interactivity & Fixtures** (REQ-5.x, REQ-7.x) — filters, drill-down, export, seed data

**Design references:** `docs/images/analytics-dashboard-design.png`, `docs/images/analytics-dashboard-design-2.png`

---

## What Already Exists

| Item | Status |
|------|--------|
| Blog, Comment, User models | Exist |
| Admin auth middleware (JWT) | Exists |
| Rate limiter middleware | Exists |
| Sidebar, App.jsx routing, routes.js | Exist (need analytics additions) |
| Badge component | Exists (needs `pending` orange variant) |
| Skeleton component | Does NOT exist (needs creation) |
| BlogView model | Does NOT exist |
| Analytics routes/controller | Do NOT exist |
| Analytics aggregation helpers | Do NOT exist |
| Recharts dependency | NOT installed |
| chart_icon.svg | Does NOT exist |
| Fixtures: 10 blogs, 5 comments | Exist but need expansion for REQ-7.x |
| views.js fixture | Does NOT exist |

---

## Agent Team Structure

The work is split into **6 tasks** for parallel `implementor` agents. Dependencies are marked — independent tasks can run concurrently.

```
Task 1: Fixtures & Seed Data (REQ-7.x)          ─── no deps, runs first
Task 2: Backend — Model & View Tracking (REQ-6)  ─── no deps, runs first
Task 3: Backend — Analytics API (REQ-2-5)         ─── depends on Task 2
Task 4: Frontend — Setup, Page & Navigation       ─── no deps, runs first
Task 5: Frontend — Charts, KPIs, Tables           ─── depends on Task 4
Task 6: Frontend — Interactivity & Integration     ─── depends on Tasks 3, 5
```

**Parallel wave plan:**
- **Wave 1** (parallel): Tasks 1, 2, 4
- **Wave 2** (parallel): Tasks 3, 5
- **Wave 3**: Task 6

---

## Task 1: Fixtures & Seed Data

**Agent:** `implementor`
**Scope:** Server only — `server/fixtures/`, `server/scripts/seed.js`
**Requirements covered:** REQ-7.1 through REQ-7.10

### Steps

1. **Expand blog fixtures** (`server/fixtures/blogs.js`)
   - Add 8-10 more blog posts (total 18-20) across all 4 categories
   - Mix of published (~75%) and drafts (~25%)
   - Spread `createdAt` over last 6 months from seed date
   - Category distribution: Technology (6), Lifestyle (4), Startup (4), Finance (4)
   - REQ-7.6, REQ-7.9

2. **Expand comment fixtures** (`server/fixtures/comments.js`)
   - Increase to 80-120 comments with varied names/content
   - Mix ~80% approved, ~20% pending
   - Distribute unevenly across posts (some 10+, some 0-2)
   - Spread `createdAt` over 6 months
   - REQ-7.4, REQ-7.7

3. **Create view fixtures** (`server/fixtures/views.js`)
   - Export a `viewConfig` object with category popularity multipliers:
     - Technology: 1.0, Lifestyle: 0.75, Startup: 0.5, Finance: 0.3
   - Export a `generateViews(blogs)` function that creates 500-1000 BlogView records
   - Weekday bias (Mon-Fri ~1.5x weekend)
   - Growth trend (recent months higher)
   - Varied `referrerSource` distribution: direct 50%, search 25%, social 15%, other 10%
   - Unique `visitorKey` values (many unique, some repeat)
   - All `isAdminView: false`
   - REQ-7.1, REQ-7.2, REQ-7.3, REQ-7.8

4. **Update seed script** (`server/scripts/seed.js`)
   - Import BlogView model and view fixtures
   - Clear BlogView collection on seed
   - After creating blogs, generate and insert view records
   - Set blog `createdAt` from fixture data (override timestamps)
   - Set comment `createdAt` from fixture data
   - Log view count created
   - REQ-7.5, REQ-7.10

### Acceptance
- `npm run seed` produces 18-20 blogs, 80-120 comments, 500-1000 views
- Data spans 6 months with realistic patterns
- All 4 categories represented with Technology having most views
- Dashboard looks fully populated (REQ-7.5)

---

## Task 2: Backend — BlogView Model & View Tracking

**Agent:** `implementor`
**Scope:** Server only — model, route, controller
**Requirements covered:** REQ-6.1 through REQ-6.5

### Steps

1. **Create BlogView model** (`server/src/models/BlogView.js`)
   - Fields: `blog` (ObjectId ref Blog, required), `viewedAt` (Date, default now), `referrerSource` (enum: direct/search/social/other, default: direct), `isAdminView` (Boolean, default: false), `visitorKey` (String, required)
   - Indexes: `{ blog: 1, visitorKey: 1, viewedAt: 1 }`, `{ blog: 1, viewedAt: 1 }`, `{ viewedAt: 1 }`
   - REQ-6.1, REQ-6.4

2. **Create view recording controller** (`server/src/controllers/viewController.js`)
   - `recordView(req, res)`:
     - Validate `blogId` param and `visitorKey` in body
     - Check blog exists and `isPublished: true` (404 if not)
     - Dedup: check existing BlogView with same `blog` + `visitorKey` within last 24h — if found, return 200 without creating
     - If `Authorization` header present and user is admin/author, set `isAdminView: true`
     - Create BlogView document
     - Return `{ success: true }`
   - REQ-6.2, REQ-6.3, REQ-6.5

3. **Add public route** (`server/src/routes/blogRoutes.js`)
   - `POST /api/blog/:blogId/view` — no auth required, rate limited
   - Wire to `viewController.recordView`
   - REQ-6.1, REQ-6.2

### Acceptance
- POST `/api/blog/:blogId/view` works without auth
- Deduplication prevents same visitor+blog within 24h
- Admin views are flagged `isAdminView: true`
- Invalid blogId or missing visitorKey returns 400
- Non-existent or unpublished blog returns 404

---

## Task 3: Backend — Analytics API Endpoints

**Agent:** `implementor`
**Scope:** Server only — controller, helpers, routes
**Requirements covered:** REQ-2.x, REQ-3.x, REQ-4.x, REQ-5.x (filters), REQ-5.9/5.10 (CSV)
**Depends on:** Task 2 (BlogView model must exist)

### Steps

1. **Create analytics aggregation helpers** (`server/src/helpers/analyticsAggregations.js`)
   - `getDateRange(period, from, to)` — returns `{ from: Date, to: Date }`
   - `getPreviousPeriod(from, to)` — returns equivalent prior range for trend comparison
   - `buildBlogFilter({ from, to, category })` — Mongoose filter for Blog queries
   - `buildViewFilter({ from, to }, blogIds)` — BlogView filter excluding admin views
   - `getBucketSize(from, to)` — returns `'day'` | `'week'` | `'month'`
   - `calculateTrend(current, previous)` — returns `{ direction, percentChange }`

2. **Create analytics controller** (`server/src/controllers/analyticsController.js`)

   **KPIs endpoint** — `GET /api/admin/analytics/kpis`
   - Returns all 6 KPIs with trends: totalViews, totalBlogs (published/drafts), totalComments (approved/pending), avgEngagement, approvalRate, mostActiveCategory
   - Accepts `period`, `from`, `to`, `category` query params
   - REQ-2.1 through REQ-2.7

   **Chart endpoints:**
   - `GET /api/admin/analytics/views-over-time` — time-series `[{ date, views }]` with adaptive bucket size (REQ-3.1, REQ-3.2)
   - `GET /api/admin/analytics/publications` — `[{ date, Technology, Lifestyle, Startup, Finance }]` by month (REQ-3.3, REQ-3.4)
   - `GET /api/admin/analytics/category-distribution` — `[{ category, count }]` (REQ-3.5)
   - `GET /api/admin/analytics/comment-activity` — `[{ date, approved, pending }]` by month (REQ-3.7)
   - `GET /api/admin/analytics/views-by-category` — `[{ category, views }]` sorted desc (REQ-3.9, REQ-3.10)

   **Table endpoints:**
   - `GET /api/admin/analytics/top-viewed` — top 5 by views with title, category, views, comments, publishDate (REQ-4.1, REQ-4.2, REQ-4.3)
   - `GET /api/admin/analytics/top-commented` — top 5 by comments with title, category, commentsApproved, commentsTotal, views (REQ-4.4, REQ-4.5)
   - `GET /api/admin/analytics/last-comments` — last 5 comments with author, content, blogTitle, createdAt, isApproved (REQ-4.6)

   **CSV export:**
   - `GET /api/admin/analytics/export-csv` — returns `text/csv` with columns: Title, Category, Publish Date, Views, Comment Count, Status (REQ-5.9, REQ-5.10)

   **Drill-down:**
   - `GET /api/admin/analytics/drill-down` — posts for a specific date bucket (REQ-5.6)

3. **Create analytics routes** (`server/src/routes/analyticsRoutes.js`)
   - All routes require JWT auth (admin only)
   - Mount under `/api/admin/analytics/`

4. **Register routes** in `server/src/routes/appRoutes.js` or main app file

### Acceptance
- All 11 endpoints return correct data shape
- All endpoints accept `period`, `from`, `to`, `category` filters (REQ-5.x)
- KPI trends compare to previous equivalent period
- CSV downloads with correct headers and Content-Disposition
- Empty/zero values handled without errors

---

## Task 4: Frontend — Setup, Page Shell & Navigation

**Agent:** `implementor`
**Scope:** Client only — config, routing, page shell, shared components
**Requirements covered:** REQ-1.1, REQ-1.2, REQ-8.1 (Skeleton), Badge update

### Steps

1. **Install recharts** — `npm install recharts` in `client/`

2. **Add chart icon** (`client/src/assets/chart_icon.svg`)
   - Create a simple bar-chart SVG icon matching the sidebar icon style
   - Add import to `client/src/assets/assets.js`

3. **Add route constant** (`client/src/constants/routes.js`)
   - Add `ADMIN_ANALYTICS: '/admin/analytics'`

4. **Create Skeleton component** (`client/src/components/ui/Skeleton/Skeleton.jsx`)
   - Shimmer animation placeholder
   - Props: `width`, `height`, `className`, `variant` (text, circle, rect)
   - Export from `Skeleton/index.js`
   - REQ-8.1

5. **Update Badge component** (`client/src/components/ui/Badge/Badge.jsx`)
   - Add `pending` variant: `bg-orange-100 text-orange-700 border-orange-300`
   - Used for "Pending" status in Recent Comments table

6. **Create Analytics page shell** (`client/src/pages/admin/Analytics/Analytics.jsx`)
   - Page title "Analytics"
   - Placeholder sections for FilterBar, KpiSection, ChartSection, TableSection
   - Export from `Analytics/index.js`
   - REQ-1.2

7. **Add route** (`client/src/App.jsx`)
   - Add `<Route path="analytics" element={<Analytics />} />` under admin layout
   - JWT protected (same as other admin routes)
   - REQ-1.2

8. **Add sidebar link** (`client/src/components/admin/shared/Sidebar/Sidebar.jsx`)
   - Add Analytics NavLink with chart_icon after Comments link
   - REQ-1.1

9. **Create analytics API service** (`client/src/services/analyticsApi.js` or add to existing api service)
   - Functions for all analytics endpoints: `getKpis(params)`, `getViewsOverTime(params)`, `getPublications(params)`, `getCategoryDistribution(params)`, `getCommentActivity(params)`, `getViewsByCategory(params)`, `getTopViewed(params)`, `getTopCommented(params)`, `getLastComments(params)`, `exportCsv(params)`, `getDrillDown(date, params)`

10. **Create analytics hooks** (`client/src/hooks/api/queries/useAnalytics/`)
    - `useAnalyticsKpis(params)` — fetches KPI data
    - `useAnalyticsCharts(params)` — fetches all chart data (or separate hooks per chart)
    - `useAnalyticsTables(params)` — fetches all table data
    - Follow existing hook patterns (loading, error, data states)

### Acceptance
- Analytics link visible in sidebar with chart icon
- Route `/admin/analytics` renders Analytics page (protected)
- Skeleton component available for loading states
- Badge has `pending` (orange) variant
- API service and hooks ready for data fetching

---

## Task 5: Frontend — KPIs, Charts & Tables

**Agent:** `implementor`
**Scope:** Client only — all analytics UI components
**Requirements covered:** REQ-2.x, REQ-3.x, REQ-4.x, REQ-8.x
**Depends on:** Task 4 (page shell, Skeleton, hooks must exist)

### Steps

1. **KPI Section** (`client/src/components/admin/analytics/`)
   - `KpiCard.jsx` — white card with label, large bold value, sub-text, trend indicator
     - Trend: green `↑ X% vs previous period` for positive, red `↓` for negative, gray `—` for no comparison
     - REQ-2.7
   - `KpiSection.jsx` — grid of 6 KpiCards
     - Total Views, Total Blogs (X published, Y drafts), Total Comments (X approved, Y pending), Avg Engagement (%), Approval Rate (%), Most Active Category (X posts)
     - Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6`
     - REQ-2.1 through REQ-2.6

2. **Chart components** (`client/src/components/admin/analytics/charts/`)

   - `ChartCard.jsx` — white card wrapper with title for each chart
   
   - `ViewsOverTimeChart.jsx` — LineChart/AreaChart
     - X: dates, Y: views, tooltip with date + count
     - Empty state: "No views data for selected period"
     - REQ-3.1, REQ-3.2

   - `PublicationsChart.jsx` — BarChart, stacked by category
     - Legend: Finance (orange), Lifestyle (purple), Startup (green), Technology (blue)
     - X: month, Y: count
     - REQ-3.3, REQ-3.4

   - `CategoryDistributionChart.jsx` — PieChart with innerRadius (donut)
     - Category color palette, tooltip: category, count, %
     - REQ-3.5, REQ-3.6

   - `CommentActivityChart.jsx` — BarChart, grouped (approved green, pending orange)
     - X: months, Y: comment count, legend
     - REQ-3.7, REQ-3.8

   - `ViewsByCategoryChart.jsx` — BarChart layout="vertical" (horizontal bars)
     - Y: category names, X: view count, sorted desc
     - REQ-3.9, REQ-3.10

   - `ChartSection.jsx` — 2-column grid layout
     - Row 1: Views Over Time | Publications Over Time
     - Row 2: Category Distribution | Comment Activity
     - Row 3: Views by Category (left column)
     - All charts use `ResponsiveContainer` width="100%"
     - REQ-8.5

3. **Table components** (`client/src/components/admin/analytics/tables/`)

   - `TopViewedTable.jsx` — columns: Title (purple link), Category, Views, Comments, Publish Date
     - Max 5 rows, sorted by views desc
     - Title links to `getBlogDetailPath(id)`
     - Date format: "Feb 11, 2026" (en-US)
     - REQ-4.1, REQ-4.2, REQ-4.3

   - `TopCommentedTable.jsx` — columns: Title (purple link), Category, Comments (X / Y approved/total), Views
     - Max 5 rows, sorted by total comments desc
     - REQ-4.4, REQ-4.5

   - `RecentCommentsTable.jsx` — author (bold), text (italic), blog title link + date, status badge
     - Max 5, sorted by date desc
     - Badge: green "Approved" or orange "Pending"
     - Horizontal line separators between comments
     - REQ-4.6

   - `TableSection.jsx` — layout wrapper
     - Top Viewed + Top Commented side-by-side on desktop
     - Recent Comments full width below

4. **Loading, empty, error states** for all sections
   - Skeleton shimmer for KPIs (6 card skeletons), charts (rectangles), tables (5 skeleton rows)
   - Empty messages per component
   - Error message + "Retry" button (triggers refetch)
   - REQ-8.1, REQ-8.2, REQ-8.3

5. **Responsive layout**
   - Mobile: single-column everything
   - Tablet: 2-col KPIs, 2-col charts, 2-col tables
   - Desktop: 6-col KPIs, 2-col charts, 2-col tables
   - REQ-8.4

### Acceptance
- All 6 KPI cards render with correct data, sub-text, and trends
- All 5 charts render with correct types, colors, tooltips
- All 3 tables render with correct columns, sorting, links, badges
- Skeleton loading shown during fetch
- Empty/error states work correctly
- Layout responsive across breakpoints

---

## Task 6: Frontend — Filters, Drill-down, Export & Integration

**Agent:** `implementor`
**Scope:** Client only — filter bar, interactivity, wiring
**Requirements covered:** REQ-5.1 through REQ-5.10, REQ-0.x
**Depends on:** Tasks 3 (API) and 5 (UI components)

### Steps

1. **Filter Bar** (`client/src/components/admin/analytics/filters/`)

   - `PeriodFilter.jsx` — 5 buttons: 7d, 30d, 90d, 1y, All
     - Active state: primary background
     - Mutually exclusive with custom date range
     - REQ-5.1

   - `DateRangeFilter.jsx` — two date inputs (from/to) with separator
     - Calendar icon affordance, `YYYY-MM-DD` input
     - Validation: from <= to
     - Selecting clears quick-select
     - REQ-5.2

   - `CategoryFilter.jsx` — dropdown: All, Technology, Startup, Lifestyle, Finance
     - Default: All, uses `blogCategories` constant
     - REQ-5.4

   - `ExportButton.jsx` — "Export CSV" button
     - `bg-primary text-white`, disabled when no data
     - Triggers CSV download via `analyticsApi.exportCsv(params)`
     - Loading state during export
     - Error handling
     - REQ-5.9

   - `FilterBar.jsx` — composes all filter sub-components
     - Wraps on small screens
     - REQ-1.3

2. **Filter state management** (in Analytics page)
   - Use `useSearchParams` for shareable URLs: `period`, `from`, `to`, `category`
   - Default: `period=all`, `category=All`
   - Period change clears date inputs and vice versa
   - All data hooks receive filter params
   - REQ-5.3, REQ-5.5

3. **Drill-down — Views chart** (`client/src/components/admin/analytics/DrillDownModal.jsx`)
   - Click on Views Over Time chart point/bar opens modal
   - Fetches `analyticsApi.getDrillDown(date, params)`
   - Shows posts: title (link), category, views, publish date
   - Close via X, Escape, click outside
   - Loading/empty states
   - REQ-5.6, REQ-5.8

4. **Drill-down — Category donut**
   - Click donut segment sets category filter (updates URL param)
   - Category dropdown reflects selection
   - All sections update
   - REQ-5.7

5. **Wire Analytics page** (`client/src/pages/admin/Analytics/Analytics.jsx`)
   - Compose: FilterBar → KpiSection → ChartSection → TableSection
   - Pass filter params from URL to all hooks
   - On filter change, all sections re-fetch
   - REQ-5.3, REQ-5.5

6. **Localization** — ensure all labels English, dates en-US, numbers with commas
   - REQ-0.1, REQ-0.2, REQ-0.3

### Acceptance
- Period buttons toggle correctly; custom dates override and vice versa
- Category dropdown filters all sections
- Export CSV downloads correct filtered data
- Views chart drill-down opens modal with post list
- Donut click filters page by category
- All sections use consistent filter values
- URL params enable shareable filtered views

---

## Requirements Coverage Matrix

| REQ ID | Description | Task |
|--------|-------------|------|
| REQ-0.1–0.3 | English labels, en-US dates/numbers | 6 |
| REQ-1.1 | Analytics nav item | 4 |
| REQ-1.2 | Admin-only access | 4 |
| REQ-1.3 | Filter bar layout | 6 |
| REQ-2.1–2.6 | KPI cards (6 types) | 3 (API), 5 (UI) |
| REQ-2.7 | Trend indicators | 3 (API), 5 (UI) |
| REQ-3.1–3.2 | Views over time chart | 3 (API), 5 (UI) |
| REQ-3.3–3.4 | Publications chart (stacked) | 3 (API), 5 (UI) |
| REQ-3.5–3.6 | Category distribution donut | 3 (API), 5 (UI) |
| REQ-3.7–3.8 | Comment activity chart | 3 (API), 5 (UI) |
| REQ-3.9–3.10 | Views by category (horizontal) | 3 (API), 5 (UI) |
| REQ-4.1–4.3 | Top viewed posts table | 3 (API), 5 (UI) |
| REQ-4.4–4.5 | Top commented posts table | 3 (API), 5 (UI) |
| REQ-4.6 | Recent comments table | 3 (API), 5 (UI) |
| REQ-5.1 | Period quick-select buttons | 6 |
| REQ-5.2 | Custom date range picker | 6 |
| REQ-5.3 | Period propagates globally | 6 |
| REQ-5.4 | Category dropdown | 6 |
| REQ-5.5 | Category filter propagates globally | 6 |
| REQ-5.6 | Views chart drill-down | 3 (API), 6 (UI) |
| REQ-5.7 | Category donut drill-down | 6 |
| REQ-5.8 | Drill-down modal/expand UX | 6 |
| REQ-5.9 | Export CSV button | 3 (API), 6 (UI) |
| REQ-5.10 | CSV content columns | 3 (API) |
| REQ-6.1–6.5 | View tracking system | 2 |
| REQ-7.1–7.10 | Fixtures & seed data | 1 |
| REQ-8.1 | Skeleton loading states | 4 (component), 5 (usage) |
| REQ-8.2 | Empty states | 5 |
| REQ-8.3 | Error + retry states | 5 |
| REQ-8.4 | Responsive layout | 5 |
| REQ-8.5 | Chart responsive containers | 5 |

**All requirements from all 3 documents are covered.**

---

## File Creation Summary

### New files (server)
```
server/src/models/BlogView.js
server/src/controllers/viewController.js
server/src/controllers/analyticsController.js
server/src/helpers/analyticsAggregations.js
server/src/routes/analyticsRoutes.js
server/fixtures/views.js
```

### New files (client)
```
client/src/assets/chart_icon.svg
client/src/components/ui/Skeleton/Skeleton.jsx
client/src/components/ui/Skeleton/index.js
client/src/pages/admin/Analytics/Analytics.jsx
client/src/pages/admin/Analytics/index.js
client/src/services/analyticsApi.js
client/src/hooks/api/queries/useAnalytics/useAnalytics.js
client/src/hooks/api/queries/useAnalytics/index.js
client/src/components/admin/analytics/KpiSection.jsx
client/src/components/admin/analytics/KpiCard.jsx
client/src/components/admin/analytics/ChartSection.jsx
client/src/components/admin/analytics/charts/ChartCard.jsx
client/src/components/admin/analytics/charts/ViewsOverTimeChart.jsx
client/src/components/admin/analytics/charts/PublicationsChart.jsx
client/src/components/admin/analytics/charts/CategoryDistributionChart.jsx
client/src/components/admin/analytics/charts/CommentActivityChart.jsx
client/src/components/admin/analytics/charts/ViewsByCategoryChart.jsx
client/src/components/admin/analytics/tables/TableSection.jsx
client/src/components/admin/analytics/tables/TopViewedTable.jsx
client/src/components/admin/analytics/tables/TopCommentedTable.jsx
client/src/components/admin/analytics/tables/RecentCommentsTable.jsx
client/src/components/admin/analytics/filters/FilterBar.jsx
client/src/components/admin/analytics/filters/PeriodFilter.jsx
client/src/components/admin/analytics/filters/DateRangeFilter.jsx
client/src/components/admin/analytics/filters/CategoryFilter.jsx
client/src/components/admin/analytics/ExportButton.jsx
client/src/components/admin/analytics/DrillDownModal.jsx
```

### Modified files
```
client/package.json                              — add recharts
client/src/assets/assets.js                      — add chart_icon
client/src/constants/routes.js                   — add ADMIN_ANALYTICS
client/src/App.jsx                               — add analytics route
client/src/components/admin/shared/Sidebar/Sidebar.jsx — add analytics NavLink
client/src/components/ui/Badge/Badge.jsx         — add pending variant
server/fixtures/blogs.js                         — expand to 18-20 blogs
server/fixtures/comments.js                      — expand to 80-120 comments
server/scripts/seed.js                           — add BlogView seeding
server/src/routes/appRoutes.js (or blogRoutes.js) — add view recording route
```
