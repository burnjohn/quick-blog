# Spec: Admin blog list
**Spec ID:** SPEC-LIST-1   **Status:** As-built (branch chore/editorial-redesign-docs, 2026-11-20)
**Code:** `client/src/pages/admin/ListBlog/ListBlog.jsx`, `client/src/components/admin/blog/BlogTableItem/BlogTableItem.jsx`, `client/src/components/admin/shared/{AdminTable,SegmentedControl,EmptyState,AdminPageHeader}/*`, `client/src/hooks/api/queries/useAdminBlogs/useAdminBlogs.js`, `client/src/hooks/api/mutations/useBlogActions/useBlogActions.js`, `client/src/hooks/core/useApiMutation/useApiMutation.js`, `client/src/utils/formatters.js` (`formatDate`), `server/src/controllers/{adminController,blogController}.js` (`getAllBlogsAdmin`, `publishBlog`, `unpublishBlog`, `deleteBlogById`), `server/src/routes/{adminRoutes,blogRoutes}.js`

## Summary
`/admin/listBlog` lists every blog, both published posts and drafts, newest first. A segmented filter (`All` / `Published` / `Drafts`) narrows the list and is kept in the URL. Each row can be published or unpublished and deleted in place. The same row component (`BlogTableItem`) is also used in the Dashboard's Latest Blogs table.

## Scope / Out of scope
**In scope:** the Blog list page, the status filter, the `BlogTableItem` row and its actions, and the endpoints `GET /api/admin/blogs`, `POST /api/blog/publish`, `POST /api/blog/unpublish` and `POST /api/blog/delete`.

**Out of scope:** editing an existing blog (there is no endpoint or UI for it; `blogApi.update` targets a route that does not exist), search, pagination, bulk actions, and creating blogs ([blog-authoring.md](blog-authoring.md)).

## User-visible behavior
- The header shows the eyebrow `42 total` and the title `All Blogs`. On the right is a segmented control: `ALL 42`, `PUBLISHED 34`, `DRAFTS 08`.
- The table has the columns `#`, `Blog Title`, `Date`, `Status` and `Actions`. Each row shows `01`, the serif title, a date such as `November 16th 2026`, a status pill (`■ PUBLISHED`, ink with signal text, or `□ UNPUBLISHED`, dashed and muted), a `Publish`/`Unpublish` button, and a red `✕` delete button.
- Publishing or deleting shows a toast. The list then refreshes in place, and the affected row animates out of the current filter or its status pill cross-fades.

## Acceptance criteria

### Server
| ID | Requirement |
|----|-------------|
| AC-LIST-01 | `GET /api/admin/blogs` SHALL require a valid JWT and respond `200 { success:true, count, blogs }`. `blogs` SHALL contain every Blog, published and unpublished, sorted by `createdAt` descending, with absolute `image` URLs. |
| AC-LIST-02 | `POST /api/blog/publish` with `{ id }` SHALL require a valid JWT. IF no blog has that id THEN it SHALL respond `404 { success:false, message:'Blog not found' }`. Otherwise it SHALL set `isPublished:true` and respond `200 { success:true, message:'Blog published successfully' }`. |
| AC-LIST-03 | `POST /api/blog/unpublish` with `{ id }` SHALL require a valid JWT. IF no blog has that id THEN it SHALL respond `404 'Blog not found'`. Otherwise it SHALL set `isPublished:false` and respond `200 { success:true, message:'Blog unpublished successfully' }`. |
| AC-LIST-04 | `POST /api/blog/delete` with `{ id }` SHALL require a valid JWT. IF no blog has that id THEN it SHALL respond `404 'Blog not found'`. |
| AC-LIST-05 | WHEN `POST /api/blog/delete` finds the blog THE SYSTEM SHALL do four things in order: delete the file `<process.cwd()>/uploads/blogs/<last path segment of image>` if it exists (an unlink error is logged, not returned); delete the Blog; delete all Comments with that `blog`; respond `200 { success:true, message:'Blog deleted successfully' }`. |

### UI: page and filter
| ID | Requirement |
|----|-------------|
| AC-LIST-06 | WHEN the page mounts THE client SHALL request `GET /api/admin/blogs`. WHILE that request is loading and no blogs are held yet THE page SHALL render the full-screen `Loader`. Later refetches SHALL keep the table mounted. |
| AC-LIST-07 | THE header SHALL show the eyebrow `<blogs.length> total` and an `h1` `All Blogs`. |
| AC-LIST-08 | THE header SHALL contain a SegmentedControl (`role="group"`, `aria-label="Filter blogs by status"`) with three options in order: `All` (every blog), `Published` (`isPublished:true`) and `Drafts` (`isPublished:false`). Each option SHALL show its count padded to two digits. |
| AC-LIST-09 | THE active filter SHALL come from the `status` query parameter: `published` → Published, `drafts` → Drafts, and anything else or a missing value → All. |
| AC-LIST-10 | WHEN a filter option is chosen THE client SHALL update the URL with `replace` (no new history entry): `status=published` or `status=drafts`, or remove `status` for All. Other query parameters SHALL be kept. |

