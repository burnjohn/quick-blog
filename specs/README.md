# Specs index

Feature specifications with EARS acceptance criteria. Format and rules:
[AGENTS.md](AGENTS.md). "As-built" specs were verified against the code on 2026-11-20.

## Public site — `public/`

| Spec | ID | ACs | Status |
|------|----|-----|--------|
| [Home front page](public/home-front-page.md) — cover, latest, search & filters, gallery, desks, editor's picks, archive | SPEC-HOME-1 | AC-HOME-01…60 | As-built |
| [Article page](public/article-page.md) — header, body, "In this story", share, read next, not found | SPEC-ART-1 | AC-ART-01…34 | As-built |
| [Comments](public/comments.md) — submit and list on the article page | SPEC-CMT-2 | AC-CMT-01…22 | As-built |
| [Newsletter](public/newsletter.md) | SPEC-NEWS-2 | AC-NEWS-01…09 | As-built (UI-only stub) |

## Editor's desk — `admin/`

| Spec | ID | ACs | Status |
|------|----|-----|--------|
| [Authentication](admin/auth.md) | SPEC-AUTH-2 | AC-AUTH-01…30 | As-built |
| [Shell and navigation](admin/shell-and-navigation.md) | SPEC-SHELL-1 | AC-SHELL-01…26 | As-built |
| [Dashboard](admin/dashboard.md) | SPEC-DASH-2 | AC-DASH-01…29 | As-built |
| [Blog authoring](admin/blog-authoring.md) — Add Blog, cover upload, AI draft | SPEC-AUTHOR-1 | AC-AUTHOR-01…37 | As-built |
| [Blog list](admin/blog-list.md) — publish/unpublish, delete | SPEC-LIST-1 | AC-LIST-01…24 | As-built |
| [Comments moderation](admin/comments-moderation.md) | SPEC-MOD-1 | AC-MOD-01…25 | As-built |

## Cross-cutting known gaps

The most severe defects found while writing these specs. Each one is detailed in the
**Known gaps** section of the linked spec. They are not requirements.

| Gap | Where |
|-----|-------|
| No role checks on the server: the `author` account can call every admin endpoint | [admin/auth.md](admin/auth.md) |
| Unpublished drafts are readable by anyone via `GET /api/blog/:id` | [public/article-page.md](public/article-page.md) |
| Article HTML is stored and rendered unsanitized (`dangerouslySetInnerHTML`) | [public/article-page.md](public/article-page.md), [admin/blog-authoring.md](admin/blog-authoring.md) |
| Malformed ids return `500` with the Mongoose message (and the stack trace in dev) | [public/article-page.md](public/article-page.md) |
| "AI draft" returns a stale value: the first click clears the editor | [admin/blog-authoring.md](admin/blog-authoring.md) |
| A failed login triggers the global 401 handler, which reloads the page | [admin/auth.md](admin/auth.md) |
| Share buttons (except Copy link), footer links and the newsletter are stubs | [public/article-page.md](public/article-page.md), [public/home-front-page.md](public/home-front-page.md), [public/newsletter.md](public/newsletter.md) |
| Migrations cannot run (`utils/dbLogger.js` is missing) | [`server/docs/data-model.md`](../server/docs/data-model.md) |
