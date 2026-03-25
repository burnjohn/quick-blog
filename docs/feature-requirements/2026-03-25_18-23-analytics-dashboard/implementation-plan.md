# Analytics Dashboard — Multi-Agent Implementation Plan

## Context

Add a full-stack Blog Analytics Dashboard to QuickBlog's admin panel. The feature includes:
- 6 KPI cards with trend indicators
- 5 interactive Recharts charts (area, stacked bar, donut, grouped bar, horizontal bar)
- 3 data tables (top viewed, top commented, recent comments)
- Period + category filters via URL search params
- CSV export (server-side)
- Anonymous view tracking with 24h deduplication + admin exclusion
- Expanded seed fixtures (18 blogs, ~100 comments, ~750 views)

All requirements from `docs/feature-requirements/2026-03-25-analytics-dashboard-requirements.md` and the three pre-existing requirement docs in `docs/requirements/` are covered.

---

## Parallel Agent Tracks

```
Wave 1 (start in parallel — no deps):
  Track A: Backend Foundation    → BlogView model + analyticsHelpers
  Track B: Frontend Foundation   → recharts install + constants + API + hooks

Wave 2 (start in parallel after Wave 1):
  Track C: Backend Analytics API → controller + routes + server.js wiring  [needs A]
  Track D: Frontend UI           → page + sidebar + all components          [needs B]
  Track E: Seed Fixtures         → expanded fixtures + seed script update   [needs A]
```

---

## Track A — Backend Foundation
**Wave 1. No blockers.**

### Files to create

**`server/src/models/BlogView.js`**
```js
import mongoose from 'mongoose'

const blogViewSchema = new mongoose.Schema({
  blog:           { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
  viewedAt:       { type: Date, default: Date.now },
  referrerSource: { type: String, enum: ['direct','search','social','other'], default: 'direct' },
  isAdminView:    { type: Boolean, default: false },
  visitorKey:     { type: String, required: true }
}, { timestamps: true })

blogViewSchema.index({ blog: 1, visitorKey: 1, viewedAt: 1 })
blogViewSchema.index({ blog: 1, viewedAt: 1 })
blogViewSchema.index({ viewedAt: 1 })

export default mongoose.model('BlogView', blogViewSchema)
```

**`server/src/helpers/analyticsHelpers.js`** — 5 named exports:
- `getDateRange(period, from, to)` → `{ startDate, endDate }`
  - Periods: `'7d'` → 7 days ago to now, `'30d'`, `'90d'`, `'365d'`, `'all'` → `new Date(0)` to now
  - Custom: if `from`+`to` provided, parse them; set `endDate.setHours(23,59,59,999)`
  - Default (nothing provided): `'30d'`
- `getPreviousPeriod(startDate, endDate)` → previous equal-duration window (for trend arrows)
- `buildBlogFilter(category, dateRange)` → Mongoose query for Blog (always `isPublished:true`, + category + `createdAt` range if provided)
- `buildViewFilter(category, dateRange)` → Mongoose query for BlogView (always `isAdminView:false`, + `viewedAt` range; category filtering requires `$lookup` in controller — add a comment noting this)
- `getBucketSize(startDate, endDate)` → `'day'` (≤14 days) | `'week'` (≤90) | `'month'` (default)

