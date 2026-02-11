# Requirements: Analytics — Interactivity, Filters, Drill-down, Export & Fixtures

**Feature:** Blog Analytics Dashboard — Interactivity (Filters, Drill-down, Export) and Fixtures/Seed Data  
**Scope:** Full-stack (client + server)  
**References:** Design screenshots (filter bar, KPI cards, charts, tables, recent comments)

---

## General Rules (apply to all requirements)

| ID | Rule |
|----|------|
| REQ-0.1 | All UI labels, buttons, tooltips, placeholders — English only |
| REQ-0.2 | Section names, chart titles, table columns — English |
| REQ-0.3 | Date/number formats — en-US (e.g. Feb 11, 2026 / 1,234) |

---

## 1. Period Filter

### REQ-5.1 — Quick-select period buttons

**Requirement:** User can select a preset period via button group: 7 days, 30 days, 90 days, 1 year, All.

| Property | Value |
|----------|-------|
| Labels | `7d`, `30d`, `90d`, `1y`, `All` |
| Values | `7`, `30`, `90`, `365`, `all` |
| Behavior | Exactly one quick-select is active OR a custom range is active (mutually exclusive) |
| Position | Left side of filter bar, before date inputs |

**Acceptance criteria:**
- [ ] Five buttons visible with labels `7d`, `30d`, `90d`, `1y`, `All`
- [ ] Active quick-select has distinct visual state (e.g. primary background)
- [ ] When a quick-select is active, date range is derived (last N days or all time)
- [ ] Selecting a quick-select clears custom date range
- [ ] Selecting custom date range clears quick-select active state

---

### REQ-5.2 — Custom date range picker

**Requirement:** User can select a custom date range via two inputs (from, to) with calendar affordance.

| Property | Value |
|----------|-------|
| Inputs | Two date inputs side by side, separated by "–" |
| Labels | `From date`, `To date` (aria-label / placeholder) |
| Format | `YYYY-MM-DD` for input value; display uses en-US |
| Validation | `from` must be ≤ `to`; invalid combinations show error feedback |

**Acceptance criteria:**
- [ ] Two date inputs with calendar icons or native date picker
- [ ] Selecting dates sets custom range; quick-select buttons show inactive
- [ ] Invalid range (from > to) shows error message; export/fetch may be blocked or auto-corrected
- [ ] Changing custom range triggers full page refresh of analytics data

---

### REQ-5.3 — Period change propagates globally

**Requirement:** When period (quick-select or custom) changes, all sections update: KPI cards, all charts, all tables, and recent comments.

**Acceptance criteria:**
- [ ] KPI section reflects metrics for the selected period
- [ ] Views Over Time chart shows data for the selected period
- [ ] Publications Over Time chart updates
- [ ] Category Distribution updates
- [ ] Comment Activity updates
- [ ] Views by Category updates
- [ ] Top Viewed Posts table updates
- [ ] Top Commented Posts table updates
- [ ] Recent Comments list updates
- [ ] All sections use the same period and category filters consistently

---

## 2. Category Filter

### REQ-5.4 — Category dropdown

**Requirement:** User can filter by category via a dropdown with options: All, Technology, Startup, Lifestyle, Finance.

| Property | Value |
|----------|-------|
| Options | `All`, `Technology`, `Startup`, `Lifestyle`, `Finance` |
| Default | `All` |
| Source | Use existing `BLOG_CATEGORIES` constant |

**Acceptance criteria:**
- [ ] Dropdown shows all five options
- [ ] Default selection is `All`
- [ ] Selected value is clearly indicated
- [ ] Accessible (aria-label, keyboard navigation)

---

### REQ-5.5 — Category filter applies globally

**Requirement:** Selected category applies to all page sections (same as period filter).

**Acceptance criteria:**
- [ ] KPI cards filter by category when not `All`
- [ ] Charts filter by category
- [ ] Top Viewed / Top Commented tables filter by category
- [ ] Recent Comments filter by category (comments on blogs in selected category)
- [ ] Export CSV respects category filter

---

## 3. Drill-down

### REQ-5.6 — Views chart drill-down

**Requirement:** User can click a bar or point in the Views Over Time chart to see a list of posts for that period with their views.

| Property | Value |
|----------|-------|
| Trigger | Click on bar (daily) or point (weekly/monthly) |
| Result | List of posts with title, category, views, publish date for that bucket |
| UX | Modal or expandable section below chart |

