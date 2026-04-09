# Demo: Debugging with Systematic Debugging Skill (Claude Code / Cursor)

This guide demonstrates how to investigate and fix two real bugs in QuickBlog using Claude Code / Cursor's `systematic-debugging` skill. The bugs are pre-planted on a dedicated branch — your job is to find the root cause using structured debugging, not guessing.

## The Bugs

Two bugs have been reported by QA:

| # | Symptom | Severity | Area |
|---|---------|----------|------|
| 1 | Deleting a blog leaves orphaned comments in the admin panel | High | Backend |
| 2 | Comments sometimes appear on the wrong blog post | Critical | Frontend |

You do **not** know the root cause yet. The demo walks through finding it systematically.

## Step 0: Switch to the Demo Branch

The bugs live on the `demo-debugging` branch. Switch to it before starting:

```bash
git checkout demo-debugging
```

> **Important:** Do NOT look at the branch diff or commit history before the demo — the bug locations are visible in the diff. The point is to discover them through systematic debugging.

## Prerequisites

After switching branches, start the application:

1. Start MongoDB and seed test data:
   ```bash
   cd server
   npm run setup    # starts DB via Docker + seeds data
   npm run server   # starts Express with nodemon
   ```

2. Start the frontend dev server:
   ```bash
   cd client
   npm run dev
   ```

3. Log into the admin panel:
   - URL: `http://localhost:5173/admin`
   - Email: `admin@quickblog.com`
   - Password: `admin123`

---

## Bug 1: Orphaned Comments After Blog Deletion

### Reproduce the Bug

1. Open the admin dashboard at `http://localhost:5173/admin`
2. Note the **Comments** count on the dashboard (e.g., 15)
3. Navigate to the blog list and **delete a blog** that has comments
4. Return to the admin dashboard — the **Comments** count hasn't decreased
5. Navigate to the **Comments** page — comments from the deleted blog are still listed
6. These comments now have a broken/missing blog reference

**Observation:** Blog deletion succeeds, but associated comments are never cleaned up.

### Debug with Claude Code

Open a new chat and paste:

```
I'm seeing a bug: when I delete a blog post, its comments are not being deleted.
After deletion, the orphaned comments still appear in the admin comments page.
The blog itself is gone, but comments reference a non-existent blog.

Use /systematic-debugging to investigate.
```