### UI: table and rows
| ID | Requirement |
|----|-------------|
| AC-LIST-11 | THE table SHALL have the columns `#`, `Blog Title`, `Date`, `Status` and `Actions`, and show one `BlogTableItem` per blog that matches the active filter, in server order. |
| AC-LIST-12 | EACH row SHALL show the row's 1-based position in the visible list, padded to two digits, in a `<th scope="row">`. It SHALL also show the title, `createdAt` formatted as Moment `MMMM Do YYYY` (for example `November 16th 2026`), and a status pill reading `Published` or `Unpublished`. |
| AC-LIST-13 | EACH row SHALL have a toggle button labeled `Unpublish` WHEN the blog is published and `Publish` otherwise. WHEN it is clicked THE client SHALL `POST /api/blog/unpublish` (published) or `POST /api/blog/publish` (unpublished) with `{ id }`. |
| AC-LIST-14 | WHEN a publish or unpublish call succeeds THE client SHALL toast `Blog updated successfully!` and re-fetch the list. IF it fails THEN the client SHALL toast the server `message`, or else the transport error message, or else `Failed to update blog.`. |
| AC-LIST-15 | EACH row SHALL have a delete button with `aria-label='Delete blog "<title>"'`, showing `✕`. WHEN it is clicked THE client SHALL ask `Are you sure you want to delete this blog?` via `window.confirm`. IF the user cancels THEN no request SHALL be sent and no toast shown. |
| AC-LIST-16 | WHEN the delete is confirmed THE client SHALL `POST /api/blog/delete` with `{ id }`. On success it SHALL toast `Blog deleted successfully!` and re-fetch. On failure it SHALL toast the server message, or else the transport error message, or else `Failed to delete blog.`. |
| AC-LIST-17 | WHILE a toggle or delete request for a row is in flight BOTH buttons of that row SHALL be disabled (`opacity 50%`, `cursor: not-allowed`). Other rows SHALL stay enabled. |
| AC-LIST-18 | WHEN the filtered list is empty THE table SHALL show an EmptyState (`∅` stamp, title, hint). For All: `No blogs found` / `Start from “Add blogs” in the menu`. For Published: `Nothing published yet` / `Try another filter`. For Drafts: `No drafts on the spike` / `Try another filter`. |

### Accessibility & motion
| ID | Requirement |
|----|-------------|
| AC-LIST-19 | EACH filter option SHALL be a `<button>` with `aria-pressed` reflecting the active option. The ink highlight SHALL slide between options (shared `layoutId="blog-status-filter"`, 0.4 s). |
| AC-LIST-20 | Rows SHALL rise in on mount, 16 px and 0.45 s, staggered 0.06 s per row up to 8 rows. A row removed from the visible list SHALL slide out 32 px to the left and fade (0.28 s), and the remaining rows SHALL glide into place. |
| AC-LIST-21 | WHEN a blog's status changes THE status pill SHALL cross-fade between `Published` and `Unpublished` with an 8 px vertical slide. |
| AC-LIST-22 | The toggle and delete buttons SHALL be at least 44 × 44 px. |

### Responsive
| ID | Requirement |
|----|-------------|
| AC-LIST-23 | BELOW `sm` (640 px) THE `Date` and `Status` columns SHALL be hidden, and the toggle button SHALL drop its 112 px minimum width. The table SHALL scroll horizontally when it overflows. |
| AC-LIST-24 | BELOW `sm` THE header SHALL stack the title above the filter. FROM `sm` up they SHALL share one row, with the filter right-aligned. |

## Contracts

```http
GET /api/admin/blogs
Authorization: <token>
200 { "success": true, "count": 42, "blogs": [ Blog ] }

POST /api/blog/publish | /api/blog/unpublish | /api/blog/delete
Authorization: <token>
Content-Type: application/json
{ "id": "<blogId>" }

200 { "success": true, "message": "Blog published successfully" | "Blog unpublished successfully" | "Blog deleted successfully" }
404 { "success": false, "message": "Blog not found" }
401 see auth.md
```

## Edge cases
- **Unpublishing while the `Published` filter is active:** after the refetch the row no longer matches, so it slides out and the `Published` count drops.
- **Deleting the only blog under All:** the empty state `No blogs found` fades in. On a later refetch with zero blogs, the Loader shows again while loading.
- **`?status=archived`** (unknown value): treated as All, and the URL is left as it is until the user picks a filter.
- **Two quick clicks on Publish:** the second is blocked because the row's buttons are disabled while the first request is in flight.

## Known gaps
- **Malformed ids crash.** An `id` that is not an ObjectId makes publish, unpublish or delete fail with `500` (CastError) instead of `400` or `404`.
- **No ownership or role check.** Any authenticated user, including an `author`, can publish, unpublish or delete any blog.
- **Image deletion depends on the working directory.** The file is resolved from `process.cwd()`, while multer writes relative to the module path, so the image is removed only when the server is started from `server/`.
- **The public blog list is not refreshed** after publish, unpublish or delete (`AppContext.blogs`).
- **No error state.** A failed list load shows a toast and the empty state `No blogs found`.
- **No undo** for delete; the only safeguard is `window.confirm`.

## Related specs
- [dashboard.md](dashboard.md): reuses `BlogTableItem` in Latest Blogs.
- [blog-authoring.md](blog-authoring.md): creates the blogs listed here.
- [auth.md](auth.md): token and 401 handling.
- [comments-moderation.md](comments-moderation.md): comments are deleted together with their blog.
