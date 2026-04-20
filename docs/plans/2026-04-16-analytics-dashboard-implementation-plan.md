# Analytics Dashboard — Agent Team Implementation Plan

## Context

The Quick Blog admin panel needs a full Analytics Dashboard with KPI cards, charts, tables, filters, CSV export, drill-down, and view tracking. This covers **3 requirements documents** (60+ requirements: REQ-1.x through REQ-8.x) and must match **2 design screenshots**. Nothing exists yet — no models, controllers, routes, components, hooks, or seed data for analytics.

The work is split across **6 implementor agents** in **2 phases** to maximize parallelism while avoiding file conflicts.

---

## Phase 1: Foundation (5 agents in parallel)

All 5 agents run simultaneously. Each owns exclusive files — no overlaps.

---

### Agent 1: Backend — Model, Aggregations, Controller, Routes

**Covers:** REQ-6.1–6.5 (view tracking), REQ-2.1–2.7 (KPI API), REQ-3.1–3.10 (chart APIs), REQ-4.1–4.6 (table APIs), REQ-5.9–5.10 (CSV export API), REQ-5 filter params

**Files (all NEW):**
- `server/src/models/BlogView.js` — schema: blog (ObjectId→Blog), viewedAt (Date), referrerSource (enum), isAdminView (Boolean), visitorKey (String). Indexes: `{blog,visitorKey,viewedAt}`, `{blog,viewedAt}`, `{viewedAt}`
- `server/src/helpers/analyticsAggregations.js` — `getDateRange(period,from,to)`, `getPreviousPeriod(from,to)`, `buildBlogFilter({from,to,category})`, `buildViewFilter({from,to},blogIds)`, `getBucketSize(from,to)`, `calculateTrend(current,previous)`
- `server/src/controllers/analyticsController.js` — 11 handlers wrapped in `asyncHandler`:
  - `recordView` — POST, 24h dedup via visitorKey+blog, optional JWT admin detection
  - `getKpis` — 6 KPIs with trends via `getPreviousPeriod` + `calculateTrend`
  - `getViewsOverTime` — time-series with adaptive bucket (day/week/month)
  - `getPublications` — stacked bar by category by month
  - `getCategoryDistribution` — count per category (donut)
  - `getCommentActivity` — approved/pending by month
  - `getViewsByCategory` — views per category sorted desc
  - `getTopViewed` — top 5 posts by views
  - `getTopCommented` — top 5 by comments (approved/total)
  - `getLastComments` — last 5 comments with blog title
  - `exportCsv` — CSV generation with Content-Disposition header
- `server/src/routes/analyticsRoutes.js` — exports `analyticsRouter` with auth middleware on all GET endpoints

**Patterns to follow:**
- Use `asyncHandler` from `server/src/helpers/asyncHandler.js`
- Use `sendSuccess`/`sendData`/`sendError` from `server/src/helpers/response.js`
- Auth middleware: `import auth from '../middleware/auth.js'`
- Response shape: `{ success: true, ... }` (matches `useApiQuery` expectations)

---

### Agent 2: Seed Data & Fixtures

**Covers:** REQ-7.1–7.10 (fixtures/seed data)

**Files:**
- `server/fixtures/blogs.js` (MODIFY) — expand from 8 to 18 blogs. Add 10 new entries across all 4 categories (~6 Technology, ~4 Lifestyle, ~4 Startup, ~4 Finance). ~75% published, ~25% drafts. Do NOT change existing `blog_data` array or `comments_data` (used by frontend).
- `server/fixtures/comments.js` (MODIFY) — expand from 10 to ~100 comment entries. Mix ~80% approved, ~20% pending. Diverse author names and realistic comment content.
- `server/fixtures/views.js` (NEW) — `viewConfig` with category popularity multipliers (Technology=1.0, Lifestyle=0.75, Startup=0.50, Finance=0.30), weekday bias (weekday=1.0, weekend=0.5), growth factor, referrer distribution (direct 50%, search 25%, social 15%, other 10%).
- `server/scripts/seed.js` (MODIFY) — import BlogView model and clear collection. Assign `createdAt` dates spread over 6 months for blogs and comments. Generate 500-1000 BlogView records per published blog using `viewConfig`. Apply weekday bias, growth trend, unique visitorKeys, varied referrerSources.

