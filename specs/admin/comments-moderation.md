# Spec: Admin comments moderation
**Spec ID:** SPEC-MOD-1   **Status:** As-built (branch chore/editorial-redesign-docs, 2026-11-20)
**Code:** `client/src/pages/admin/Comments/Comments.jsx`, `client/src/components/admin/comment/CommentTableItem/CommentTableItem.jsx`, `client/src/components/admin/shared/{AdminTable,SegmentedControl,EmptyState,AdminPageHeader}/*`, `client/src/components/ui/Badge/Badge.jsx`, `client/src/hooks/api/queries/useAdminComments/useAdminComments.js`, `client/src/hooks/api/mutations/useCommentActions/useCommentActions.js`, `server/src/controllers/adminController.js` (`getAllComments`, `approveCommentById`, `unapproveCommentById`, `deleteCommentById`), `server/src/routes/adminRoutes.js`

Public submission and display of comments are specified in [../public/comments.md](../public/comments.md).

## Summary
`/admin/comments` is the moderation queue. Comments submitted by readers arrive unapproved and are shown under the default `Not Approved` tab. An editor can approve a comment, which makes it public, or delete it. Approved comments are listed under the `Approved` tab, where they can only be deleted.

## Scope / Out of scope
**In scope:** the Comments page, the `Approved` / `Not Approved` filter, the approve and delete actions, and the endpoints `GET /api/admin/comments`, `POST /api/admin/approve-comment`, `POST /api/admin/unapprove-comment` and `POST /api/admin/delete-comment`.

**Out of scope:** the public comment form, rate limiting and validation ([../public/comments.md](../public/comments.md)); threaded replies, editing and spam detection (not implemented).

## User-visible behavior
- The header shows the eyebrow `Moderation` and the title `Comments`, with a segmented control `APPROVED 71` / `NOT APPROVED 14` on the right.
- The table has the columns `Details`, `Date` and `Actions`. Each row's Details cell is a small definition list (`BLOG`: the blog title in serif; `NAME`: the commenter; `COMMENT`: the text, with a signal-yellow left rule). The Date cell reads like `November 16th 2026`. Actions are a green `✓ APPROVE` button for pending comments, or a green-outlined `APPROVED` badge for approved ones, plus a red `✕` delete button.
- Switching tabs cross-fades the table. Approving or deleting a comment slides its row out.

## Acceptance criteria

### Server
| ID | Requirement |
|----|-------------|
| AC-MOD-01 | ALL four moderation endpoints SHALL require a valid JWT from any role. A missing, invalid or expired token SHALL get `401` ([auth.md](auth.md) AC-AUTH-07…09). |
| AC-MOD-02 | `GET /api/admin/comments` SHALL respond `200 { success:true, count, comments }` with every Comment, approved and pending, sorted by `createdAt` descending. Each comment SHALL have `blog` populated with the full Blog document, whose `image` SHALL be converted to an absolute URL. |
| AC-MOD-03 | `POST /api/admin/approve-comment` with `{ id }` SHALL set `isApproved:true` and respond `200 { success:true, message:'Comment approved successfully' }`. |
| AC-MOD-04 | `POST /api/admin/unapprove-comment` with `{ id }` SHALL set `isApproved:false` and respond `200 { success:true, message:'Comment unapproved successfully' }`. |
| AC-MOD-05 | `POST /api/admin/delete-comment` with `{ id }` SHALL delete the Comment and respond `200 { success:true, message:'Comment deleted successfully' }`. |

### Data
| ID | Requirement |
|----|-------------|
| AC-MOD-06 | THE `Comment` model SHALL have the required `blog` (ObjectId ref `Blog`), `name` and `content`, `isApproved` (default `false`), and `createdAt`/`updatedAt` timestamps. |

