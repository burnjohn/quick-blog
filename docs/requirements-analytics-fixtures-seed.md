## Feature: Blog Analytics Dashboard — Fixtures & Seed Data

**Summary:** Extend fixtures and seed script to provide realistic, time-distributed data (blogs, comments, views) so the analytics dashboard appears full and meaningful from the first run, with deterministic output for reproducible testing.

**Scope:** Backend (Seed/Fixtures)

**References:**
- Design: docs/plans/2026-02-11-blog-analytics-dashboard-design.md
- Backend API: docs/requirements-analytics-backend.md
- Tables/Filters: docs/requirements-analytics-tables-filters-export.md
- Existing: server/fixtures/*.js, server/scripts/seed.js

---

## 1. Blog Post Fixtures

### 1.1 Quantity and Variety

- Fixtures must include a minimum of 15 and a maximum of 20 blog posts.
- Each blog post has: title, subTitle, description, category, image (path), author (set at seed time).
- Every post must specify category from the allowed set: Technology, Startup, Lifestyle, Finance.
- Category distribution must be uneven to reflect category popularity: Technology and Lifestyle posts outnumber Startup and Finance (e.g., Technology ≥ Lifestyle > Startup > Finance).

### 1.2 Publication Status

- Some posts must be published (`isPublished: true`), some must be draft (`isPublished: false`).
- At least 70% of posts must be published so the dashboard has meaningful visible data.
- Draft posts must appear in at least two different categories.

### 1.3 Creation Date Spread

- Blog creation dates must be spread across the last 6 months, not clustered on a single day.
- Fixture data must include creation timestamps or a mechanism to assign them deterministically during seed so that:
  - Posts exist in each of the 6 months.
  - No single month has more than 40% of posts.
- Date formats in fixtures/seed output must follow en-US conventions where displayed.

### 1.4 Image Assets

- Each blog post must reference a valid image path (e.g., `/uploads/seed/blog_pic_N.png`).
- Ensure sufficient unique images exist in `uploads/seed/` for all fixture posts (at least one per post, with reuse allowed).

---

## 2. Comment Fixtures

### 2.1 Quantity

- Fixtures must support creating a minimum of 80 and a maximum of 120 comments in total after seed.
- Comments may be defined as a pool of templates, with seed logic distributing them across posts and assigning timestamps.

### 2.2 Distribution Across Posts

- Comments must be distributed unevenly across blog posts so that:
  - Some posts have many comments (e.g., 8–15).
  - Some posts have few (1–3).
  - Some published posts have zero comments.
- Popular categories (Technology, Lifestyle) should have posts with higher comment counts on average.

### 2.3 Approval Status

- Comments must have mixed approval status: some approved (`isApproved: true`), some pending (`isApproved: false`).
- Approximately 70–85% of comments should be approved so the dashboard shows realistic moderation.
- Both approved and pending comments must appear across multiple posts and categories.

### 2.4 Date Distribution

- Comment creation timestamps must be distributed over time, not all on the same date.
- Comments must fall within the 6‑month window and ideally correlate with the publish date of the post they belong to (comments typically created after post publish date).
- No single day should have more than 15% of all comments.

---

## 3. View Tracking Fixtures

### 3.1 Model Context (BlogView)

- Each view record includes: blog reference, sessionId, referrer, timestamp.
- Optionally: isAdmin (boolean) for excluding admin views from analytics.
- Referrer values: direct, search, social, other.

### 3.2 Quantity

- Seed must create a minimum of 500 and a maximum of 1000 view records.
- Views must be distributed across all published blog posts (no views for draft posts).

### 3.3 Session IDs

- Multiple distinct sessionId values must be used (e.g., 50–150 unique sessions).
- Same sessionId may view the same post more than once (realistic repeat visits).
- Same sessionId may view multiple different posts.
- Session IDs must be deterministic (same seed run produces same session IDs).

### 3.4 Referrer Distribution

- Referrer distribution must be realistic, e.g.:
  - search: ~40–50%
  - social: ~25–35%
  - direct: ~15–25%
  - other: ~5–15%

### 3.5 Time Patterns

- View timestamps must be spread across the last 6 months.
- Weekday views must outnumber weekend views (e.g., ~1.2–1.5× weekday vs weekend).
- Gradual growth trend: more recent months should have higher view counts than older months (e.g., last month > first month in the 6‑month window).
- Within each day, views can be spread across typical browsing hours (e.g., 8–22 local time).

### 3.6 Category Popularity (Views)

- View counts per category must follow: Technology > Lifestyle > Startup > Finance.
- This aligns with REQ-7.3 and makes charts meaningful when filtered by category.

---

## 4. Seed Script Requirements

### 4.1 Execution Order

- Seed must run in this order: Users → Blogs → Comments → BlogViews.
- Users must exist before blogs (author reference).
- Blogs must exist before comments and views (blog reference).

### 4.2 Idempotency and Existing Data Handling

- Running seed multiple times must produce the same logical outcome:
  - Either: clear all seed-related collections and re-seed (current behavior).
  - Or: clear and re-seed only seed data, preserving non-seed data if a safe distinction exists.
- Default behavior must be: clear Blogs, Comments, BlogViews, then seed; Users may be cleared and recreated or updated per project convention.
- No duplicate blogs, comments, or views when seed is run twice in sequence.

### 4.3 Determinism

- Same seed run (same code, no external randomness) must produce identical data:
  - Same blog titles, categories, counts.
  - Same comment counts per post.
  - Same view counts, session IDs, referrers, and timestamp distribution.
- Use a fixed random seed if randomness is needed (e.g., for distributions), so results are reproducible.

### 4.4 Error Handling

- Seed must fail fast on connection or schema errors.
- Clear error messages when required collections or models are missing.
- Exit with non-zero code on failure.

---

## 5. Data Distribution Patterns

### 5.1 Category Popularity (Summary)

- Technology: highest views and comments.
- Lifestyle: second highest.
- Startup: third.
- Finance: lowest.

### 5.2 Temporal Patterns

- Weekday vs weekend: weekdays have more views and comments than weekends.
- Growth: older months have fewer views/comments; newer months have more.
- No single date dominates; data is spread across many days.

### 5.3 Relationship Between Entities

- Popular blogs (high views) often have more comments, but not always (some high-view posts have few comments).
- At least one high-view post with few comments, and one moderate-view post with many comments, to avoid perfect correlation.

---

## 6. Validation and Sufficiency

### 6.1 Dashboard Coverage

- After seed, every chart, table, and KPI card must show meaningful, non-empty data under:
  - Default filters (e.g., last 6 months, All categories).
  - Each single-category filter (Technology, Startup, Lifestyle, Finance).
  - At least one shortened period (e.g., last 7 days, last 30 days) where some data exists.

### 6.2 Minimum Visibility

- Top Viewed Posts table: at least 5 posts with views.
- Top Commented Posts table: at least 5 posts with comments.
- Recent Comments table: at least 10 comments displayed.
- Views-over-time chart: non-flat line; visible trend (e.g., growth).
- Category distribution chart: all four categories represented with non-zero counts.
- KPI cards (total views, total comments, etc.): all show non-zero values under default filters.

### 6.3 Verification Approach

- Document or script checks (optional): after seed, assert minimum counts (e.g., ≥15 blogs, ≥80 comments, ≥500 views).
- Manual or automated UI check: load analytics page with default filters and confirm no empty states.

---

## 7. Edge Cases

### 7.1 Empty Database

- Seed on empty DB must succeed and produce full dataset per above requirements.
- All collections are created as needed by MongoDB/Mongoose.

### 7.2 Existing Data (Re-seed)

- Re-running seed after a previous seed: must result in clean, consistent state (no partial duplicates or orphaned references).
- If seed clears and re-creates data: second run must be indistinguishable from first (aside from ObjectIds if not deterministic).

### 7.3 Partial Failures

- If seed fails midway (e.g., after blogs, before comments): state may be inconsistent.
- Requirements: seed is atomic per collection where possible; document that users should re-run full seed after fixing errors.
- No requirement to support partial resume; full re-seed is acceptable.

### 7.4 BlogView Model Not Yet Migrated

- If BlogView collection or model does not exist when analytics is introduced: seed must skip view creation gracefully and log a warning, or fail with a clear message.
- Once BlogView exists, seed must create view fixtures as specified.

---

## Acceptance Criteria

### Blog Fixtures

- [ ] Fixtures contain 15–20 blog posts
- [ ] All four categories (Technology, Startup, Lifestyle, Finance) are represented
- [ ] Category distribution reflects popularity (Technology ≥ Lifestyle > Startup > Finance)
- [ ] At least 70% of posts are published; drafts exist in at least two categories
- [ ] Blog creation dates span 6 months with no single month >40% of posts
- [ ] Each post references a valid image path

### Comment Fixtures

- [ ] Seed creates 80–120 comments
- [ ] Comments are unevenly distributed across posts (some high, some low, some zero)
- [ ] 70–85% of comments are approved
- [ ] Both approved and pending comments appear across multiple posts
- [ ] Comment timestamps are distributed over 6 months (no single day >15%)

### View Fixtures

- [ ] Seed creates 500–1000 view records
- [ ] Views only for published posts
- [ ] 50–150 unique session IDs used
- [ ] Referrer distribution: search ~40–50%, social ~25–35%, direct ~15–25%, other ~5–15%
- [ ] Weekday views exceed weekend views
- [ ] Gradual growth: more views in recent months
- [ ] View counts by category follow Technology > Lifestyle > Startup > Finance

### Seed Script

- [ ] Execution order: Users → Blogs → Comments → BlogViews
- [ ] Re-running seed produces same logical outcome (idempotent)
- [ ] Data is deterministic (same code ⇒ same data)
- [ ] Fails with clear errors on connection or model issues
- [ ] Exits with non-zero code on failure

### Dashboard Sufficiency

- [ ] All charts show non-empty, meaningful data under default filters
- [ ] All tables (Top Viewed, Top Commented, Recent Comments) have data
- [ ] All KPI cards show non-zero values under default filters
- [ ] Each category filter shows data when selected
- [ ] At least one shortened period (7d, 30d) shows some data

### Edge Cases

- [ ] Seed succeeds on empty database
- [ ] Re-seed produces consistent state (no duplicates, no orphaned refs)
- [ ] Partial failure behavior is documented; full re-seed is supported