**Key constraints:**
- Import `BlogView` from `'../src/models/BlogView.js'` (created by Agent 1)
- Seed order: users → blogs (with spread createdAt) → comments (spread createdAt, uneven distribution) → BlogView records
- Blogs must have `createdAt` spanning ~6 months (not all same day)
- Comments distributed unevenly (some posts 10+, some 0-2)
- No single day > 20% of all comments

---

### Agent 3: Frontend — Chart Components (Recharts)

**Covers:** REQ-3.1–3.10 (charts), REQ-8.2 (chart empty states), REQ-8.5 (responsive charts)

**Files (all NEW under `client/src/components/admin/analytics/`):**
- `charts/ViewsOverTimeChart.jsx` — AreaChart, props: `{ data: [{date,views}], onPointClick, loading }`. ResponsiveContainer, XAxis (date), YAxis, Tooltip (date + count). Empty: "No views data for selected period"
- `charts/PublicationsChart.jsx` — BarChart stacked by category. Props: `{ data: [{date, Technology, Lifestyle, Startup, Finance}] }`. Legend with category colors
- `charts/CategoryDistributionChart.jsx` — PieChart donut (`innerRadius={60}`). Props: `{ data: [{category,count}], onCategoryClick }`. Custom tooltip: category, count, percentage
- `charts/CommentActivityChart.jsx` — BarChart grouped (not stacked). Props: `{ data: [{date, approved, pending}] }`. Two bars: Approved (green), Pending (orange). Legend
- `charts/ViewsByCategoryChart.jsx` — BarChart `layout="vertical"`. Props: `{ data: [{category,views}] }` sorted desc. Bars colored by CATEGORY_COLORS
- `charts/index.js` — barrel export
- `ChartSection.jsx` — 2-col grid (`lg:grid-cols-2`). Row 1: ViewsOverTime | Publications. Row 2: CategoryDistribution | CommentActivity. Row 3: ViewsByCategory (left only). Each in white card with title + border
- `constants.js` — `CATEGORY_COLORS: { Technology: '#3b82f6', Lifestyle: '#a855f7', Startup: '#22c55e', Finance: '#f97316' }`

**All components are pure/presentational** — accept data as props, no API calls. Assume `recharts` is installed (Agent 6 handles install).

---

### Agent 4: Frontend — KPIs, Tables, Filters, Skeleton, DrillDown

**Covers:** REQ-2.1–2.7 (KPI UI), REQ-4.1–4.6 (tables), REQ-5.1–5.2 (period filter UI), REQ-5.4 (category filter UI), REQ-5.6/5.8 (drill-down modal), REQ-8.1 (skeleton), REQ-8.2–8.3 (empty/error states)

