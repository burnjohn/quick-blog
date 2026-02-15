# Feature: Blog Analytics Dashboard

**Summary:** A separate page in the admin panel with complete blog analytics: content metrics, reader engagement, views, charts, and interactive filters. The dashboard gives the admin a complete picture of how the blog performs — what is being read, what is being commented on, and how the audience engages.

**Scope:** Full-stack (client + server)

**References:**
- Design: Screenshots provided (filter bar, KPI cards, charts, tables, Recent Comments)
- Original requirements: Ukrainian feature spec (Feb 2026)

---

## 1. General Rules

- **REQ-0.1:** All UI (headings, labels, buttons, tooltips, placeholders, messages) — in English only
- **REQ-0.2:** Section names, chart names, table columns, KPI cards — in English
- **REQ-0.3:** Date and number formats — en-US (e.g., Feb 11, 2026 / 1,234)

---

## 2. Navigation

- **REQ-1.1:** A new "Analytics" item appears in the admin panel sidebar with a chart icon
- **REQ-1.2:** Page is accessible only to authenticated admins (same JWT auth as rest of admin panel)
- **REQ-1.3:** Unauthenticated or non-admin users are redirected to login (same behavior as other admin pages)

---

## 3. Data and API

- **REQ-3.API.1:** Analytics data is fetched from separate server endpoints; all metrics are computed server-side via MongoDB aggregation
- **REQ-3.API.2:** All analytics endpoints accept `startDate`, `endDate`, and `category` as query parameters for filtering
- **REQ-3.API.3:** When category filter is "All", the category parameter is omitted from requests
- **REQ-3.API.4:** No caching for v1 — data is refetched on every page visit and on every filter change

**Endpoints:**
- `GET /api/analytics/summary` — KPI cards data (with trend comparison)
- `GET /api/analytics/views-over-time` — views chart data
- `GET /api/analytics/publications-over-time` — publications chart data
- `GET /api/analytics/category-distribution` — donut chart data
- `GET /api/analytics/comment-activity` — comment activity chart data
- `GET /api/analytics/views-by-category` — horizontal bar chart data
- `GET /api/analytics/top-posts` — top viewed and top commented posts
- `GET /api/analytics/recent-comments` — latest 5 comments
- `POST /api/views/track` — public endpoint to record a view (called from blog post page)
- `GET /api/analytics/export` — CSV export

---

## 4. KPI Cards

Row of 6 cards with key metrics and trend relative to previous period:

| ID | Card | What it shows |
|----|------|---------------|
| **REQ-2.1** | Total Views | Total number of views across all blogs |
| **REQ-2.2** | Total Blogs | Number of blogs (published / drafts) |
| **REQ-2.3** | Total Comments | Number of comments (approved / pending moderation) |
| **REQ-2.4** | Avg Engagement | Average number of comments per post |
| **REQ-2.5** | Approval Rate | Percentage of approved comments from total |
| **REQ-2.6** | Most Active Category | Category with most views for the selected period |

- **REQ-2.7:** Each card shows trend (up/down arrow + change percentage) compared to previous equivalent period
- **REQ-2.8:** When there is no previous period to compare (e.g., "All" time selected, or first period), show a dash ("—") instead of trend

---

## 5. Charts

### 5.1 Views Over Time (line/area chart)

- **REQ-3.1:** Chart shows view count by days/weeks/months (depending on selected period)
- **REQ-3.2:** Hover on point — tooltip with exact date and view count

### 5.2 Publications Over Time (bar chart)

- **REQ-3.3:** Chart shows number of published blogs by month
- **REQ-3.4:** Bars are color-coded by categories (stacked bar)

### 5.3 Category Distribution (pie/donut chart)

- **REQ-3.5:** Donut chart shows percentage of blogs in each category
- **REQ-3.6:** Hover — category name, count, and percentage
- **REQ-3.6a:** Click on segment — sets the category filter dropdown to that category (shortcut; no modal or expand)

### 5.4 Comment Activity (bar chart)

- **REQ-3.7:** Bar chart with two series: approved and pending comments by month
- **REQ-3.8:** Hover — details per month

### 5.5 Views by Category (horizontal bar chart)

- **REQ-3.9:** Horizontal bars show total view count for each category
- **REQ-3.10:** Sorted from highest to lowest

### 5.6 Chart Layout and Formatting

- **REQ-3.11:** Charts are displayed in a 2-column grid
- **REQ-3.12:** Chart axis labels may use shorter date formats (e.g., "2026-02" for monthly, "Feb 11" for daily) as appropriate
- **REQ-3.13:** Charts adapt to container width

**Deferred to v2:** Drill-down on Views Over Time (click bar/point to show posts for that period) — REQ-5.6, REQ-5.8

---

## 6. Tables and Rankings