**Acceptance criteria:**
- [ ] Clickable bars/points in Views Over Time chart
- [ ] Click opens drill-down view with posts for that date/bucket
- [ ] Each row shows: post title, category, views, publish date
- [ ] Post titles are clickable (link to blog detail or admin edit)
- [ ] User can close/dismiss drill-down

---

### REQ-5.7 — Category donut drill-down

**Requirement:** User can click a segment in the Category Distribution donut to filter the entire page by that category.

| Property | Value |
|----------|-------|
| Trigger | Click on donut segment |
| Result | Page filters by that category (equivalent to selecting it in category dropdown) |

**Acceptance criteria:**
- [ ] Donut segments are clickable
- [ ] Click sets category filter to the clicked category
- [ ] All page sections update to filtered data
- [ ] Category dropdown reflects the selected category

---

### REQ-5.8 — Drill-down presentation

**Requirement:** Drill-down content opens as a modal or expands inline below the chart.

**Acceptance criteria:**
- [ ] Views chart drill-down appears in modal OR as expanded section below chart
- [ ] Clear way to close/dismiss (X, "Close", click outside if modal)
- [ ] Accessible (focus trap in modal, Escape to close)
- [ ] Loading state when fetching drill-down data
- [ ] Empty state when no posts for that bucket

---

## 4. Export

### REQ-5.9 — Export CSV button

**Requirement:** "Export CSV" button downloads a CSV file with all metrics for the currently selected period and category.

| Property | Value |
|----------|-------|
| Label | `Export CSV` |
| Position | Right side of filter bar |
| Behavior | Triggers download; respects period and category filters |

**Acceptance criteria:**
- [ ] Button visible and labeled "Export CSV"
- [ ] Click triggers file download
- [ ] Downloaded file name indicates period (e.g. `analytics-2025-01-01-2025-06-30.csv`)
- [ ] Loading state during export ("Exporting…" or spinner)
- [ ] Error state shown if export fails (e.g. toast or inline message)

---

### REQ-5.10 — CSV content

**Requirement:** CSV contains: post title, category, date, views, comment count, status (published/draft).

| Column | Description |
|--------|-------------|
| Post Title | Blog post title |
| Category | Technology, Startup, Lifestyle, Finance |
| Date | Publish date (en-US format) |
| Views | Total views in selected period |
| Comment Count | Total comments |
| Status | Published or Draft |

**Acceptance criteria:**
- [ ] CSV has header row with column names
- [ ] Each row = one blog post
- [ ] Data respects period and category filters
- [ ] Dates formatted en-US (e.g. Feb 11, 2026)
- [ ] File is valid CSV (escaping for commas, quotes in titles)

---

## 5. Fixtures / Seed Data

### REQ-7.1 — View data for all blogs

**Requirement:** Seed script creates realistic BlogView records for all existing blogs.

| Property | Value |
|----------|-------|
| Model | BlogView (blog, viewedAt, referrerSource, visitorKey, isAdminView) |
| Scope | All published blogs in seed data |

**Acceptance criteria:**
- [ ] After `npm run seed`, BlogView collection has records
- [ ] Each published blog has at least some views
- [ ] No views for admin-only sessions (isAdminView: false for seed data)

---

### REQ-7.2 — Data over 6 months, realistic patterns

**Requirement:** View and comment data is distributed over the last 6 months with weekday > weekend and gradual growth.

| Pattern | Behavior |
|---------|----------|
| Time span | Last 6 months from seed run date |
| Weekday bias | Weekdays (Mon–Fri) have higher view counts than weekends |
| Growth | Slight upward trend over time (older = fewer views) |

**Acceptance criteria:**
- [ ] viewedAt and comment createdAt span ~6 months
- [ ] Aggregate weekday views > weekend views
- [ ] More recent months have higher totals than older months

---

### REQ-7.3 — Category popularity

**Requirement:** Different categories have different popularity: Technology > Lifestyle > Startup > Finance.

| Rank | Category | Relative share |
|------|----------|----------------|
| 1 | Technology | Highest |
| 2 | Lifestyle | ~75% of Technology |
| 3 | Startup | ~50% of Technology |
| 4 | Finance | ~30% of Technology |