**Files (all NEW):**
- `client/src/components/ui/Skeleton/Skeleton.jsx` + `index.js` — animated shimmer (`animate-pulse bg-gray-200`). Props: `className`, `width`, `height`, `rounded`
- `client/src/components/admin/analytics/KpiCard.jsx` — props: `label`, `value`, `subText`, `trend: {direction, percentChange}`, `loading`. White card, border-gray-100. Trend: green arrow-up / red arrow-down / gray em-dash. Loading: Skeleton placeholders
- `client/src/components/admin/analytics/KpiSection.jsx` — grid `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6`. Maps 6 KPI objects to KpiCards. Error state with retry
- `client/src/components/admin/analytics/filters/PeriodFilter.jsx` — 5 buttons (7d/30d/90d/1y/All), controlled via `{value, onChange}`
- `client/src/components/admin/analytics/filters/CategoryFilter.jsx` — select dropdown using `BLOG_CATEGORIES` from `constants/categories.js`
- `client/src/components/admin/analytics/filters/FilterBar.jsx` — layout: period buttons | date inputs (from–to) | category dropdown | ExportButton. Wraps on small screens
- `client/src/components/admin/analytics/filters/index.js`
- `client/src/components/admin/analytics/ExportButton.jsx` — purple button "Export CSV", props: `onClick`, `loading`, `disabled`
- `client/src/components/admin/analytics/tables/TopViewedTable.jsx` — 5 rows: title (purple link via `getBlogDetailPath`), category, views, comments, publish date (en-US "Feb 11, 2026"). Skeleton rows when loading
- `client/src/components/admin/analytics/tables/TopCommentedTable.jsx` — 5 rows: title link, category, comments "X / Y", views
- `client/src/components/admin/analytics/tables/RecentCommentsTable.jsx` — 5 rows: author (bold), comment text (italic), blog title link + date, status badge (green "Approved" / orange "Pending"). Items separated by `<hr>`
- `client/src/components/admin/analytics/tables/TableSection.jsx` — top 2 tables side-by-side (`lg:grid-cols-2`), recent comments full-width below
- `client/src/components/admin/analytics/tables/index.js`
- `client/src/components/admin/analytics/DrillDownModal.jsx` — modal overlay. Props: `isOpen`, `onClose`, `title`, `data`, `loading`. Table of posts. Focus trap, Escape to close
- `client/src/components/admin/analytics/index.js` — barrel export for all analytics components

**All components are pure/presentational** — accept data as props. Use `getBlogDetailPath` from `constants/routes.js`. Use Badge from `components/ui/Badge` (pending variant added by Agent 6).

---

### Agent 5: Frontend — API Layer & Hooks

**Covers:** REQ-5.3 (data fetching), REQ-5.5 (category in API), REQ-5.9 (export hook)

**Files (all NEW):**
- `client/src/api/analyticsApi.js` — follows `adminApi.js` pattern (imports axios from `./axiosConfig`). Methods:
  - `getKpis(params)` → GET `/api/admin/analytics/kpis?${queryString}`
  - `getViewsOverTime(params)` → GET `/api/admin/analytics/views-over-time`
  - `getPublications(params)` → GET `/api/admin/analytics/publications`
  - `getCategoryDistribution(params)` → GET `/api/admin/analytics/category-distribution`
  - `getCommentActivity(params)` → GET `/api/admin/analytics/comment-activity`
  - `getViewsByCategory(params)` → GET `/api/admin/analytics/views-by-category`
  - `getTopViewed(params)` → GET `/api/admin/analytics/top-viewed`
  - `getTopCommented(params)` → GET `/api/admin/analytics/top-commented`
  - `getLastComments(params)` → GET `/api/admin/analytics/last-comments`
  - `exportCsv(params)` → GET with `responseType: 'blob'`
  - `getDrillDown(params)` → GET `/api/admin/analytics/drill-down`
  - `recordView(blogId, data)` → POST `/api/blog/${blogId}/view`
  - All accept `{period, from, to, category}` as query params
- `client/src/constants/analyticsConstants.js` — `PERIOD_OPTIONS`, `DEFAULT_PERIOD: 'all'`, `DEFAULT_CATEGORY: 'All'`
- `client/src/hooks/api/queries/useAnalytics/useAnalytics.js` + `index.js` — uses `useApiQuery` from `hooks/core`. Accepts `{period, from, to, category}`. Returns `{kpis, viewsOverTime, publications, categoryDistribution, commentActivity, viewsByCategory, topViewed, topCommented, lastComments, loading, error, refetch}`. Dependencies: `[period, from, to, category]`
- `client/src/hooks/api/queries/useAnalyticsDrillDown/useAnalyticsDrillDown.js` + `index.js` — `enabled` only when drill-down is open
- `client/src/hooks/api/mutations/useExportCsv/useExportCsv.js` + `index.js` — triggers blob download, creates `<a>` element for download. Filename: `analytics-YYYY-MM-DD-to-YYYY-MM-DD.csv`

