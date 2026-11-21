# Spec: Comments (public)
**Spec ID:** SPEC-CMT-2   **Status:** As-built (chore/editorial-redesign-docs, 2026-11-20)
**Code:** `server/src/routes/blogRoutes.js` (`POST /add-comment`, `POST /comments`), `server/src/controllers/blogController.js` (`addComment`, `getBlogComments`), `server/src/validators/blogValidator.js` (`validateComment`), `server/src/middleware/rateLimiter.js` (`commentLimiter`), `server/src/models/Comment.js`, `client/src/api/commentApi.js`, `client/src/hooks/api/queries/useComments/useComments.js`, `client/src/components/comment/{CommentList,CommentItem,CommentForm}/**`, `client/src/pages/public/BlogDetail/BlogDetail.jsx` (Discussion section)

## Summary
Readers can leave a comment on any article without an account. New comments are stored as pending (`isApproved:false`) and only appear publicly after an editor approves them in the admin panel. The article page lists the approved comments, newest first, under `Comments (N)`, next to a `Letters to the editor` form.

## Scope / Out of scope
**In scope:** `POST /api/blog/add-comment` (rate limit, validation, creation); `POST /api/blog/comments` (public list of approved comments); the `useComments` hook; the CommentList, CommentItem and CommentForm UI on the article page.

**Out of scope:**
- Moderation (listing, approving, unapproving and deleting comments): [../admin/comments-moderation.md](../admin/comments-moderation.md).
- Threaded replies, editing, commenter accounts, spam detection beyond rate limiting (not implemented).

## User-visible behavior
On the article page, the `Discussion` area has two columns on `lg`. On the left, the kicker `Conversation` (numbered `01 — `), a large `Comments (N)` heading with a tilted `NN` badge (from `sm` up), and either a dashed box reading `No comments yet. Be the first!` or a list. Each list item shows an initials avatar, the name, a relative time (e.g. `3 days ago`) and the comment text. On the right (sticky on `lg`), a card with a tilted `Letters to the editor` sticker, the heading `Add your comment`, the note `Comments appear once approved by the editor.`, the `Your name` and `Your comment` fields and a `Submit` button. After a successful submit a toast reads `Comment added for review`, the fields clear, and the comment does not appear yet.

## Acceptance criteria

### Server: submission
| ID | Requirement |
|----|-------------|
| AC-CMT-01 | `POST /api/blog/add-comment` SHALL NOT require authentication. |
| AC-CMT-02 | THE SYSTEM SHALL allow at most 5 requests to `POST /api/blog/add-comment` per IP per minute; WHEN the limit is exceeded THE SYSTEM SHALL respond `429 { success:false, message:'Too many comments submitted. Please wait a moment.' }` with standard `RateLimit-*` headers. |
| AC-CMT-03 | IF `blog` is missing THEN THE SYSTEM SHALL respond `400 { success:false, message:'Validation failed', errors }` with `Blog ID is required` in `errors`. |
| AC-CMT-04 | IF `name` is missing or shorter than 2 characters after trimming THEN THE SYSTEM SHALL respond `400` as in AC-CMT-03 with `Name must be at least 2 characters` in `errors`. |
| AC-CMT-05 | IF `content` is missing or shorter than 5 characters after trimming THEN THE SYSTEM SHALL respond `400` as in AC-CMT-03 with `Content must be at least 5 characters` in `errors`. All failing rules SHALL be reported together. |
| AC-CMT-06 | WHEN validation passes THE SYSTEM SHALL create `Comment { blog, name, content, isApproved:false }` with values stored as sent, and respond `201 { success:true, message:'Comment added for review' }`. |

### Server: public list
| ID | Requirement |
|----|-------------|
| AC-CMT-07 | WHEN `POST /api/blog/comments` is called with `{ blogId }` THE SYSTEM SHALL respond `200 { success:true, count, comments }` with only that blog's comments where `isApproved:true`, sorted by `createdAt` descending, without authentication. |
| AC-CMT-08 | THE public list SHALL NEVER include pending comments (`isApproved:false`). |

### Client: data
| ID | Requirement |
|----|-------------|
| AC-CMT-09 | WHEN the article page mounts or its `id` changes THE SYSTEM SHALL call `POST /api/blog/comments` with `{ blogId: <route id> }` and store `comments`. |
| AC-CMT-10 | IF the list request fails or returns `success:false` THEN THE SYSTEM SHALL show an error toast with the server `message`, falling back to the error message and then to `Failed to fetch comments.` |
| AC-CMT-11 | WHEN the form is submitted THE SYSTEM SHALL call `POST /api/blog/add-comment` with `{ blog: <route id>, name, content }`, using the values exactly as typed. |
| AC-CMT-12 | WHEN the response has `success:true` THE SYSTEM SHALL toast the server message (fallback `Comment added successfully!`), fetch the approved list again and clear both fields. |
| AC-CMT-13 | IF the submission fails THEN THE SYSTEM SHALL toast the server `message` (e.g. `Validation failed`, or the 429 text), falling back to `Failed to add comment.`, and SHALL keep the field values. |

