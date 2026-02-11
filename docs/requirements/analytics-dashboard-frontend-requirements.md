# Analytics Dashboard — Frontend Requirements

**Feature:** Blog Analytics Dashboard  
**Summary:** Admin-only analytics page with KPI cards, charts, tables, and filters.  
**Scope:** Frontend (UI components, charts, tables, layout)  
**Stack:** React 19, Vite 6, Tailwind CSS 4, Recharts (recommended)

**References:** Design screenshots (Analytics page, Top posts & Recent Comments sections)

---

## Requirement ID Reference

| ID | Description |
|----|-------------|
| REQ-1.1 | Analytics nav item in sidebar with chart icon |
| REQ-1.2 | Page accessible only to authenticated admins |
| REQ-2.1 | Total Views KPI card |
| REQ-2.2 | Total Blogs KPI card (published/drafts breakdown) |
| REQ-2.3 | Total Comments KPI card (approved/pending breakdown) |
| REQ-2.4 | Avg Engagement KPI card |
| REQ-2.5 | Approval Rate KPI card |
| REQ-2.6 | Most Active Category KPI card |
| REQ-2.7 | Trend indicator (arrow + % vs previous period) |
| REQ-3.1 | Views over time — line/area chart |
| REQ-3.2 | Chart tooltips (date, view count) |
| REQ-3.3 | Publications over time — stacked bar by month |
| REQ-3.4 | Publications bars split by category (stacked) |
| REQ-3.5 | Category distribution — donut chart |
| REQ-3.6 | Donut hover: category, count, percentage |
| REQ-3.7 | Comment activity — grouped bar (approved & pending by month) |
| REQ-3.8 | Comment activity tooltip — month details |
| REQ-3.9 | Views by category — horizontal bar |
| REQ-3.10 | Views by category — sorted highest to lowest |
| REQ-4.1 | Top Viewed Posts table columns |
| REQ-4.2 | Top Viewed — sorted by views (desc) |
| REQ-4.3 | Post title as clickable link to post |
| REQ-4.4 | Top Commented Posts table columns |
| REQ-4.5 | Top Commented — sorted by comment count |
| REQ-4.6 | Recent Comments — author, text, blog link, date, status badge |
| REQ-8.1 | Loading state — skeleton placeholders |
| REQ-8.2 | Empty state — message for no data |
| REQ-8.3 | Error state — message + retry button |
| REQ-8.4 | Responsive (desktop, tablet, mobile) |
| REQ-8.5 | Charts adapt to container width |

---

## 1. Analytics Page Layout (REQ-1.x)

### 1.1 Navigation

- **REQ-1.1:** New "Analytics" item in admin sidebar with chart icon.
- **REQ-1.2:** Page accessible only to authenticated admins (same protection as other admin routes).

**Acceptance criteria:**
- [ ] Sidebar shows "Analytics" with chart icon (`chart_icon.svg`).
- [ ] NavLink uses `ROUTES.ADMIN_ANALYTICS`.
- [ ] Active state: light purple background, left border (same as other nav items).
- [ ] Route nested under admin layout (JWT required).
- [ ] Unauthenticated users redirect to Login.

**File paths:**
- `client/src/components/admin/shared/Sidebar.jsx` — add Analytics `NavLink`.
- `client/src/constants/routes.js` — add `ADMIN_ANALYTICS: '/admin/analytics'`.
- `client/src/assets/assets.js` — add `chart_icon`.
- `client/src/pages/admin/Analytics.jsx` — new page.
- `client/src/App.jsx` — add `<Route path="analytics" element={<Analytics />} />`.

---

### 1.2 Page Structure

**Acceptance criteria:**
- [ ] Page title: "Analytics" at top of main content.
- [ ] Section order: Filter bar → KPI cards → Charts grid → Tables.
- [ ] Content in scrollable main area (admin layout).
- [ ] Padding/ spacing consistent with Dashboard/Comments pages.

**File path:** `client/src/pages/admin/Analytics.jsx`

---

### 1.3 Filter Bar

- Period buttons: 7d, 30d, 90d, 1y, All.
- Date range inputs (from/to).
- Category dropdown (All, Technology, Startup, Lifestyle, Finance).
- "Export CSV" button (purple background).

**Acceptance criteria:**
- [ ] Period buttons: selected state = darker background, bold text.
- [ ] Date inputs with calendar icon affordance.
- [ ] Category dropdown shows BLOG_CATEGORIES.
- [ ] Export button: `bg-primary text-white`, disabled when no data.
- [ ] Filter bar layout wraps on small screens.

**File paths:**
- `client/src/components/admin/analytics/filters/FilterBar.jsx`
- `client/src/components/admin/analytics/filters/PeriodFilter.jsx`
- `client/src/components/admin/analytics/filters/CategoryFilter.jsx`
- `client/src/components/admin/analytics/ExportButton.jsx`