**Pattern to follow** — from `useAdminDashboard.js`:
```js
const { data, loading, error, refetch } = useApiQuery(
  () => axios.get('/api/admin/analytics/kpis', { params }),
  { dependencies: [period, from, to, category] }
)
```

---

## Phase 2: Integration (1 agent, after all Phase 1 agents complete)

### Agent 6: Wiring & Integration

**Covers:** REQ-1.1–1.2 (navigation/routing), REQ-5.3 (global filter propagation), REQ-5.5 (category wiring), REQ-5.6–5.7 (drill-down wiring), REQ-8.4 (responsive page layout), REQ-0.1–0.3 (English labels, en-US formats)

**Modifications to existing files:**

| File | Change |
|------|--------|
| `client/package.json` | `npm install recharts` |
| `client/src/constants/routes.js` | Add `ADMIN_ANALYTICS: '/admin/analytics'` |
| `client/src/constants/apiEndpoints.js` | Add all analytics endpoints (10 constants) |
| `client/src/assets/assets.js` | Import and export `chart_icon` |
| `client/src/components/ui/Badge/Badge.jsx` | Add `pending: 'bg-orange-100 text-orange-700 border-orange-300'` to variants |
| `client/src/components/admin/shared/Sidebar/Sidebar.jsx` | Add Analytics NavLink after Comments link |
| `client/src/App.jsx` | Import Analytics, add `<Route path='analytics' element={<Analytics />} />` inside admin layout |
| `client/src/pages/admin/index.js` | Add `export { default as Analytics } from './Analytics'` |
| `server/src/app.js` | Import and mount `analyticsRouter` on `/api/admin/analytics` |
| `server/src/routes/blogRoutes.js` | Add `POST /:blogId/view` to public routes section (import `recordView` from analyticsController) |

**New files:**
- `client/src/assets/chart_icon.svg` — simple bar-chart SVG icon
- `client/src/pages/admin/Analytics/Analytics.jsx` — **the main orchestration page**:
  - State: `period` (default 'all'), `dateRange: {from, to}`, `category` (default 'All'), `drillDown: {open, date}`
  - Calls `useAnalytics({period, from, to, category})` for all data
  - Calls `useExportCsv()` for export
  - Calls `useAnalyticsDrillDown({date, ...filters, enabled: drillDown.open})`
  - Renders: "Analytics" title → FilterBar → KpiSection → ChartSection → TableSection → DrillDownModal
  - Wires: `onCategoryClick` from donut → sets category state + dropdown (REQ-5.7)
  - Wires: `onPointClick` from ViewsOverTime → opens DrillDownModal (REQ-5.6)
  - Wires: `onExport` → triggers CSV download
  - Passes loading/error/refetch to all sections
- `client/src/pages/admin/Analytics/index.js` — barrel

---

## Requirement Coverage Matrix