Use `Date.now()` arithmetic only (no `moment` on server — it's not installed).

---

## Track B — Frontend Foundation
**Wave 1. No blockers.**

### Steps

1. **Install recharts**: `npm install recharts` inside `client/`

### Files to modify

**`client/src/constants/apiEndpoints.js`** — append to `API_ENDPOINTS`:
```js
ANALYTICS_KPIS: '/api/admin/analytics/kpis',
ANALYTICS_VIEWS_OVER_TIME: '/api/admin/analytics/views-over-time',
ANALYTICS_PUBLICATIONS: '/api/admin/analytics/publications',
ANALYTICS_CATEGORY_DISTRIBUTION: '/api/admin/analytics/category-distribution',
ANALYTICS_COMMENT_ACTIVITY: '/api/admin/analytics/comment-activity',
ANALYTICS_VIEWS_BY_CATEGORY: '/api/admin/analytics/views-by-category',
ANALYTICS_TOP_VIEWED: '/api/admin/analytics/top-viewed',
ANALYTICS_TOP_COMMENTED: '/api/admin/analytics/top-commented',
ANALYTICS_LAST_COMMENTS: '/api/admin/analytics/last-comments',
ANALYTICS_DRILL_DOWN: '/api/admin/analytics/drill-down',
ANALYTICS_EXPORT_CSV: '/api/admin/analytics/export-csv',
BLOG_TRACK_VIEW: (blogId) => `/api/blog/${blogId}/view`,
```

**`client/src/constants/routes.js`** — add:
```js
ADMIN_ANALYTICS: '/admin/analytics',
```

### Files to create

**`client/src/api/analyticsApi.js`**
```js
import axios from './axiosConfig'
import { API_ENDPOINTS } from '../constants/apiEndpoints'

export const analyticsApi = {
  getKpis: (params) => axios.get(API_ENDPOINTS.ANALYTICS_KPIS, { params }),
  getViewsOverTime: (params) => axios.get(API_ENDPOINTS.ANALYTICS_VIEWS_OVER_TIME, { params }),
  getPublications: (params) => axios.get(API_ENDPOINTS.ANALYTICS_PUBLICATIONS, { params }),
  getCategoryDistribution: (params) => axios.get(API_ENDPOINTS.ANALYTICS_CATEGORY_DISTRIBUTION, { params }),
  getCommentActivity: (params) => axios.get(API_ENDPOINTS.ANALYTICS_COMMENT_ACTIVITY, { params }),
  getViewsByCategory: (params) => axios.get(API_ENDPOINTS.ANALYTICS_VIEWS_BY_CATEGORY, { params }),
  getTopViewed: (params) => axios.get(API_ENDPOINTS.ANALYTICS_TOP_VIEWED, { params }),
  getTopCommented: (params) => axios.get(API_ENDPOINTS.ANALYTICS_TOP_COMMENTED, { params }),
  getLastComments: (params) => axios.get(API_ENDPOINTS.ANALYTICS_LAST_COMMENTS, { params }),
  getDrillDown: (params) => axios.get(API_ENDPOINTS.ANALYTICS_DRILL_DOWN, { params }),
  exportCsv: (params) => axios.get(API_ENDPOINTS.ANALYTICS_EXPORT_CSV, { params, responseType: 'blob' }),
  trackView: (blogId, data) => axios.post(API_ENDPOINTS.BLOG_TRACK_VIEW(blogId), data),
}
```

**`client/src/hooks/api/queries/useAnalyticsKpis.js`** — and 8 more hooks following the exact `useAdminDashboard` pattern:
```js
import { useAppContext } from '../../../context/AppContext'
import { useApiQuery } from '../../core'
import { analyticsApi } from '../../../api/analyticsApi'

export function useAnalyticsKpis(filterParams = {}) {
  const { } = useAppContext()  // keep for consistency even if axios not used directly
  const { data, loading, error, refetch } = useApiQuery(
    () => analyticsApi.getKpis(filterParams),
    {
      dependencies: [filterParams.period, filterParams.from, filterParams.to, filterParams.category],
      showErrorToast: false,  // Analytics page shows inline errors
      errorMessage: 'Failed to fetch KPIs'
    }
  )
  return { kpis: data?.kpis || {}, trends: data?.trends || {}, loading, error, refetch }
}
```

**CRITICAL:** Pass individual filter values as `dependencies` (not the object reference) — the `useEffect` in `useApiQuery` won't detect changes on object identity otherwise.

Create these 9 hooks with their return shapes:
| Hook | Return shape |
|------|-------------|
| `useAnalyticsKpis` | `{ kpis, trends, loading, error, refetch }` |
| `useAnalyticsViewsOverTime` | `{ series: data?.series \|\| [], bucketSize, loading, error, refetch }` |
| `useAnalyticsPublications` | `{ series: data?.series \|\| [], loading, error, refetch }` |
| `useAnalyticsCategoryDistribution` | `{ distribution: data?.distribution \|\| [], loading, error, refetch }` |
| `useAnalyticsCommentActivity` | `{ series: data?.series \|\| [], loading, error, refetch }` |
| `useAnalyticsViewsByCategory` | `{ categories: data?.categories \|\| [], loading, error, refetch }` |
| `useAnalyticsTopViewed` | `{ blogs: data?.blogs \|\| [], loading, error, refetch }` |
| `useAnalyticsTopCommented` | `{ blogs: data?.blogs \|\| [], loading, error, refetch }` |
| `useAnalyticsLastComments` | `{ comments: data?.comments \|\| [], loading, error, refetch }` |

### Files to modify (exports)

**`client/src/hooks/api/queries/index.js`** — add 9 export lines
**`client/src/api/index.js`** — add `export { analyticsApi } from './analyticsApi'`

---

## Track C — Backend Analytics API
**Wave 2. Blocked by Track A.**

### Files to create

**`server/src/controllers/analyticsController.js`**

Imports: `Blog`, `Comment`, `BlogView`, `asyncHandler`, all helpers from `analyticsHelpers.js`, `jwt`, `mongoose`.

**`trackView`** — exported from here, wired in `blogRoutes.js` (public POST):
- Manually decode JWT (don't use auth middleware — must stay public): try/catch `jwt.verify`, set `isAdmin = decoded.role === 'admin'`
- Validate `blogId` with `mongoose.Types.ObjectId.isValid()`; 400 if invalid
- Require `visitorKey` from `req.body`; 400 if absent
- Dedup: `BlogView.findOne({ blog: blogId, visitorKey, viewedAt: { $gte: new Date(Date.now() - 86400000) } })` → if exists, return `200 { success:true, message:'Already recorded' }`
- Create document with `isAdminView: isAdmin`; return `201`

**`getKpis`** — use `Promise.all` for concurrent queries, compute trends with `getPreviousPeriod`:
```
Response: { success:true, kpis:{totalViews, totalBlogs, totalComments, avgEngagement, approvalRate, mostActiveCategory}, trends:{...} }
```

**Time-series handlers** — use `$dateToString` with format from `getBucketSize`:
- `'%Y-%m-%d'` for day, `'%Y-%V'` for week, `'%Y-%m'` for month
- `getPublications`: group by `{ date, category }`, then reshape in JS to `[{ date, Technology:N, Lifestyle:N, ... }]`
- `getCommentActivity`: two `$sum` with `$cond` in one aggregation for approved vs pending

**`getViewsByCategory`** — needs `$lookup` from BlogView → Blog for category:
```js
BlogView.aggregate([
  { $match: viewFilter },
  { $lookup: { from:'blogs', localField:'blog', foreignField:'_id', as:'blogData' } },
  { $unwind: '$blogData' },
  ...(category ? [{ $match: { 'blogData.category': category } }] : []),
  { $group: { _id:'$blogData.category', views:{ $sum:1 } } },
  { $sort: { views:-1 } }
])
```

**`getTopViewed`** — aggregate BlogView by blog, sort desc, limit 5, `$lookup` Blog, then `Promise.all` for comment counts on 5 results.

**`getLastComments`** — `Comment.find({}).sort({createdAt:-1}).limit(5).populate('blog','title')`, truncate `content` to 100 chars.

**`exportCsv`** — build CSV string manually (no `moment` on server, use `.toISOString().slice(0,10)`):
```js
res.setHeader('Content-Type', 'text/csv')
res.setHeader('Content-Disposition', `attachment; filename="blog-analytics-${period||'30d'}-${new Date().toISOString().slice(0,10)}.csv"`)
res.send(csvString)
// NOTE: Do NOT use res.json() here — not the standard {success:true} envelope
```

**`server/src/routes/analyticsRoutes.js`** — standard Express router, all `GET`, no auth inside (applied at app level).

### Files to modify

**`server/server.js`** — add after existing route registrations:
```js
import analyticsRouter from './src/routes/analyticsRoutes.js'
import auth from './src/middleware/auth.js'
// ...
app.use('/api/admin/analytics', auth, analyticsRouter)
```

**`server/src/routes/blogRoutes.js`** — add in the PUBLIC section, BEFORE `blogRouter.use(auth)`:
```js
import { trackView } from '../controllers/analyticsController.js'
// ...
blogRouter.post('/:blogId/view', trackView)  // must be before auth middleware
```

---

## Track D — Frontend UI
**Wave 2. Blocked by Track B.**

### Files to modify

**`client/src/components/admin/shared/Sidebar.jsx`** — add Analytics `NavLink` after Comments, matching existing pattern. No analytics icon asset exists — use an inline SVG bar chart icon or `<span>` with emoji `📊`, sized `min-w-4 w-5`.

**`client/src/App.jsx`** — import `Analytics` from `./pages/admin`, add `<Route path='analytics' element={<Analytics />} />` nested under admin layout route.

**`client/src/pages/admin/index.js`** — add `export { default as Analytics } from './Analytics'`

### Files to create

**`client/src/pages/admin/Analytics.jsx`** — owns filter state via `useSearchParams`:
```jsx
const [searchParams, setSearchParams] = useSearchParams()
const filterParams = {
  period: searchParams.get('period') || '30d',
  from: searchParams.get('from') || '',
  to: searchParams.get('to') || '',
  category: searchParams.get('category') || ''
}
const updateFilter = (updates) => setSearchParams(prev => {
  const next = new URLSearchParams(prev)
  Object.entries(updates).forEach(([k,v]) => v ? next.set(k,v) : next.delete(k))
  return next
})
// Renders: <FilterBar> → <KpiSection> → <ChartSection> → <TableSection>
// Pass filterParams as prop to each. Pass updateFilter to FilterBar and ChartSection.
```

**`client/src/components/admin/analytics/FilterBar.jsx`**
- Period buttons `['7d','30d','90d','365d','all']` — clicking clears `from`/`to`
- Date inputs `type="date"` — changing clears `period`; validate `from ≤ to` with inline error
- Category `<select>` with `''` → "All Categories"
- Export button handler: calls `analyticsApi.exportCsv(filterParams)` then creates blob URL, click-triggers download, revokes URL

**`client/src/components/admin/analytics/KpiSection.jsx`** — calls `useAnalyticsKpis(filterParams)`, renders 6 `<KpiCard>` in `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4`. Loading: 6 `animate-pulse` skeletons. Error: single card with retry.

**`client/src/components/admin/analytics/KpiCard.jsx`** — props `{ label, value, subText, trend:{direction,percent} }`. Trend arrows: `↑` green, `↓` red, `—` gray.

**5 chart components** in `client/src/components/admin/analytics/charts/`:

All share this wrapper:
```jsx
if (loading) return <div className='h-64 animate-pulse bg-gray-200 rounded' />
if (error) return <ErrorState onRetry={refetch} />  // "Failed to load. Retry"
if (!data.length) return <EmptyState />              // neutral gray message
return (
  <div className='bg-white rounded-lg shadow p-4'>
    <h3>...</h3>
    <ResponsiveContainer width='100%' height={240}>...</ResponsiveContainer>
  </div>
)
```

**`ViewsOverTime.jsx`** — `AreaChart`. Data key: `date`, value key: `views`. Fill: `#3b82f6`.

**`PublicationsOverTime.jsx`** — `BarChart` with one `<Bar>` per category. Colors: `{ Technology:'#3b82f6', Lifestyle:'#a855f7', Startup:'#22c55e', Finance:'#f97316' }`. Include `<Legend />`.

**`CategoryDistribution.jsx`** — `PieChart` with `innerRadius={60} outerRadius={100}`. Receives `onSegmentClick` prop from `ChartSection` — clicking a slice calls `onSegmentClick(entry.name)` which propagates to `Analytics.jsx` → `updateFilter({ category })`.

**`CommentActivity.jsx`** — `BarChart` grouped. `approved` bar: `#22c55e`. `pending` bar: `#f97316`.

**`ViewsByCategory.jsx`** — `BarChart layout="vertical"`. `XAxis type="number"`, `YAxis type="category" dataKey="category"`.

**`client/src/components/admin/analytics/ChartSection.jsx`** — composes all 5 charts. `ViewsOverTime` full width; remaining 4 in `grid grid-cols-1 md:grid-cols-2 gap-6`. Holds local `drillDownData` state; passes `onSegmentClick` to `CategoryDistribution` and renders `<DrillDownModal>` when set.

**3 table components** in `client/src/components/admin/analytics/tables/` — all use white bg, shadow, `overflow-x-auto`, `thead` with `bg-gray-50 text-xs uppercase`. Loading: 5 `animate-pulse` rows. Empty: single centered gray row.

- **`TopViewedTable.jsx`**: Title as purple `<a>` link to `getBlogDetailPath(blog._id)` (import from `constants/routes`), format date with `moment(date).format('MMM D, YYYY')`
- **`TopCommentedTable.jsx`**: Comments column displays `"approved/total"` string
- **`RecentCommentsTable.jsx`**: Author bold, text italic + `truncate max-w-xs`, status badge (green `Approved` / orange `Pending`)

**`client/src/components/admin/analytics/TableSection.jsx`** — `grid grid-cols-1 lg:grid-cols-2 gap-6` with all 3 tables.

**`client/src/components/admin/analytics/DrillDownModal.jsx`** — fixed backdrop + centered panel. Close on: X button, `Escape` keydown listener, backdrop click (`stopPropagation` on panel).

---

## Track E — Seed Fixtures
**Wave 2. Blocked by Track A.**

### Files to create

**`server/fixtures/views.js`** — configuration constants for seed view generation:
```js
export const viewsConfig = {
  totalViews: 750,
  categoryWeights: { Technology:0.40, Lifestyle:0.30, Startup:0.20, Finance:0.10 },
  weekdayMultiplier: 1.4,
  referrerSources: ['direct','search','social','other'],
  referrerWeights: [0.40, 0.35, 0.15, 0.10],
  visitorKeyPrefix: 'seed-visitor-'
}
```

### Files to modify

**`server/fixtures/blogs.js`** — expand from 6 to 18 blogs (keep all existing 6, add 12 new):
- Add `createdAt` to each entry for historical spread (6 months back)
- Distribution: Technology×6, Lifestyle×5, Startup×4, Finance×3
- Rotate images: `blog_pic_${(index % 6) + 1}.png` (existing seed images go up to 6)
- Finance blog examples: budgeting basics, ETFs vs stocks, compound interest

**`server/fixtures/comments.js`** — expand to ~100 comments:
- 75-85% with `isApproved: true` (set last ~20 to `false`)
- 15-20 unique commenter names, 25-30 comment texts, mix short/substantive

**`server/scripts/seed.js`** — changes:
1. Import `BlogView` and `viewsConfig`
2. Add `await BlogView.deleteMany({})` in cleanup
3. Pass `createdAt: blogs[i].createdAt || new Date()` in `Blog.create()` call
4. Distribute comments across ALL blogs (weighted: Tech gets most, Finance least)
5. Add `seedViews(createdBlogs)` function using weighted pool + weekday bias + `BlogView.insertMany(views)` after comments step

---

## Key Constraints & Gotchas

| Concern | Detail |
|---------|--------|
| Auth on analytics routes | Applied at `app.use('/api/admin/analytics', auth, analyticsRouter)` — not inside the router |
| `trackView` is public | Must be in the PUBLIC section of `blogRoutes.js`, before `blogRouter.use(auth)` |
| `exportCsv` response | `res.send(csv)` not `res.json()` — no `{success:true}` envelope; set headers first |
| recharts height | `ResponsiveContainer` needs explicit `height={240}` — can't derive from `auto` parent |
| Hook dependencies | Pass individual values `[period, from, to, category]` not the object ref to `useApiQuery` |
| `moment` on server | Not installed — use `new Date().toISOString().slice(0,10)` for date strings |
| `Finance` category | Not currently in fixtures — Blog schema has no enum on `category`, safe to add |
| Blog `createdAt` | Mongoose `timestamps:true` respects explicitly provided `createdAt` on `create()` |
| `useApiQuery` errors | Set `showErrorToast: false` in all analytics hooks — page shows inline errors instead |

---

## Verification

After all tracks complete:
```bash
# 1. Seed the database
cd server && npm run seed
# Expect: 2 users, 18 blogs, ~100 comments, ~700+ views

# 2. Start services
npm run server   # in server/
npm run dev      # in client/

# 3. Manual checks
# - Navigate to /admin → login → sidebar shows "Analytics"
# - /admin/analytics loads with filter bar + KPIs + charts + tables
# - Change period (7d → 30d) → URL updates → data refetches
# - Change category → all sections filter
# - Export CSV → file downloads as blog-analytics-30d-YYYY-MM-DD.csv
# - Visit /blog/:id → POST fires to /:blogId/view (check server logs)
# - Visiting as admin → isAdminView:true recorded, not counted in analytics

# 4. Backend spot-check
curl -H "Authorization: $TOKEN" \
  "http://localhost:4000/api/admin/analytics/kpis?period=30d"
# → { success:true, kpis:{...}, trends:{...} }

curl -X POST http://localhost:4000/api/blog/BLOG_ID/view \
  -H "Content-Type: application/json" \
  -d '{"visitorKey":"abc-123","referrerSource":"direct"}'
# → { success:true, message:'View recorded' }
# Repeat → { success:true, message:'Already recorded' }
```
