# Feature: Blog Analytics Dashboard — Frontend: KPI Cards & Charts

**Summary:** Add an admin Analytics page with KPI cards and charts for views, publications, categories, and comments, plus loading, empty, and error handling.

**Scope:** Frontend

**References:**
- Design: docs/plans/2026-02-11-blog-analytics-dashboard-design.md

---

## 0. General

- **REQ-0.1:** All UI text in English.
- **REQ-0.3:** Use en-US formats for dates (e.g. Feb 11, 2026) and numbers (e.g. 1,234).

---

## 1. Navigation

- **REQ-1.1:** Add an "Analytics" item with a chart icon to the admin sidebar.
- **REQ-1.2:** Analytics is available only to authenticated admins (same as other admin pages).
- Analytics page must be reachable via a defined admin route.

---

## 2. Page Layout

- KPI cards appear in a row at the top.
- Charts are arranged below in a responsive grid.
- Layout must scale and reflow across desktop, tablet, and mobile.

---

## 3. KPI Cards — Top Section

KPI cards show metrics and trend vs the previous equivalent period.

### 3.1 Card Metrics

| Card | Requirement | Content |
|------|-------------|---------|
| Total Views | REQ-2.1 | Total view count across all blogs |
| Total Blogs | REQ-2.2 | Count of published blogs and drafts |
| Total Comments | REQ-2.3 | Count of approved and pending comments |
| Avg Engagement | REQ-2.4 | Average comments per post |
| Approval Rate | REQ-2.5 | Percentage of approved comments |
| Most Active Category | REQ-2.6 | Category with most views in the selected period |

### 3.2 Trend Indicators

- **REQ-2.7:** Each card shows trend vs previous equivalent period: up/down arrow and percentage change.
- Positive trend (up): green color, upward arrow.
- Negative trend (down): red color, downward arrow.
- Unchanged: neutral styling.
- Trend uses en-US number formatting (e.g. +12.5%, -3.2%).

### 3.3 Card Layout

- Cards display in a single row on desktop (6 cards).
- Cards wrap to 2 or 3 per row on tablet.
- Cards stack to 1 or 2 per row on mobile.
- Each card shows: metric label, primary value, trend arrow with percentage.

---

## 4. Charts

### 4.1 Views Over Time (Line/Area Chart)

- **REQ-3.1:** View count by day, week, or month depending on selected period.
- **REQ-3.2:** Hover tooltip shows exact date and view count.
- Chart adapts to container width.
- Y-axis: view count. X-axis: time labels.

### 4.2 Publications Over Time (Bar Chart)

- **REQ-3.3:** Published blog count by month.
- **REQ-3.4:** Stacked bars colored by category.
- Legend identifies each category color.
- Chart adapts to container width.

### 4.3 Category Distribution (Donut Chart)

- **REQ-3.5:** Donut chart with percentage of blogs per category.
- **REQ-3.6:** Hover shows category name, count, and percentage.
- Legend shows all categories with their colors.
- Chart adapts to container width.

### 4.4 Comment Activity (Bar Chart)

- **REQ-3.7:** Bar chart with two series: approved and pending comments by month.
- **REQ-3.8:** Hover shows month-level details (approved count, pending count, total).
- Legend distinguishes approved from pending.
- Chart adapts to container width.

### 4.5 Views by Category (Horizontal Bar Chart)

- **REQ-3.9:** Horizontal bars for total views per category.
- **REQ-3.10:** Sorted from highest to lowest views.
- Each bar labeled with category name and view count.
- Chart adapts to container width.

### 4.6 Chart Grid Layout

- Charts are arranged in a responsive grid (e.g. 2 columns on desktop).
- On tablet: 1–2 columns.
- On mobile: single column, full width.

---

## 5. States and UX

### 5.1 Loading State

- **REQ-8.1:** Show skeleton/shimmer placeholders for KPI cards and charts during loading.
- KPI card skeletons match the card dimensions (label + value + trend area).
- Chart skeletons show a rectangular placeholder matching the chart area.
- No empty charts or blank spaces visible during loading.

### 5.2 Empty State

- **REQ-8.2:** If there is no data, show an empty-state message suggesting creating the first post.
- Message appears centered in the content area.
- Optionally includes a link/button to the blog creation page.
- Per-chart empty states for individual charts that have no data (e.g. "No views data available for the selected period").

### 5.3 Error State

- **REQ-8.3:** If the API fails, show a clear error message and a "Try Again" button.
- Error message is user-friendly (e.g. "Unable to load analytics data. Please try again.").
- "Try Again" button retries the failed data fetch.
- Error state is visually distinct from loading and empty states.

### 5.4 Responsiveness

- **REQ-8.4:** Page displays and behaves correctly on desktop, tablet, and mobile.
- **REQ-8.5:** Charts resize to fit their container width.
- No horizontal scrolling on the page itself.
- Text remains readable at all breakpoints.

---

## 6. Data Requirements (Frontend Perspective)

- Frontend expects API endpoints that provide:
  - KPI data: total views, blog counts, comment counts, avg engagement, approval rate, most active category — each with current value, trend direction, and percentage change
  - Views over time: array of {date, views}
  - Publications over time: array of {month, total, byCategory}
  - Category distribution: array of {category, count, percent}
  - Comment activity: array of {month, approved, pending, total}
  - Views by category: array of {category, views}
- Frontend must pass period and category filter parameters to all API calls.
- Frontend handles the mapping of time granularity (day/week/month) based on period length.

---

## Acceptance Criteria

### Navigation

- [ ] Analytics item with chart icon appears in admin sidebar
- [ ] Analytics page is reachable from the sidebar
- [ ] Only authenticated admins can access Analytics; unauthenticated users are redirected

### KPI Cards

- [ ] Total Views card displays total view count and trend
- [ ] Total Blogs card displays published/draft counts and trend
- [ ] Total Comments card displays approved/pending counts and trend
- [ ] Avg Engagement card displays average comments per post and trend
- [ ] Approval Rate card displays percentage of approved comments and trend
- [ ] Most Active Category card displays top category and trend
- [ ] Each card shows up/down arrow and percentage change vs previous period
- [ ] Trend colors: green for up, red for down, neutral for unchanged
- [ ] Numbers and dates use en-US formatting
- [ ] Cards wrap responsively on tablet and mobile

### Charts

- [ ] Views Over Time chart shows data by day/week/month per period
- [ ] Views Over Time chart has hover tooltip with date and count
- [ ] Publications Over Time chart shows blogs by month with stacked bars by category
- [ ] Publications Over Time chart has a legend for categories
- [ ] Category Distribution donut shows percentage per category
- [ ] Category Distribution hover shows name, count, and percentage
- [ ] Comment Activity chart has approved and pending series by month
- [ ] Comment Activity chart has hover with month details
- [ ] Views by Category horizontal bar chart is sorted highest to lowest
- [ ] All charts adapt to container width
- [ ] Chart grid is responsive (2 columns desktop, 1 column mobile)

### States and UX

- [ ] Loading shows skeleton/shimmer for KPI cards and charts
- [ ] Empty state shows message suggesting creating first post
- [ ] Per-chart empty states shown when individual charts have no data
- [ ] Error state shows message and "Try Again" button
- [ ] Layout works on desktop, tablet, and mobile
- [ ] Charts resize with their containers
- [ ] No horizontal scroll on main page

### General

- [ ] All UI text is in English
- [ ] Dates and numbers use en-US format