| REQ | Description | Agent | Phase |
|-----|-------------|-------|-------|
| **REQ-0.1–0.3** | English labels, en-US formats | Agent 4, 6 | 1, 2 |
| **REQ-1.1** | Analytics sidebar nav with chart icon | Agent 6 | 2 |
| **REQ-1.2** | Protected admin route | Agent 6 | 2 |
| **REQ-2.1–2.6** | 6 KPI cards (backend) | Agent 1 | 1 |
| **REQ-2.1–2.6** | 6 KPI cards (frontend) | Agent 4 | 1 |
| **REQ-2.7** | Trend indicators | Agent 1 (calc), Agent 4 (UI) | 1 |
| **REQ-3.1–3.2** | Views Over Time chart + tooltips | Agent 1 (API), Agent 3 (UI) | 1 |
| **REQ-3.3–3.4** | Publications stacked bar | Agent 1 (API), Agent 3 (UI) | 1 |
| **REQ-3.5–3.6** | Category donut + hover | Agent 1 (API), Agent 3 (UI) | 1 |
| **REQ-3.7–3.8** | Comment Activity grouped bar | Agent 1 (API), Agent 3 (UI) | 1 |
| **REQ-3.9–3.10** | Views by Category horizontal bar | Agent 1 (API), Agent 3 (UI) | 1 |
| **REQ-4.1–4.3** | Top Viewed table | Agent 1 (API), Agent 4 (UI) | 1 |
| **REQ-4.4–4.5** | Top Commented table | Agent 1 (API), Agent 4 (UI) | 1 |
| **REQ-4.6** | Recent Comments | Agent 1 (API), Agent 4 (UI) | 1 |
| **REQ-5.1** | Period quick-select buttons | Agent 4 (UI), Agent 6 (wiring) | 1, 2 |
| **REQ-5.2** | Custom date range picker | Agent 4 (UI), Agent 6 (wiring) | 1, 2 |
| **REQ-5.3** | Period propagates globally | Agent 5 (hooks), Agent 6 (page) | 1, 2 |
| **REQ-5.4** | Category dropdown | Agent 4 (UI) | 1 |
| **REQ-5.5** | Category filter global | Agent 5 (hooks), Agent 6 (page) | 1, 2 |
| **REQ-5.6** | Views chart drill-down | Agent 1 (API), Agent 4 (modal), Agent 5 (hook), Agent 6 (wiring) | 1, 2 |
| **REQ-5.7** | Donut click → filter page | Agent 3 (callback prop), Agent 6 (wiring) | 1, 2 |
| **REQ-5.8** | Drill-down modal UX | Agent 4 (modal) | 1 |
| **REQ-5.9–5.10** | CSV export | Agent 1 (API), Agent 4 (button), Agent 5 (hook), Agent 6 (wiring) | 1, 2 |
| **REQ-6.1** | Record blog views | Agent 1 | 1 |
| **REQ-6.2** | Anonymous tracking | Agent 1 | 1 |
| **REQ-6.3** | 24h deduplication | Agent 1 | 1 |
| **REQ-6.4** | Referrer source tracking | Agent 1 | 1 |
| **REQ-6.5** | Admin view exclusion | Agent 1 | 1 |
| **REQ-7.1–7.3** | View fixtures (6mo, patterns, category popularity) | Agent 2 | 1 |
| **REQ-7.4** | Comment distribution over time | Agent 2 | 1 |
| **REQ-7.5** | Dashboard looks populated | Agent 2 | 1 |
| **REQ-7.6** | 15-20 blog posts | Agent 2 | 1 |
| **REQ-7.7** | 80-120 comments mixed status | Agent 2 | 1 |
| **REQ-7.8** | 500-1000 BlogView records | Agent 2 | 1 |
| **REQ-7.9** | Blog dates spread over 6 months | Agent 2 | 1 |
| **REQ-7.10** | Filter robustness | Agent 2 | 1 |
| **REQ-8.1** | Skeleton loading states | Agent 4 | 1 |
| **REQ-8.2** | Empty state messages | Agent 3 (charts), Agent 4 (tables/KPIs) | 1 |
| **REQ-8.3** | Error state + retry | Agent 4 (KpiSection), Agent 6 (page) | 1, 2 |
| **REQ-8.4** | Responsive layout | Agent 3, 4, 6 | 1, 2 |
| **REQ-8.5** | Charts responsive containers | Agent 3 | 1 |

**All 60+ requirements are covered.**

---

## File Ownership (No Conflicts)

