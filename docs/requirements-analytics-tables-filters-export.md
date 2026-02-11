# Feature: Blog Analytics Dashboard — Frontend: Tables, Filters & Interactivity

**Summary:** Admin Analytics page includes three data tables (top viewed posts, top commented posts, recent comments), period and category filters that apply across the page, drill-down interactions on charts, and CSV export of analytics data.

**Scope:** Frontend

**References:**
- Design: Blog Analytics Dashboard — Tables, Filters, Drill-Down, and Export (translated from Ukrainian)
- Categories: Technology, Startup, Lifestyle, Finance

---

## 1. Tables / Rankings

### 1.1 Top 5 Most Viewed Posts

- Table displays exactly 5 rows (or fewer if fewer posts exist).
- Columns: title, category, views, comments, publish date.
- Title column shows the post title.
- Category column shows one of: Technology, Startup, Lifestyle, Finance.
- Views column shows view count formatted in en-US (e.g., 1,234).
- Comments column shows total approved comment count.
- Publish date column shows date in en-US format (e.g., Feb 11, 2026).
- Rows are sorted by views descending (highest first).
- Post title is a clickable link that opens the post in a new tab or navigates to the public post page.
- Table respects the active period and category filters.

### 1.2 Top 5 Most Commented Posts

- Table displays exactly 5 rows (or fewer if fewer posts exist).
- Columns: title, category, comments (approved/total), views.
- Title column shows the post title.
- Category column shows one of: Technology, Startup, Lifestyle, Finance.
- Comments column shows both approved and total count (e.g., "12 / 15").
- Views column shows view count formatted in en-US.
- Rows are sorted by comment count descending (highest first).
- Post title is a clickable link that opens the post.
- Table respects the active period and category filters.

### 1.3 Recent Comments

- List displays the 5 most recent comments.
- Each item shows: author name, text excerpt, blog title, date, status.
- Author name is displayed as provided (or "Anonymous" if absent).
- Text excerpt is truncated (e.g., max 50–80 characters with ellipsis) to avoid overflow.
- Blog title identifies the post the comment belongs to.
- Date is in en-US format.
- Status appears as a badge: "Approved" (green/success style) or "Pending" (warning/pending style).
- List is ordered by date descending (newest first).
- Recent comments respect the active period and category filters.

---

## 2. Period Filter

- Quick-select buttons: 7 days, 30 days, 90 days, year, all time.
- Exactly one quick-select option is active at a time (selected state is visually distinct).
- Custom date range picker provides "from" and "to" date inputs.
- When a custom date range is used, the quick-select is cleared or shows a neutral state; when a quick-select is chosen, the date range picker reflects that range or is disabled/readonly.
- Selecting a different period immediately updates all KPI cards, charts, and tables on the page.
- Period is calculated relative to the current date (today as end date for past ranges).
- All UI labels are in English (e.g., "7 days", "30 days", "90 days", "Year", "All time", "From", "To").

---

## 3. Category Filter

- Dropdown with options: All, Technology, Startup, Lifestyle, Finance.
- Default value is "All" (no category restriction).
- Selecting a category filters all sections on the page: KPI cards, charts, and all three tables.
- Only one category can be selected at a time.
- The active category is clearly indicated in the dropdown.
- Filter applies consistently across the entire analytics page.

---

## 4. Filter Interaction (Combined Filtering)

- Period and category filters work together: data is filtered by both when both are set.
- Changing period does not reset category; changing category does not reset period.
- Filters have no ordering dependency: either can be changed first.
- When "All" is selected for category, results include all categories within the chosen period.
- Export uses the same combined filters (see Section 6).

---

## 5. Drill-Down

### 5.1 Views Chart Drill-Down

- Clicking a bar or point in the views chart triggers drill-down.
- Drill-down shows a list of posts for that period (day/week/month, depending on chart granularity) with their view counts.
- Drill-down content includes at least: post title, views, and optionally category and publish date.
- Drill-down appears as a modal or as an expandable section below the chart.
- User can close or collapse the drill-down to return to the chart view.
- Post titles in the drill-down list are clickable links to the post.

### 5.2 Category Donut Chart Drill-Down

- Clicking a segment of the category donut chart filters the entire page by that category.
- The category filter dropdown updates to reflect the selected category.
- All KPI cards, charts, and tables immediately update to show data for that category.
- User can clear the filter via the dropdown (e.g., select "All") to restore unfiltered view.
- Segment click behaves like selecting that category in the category dropdown.

