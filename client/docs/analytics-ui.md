# Admin analytics UI

> **Status: Pending — ships with the analytics PR.** Not part of the current release docs.

The analytics page at `/admin/analytics` (`client/src/pages/admin/Analytics.jsx`) and its components in `client/src/components/admin/analytics/`. Behavior specs: [`../../specs/analytics/`](../../specs/analytics/). Shared admin primitives it uses (`AdminPageHeader`, `Masthead`, `CountUp`, `SegmentedControl`, `AdminTable`) are documented in [components.md](components.md#adminshared).

## Page composition

Inside `section-counter` with `p-5 md:p-10`, top to bottom:

1. **AdminPageHeader** "Insights" / "Analytics" with the **FilterBar**:
   - `PeriodFilter`: `SegmentedControl` (`layoutId='analytics-period'`) with 7d, 30d, 90d, 1y, All, plus "From" / "To" date inputs. When both dates are set, no period option is shown as active.
   - `CategoryFilter`: native `<select>` over `BLOG_CATEGORIES` (including "All").
   - `ExportButton`: "Export CSV".
2. **KpiSection**:
   - `AnalyticsMasthead` (wraps `admin/shared/Masthead`): dateline "Quick Blog · Readership desk", period description, date; giant "Views" number; trend sticker ("↑ 12.3% vs prev." or "Flat vs prev."); most active desk line; insights "Engagement", "Conversation", "The desk".
   - "Key metrics": 6 `KpiCard`s (Total Views, Total Blogs, Total Comments, Avg Engagement, Approval Rate, Most Active Category) in a 1/2/3/6-column grid, with trend arrow and percent vs previous period. Error state shows the message and a "Retry" button.
3. **ChartSection**: 2-column grid of `AnalyticsPanel`s (numbered `section-no` headers):
   - Views Over Time (spans 2 columns; Recharts area chart; "Peak {date} · {n} views" tag and dashed reference line; clicking a point opens the drill-down);
   - Publications Over Time;
   - Category Distribution (donut; clicking a segment sets the category filter);
   - Comment Activity;
   - Views by Category.
4. **TableSection**: "Readership / Top Viewed Posts" and "Conversation / Top Commented Posts" (`AdminTable`, top 5), then "Recent Comments" as an ink `AnalyticsPanel` spanning both columns.
5. **DrillDownModal**: portal to `document.body`, "Posts for {date}" with views and category per post; skeleton rows while loading.

Each chart and table renders `Skeleton` while loading and `StateMessage` for empty or error.

## State and data

Filter state lives in the URL (`useSearchParams`):

| Param | Default | Notes |
|---|---|---|
| `period` | `'30'` | `7`, `30`, `90`, `365`, `all`. Changing it removes `from` / `to` |
| `category` | `'All'` | Not sent to the API when `'All'` |
| `from`, `to` | empty | Sent only when both are set |

`filterParams = { period, category, from?, to? }` is passed to every section. Drill-down state (`isOpen`, `date`, `posts`, `loading`) is local to the page.

API (`client/src/api/analyticsApi.js`, imported by path; not re-exported from `api/index.js`). `buildParams` drops empty values and `category === 'All'`.

| Function | Endpoint (`API_ENDPOINTS`) |
|---|---|
| `getKpis` | `GET /api/admin/analytics/kpis` |
| `getViewsOverTime` | `GET …/views-over-time` |
| `getPublicationsOverTime` | `GET …/publications` |
| `getCategoryDistribution` | `GET …/category-distribution` |
| `getCommentActivity` | `GET …/comment-activity` |
| `getViewsByCategory` | `GET …/views-by-category` |
| `getTopViewed`, `getTopCommented`, `getLastComments` | `GET …/top-viewed`, `…/top-commented`, `…/last-comments` |
| `getDrillDown(date, params)` | `GET …/drill-down?date=` |
| `exportCsv` | `GET …/export-csv` (`responseType: 'blob'`) |

Hooks (`client/src/hooks/api/queries/useAnalytics.js`), all on `useApiQuery`: `useAnalyticsKpis` (returns `data.kpis`), `useViewsOverTime`, `usePublicationsOverTime`, `useCategoryDistribution`, `useCommentActivity`, `useViewsByCategory`, `useTopViewed`, `useTopCommented`, `useLastComments` (return `data.data`). `ExportButton` saves the blob with `utils/downloadFile.js`, using the `Content-Disposition` filename when present.

## Styling and motion

- Chart colors are hex mirrors of the tokens in `charts/constants.js` (`CHART_COLORS`, `CATEGORY_COLORS`: Technology ink, Lifestyle signal, Startup ink-muted, Finance `#A39B88`), with shared `AXIS_PROPS` (mono 11px), `GRID_PROPS` (dashed `line`), `LEGEND_PROPS` (ink labels, colored square swatch) and `TOOLTIP_CLASS`.
- `AnalyticsPanel`: `lift` frame, `surface` or `ink` tone, `revealOnScroll(index)`; ChartSection passes `index % 2` so each row staggers in pairs.
- `KpiCard`: `riseIn` with `custom = index`; integer values use `CountUp`.
- `RecentCommentsTable` items: `revealOnScroll(index)`.
- `DrillDownModal`: scrim fade 0.2s; panel `y 24` → `0`, 0.45s; no exit animation.

## Tests

`KpiCard.test.jsx`.