```
Agent 1 (Backend):
  NEW  server/src/models/BlogView.js
  NEW  server/src/helpers/analyticsAggregations.js
  NEW  server/src/controllers/analyticsController.js
  NEW  server/src/routes/analyticsRoutes.js

Agent 2 (Fixtures):
  MOD  server/fixtures/blogs.js
  MOD  server/fixtures/comments.js
  NEW  server/fixtures/views.js
  MOD  server/scripts/seed.js

Agent 3 (Charts):
  NEW  client/src/components/admin/analytics/constants.js
  NEW  client/src/components/admin/analytics/ChartSection.jsx
  NEW  client/src/components/admin/analytics/charts/ViewsOverTimeChart.jsx
  NEW  client/src/components/admin/analytics/charts/PublicationsChart.jsx
  NEW  client/src/components/admin/analytics/charts/CategoryDistributionChart.jsx
  NEW  client/src/components/admin/analytics/charts/CommentActivityChart.jsx
  NEW  client/src/components/admin/analytics/charts/ViewsByCategoryChart.jsx
  NEW  client/src/components/admin/analytics/charts/index.js

Agent 4 (KPIs/Tables/Filters/UI):
  NEW  client/src/components/ui/Skeleton/Skeleton.jsx
  NEW  client/src/components/ui/Skeleton/index.js
  NEW  client/src/components/admin/analytics/KpiCard.jsx
  NEW  client/src/components/admin/analytics/KpiSection.jsx
  NEW  client/src/components/admin/analytics/ExportButton.jsx
  NEW  client/src/components/admin/analytics/DrillDownModal.jsx
  NEW  client/src/components/admin/analytics/index.js
  NEW  client/src/components/admin/analytics/filters/FilterBar.jsx
  NEW  client/src/components/admin/analytics/filters/PeriodFilter.jsx
  NEW  client/src/components/admin/analytics/filters/CategoryFilter.jsx
  NEW  client/src/components/admin/analytics/filters/index.js
  NEW  client/src/components/admin/analytics/tables/TopViewedTable.jsx
  NEW  client/src/components/admin/analytics/tables/TopCommentedTable.jsx
  NEW  client/src/components/admin/analytics/tables/RecentCommentsTable.jsx
  NEW  client/src/components/admin/analytics/tables/TableSection.jsx
  NEW  client/src/components/admin/analytics/tables/index.js

Agent 5 (API/Hooks):
  NEW  client/src/api/analyticsApi.js
  NEW  client/src/constants/analyticsConstants.js
  NEW  client/src/hooks/api/queries/useAnalytics/useAnalytics.js
  NEW  client/src/hooks/api/queries/useAnalytics/index.js
  NEW  client/src/hooks/api/queries/useAnalyticsDrillDown/useAnalyticsDrillDown.js
  NEW  client/src/hooks/api/queries/useAnalyticsDrillDown/index.js
  NEW  client/src/hooks/api/mutations/useExportCsv/useExportCsv.js
  NEW  client/src/hooks/api/mutations/useExportCsv/index.js

Agent 6 (Integration — Phase 2):
  RUN  npm install recharts (in client/)
  NEW  client/src/assets/chart_icon.svg
  MOD  client/src/assets/assets.js
  MOD  client/src/constants/routes.js
  MOD  client/src/constants/apiEndpoints.js
  MOD  client/src/components/ui/Badge/Badge.jsx
  MOD  client/src/components/admin/shared/Sidebar/Sidebar.jsx
  MOD  client/src/App.jsx
  MOD  client/src/pages/admin/index.js
  NEW  client/src/pages/admin/Analytics/Analytics.jsx
  NEW  client/src/pages/admin/Analytics/index.js
  MOD  server/src/app.js
  MOD  server/src/routes/blogRoutes.js
```

---

## Verification

After Phase 2, verify end-to-end:

1. **Seed**: Run `npm run seed` in server/ — expect 18 blogs, ~100 comments, 500-1000 views
2. **Server**: Start server, verify all endpoints respond at `/api/admin/analytics/*`
3. **Client**: Start dev server, navigate to `/admin/analytics`
4. **Navigation**: Analytics link in sidebar with chart icon, active state works
5. **KPIs**: All 6 cards render with seed data, trends show correctly
6. **Charts**: All 5 charts render with data, tooltips work, responsive
7. **Tables**: Top Viewed (5 rows, purple links), Top Commented (X/Y format), Recent Comments (badges)
8. **Filters**: Period buttons toggle, category dropdown filters, date range works, all sections update
9. **Export**: CSV downloads with correct filename and columns
10. **Drill-down**: Click chart point → modal opens. Click donut segment → page filters
11. **States**: Loading shows skeletons, empty period shows messages, network error shows retry
12. **Responsive**: Mobile 1-col, tablet 2-col, desktop 6-col KPIs