**Acceptance criteria:**
- [ ] Technology blogs have most views
- [ ] Finance blogs have fewest views
- [ ] Order Technology > Lifestyle > Startup > Finance in Views by Category chart

---

### REQ-7.4 — Comment distribution over time

**Requirement:** Comment fixtures are distributed over time (not all on one date).

**Acceptance criteria:**
- [ ] Comments have varied createdAt across 6 months
- [ ] No single day has > 20% of all comments
- [ ] Comment Activity chart shows multiple months with data

---

### REQ-7.5 — Dashboard looks populated

**Requirement:** After running seed, dashboard appears fully populated with meaningful, non-empty visuals.

**Acceptance criteria:**
- [ ] All KPI cards show non-zero values (except where logically zero)
- [ ] Views Over Time has bars/points
- [ ] Publications Over Time has data
- [ ] Category Distribution has segments
- [ ] Comment Activity has bars
- [ ] Views by Category has bars
- [ ] Top Viewed and Top Commented tables have rows
- [ ] Recent Comments has entries

---

### REQ-7.6 — Blog post quantity

**Requirement:** Seed creates 15–20 blog posts across categories, including drafts and published.

| Property | Value |
|----------|-------|
| Total | 15–20 posts |
| Categories | Mix of Technology, Startup, Lifestyle, Finance |
| Status | Some published, some drafts (e.g. ~75% published, ~25% drafts) |

**Acceptance criteria:**
- [ ] 15–20 blogs in fixtures
- [ ] All four categories represented
- [ ] At least 2 drafts, rest published

---

### REQ-7.7 — Comment quantity and status

**Requirement:** Seed creates 80–120 comments with mixed approved/pending status, unevenly distributed across posts.

| Property | Value |
|----------|-------|
| Total | 80–120 comments |
| Status | Mix of approved and pending (e.g. ~75–85% approved) |
| Distribution | Not uniform — some posts have many, some few |

**Acceptance criteria:**
- [ ] 80–120 comments after seed
- [ ] Both approved and pending comments present
- [ ] Some posts have 0–2 comments, others 10+ (uneven)
- [ ] Comments spread across different posts

---

### REQ-7.8 — View record quantity and variety

**Requirement:** Seed creates 500–1000 BlogView records with varied referrerSource and visitorKey (sessionId).

| Property | Value |
|----------|-------|
| Total | 500–1000 records |
| referrerSource | direct, search, social, other |
| visitorKey | Unique per visitor/session (multiple views per visitor allowed) |

**Acceptance criteria:**
- [ ] 500–1000 BlogView documents
- [ ] referrerSource values include direct, search, social, other
- [ ] visitorKey varies (many unique visitors, some repeat views)
- [ ] Use existing viewConfig in fixtures/views.js for distribution

---

### REQ-7.9 — Blog creation dates

**Requirement:** Blog creation dates are spread over the last 6 months (not all on same day).

**Acceptance criteria:**
- [ ] createdAt for blogs spans ~6 months
- [ ] Publications Over Time chart shows multiple months
- [ ] No single day has > 25% of all blogs created

---

### REQ-7.10 — Filter robustness

**Requirement:** Enough data so that with any combination of period and category, charts and tables remain meaningful (no widespread empty states).

**Acceptance criteria:**
- [ ] Filtering by single category (e.g. Technology) still shows data
- [ ] Short period (7d) with recent data shows non-empty charts
- [ ] "All" period with "All" category shows full picture
- [ ] Edge case: 1-day custom range may be empty; that is acceptable with clear empty state

---

## Dependencies Between Requirements

```
REQ-5.1, REQ-5.2 ──► REQ-5.3 (period filter drives global update)
REQ-5.4 ───────────► REQ-5.5 (category filter drives global update)
REQ-5.1, 5.2, 5.4 ─► REQ-5.9, 5.10 (filters affect export)
REQ-5.6, 5.7 ──────► REQ-5.8 (drill-down presentation)

REQ-7.1, 7.2, 7.3, 7.8 ─► REQ-7.5 (views data → populated dashboard)
REQ-7.4, 7.7 ───────────► REQ-7.5 (comments → populated dashboard)
REQ-7.6, 7.9 ───────────► REQ-7.5 (blogs → populated dashboard)
REQ-7.1–7.9 ─────────────► REQ-7.10 (sufficient data for filters)
```