---

## 2. KPI Stat Cards (REQ-2.x)

### 2.1 Card Layout

- **REQ-2.1–2.6:** Six cards in a single horizontal row on desktop.
- **REQ-2.7:** Each card shows trend (arrow + "% change vs previous period").

**Visual spec:**
- White background, light border (`border-gray-100`).
- Label at top (e.g. "Total Views"), small gray text.
- Large bold value.
- Sub-text below (e.g. "13 published, 5 drafts", "63 approved, 17 pending").
- Trend text: green `↑ 100.0% vs previous period` when applicable; gray `—` when no trend.

**Acceptance criteria:**
- [ ] 6 cards: Total Views, Total Blogs, Total Comments, Avg Engagement, Approval Rate, Most Active Category.
- [ ] Total Blogs: sub-text "X published, Y drafts".
- [ ] Total Comments: sub-text "X approved, Y pending".
- [ ] Most Active Category: sub-text "X posts".
- [ ] Avg Engagement: value as percentage (e.g. "0%").
- [ ] Approval Rate: value as percentage (e.g. "78.75%").
- [ ] Trend: green arrow + text for positive; red for negative; `—` when no comparison.
- [ ] Grid: 1 col mobile, 2 cols tablet, 6 cols desktop (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6`).

**File paths:**
- `client/src/components/admin/analytics/KpiSection.jsx`
- `client/src/components/admin/analytics/KpiCard.jsx`

---

## 3. Charts (REQ-3.x)

**Library:** Recharts (add to `package.json`).

**Color palette (design):**
- Finance: orange (`#f97316` or `orange-500`)
- Lifestyle: purple (`#a855f7` or `purple-500`)
- Startup: green (`#22c55e` or `green-500`)
- Technology: blue (`#3b82f6` or `blue-500`)

### 3.1 Views Over Time (REQ-3.1, REQ-3.2)

- **REQ-3.1:** Line or area chart, time-based (days/weeks/months).
- **REQ-3.2:** Tooltip on hover: exact date, view count.

**Acceptance criteria:**
- [ ] LineChart or AreaChart with responsive container.
- [ ] X-axis: dates; Y-axis: view count.
- [ ] Tooltip shows date and value.
- [ ] Empty state: "No views data for selected period".

**File path:** `client/src/components/admin/analytics/charts/ViewsOverTimeChart.jsx`

---

### 3.2 Publications Over Time (REQ-3.3, REQ-3.4)

- **REQ-3.3:** Bar chart by month.
- **REQ-3.4:** Stacked bars by category.

**Acceptance criteria:**
- [ ] BarChart, stacked by category.
- [ ] Legend: Finance (orange), Lifestyle (purple), Startup (green), Technology (blue).
- [ ] X-axis: month (e.g. "2026-02"); Y-axis: count.
- [ ] Tooltip on hover with category breakdown.

**File path:** `client/src/components/admin/analytics/charts/PublicationsChart.jsx`

---

### 3.3 Category Distribution (REQ-3.5, REQ-3.6)

- **REQ-3.5:** Donut chart with % per category.
- **REQ-3.6:** Hover: category name, count, percentage.

**Acceptance criteria:**
- [ ] PieChart with `innerRadius` (donut).
- [ ] Segments use category color palette.
- [ ] Tooltip: category, count, percentage.
- [ ] Empty segments not shown.

**File path:** `client/src/components/admin/analytics/charts/CategoryDistributionChart.jsx`

---

### 3.4 Comment Activity (REQ-3.7, REQ-3.8)

- **REQ-3.7:** Grouped bar chart: approved & pending by month.
- **REQ-3.8:** Tooltip: month details (approved count, pending count).

**Acceptance criteria:**
- [ ] BarChart with two series: Approved (green), Pending (orange).
- [ ] X-axis: months; Y-axis: comment count.
- [ ] Legend: Approved, Pending.
- [ ] Tooltip shows month + both counts.

**File path:** `client/src/components/admin/analytics/charts/CommentActivityChart.jsx`

---

### 3.5 Views by Category (REQ-3.9, REQ-3.10)

- **REQ-3.9:** Horizontal bar chart.
- **REQ-3.10:** Sorted highest to lowest views.

**Acceptance criteria:**
- [ ] BarChart with layout="vertical" (horizontal bars).
- [ ] Y-axis: category names; X-axis: view count.
- [ ] Bars sorted by views descending.
- [ ] Spans half width in grid (left column).

**File path:** `client/src/components/admin/analytics/charts/ViewsByCategoryChart.jsx`

---

### 3.6 Charts Grid Layout

**Acceptance criteria:**
- [ ] 2-column grid on desktop (`lg:grid-cols-2`).
- [ ] Row 1: Views Over Time | Publications Over Time.
- [ ] Row 2: Category Distribution | Comment Activity.
- [ ] Row 3: Views by Category | (empty right cell, or chart spans left only).
- [ ] Each chart in white card with light border and title.
- [ ] Charts use `ResponsiveContainer` (REQ-8.5).

**File path:** `client/src/components/admin/analytics/ChartSection.jsx`

---

## 4. Tables (REQ-4.x)

### 4.1 Top Viewed Posts (REQ-4.1–4.3)

- **REQ-4.1:** Columns: Title, Category, Views, Comments, Publish Date.
- **REQ-4.2:** Sorted by views (descending).
- **REQ-4.3:** Title is clickable link to blog post.

**Acceptance criteria:**
- [ ] Max 5 rows.
- [ ] Title: purple link (`text-primary`), opens `getBlogDetailPath(id)` or public blog URL.
- [ ] Category: plain text.
- [ ] Views, Comments: bold numbers.
- [ ] Publish Date: "Month Day, Year" (e.g. "Feb 11, 2026").
- [ ] Light gray headers; row separators.
- [ ] Loading: skeleton rows.

**File path:** `client/src/components/admin/analytics/tables/TopViewedTable.jsx`

---

### 4.2 Top Commented Posts (REQ-4.4, REQ-4.5)

- **REQ-4.4:** Columns: Title, Category, Comments (approved/total), Views.
- **REQ-4.5:** Sorted by comment count (descending).

**Acceptance criteria:**
- [ ] Max 5 rows.
- [ ] Title: purple link to post.
- [ ] Comments: "11 / 15" (approved / total).
- [ ] Views: bold number.
- [ ] Sorted by total comments (or approved) desc.

**File path:** `client/src/components/admin/analytics/tables/TopCommentedTable.jsx`

---

### 4.3 Recent Comments (REQ-4.6)

- **REQ-4.6:** Last 5 comments: author (bold), text (italic), blog title link, date, status badge.

**Acceptance criteria:**
- [ ] Max 5 comments.
- [ ] Author name: bold.
- [ ] Comment text: italic.
- [ ] Row: purple blog title link + bullet + date.
- [ ] Status badge: green "Approved" or orange "Pending".
- [ ] Sorted by date desc (newest first).
- [ ] Each comment separated by horizontal line.

**File path:** `client/src/components/admin/analytics/tables/RecentCommentsTable.jsx`

---

### 4.4 Table Layout

**Acceptance criteria:**
- [ ] Top Viewed and Top Commented side-by-side (2 columns) on desktop.
- [ ] Recent Comments full width below.
- [ ] Each table in white card with title.

**File path:** `client/src/components/admin/analytics/tables/TableSection.jsx`

---

## 5. States & UX (REQ-8.x)

### 5.1 Loading (REQ-8.1)

- **REQ-8.1:** Skeleton shimmer placeholders during data fetch.

**Acceptance criteria:**
- [ ] KPI cards: skeleton with label, value, sub-text placeholders.
- [ ] Charts: skeleton rectangle with chart aspect ratio.
- [ ] Tables: skeleton rows (5 rows).
- [ ] Uses existing `Skeleton` component (`client/src/components/ui/Skeleton.jsx`).
- [ ] No content flash — skeletons until data arrives.

---

### 5.2 Empty State (REQ-8.2)

- **REQ-8.2:** Message when no data (e.g. "Create your first post to see analytics").

**Acceptance criteria:**
- [ ] Views Over Time: "No views data for selected period".
- [ ] Other charts: equivalent empty message.
- [ ] Tables: "No posts yet" / "No comments yet" as appropriate.
- [ ] Centered, gray text; not error styling.

---

### 5.3 Error State (REQ-8.3)

- **REQ-8.3:** Error message with retry button.

**Acceptance criteria:**
- [ ] Red error text.
- [ ] "Retry" button with primary style.
- [ ] Retry triggers refetch.
- [ ] Per-section errors where possible (e.g. KPI error separate from chart error).

---

### 5.4 Responsive (REQ-8.4)

- **REQ-8.4:** Works on desktop, tablet, mobile.

**Acceptance criteria:**
- [ ] Mobile: single-column KPIs, charts, tables.
- [ ] Tablet: 2-col KPIs, 2-col charts, 2-col tables.
- [ ] Desktop: 6-col KPIs, 2-col charts, 2-col tables.
- [ ] Filter bar wraps; no horizontal scroll.
- [ ] Touch targets ≥ 44px where applicable.

---

### 5.5 Chart Responsiveness (REQ-8.5)

- **REQ-8.5:** Charts adapt to container width.

**Acceptance criteria:**
- [ ] All charts use Recharts `ResponsiveContainer` with `width="100%"` and `aspect` or `height`.
- [ ] No fixed pixel widths.
- [ ] Charts redraw correctly on resize.

---

## 6. Component Hierarchy

```
Analytics (page)
├── FilterBar
│   ├── PeriodFilter
│   ├── CategoryFilter
│   └── ExportButton
├── KpiSection
│   └── KpiCard (×6)
├── ChartSection
│   ├── ChartCard "Views Over Time"
│   │   └── ViewsOverTimeChart
│   ├── ChartCard "Publications Over Time"
│   │   └── PublicationsChart
│   ├── ChartCard "Category Distribution"
│   │   └── CategoryDistributionChart
│   ├── ChartCard "Comment Activity"
│   │   └── CommentActivityChart
│   └── ChartCard "Views by Category"
│       └── ViewsByCategoryChart
└── TableSection
    ├── TopViewedTable
    ├── TopCommentedTable
    └── RecentCommentsTable
```

**Shared / reused:**
- `Skeleton` (ui)
- `Badge` (ui) — variants: success (Approved), warning or custom (Pending/orange)
- `Button` (ui) — for Export, Retry

---

## 7. Dependencies

| Requirement | Depends on |
|-------------|------------|
| REQ-1.1, REQ-1.2 | routes.js, Sidebar.jsx, App.jsx, Analytics page |
| REQ-2.x | KpiSection, KpiCard, useAnalyticsKpis, Skeleton |
| REQ-3.x | Recharts, ChartSection, chart components, use* hooks |
| REQ-4.x | TableSection, TopViewedTable, TopCommentedTable, RecentCommentsTable |
| REQ-8.1 | Skeleton component |
| REQ-8.2 | Chart and table components |
| REQ-8.3 | refetch from hooks, error handling |
| REQ-8.4, REQ-8.5 | Tailwind responsive classes, ResponsiveContainer |

**External:**
- Recharts (`recharts`) — add via `npm install recharts`
- `chart_icon.svg` — exists at `client/src/assets/chart_icon.svg`; add to assets.js

---

## 8. Implementation Order

1. **Setup**
   - Add `ADMIN_ANALYTICS` to `routes.js`
   - Add `chart_icon` to `assets.js`
   - Install `recharts`

2. **Page & Navigation**
   - Create `Analytics.jsx` page
   - Add route in `App.jsx`
   - Add Analytics NavLink to `Sidebar.jsx`

3. **Filter Bar**
   - Ensure `FilterBar`, `PeriodFilter`, `CategoryFilter`, `ExportButton` are wired in Analytics page

4. **KPI Section**
   - Refine `KpiCard` / `KpiSection` to match design (trend format, sub-text)

5. **Charts**
   - Create `charts/` folder and 5 chart components
   - Wire to `ChartSection`
   - Add empty/loading/error states

6. **Tables**
   - Create `TopViewedTable`, `TopCommentedTable`, `RecentCommentsTable`
   - Wire to `TableSection`
   - Add Badge variant for Pending (orange) if needed

7. **States**
   - Add skeleton loading to all sections
   - Add empty and error handling
   - Verify responsive layout and chart resize

---

## 9. Acceptance Criteria Summary

### Navigation & Page
- [ ] Analytics link in sidebar with chart icon
- [ ] Route protected by admin auth
- [ ] Page shows filter bar, KPIs, charts, tables in order

### KPI Cards
- [ ] 6 cards with labels, values, trends, sub-text per design
- [ ] Trend format: "↑ 100.0% vs previous period" (green) or "—"

### Charts
- [ ] 5 charts: Views Over Time, Publications, Category Distribution, Comment Activity, Views by Category
- [ ] Correct chart types, colors, tooltips, empty states
- [ ] Charts responsive

### Tables
- [ ] Top Viewed: 5 rows, purple links, correct columns
- [ ] Top Commented: 5 rows, Comments as "X / Y"
- [ ] Recent Comments: 5 rows, author bold, text italic, status badges

### States
- [ ] Skeletons during load
- [ ] Empty states when no data
- [ ] Error + retry when fetch fails

### Responsive
- [ ] Layout adapts for mobile, tablet, desktop

---

## 10. Badge Variants for Status

Current `Badge` has: primary, secondary, success, warning, danger, info.

- **Approved:** `variant="success"` (green).
- **Pending:** Add `pending` or use `variant="warning"` with override for orange. Design specifies orange; `warning` is yellow. Recommended: add `pending: 'bg-orange-100 text-orange-700 border-orange-300'` to Badge variants.

**File:** `client/src/components/ui/Badge.jsx`