**What Claude Code does (following the skill's 4 phases):**

#### Phase 1: Gather Evidence
- Reads `blogController.js` → finds the `deleteBlogById` function
- Reads `Comment` model schema → identifies the field that references blogs
- Checks the delete flow: find blog → delete image → delete blog → delete comments
- Traces the exact query used for comment cleanup

#### Phase 2: Analyze Patterns
- The blog deletion itself works (blog disappears from the list)
- The comment deletion step runs without errors (no 500, no crash)
- But comments remain in the database
- Pattern: **"Operation succeeds silently but has no effect"** → likely a wrong query

#### Phase 3: Form Hypothesis
- **Hypothesis:** "The `Comment.deleteMany()` query uses an incorrect field name, causing MongoDB to match 0 documents and silently delete nothing."
- Tests the hypothesis by comparing the query field against the Comment model schema

#### Phase 4: Fix and Verify
- Identifies the one-character fix
- Verifies by deleting a blog and confirming comments are cleaned up

### Debug with Cursor

1. **Open Cursor chat** and describe the bug:

```
Bug: deleting a blog doesn't remove its comments.
Steps to reproduce:
1. Delete a blog with comments via admin
2. Check admin comments page — orphaned comments remain
3. No errors in server logs

Help me debug this step by step.
```

2. **Cursor traces the code path:**
   - Opens `blogController.js` → `deleteBlogById`
   - Highlights the `Comment.deleteMany()` call
   - Cross-references with `Comment` model to check field names

3. **Use Cursor's Debug Mode** (`Cmd+.` → Debug) to add instrumentation:
   - Add a `console.log` before and after the `deleteMany` call
   - Log the query filter and the result's `deletedCount`
   - Observe: `deletedCount: 0` — confirms the query matches nothing

4. **Root cause identified** — Cursor highlights the field name mismatch

---

## Bug 2: Comments Posted to Wrong Blog (Stale Closure)

### Reproduce the Bug

1. Open any blog post, e.g., `http://localhost:5173/blog/<blog-A-id>`
2. Note the blog title — this is **Blog A**
3. **Without going back to the blog list**, change the URL directly to another blog: `http://localhost:5173/blog/<blog-B-id>`
4. Blog B's content and existing comments load correctly
5. Submit a new comment on Blog B (fill in name and content, click submit)
6. The toast says "Comment added for review" — looks successful
7. **Refresh the page** — your comment is NOT on Blog B
8. Navigate to Blog A — your comment is there instead

**Observation:** The comment was silently posted to the first blog you visited, not the one currently displayed.

> **Note:** This bug only triggers when navigating directly between blog detail pages (URL change without unmounting). Going List → Blog A → List → Blog B does NOT trigger it because the component fully remounts.

### Debug with Claude Code

Open a new chat and paste:

```
I found a bug: when I navigate directly between blog posts (changing the URL
from /blog/X to /blog/Y), any comment I submit on Blog Y actually appears on
Blog X instead. The comment form shows success, but the comment ends up on the
wrong blog.

This only happens when navigating directly between blog detail pages, not when
going through the blog list.

Use /systematic-debugging to investigate.
```

**What Claude Code does (following the skill's 4 phases):**

#### Phase 1: Gather Evidence
- Reads `BlogDetail.jsx` → traces how `blogId` flows from `useParams()` to `useComments(id)` to `handleAddComment`
- Reads `useComments.js` → finds the `blogIdRef` and how `addComment` uses it
- Reads `commentApi.js` → confirms the API sends whatever `blog` field it receives
- Checks React Router behavior: same route pattern `/blog/:id` → component re-renders, doesn't remount

#### Phase 2: Analyze Patterns
- Blog content loads correctly after URL change (fetching uses `blogId` prop directly)
- Comments list loads correctly after URL change (fetching uses `blogId` prop directly)
- Only `addComment` sends to the wrong blog
- Pattern: **"Works on first visit, breaks on navigation"** → stale state or closure issue
- The bug only affects the write path, not the read path → the write path uses a different data source

#### Phase 3: Form Hypothesis
- **Hypothesis:** "`addComment` reads the blog ID from a `useRef` that was initialized with the first `blogId` but is never updated when `blogId` changes. Since React Router re-renders (doesn't remount) when params change, the ref retains the stale initial value."
- Tests by checking: is there a `useEffect` that syncs `blogIdRef.current = blogId`? No — that's the bug.

#### Phase 4: Fix and Verify
- Adds a `useEffect` to keep the ref in sync, OR removes the ref entirely and passes `blogId` directly
- Verifies by navigating between blogs and confirming comments land on the correct post

### Debug with Cursor

1. **Open Cursor chat** and describe the bug:

```
Bug: comments are posted to the wrong blog when navigating directly between
blog detail pages via URL.

Steps to reproduce:
1. Visit /blog/A
2. Change URL to /blog/B (don't go through blog list)
3. Submit a comment — it appears on Blog A, not Blog B

This only happens on direct navigation, not when going through the list.
```

2. **Cursor narrows the scope:**
   - The symptom is "wrong blog ID sent to API" → traces how blog ID reaches the API call
   - Opens `BlogDetail.jsx` → `handleAddComment` → `addComment`
   - Opens `useComments.js` → finds `blogIdRef`

3. **Use Cursor's Debug Mode** to add instrumentation:
   - Add `console.log('blogId prop:', blogId, 'ref:', blogIdRef.current)` inside `addComment`
   - Navigate between blogs and observe: `blogId prop: <new-id>` but `ref: <old-id>`
   - The ref never updates after initial mount

4. **Root cause identified** — `useRef(blogId)` only sets the initial value; there's no effect to sync it

---

## Key Debugging Lessons

### What the `systematic-debugging` Skill Enforces

| Phase | Rule | Why It Matters |
|-------|------|----------------|
| Phase 1 | Gather evidence first | Prevents jumping to conclusions |
| Phase 2 | Analyze patterns | "Silent success" and "works on first load" are diagnostic clues |
| Phase 3 | Form a testable hypothesis | Forces you to explain WHY before attempting a fix |
| Phase 4 | Verify the fix | "It should work" is not verification |

### Anti-Patterns These Bugs Expose

| Anti-Pattern | Example | What to Do Instead |
|--------------|---------|-------------------|
| **Trusting silent success** | MongoDB `deleteMany` returns `{ deletedCount: 0 }` with no error | Always check operation results |
| **Assuming refs track props** | `useRef(value)` only sets the initial value | Add a sync effect or use the prop directly |
| **Testing only the happy path** | Comments work fine on first blog visit | Test navigation flows and state transitions |
| **Symptom in a different layer** | Backend bug manifests in admin UI; frontend bug manifests in wrong data | Trace the full data flow, don't stop at the first layer |

### Why These Bugs Are Hard to Find

| Property | Bug 1 (Backend) | Bug 2 (Frontend) |
|----------|-----------------|-------------------|
| **Error thrown?** | No | No |
| **Operation "succeeds"?** | Yes — 200 OK | Yes — toast shows success |
| **Visible immediately?** | No — only on comments page | No — only on page refresh |
| **Root cause location** | `blogController.js` (different from symptom in admin comments) | `useComments.js` (different from symptom in BlogDetail) |
| **Size of the fix** | One field name (`blogId` → `blog`) | One missing `useEffect` or remove the ref |

---

## Summary

This demo showcased:
1. **Structured debugging** — Following the 4-phase approach instead of guessing
2. **Evidence-first investigation** — Reading code, checking queries, tracing data flow
3. **Pattern recognition** — "Silent success" and "works on first load, breaks on navigation" as diagnostic signals
4. **Root cause before fix** — Understanding WHY before changing code
5. **Cross-layer debugging** — Tracing symptoms from UI back to the actual source

## Related Documents

- [Systematic Debugging Skill](/.claude/skills/systematic-debugging/SKILL.md) — The full debugging methodology
- [DEMO: Analytics Feature](DEMO-ANALYTICS-FEATURE.md) — Multi-agent implementation demo
- [DEMO: Comments Feature](DEMO-COMMENTS-FEATURE.md) — Single-agent implementation demo
- [QuickBlog README](README.md)