### UI
| ID | Requirement |
|----|-------------|
| AC-MOD-07 | WHEN the page mounts THE client SHALL request `GET /api/admin/comments`. WHILE that request is loading and no comments are held yet THE page SHALL render the full-screen `Loader`. Later refetches SHALL keep the table mounted. |
| AC-MOD-08 | THE header SHALL show the eyebrow `Moderation` and an `h1` `Comments`. |
| AC-MOD-09 | THE header SHALL contain a SegmentedControl (`aria-label="Filter comments"`) with the options `Approved` and `Not Approved`, in that order. Each SHALL show its count (`isApproved` true or false) padded to two digits. |
| AC-MOD-10 | THE default filter SHALL be `Not Approved`. The filter state SHALL be kept in component state only (not in the URL) and SHALL reset to `Not Approved` WHEN the page is re-entered. |
| AC-MOD-11 | THE table SHALL have the columns `Details`, `Date` and `Actions`, and show one `CommentTableItem` per comment that matches the filter, in server order (newest first). |
| AC-MOD-12 | EACH row's Details cell SHALL be a `<dl>` with `Blog` → the populated blog's `title`, `Name` → `name`, and `Comment` → `content` rendered as plain text. |
| AC-MOD-13 | EACH row's Date cell SHALL show `createdAt` formatted as Moment `MMMM Do YYYY`. |
| AC-MOD-14 | WHEN the comment is not approved THE row SHALL show a `✓ Approve` button (`aria-label="Approve comment"`). WHEN it is approved THE row SHALL show an `Approved` badge in place of the button. |
| AC-MOD-15 | WHEN `Approve` is clicked THE client SHALL `POST /api/admin/approve-comment` with `{ id }`. On success it SHALL toast `Comment approved successfully!` and re-fetch. On failure it SHALL toast the server `message`, or else the transport error message, or else `Something went wrong. Please try again.`. |
| AC-MOD-16 | EACH row SHALL have a delete button (`aria-label="Delete comment"`, showing `✕`). WHEN it is clicked THE client SHALL ask `Are you sure you want to delete this comment?` via `window.confirm`. IF the user cancels THEN no request SHALL be sent. |
| AC-MOD-17 | WHEN the delete is confirmed THE client SHALL `POST /api/admin/delete-comment` with `{ id }`. On success it SHALL toast `Comment deleted successfully!` and re-fetch. On failure it SHALL toast the server message, or else the transport error message, or else `Failed to delete comment.`. |
| AC-MOD-18 | WHILE an approve or delete request for a row is in flight BOTH action buttons of that row SHALL be disabled. |
| AC-MOD-19 | WHEN the filtered list is empty THE table SHALL show an EmptyState. For Approved: `No approved comments found` / `Approve a comment to publish it`. For Not Approved: `No not approved comments found` / `The moderation queue is clear`. |
| AC-MOD-20 | THE UI SHALL NOT offer an un-approve action. `POST /api/admin/unapprove-comment` has no client caller. |

### Accessibility & motion
| ID | Requirement |
|----|-------------|
| AC-MOD-21 | EACH filter option SHALL be a `<button>` with `aria-pressed`. The ink highlight SHALL slide between the options (`layoutId="comment-filter"`, 0.4 s). |
| AC-MOD-22 | WHEN the filter changes THE table panel SHALL cross-fade: the old panel exits up 6 px (0.2 s), then the new one enters from 10 px below (0.35 s). |
| AC-MOD-23 | Rows SHALL rise in with a 0.06 s stagger. A row that leaves the filtered list (after approve or delete) SHALL slide out to the left. |
| AC-MOD-24 | The Approve and delete buttons SHALL be at least 44 px tall. The delete button SHALL be 44 × 44 px. |

### Responsive
| ID | Requirement |
|----|-------------|
| AC-MOD-25 | BELOW `sm` (640 px) THE `Date` column SHALL be hidden. The table SHALL scroll horizontally when it overflows. |

## Contracts

```http
GET /api/admin/comments
Authorization: <token>
200 { "success": true, "count": 85, "comments": [ Comment & { "blog": Blog } ] }

POST /api/admin/approve-comment | /api/admin/unapprove-comment | /api/admin/delete-comment
Authorization: <token>
{ "id": "<commentId>" }
200 { "success": true, "message": "Comment approved successfully" | "Comment unapproved successfully" | "Comment deleted successfully" }
401 see auth.md
```

`Comment = { _id, blog, name, content, isApproved, createdAt, updatedAt, __v }`

## Edge cases
- **Approving under `Not Approved`:** after the refetch the comment no longer matches, so its row slides out. The `Not Approved` count drops by one and `Approved` rises by one.
- **Last pending comment approved:** the table shows `No not approved comments found` / `The moderation queue is clear`.
- **Comment whose blog was deleted outside the app:** `blog` populates to `null`, and the `Blog` value renders empty. Deleting a blog through the app also deletes its comments ([blog-list.md](blog-list.md) AC-LIST-05).
- **Long comment text** wraps inside the Details cell; nothing truncates it.

## Known gaps
- **Unknown ids still report success.** Approve, unapprove and delete return `200 success` even when the id matches nothing. A malformed id returns `500` (CastError).
- **No role check.** Moderation endpoints accept any authenticated role, `author` included.
- **No un-approve control** in the UI, even though the endpoint exists.
- **No error state.** A failed load shows a toast plus the empty state, which reads as "queue is clear".
- **Inconsistent error fallbacks.** The approve failure fallback is the generic `Something went wrong. Please try again.`, while delete uses `Failed to delete comment.`.
- **No pagination.** `GET /api/admin/comments` returns every comment with the full Blog document populated, including `description` HTML.

## Related specs
- [../public/comments.md](../public/comments.md): reader-side submission, validation, rate limit and the public list of approved comments.
- [blog-list.md](blog-list.md): deleting a blog cascades to its comments.
- [dashboard.md](dashboard.md): the `Comments` stat card counts all comments.
- [auth.md](auth.md): token and 401 handling.