### 6.1 Top 5 Most Viewed Posts

- **REQ-4.1:** Table with columns: title, category, views, comments, publish date
- **REQ-4.2:** Sorted by views (highest first)
- **REQ-4.3:** Post title is a clickable link that opens the post in a new tab

### 6.2 Top 5 Most Commented Posts

- **REQ-4.4:** Table with columns: title, category, comments (approved/total), views
- **REQ-4.5:** Sorted by total comment count (highest first)
- **REQ-4.5a:** Post title is a clickable link that opens the post in a new tab

### 6.3 Recent Comments

- **REQ-4.6:** List of 5 latest comments showing: author name, text excerpt, blog title, date, status (approved/pending)
- **REQ-4.6a:** Comment excerpt is truncated at approximately 100 characters with "..." if longer
- **REQ-4.6b:** Blog title is a clickable link that opens the post in a new tab

### 6.4 Table Layout

- **REQ-4.7:** Top Viewed and Top Commented tables are displayed side-by-side
- **REQ-4.8:** Recent Comments is displayed as a vertical list below the tables

---

## 7. Filters and Interactivity

### 7.1 Period Filter

- **REQ-5.1:** Quick select buttons: 7 days, 30 days, 90 days, 1 year, All
- **REQ-5.2:** Custom date range picker (from — to)
- **REQ-5.3:** Period change updates all KPI cards, charts, and tables on the page
- **REQ-5.3a:** Selecting a preset updates the date pickers to reflect that range
- **REQ-5.3b:** Entering a custom date range deselects the preset buttons (no active preset highlighted)
- **REQ-5.3c:** Default on page load: "All" time
- **REQ-5.3d:** Date range validation: end date cannot be before start date; if invalid, show inline message "End date must be after start date" and do not fetch

### 7.2 Category Filter

- **REQ-5.4:** Dropdown for category selection (All, Technology, Startup, Lifestyle, Finance)
- **REQ-5.5:** Filter applies to all page sections
- **REQ-5.5a:** Default on page load: "All" categories

### 7.3 Export

- **REQ-5.9:** "Export CSV" button — downloads file with all metrics for selected period
- **REQ-5.10:** CSV contains: post title, category, date, views, comment count, status
- **REQ-5.10a:** Export triggers immediate download; button shows brief loading/disabled state while downloading
- **REQ-5.10b:** Browser download is sufficient success feedback; no toast

### 7.4 Filter State Persistence

- **REQ-5.11:** When user navigates away from Analytics and returns, filters reset to defaults ("All" time, "All" categories)

---

## 8. View Tracking

- **REQ-6.1:** Each blog post view on the public side is recorded
- **REQ-6.2:** Tracking is anonymous — does not require reader authentication
- **REQ-6.3:** One unique session is counted once per post per 24 hours (deduplication by sessionId + blogId)
- **REQ-6.4:** Referrer source is recorded (direct, search, social, other) — stored but not displayed in dashboard for v1
- **REQ-6.5:** Views from admins/authors are not counted in statistics (or marked separately)
- **REQ-6.6:** Session ID is stored in sessionStorage; if sessionStorage is unavailable, still record the view but without deduplication (may over-count slightly)
- **REQ-6.7:** View events are stored in a new View collection in MongoDB

**Out of scope for v1:** Bot/crawler exclusion

---

## 9. Fixtures (Test Data)

- **REQ-7.1:** Seed script creates realistic view data for all existing blogs
- **REQ-7.2:** Data distributed over last 6 months with realistic pattern (weekdays > weekends, gradual growth)
- **REQ-7.3:** Different categories have different popularity (Technology > Lifestyle > Startup > Finance)
- **REQ-7.4:** Comment fixtures also distributed over time (not all on one date)
- **REQ-7.5:** After running seed, dashboard immediately looks filled and realistic
- **REQ-7.6:** Minimum 15–20 blog posts in fixtures (various categories, some drafts, some published)
- **REQ-7.7:** Minimum 80–120 comments (various status: approved / pending, distributed unevenly between posts)
- **REQ-7.8:** Minimum 500–1000 view records with different referrer and sessionId
- **REQ-7.9:** Blog creation dates spread over 6 months (not all created on one day)
- **REQ-7.10:** Enough data so every chart, table, and KPI card looks meaningful and not empty with any filter (category, period)

---

## 10. Loading, Empty, and Error States

### 10.1 Loading

- **REQ-8.1:** Loading state — skeletons (shimmer) instead of empty charts during loading
- **REQ-8.1a:** Per-section skeletons; each section (KPI row, each chart, each table, Recent Comments) shows its own skeleton independently
- **REQ-8.1b:** When filters change, all sections show loading skeletons simultaneously; data appears as each endpoint responds

### 10.2 Empty State

