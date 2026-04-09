# Feature: Blog Analytics Dashboard

## Summary

A separate page in the admin panel with full blog analytics: content metrics, reader engagement, views, charts, and interactive filters. The dashboard gives the admin a complete picture of how the blog is performing — what's being read, what's being commented on, how the audience is growing.

## Decisions

- New **Analytics** page in the admin panel sidebar (the current Dashboard remains as is)
- Blog post view tracking (anonymous, no reader authentication required)
- Database fixtures for realistic analytics data
- Interactive charts with filters and drill-down

## General Rules

- **REQ-0.1:** All UI (headings, labels, buttons, tooltips, placeholders, messages) — exclusively in English
- **REQ-0.2:** Section names, chart titles, table columns, KPI card names — in English
- **REQ-0.3:** Date and number formats — en-US (Feb 11, 2026 / 1,234)

---

## Product Requirements

### 1. Navigation

- **REQ-1.1:** A new "Analytics" item appears in the admin panel sidebar with a chart icon
- **REQ-1.2:** The page is accessible only to authenticated admins (same as the rest of the admin panel)

---

### 2. KPI Cards (Top Section)

A row of cards with key metrics showing trends relative to the previous period:

| # | Card | What It Shows |
|---|------|---------------|
| **REQ-2.1** | Total Views | Total number of views across all blogs |
| **REQ-2.2** | Total Blogs | Number of blogs (published / drafts) |
| **REQ-2.3** | Total Comments | Number of comments (approved / pending moderation) |
| **REQ-2.4** | Average Engagement | Average number of comments per post |
| **REQ-2.5** | Approval Rate | Percentage of approved comments out of total |
| **REQ-2.6** | Most Active Category | Category with the most views in the selected period |

- **REQ-2.7:** Each card shows a trend (up/down arrow + percentage change) compared to the previous equivalent period

---

### 3. Charts

#### 3.1 Views Over Time (Line/Area Chart)

- **REQ-3.1:** Chart shows view count by days/weeks/months (depending on selected period)
- **REQ-3.2:** Hovering over a point — tooltip with exact date and view count

#### 3.2 Publications Over Time (Bar Chart)

- **REQ-3.3:** Chart shows number of published blogs by month
- **REQ-3.4:** Bars are color-coded by category (stacked bar)

#### 3.3 Distribution by Category (Pie Chart)

- **REQ-3.5:** Donut chart shows the percentage of blogs in each category
- **REQ-3.6:** On hover — category name, count, and percentage

#### 3.4 Comment Activity (Bar Chart)

- **REQ-3.7:** Bar chart with two series: approved and pending comments by month
- **REQ-3.8:** On hover — details for that month

#### 3.5 Views by Category (Horizontal Bar Chart)

- **REQ-3.9:** Horizontal bars show total views for each category
- **REQ-3.10:** Sorted from highest to lowest

---

### 4. Tables / Rankings

#### 4.1 Top 5 Most Viewed Posts

- **REQ-4.1:** Table with columns: title, category, views, comments, publication date
- **REQ-4.2:** Sorted by views (highest first)
- **REQ-4.3:** Post title is a clickable link that opens the post

#### 4.2 Top 5 Most Commented Posts

- **REQ-4.4:** Table with columns: title, category, comments (approved/total), views
- **REQ-4.5:** Sorted by comment count

#### 4.3 Recent Comments

- **REQ-4.6:** List of the 5 most recent comments: author name, text excerpt, blog title, date, status (approved/pending moderation)

---

### 5. Interactivity

#### 5.1 Period Filter

- **REQ-5.1:** Quick select buttons: 7 days, 30 days, 90 days, all time
- **REQ-5.2:** Custom date range picker (from — to)
- **REQ-5.3:** Changing the period updates all KPI cards, charts, and tables on the page

#### 5.2 Category Filter

- **REQ-5.4:** Dropdown for category selection (All, Technology, Startup, Lifestyle, Finance)
- **REQ-5.5:** Filter applies to all sections on the page

#### 5.3 Drill-down (Detail View)

- **REQ-5.6:** Clicking a bar/point on the views chart — shows a list of posts for that period with their views
- **REQ-5.7:** Clicking a segment on the category chart — filters the entire page by that category
- **REQ-5.8:** Drill-down opens as a modal or expands below the chart

#### 5.4 Export

- **REQ-5.9:** "Export CSV" button — downloads a file with all metrics for the selected period
- **REQ-5.10:** CSV contains: post title, category, date, views, comment count, status

---

### 6. View Tracking

- **REQ-6.1:** Each blog post view on the public site is recorded
- **REQ-6.2:** Tracking is anonymous — no reader authentication required
- **REQ-6.3:** One unique user (session) is counted once per post per 24 hours (deduplication)
- **REQ-6.4:** Referral source is recorded: direct, search, social, other
- **REQ-6.5:** Views from admins/authors are not included in statistics (or marked separately)

---

### 7. Fixtures (Test Data)

- **REQ-7.1:** Seed script creates realistic view data for all existing blogs
- **REQ-7.2:** Data is distributed over the last 6 months with a realistic pattern (weekdays > weekends, gradual growth)
- **REQ-7.3:** Different categories have different popularity levels (Technology > Lifestyle > Startup > Finance)
- **REQ-7.4:** Comment fixtures are also distributed over time (not all on the same date)
- **REQ-7.5:** After running seed, the dashboard immediately looks populated and realistic
- **REQ-7.6:** Minimum 15–20 blog posts in fixtures (various categories, some drafts, some published)
- **REQ-7.7:** Minimum 80–120 comments (various statuses: approved / pending moderation, unevenly distributed among posts)
- **REQ-7.8:** Minimum 500–1,000 view records with various referrer and sessionId values
- **REQ-7.9:** Blog creation dates are spread across 6 months (not all created on the same day)
- **REQ-7.10:** There must be enough data so that every chart, table, and KPI card looks meaningful and non-empty for any filter (category, period)

---

### 8. States & UX

- **REQ-8.1:** Loading state — skeletons (shimmer) instead of empty charts during loading
- **REQ-8.2:** Empty state — if there's no data yet, show a message suggesting to create the first post
- **REQ-8.3:** Error state — if the API returns an error, show a message with a "Try Again" button
- **REQ-8.4:** Responsive — the page displays correctly on desktop, tablet, and mobile
- **REQ-8.5:** Charts adapt to container width

---

## Out of Scope (Not Included in This Feature)

- Real-time analytics (real-time updates / WebSocket)
- Visitor geography (requires geolocation)
- A/B testing of headlines
- Side-by-side period comparison
- Email reports with analytics

---

## Open Questions

1. Is the ability to filter by a specific author needed (when multi-user support is added)?
2. What is the maximum retention depth for view data (store everything forever or aggregate old data)?