---

## Suggested Implementation Order

### Phase 1: Fixtures (enables testing)

1. **REQ-7.6** — Expand blog fixtures to 15–20, add drafts
2. **REQ-7.9** — Spread blog createdAt over 6 months
3. **REQ-7.7** — Expand comments to 80–120, mixed status, distribute over time
4. **REQ-7.4** — Ensure comment distribution over time
5. **REQ-7.1, REQ-7.8** — Implement BlogView seed using viewConfig
6. **REQ-7.2, REQ-7.3** — Apply weekday/growth and category popularity in view generation
7. **REQ-7.5, REQ-7.10** — Validate dashboard and filters with seed data

### Phase 2: Filters (foundation for interactivity)

8. **REQ-5.1, REQ-5.2** — Period filter (quick-select + custom range)
9. **REQ-5.3** — Wire period to all analytics sections (hooks already accept params)
10. **REQ-5.4, REQ-5.5** — Category filter and global propagation

### Phase 3: Export & Drill-down

11. **REQ-5.9, REQ-5.10** — CSV export (server endpoint + client button)
12. **REQ-5.7** — Category donut click filters page (already partially supported via onCategoryChange)
13. **REQ-5.6** — Views chart drill-down API and UI
14. **REQ-5.8** — Drill-down modal/expand UX

---

## Technical Approach

### Filters: URL params vs state

**Recommendation: URL search params**

- **Pros:** Shareable links, browser back/forward, bookmarkable filtered views
- **Params:** `period`, `from`, `to`, `category`
- **Implementation:** Use `useSearchParams` in Analytics page; pass params to FilterBar and all data hooks
- **Fallback:** If not using URL, store in React state; ensure single source of truth for all sections

### Drill-down UX

- **Views chart:** Server endpoint `GET /api/admin/analytics/drill-down?date=YYYY-MM-DD&...` returns posts for that date bucket
- **Presentation:** Modal (recommended) — keeps context; expand below chart as alternative
- **Category donut:** No API call; set `category` filter state/URL param to clicked category

### CSV generation

**Recommendation: Server-side**

- **Endpoint:** `GET /api/admin/analytics/export?period=&from=&to=&category=`
- **Response:** `Content-Type: text/csv`, `Content-Disposition: attachment; filename="..."`  
- **Generation:** Build CSV string from aggregated blog + view + comment data in controller
- **Client:** `analyticsApi.exportCsv(params)` with `responseType: 'blob'`; use existing `downloadFile` util

### Fixture data generation strategy

1. **Blogs:** Extend `fixtures/blogs.js` — add 9–14 more posts; assign `createdAt` via helper that spreads over 6 months; set `isPublished` for ~75%
2. **Comments:** Extend `fixtures/comments.js` — increase pool; in seed script, assign random `createdAt` over 6 months; assign to random blogs with uneven distribution
3. **Views:** Add `seedViews(blogs)` in seed script — use `viewConfig` from `fixtures/views.js`; for each published blog, generate N views based on category popularity; `viewedAt` spread over 6 months with weekday multiplier; `visitorKey` = unique IDs (e.g. `visitor-${i}` with some repeats); `referrerSource` from distribution in config
4. **Order:** Seed users → blogs (with createdAt) → comments (with createdAt, link to blogs) → BlogView (link to blogs, spread viewedAt)

---

## Acceptance Criteria Summary

### Period Filter
- [ ] REQ-5.1: Quick-select buttons work; active state clear
- [ ] REQ-5.2: Custom date range works; validation for from ≤ to
- [ ] REQ-5.3: All sections update when period changes

### Category Filter
- [ ] REQ-5.4: Dropdown shows All + 4 categories
- [ ] REQ-5.5: Category applies to all sections and export

### Drill-down
- [ ] REQ-5.6: Views chart click shows post list for that bucket
- [ ] REQ-5.7: Category donut click filters page
- [ ] REQ-5.8: Drill-down in modal or expand; close/dismiss works

### Export
- [ ] REQ-5.9: Export CSV button downloads file
- [ ] REQ-5.10: CSV has required columns; respects filters

### Fixtures
- [ ] REQ-7.1–7.10: Seed produces 15–20 blogs, 80–120 comments, 500–1000 views; data over 6 months; category popularity; dashboard populated; filters produce meaningful results
