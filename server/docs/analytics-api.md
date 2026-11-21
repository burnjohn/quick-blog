# Analytics API

> **Status: Pending — ships with the analytics PR.** Not part of the current release docs.

Everything analytics-related on the server is documented on this page: admin analytics endpoints, the public view-recording endpoint, the `BlogView` model, config and seed data. Specs live under [../../specs/analytics/](../../specs/analytics/).

## Files

| Path | Role |
|------|------|
| `src/routes/analyticsRoutes.js` | 11 GET routes, mounted at `/api/admin/analytics` by `adminRoutes.js` after `auth` |
| `src/controllers/analyticsController.js` | all analytics handlers plus `recordView` |
| `src/helpers/analyticsAggregations.js` | date-range, trend, bucket and filter helpers; `CATEGORIES` |
| `src/validators/analyticsValidator.js` | `validateAnalyticsQuery`, `validateDrillDownQuery` |
| `src/models/BlogView.js` | view events |
| `src/utils/viewTracking.js` | server-side view recording helpers |
| `src/configs/analytics.js` | `EXPORT_SIGNING_SECRET`, `SEGMENT_WRITE_KEY` |
| `src/constants/messages.js` | `VIEW_RECORDED`, `MISSING_VISITOR_KEY`, `INVALID_DRILL_DOWN_DATE`, `VIEW_ALREADY_RECORDED` and others |
| `migrations/20260211000001-add-blogview-indexes.js` | `blogviews` indexes |
| `fixtures/views.js` and `seedViews` in `scripts/seed.js` | seeded views |
| `POST /api/blog/:blogId/view` in `src/routes/blogRoutes.js` | public view recording |

## Data model: BlogView

`src/models/BlogView.js`, collection `blogviews`, `timestamps: true`.

| Field | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `blog` | ObjectId → `Blog` | yes | – | |
| `viewedAt` | Date | no | `new Date()` | |
| `referrerSource` | String | no | `'direct'` | enum `direct`, `search`, `social`, `other` |
| `isAdminView` | Boolean | no | `false` | excluded from every metric and from `/api/blog/popular` |
| `visitorKey` | String | yes | – | used for 24-hour deduplication |

Schema indexes: `{ blog: 1, visitorKey: 1, viewedAt: 1 }`, `{ blog: 1, viewedAt: 1 }`, `{ viewedAt: 1 }`. The migration creates the same three under explicit names.

`GET /api/blog/popular` reads this collection.

## Record a view: `POST /api/blog/:blogId/view`

| | |
|-|-|
| Auth | optional. A valid token with `role: 'admin'` marks the view `isAdminView: true` |
| Rate limit | `apiLimiter` only |
| Controller | `analyticsController.recordView` |
| Body | `{ "visitorKey": "<client-generated string>", "referrerSource": "direct" \| "search" \| "social" \| "other" }` (`referrerSource` defaults to `direct`) |

Flow: validate `visitorKey` (non-empty string) and `referrerSource`. Load the post, returning 404 if it is missing and 400 if it is not published. If a view with the same `blog` and trimmed `visitorKey` exists within the last 24 hours, return 400 `View already recorded`. Otherwise insert.

| Status | Body |
|--------|------|
| 200 | `{ success: true, message: "View recorded" }` |
| 400 | `visitorKey is required` · `referrerSource must be one of: direct, search, social, other` · `Blog is not published` · `View already recorded` |
| 404 | `Blog not found` |
| 500 | malformed `blogId` (CastError) |

## Admin analytics endpoints

All are `GET /api/admin/analytics/<name>`. They require a JWT of any role and run `validateAnalyticsQuery`.

### Shared query parameters (`validateAnalyticsQuery`)

| Param | Values | Default | Notes |
|-------|--------|---------|-------|
| `period` | `7`, `30`, `90`, `365`, `all` | `30` | days back from now; `all` means from the epoch |
| `from`, `to` | `YYYY-MM-DD` | – | used when `period` is not `all`. `from` without `to` means up to now; `to` without `from` is an error; `from > to` is an error |
| `category` | `All`, `Technology`, `Startup`, `Lifestyle`, `Finance` | `All` | trimmed |

The validator sets `req.analyticsFilter = { from, to, category }`. Errors return 400 with the messages joined by `; `. Most endpoints scope work to posts whose `createdAt` falls inside the range (and match the category), then count views, comments or posts for those posts within the range.

All JSON responses use `sendData`, so the shape is `{ success: true, ...payload }`.

| Endpoint | Payload |
|----------|---------|
| `/kpis` | `kpis: { totalViews, totalBlogs{value,published,drafts}, totalComments{value,approved,pending}, avgEngagement, approvalRate, mostActiveCategory{value,count} }`. Every entry has `trend: { direction: 'up'\|'down'\|'unchanged', percentChange }` against the previous period of the same length |
| `/views-over-time` | `data: [{ date, views }]`. Bucket is day when the range is 31 days or less (`YYYY-MM-DD`), ISO week up to 90 days (`YYYY-Wnn`), month beyond that (`YYYY-MM`), all in UTC |
| `/publications` | `data: [{ month: 'YYYY-MM', Technology, Startup, Lifestyle, Finance }]` (post counts) |
| `/category-distribution` | `data: [{ category, count }]`, published posts only, count desc |
| `/comment-activity` | `data: [{ month, approved, pending }]` |
| `/views-by-category` | `data: [{ category, views }]`, ascending by views |
| `/top-viewed` | `data: [{ id, title, category, views, comments, publishDate }]`, top 5. Optional `search` query filters titles with a case-insensitive regex |
| `/top-commented` | `data: [{ id, title, category, comments: { approved, total }, views }]`, top 5 |
| `/last-comments` | `data: [{ id, authorName, contentExcerpt (100 chars), blogTitle, blogId, createdAt, status: 'approved'\|'pending' }]`, newest 5 |
| `/export-csv` | `text/csv` attachment `analytics-export-YYYY-MM-DD.csv` with columns `Title,Category,Publish Date,Views,Comment Count,Status`, plus header `X-Export-Signature`: HMAC-SHA256 of the CSV body |
| `/drill-down` | requires `date` as `YYYY-MM-DD`, `YYYY-Wnn` or `YYYY-MM` (`validateDrillDownQuery`). Returns `data: [{ id, title, category, views, publishDate }]` for views inside that bucket. 400 `Invalid drill-down date format` |

## Seed data

`fixtures/views.js` (`viewConfig`) and `seedViews` in `scripts/seed.js`:

- 1,650 to 1,950 view attempts over the last ~180 days, drawn from 180 to 260 synthetic visitor keys (`visitor_<n>_<timestamp>`).
- Post choice is weighted by category: Technology 1.0, Lifestyle 0.75, Startup 0.5, Finance 0.3.
- Referrer mix: search 45%, social 30%, direct 20%, other 5%.
- Timestamps skew toward the present (`growthFactor: 1.5`). Weekend views are thinned (`weekdayMultiplier: 1.3`), leaving roughly 1,500 to 1,800 rows.
- A view dated before its post's `createdAt` is moved to a random time after it.
- All seeded views are `isAdminView: false`. No 24-hour deduplication is applied.