### 5.3 Drill-Down Display

- Drill-down opens as a modal or expands below the chart; behavior is consistent for views chart drill-down.
- Drill-down content is readable and follows en-US formatting for dates and numbers.
- Loading state is shown if drill-down data is fetched asynchronously.

---

## 6. Export

- "Export CSV" button is visible and accessible on the page (placement: near filters or in a dedicated actions area).
- Button label is "Export CSV" or equivalent in English.
- Clicking the button downloads a CSV file with all metrics for the selected period (and category, if filtered).
- CSV filename is descriptive (e.g., `analytics-2026-02-11.csv` or includes period).
- CSV contains columns: post title, category, date, views, comment count, status.
- All posts matching the current filters are included in the export.
- Date and number formatting in CSV follows en-US (e.g., Feb 11, 2026; 1,234).
- Export uses the same period and category filters as the rest of the page.
- Export handles empty data gracefully (downloads valid CSV with headers only, or with a message row).

---

## 7. States and UX

### 7.1 Loading State

- While data is loading, skeleton placeholders are shown for tables (rows/cards).
- Skeletons reflect approximate layout of the final content (e.g., 5 rows for top-5 tables).
- Charts show skeleton or loading indicator during fetch.
- No layout shift when real content replaces skeletons (skeleton dimensions match content where possible).

### 7.2 Empty State

- When no posts match the filters, tables show an empty state message (e.g., "No posts found for the selected period and category").
- Recent comments list shows an empty state if no comments exist.
- Empty state is clearly distinguishable from loading state.
- Empty state message is in English.

### 7.3 Error State

- If data fails to load, an error message is displayed (e.g., "Unable to load analytics data. Please try again.").
- User has a way to retry (e.g., retry button or reload).
- Error state is visible and distinct from loading and empty states.

### 7.4 Responsive Design

- Layout works correctly on desktop, tablet, and mobile.
- Tables are scrollable horizontally on small screens if needed, or columns stack/hide appropriately.
- Filter controls (period buttons, category dropdown, export button) remain usable on all breakpoints.
- Drill-down modal or expandable section is readable and dismissible on mobile.
- Touch targets are sufficiently large for mobile interaction.

---

## 8. General

- All UI text is in English only (REQ-0.1).
- Date and number formats use en-US locale (e.g., Feb 11, 2026; 1,234) (REQ-0.3).
- Analytics page is admin-only and requires authentication.

---

## Acceptance Criteria

### Tables

- [ ] Top 5 Most Viewed Posts table shows columns: title, category, views, comments, publish date
- [ ] Top 5 Most Viewed Posts sorted by views descending
- [ ] Post titles in Most Viewed table are clickable links to the post
- [ ] Top 5 Most Commented Posts table shows columns: title, category, comments (approved/total), views
- [ ] Top 5 Most Commented Posts sorted by comment count descending
- [ ] Post titles in Most Commented table are clickable links to the post
- [ ] Recent Comments shows 5 items with author, excerpt, blog title, date, status badge
- [ ] Comment text is truncated with ellipsis when long
- [ ] Status badge shows Approved or Pending with distinct styling
- [ ] All tables respect period and category filters

### Period Filter

- [ ] Quick-select buttons: 7 days, 30 days, 90 days, year, all time
- [ ] Custom date range picker (from — to) is available
- [ ] Period change updates all KPI cards, charts, and tables

### Category Filter

- [ ] Dropdown options: All, Technology, Startup, Lifestyle, Finance
- [ ] Default value is "All"
- [ ] Category filter applies to all sections on the page
- [ ] Period and category filters combine correctly

### Drill-Down

- [ ] Click on views chart bar/point shows post list for that period
- [ ] Post list shows title, views, and links to posts
- [ ] Click on category donut segment filters page by that category
- [ ] Category filter dropdown updates when donut segment is clicked
- [ ] Drill-down appears as modal or expandable section

### Export

- [ ] "Export CSV" button is visible and accessible
- [ ] CSV includes: post title, category, date, views, comment count, status
- [ ] Export uses current period and category filters
- [ ] CSV downloads successfully for selected data

### States and UX

- [ ] Loading state shows skeletons for tables
- [ ] Empty state shows message when no data matches filters
- [ ] Error state shows message and retry option on load failure
- [ ] Layout is responsive on desktop, tablet, and mobile
- [ ] All text in English; dates and numbers in en-US format