- **REQ-8.2:** When no blogs exist at all — show page-level message: "No blog posts yet. Create your first post to start tracking analytics."
- **REQ-8.2a:** When a specific section has no data for the selected filters — show per-section empty message (e.g., "No views data for selected period" in Views Over Time chart)
- **REQ-8.2b:** When a category filter returns no data — each affected section shows its own empty message

### 10.3 Error State

- **REQ-8.3:** When an API returns an error for a section — show error message with "Try again" button for that section only
- **REQ-8.3a:** Successful sections display normally; only failed sections show errors (partial failure is acceptable)
- **REQ-8.3b:** "Try again" retries only that section's request, not the entire page

### 10.4 Export Error

- **REQ-8.4:** When export fails — show toast "Failed to export data. Please try again." Auto-dismiss after 5 seconds. This is the only toast on the Analytics page.

---

## 11. Layout and Responsiveness

- **REQ-8.5:** KPI cards in a horizontal row (6 cards)
- **REQ-8.6:** Charts in a 2-column grid; tables side-by-side; Recent Comments as vertical list
- **REQ-8.7:** On smaller screens (tablet, mobile), sections stack to a single column
- **REQ-8.8:** Post titles in tables truncate with ellipsis on overflow (single line)
- **REQ-8.9:** Tables and tooltips use date format "Feb 11, 2026"

---

## 12. Out of Scope

- Real-time analytics (real-time updates / WebSocket)
- Visitor geography (requires geolocation)
- A/B testing of headlines
- Side-by-side period comparison
- Email analytics reports
- Drill-down on Views Over Time chart (modal or expand panel) — deferred to v2
- Bot/crawler exclusion from view counts
- Referrer source display in dashboard
- Caching of analytics data
- Performance optimization for large datasets (e.g., thousands of posts)

---

## 13. Open Questions

1. Is the ability to select a specific author for filtering needed (when multi-user support is added)?
2. What is the maximum data retention depth for view data (keep forever or aggregate old data)?

---

## Acceptance Criteria

### Navigation

- [ ] "Analytics" item appears in admin sidebar with chart icon
- [ ] Analytics page is protected by same auth as other admin pages
- [ ] Unauthenticated users are redirected to login

### KPI Cards

- [ ] All 6 KPI cards display correctly with correct metrics
- [ ] Trend (arrow + percentage) shown when previous period exists
- [ ] Dash ("—") shown when no previous period exists
- [ ] Subtext (e.g., "13 published, 5 drafts") shows where applicable

### Charts

- [ ] Views Over Time chart displays with correct granularity
- [ ] Publications Over Time chart shows stacked bars by category
- [ ] Category Distribution donut chart shows percentages
- [ ] Click on donut segment sets category filter
- [ ] Comment Activity chart shows approved vs pending by month
- [ ] Views by Category chart shows horizontal bars sorted by count
- [ ] All charts show tooltips on hover
- [ ] Charts adapt to container width

### Tables

- [ ] Top Viewed Posts table shows 5 posts, sorted by views
- [ ] Top Commented Posts table shows 5 posts, sorted by comments
- [ ] Recent Comments shows 5 latest with excerpt, date, status
- [ ] Post titles and blog titles are clickable links (open in new tab)
- [ ] Comment excerpt truncated at ~100 chars

### Filters

- [ ] Period quick-select (7d, 30d, 90d, 1y, All) works
- [ ] Custom date range picker works
- [ ] Preset selection updates date pickers
- [ ] Custom range deselects presets
- [ ] Category dropdown filters all sections
- [ ] Invalid date range (end before start) shows validation message
- [ ] Default filters: "All" time, "All" categories
- [ ] Filters reset on navigation away and back

### Export

- [ ] Export CSV button downloads file with correct data
- [ ] Button shows loading state during download
- [ ] Export failure shows toast, auto-dismisses after 5 seconds

### View Tracking

- [ ] Public blog post view triggers tracking
- [ ] Views deduplicated by session + blog per 24 hours
- [ ] Referrer stored (not displayed)
- [ ] Admin views excluded or marked separately

### States

- [ ] Per-section loading skeletons display during fetch
- [ ] All sections show loading when filters change
- [ ] Page-level empty state when no blogs exist
- [ ] Per-section empty state when section has no data
- [ ] Per-section error with "Try again" (retries only that section)
- [ ] Partial failure: successful sections display, failed sections show error

### Layout and Responsiveness

- [ ] Layout matches design on desktop
- [ ] Sections stack to single column on smaller screens
- [ ] Long post titles truncate with ellipsis
- [ ] Dates formatted en-US (Feb 11, 2026)

### Fixtures

- [ ] Seed script produces realistic data
- [ ] Dashboard looks filled after running seed
- [ ] All charts, tables, and KPIs show meaningful data with any filter