### UI: list
| ID | Requirement |
|----|-------------|
| AC-CMT-14 | THE list SHALL show the kicker `Conversation` (numbered by the section counter) and an `h2` `Comments (<n>)`, where `n` is the number of approved comments loaded, plus an `aria-hidden` badge with `n` padded to 2 digits, visible from `sm` up. |
| AC-CMT-15 | WHEN `n = 0` THE SYSTEM SHALL show `No comments yet. Be the first!` |
| AC-CMT-16 | WHEN `n > 0` THE SYSTEM SHALL render an ordered list in server order. Each item SHALL show an `aria-hidden` avatar with up to 2 upper-case initials of `name`, the `name`, a `<time dateTime=createdAt>` with moment's `fromNow()` text, and `content` as plain escaped text (no HTML), wrapped with `break-words`. |
| AC-CMT-17 | EACH comment item SHALL appear through `Reveal`, rising 12 px and staggered by index (at most 8 steps). |

### UI: form
| ID | Requirement |
|----|-------------|
| AC-CMT-18 | THE form card SHALL show an `aria-hidden` sticker `Letters to the editor`, the `h2` `Add your comment` and the note `Comments appear once approved by the editor.` |
| AC-CMT-19 | THE form SHALL have a text input labelled `Your name` (placeholder `Name`, `autoComplete="name"`) and a 6-row textarea labelled `Your comment` (placeholder `Comment`). Both SHALL be HTML `required` and show an `aria-hidden` `*` next to the label. |
| AC-CMT-20 | THE form SHALL have a `Submit` button. WHEN the component's `loading` prop is true the button SHALL be disabled and read `Loading...`. |

### Accessibility & responsive
| ID | Requirement |
|----|-------------|
| AC-CMT-21 | Each label SHALL be tied to its control through `htmlFor`/`id`. |
| AC-CMT-22 | ON `lg` THE list SHALL take 7 of 12 columns and the form 5 of 12, sticky at `top-28`; below `lg` the form SHALL stack under the list. |

## Contracts
```http
POST /api/blog/add-comment      { "blog": "<blogId>", "name": "Ann", "content": "Great post" }
201 { "success": true, "message": "Comment added for review" }
400 { "success": false, "message": "Validation failed", "errors": ["Name must be at least 2 characters"] }
429 { "success": false, "message": "Too many comments submitted. Please wait a moment." }

POST /api/blog/comments         { "blogId": "<blogId>" }
200 { "success": true, "count": 2, "comments": [Comment] }
```
`Comment = { _id, blog, name, content, isApproved, createdAt, updatedAt, __v }`

## Edge cases
- **One-character name, or a comment under 5 characters:** the browser's `required` check passes, the server returns `400`, and the client toasts only `Validation failed`, without the specific rule.
- **Sixth submission within a minute from the same IP:** `429`, and the toast shows the rate-limit text.
- **Successful submit:** the list is fetched again but doesn't change, because the new comment is still pending.
- **Whitespace-padded input** (`"  Ann  "`): accepted when the trimmed length qualifies, and stored with the spaces.

## Known gaps
- **No blog check on submission.** `add-comment` doesn't check that the blog exists or is published, and a `blog` that isn't an ObjectId causes a `500` (CastError) instead of a `400`. `POST /comments` doesn't validate `blogId` either; a malformed id also gives a `500`.
- **No maximum lengths.** `name` and `content` have no length cap, and values are stored untrimmed.
- **Per-rule errors are hidden.** The client shows only the generic `message` and drops the `errors` array.
- **No busy state on the form.** `BlogDetail` never passes `loading` to `CommentForm`, so the button never disables during submission and double submits are possible (only the rate limiter catches them).
- **The empty state flashes.** While the list is loading, the page shows `Comments (0)` and `No comments yet. Be the first!`, because `useComments.loading` isn't used.
- **Reading uses POST.** The public list is fetched with `POST /api/blog/comments`, so it can't be cached and isn't RESTful.
- **No pagination.** Every approved comment is returned and rendered.
- **The rate limiter is in memory per process**, so limits reset on restart and aren't shared between instances.

## Related specs
- [../admin/comments-moderation.md](../admin/comments-moderation.md): the approval workflow that makes comments public
- [article-page.md](article-page.md): page layout around the Discussion section
