# AGENTS.md — specs/

Feature specifications for QuickBlog. One file per feature, written in EARS
(Easy Approach to Requirements Syntax). Specs describe **what** the system does and are
the contract that reviewers check code against; implementation notes belong in
`client/docs/` and `server/docs/`.

## Layout

| Folder | Covers |
|--------|--------|
| `public/` | Reader-facing site: front page, article page, comments, newsletter |
| `admin/` | Editor's desk: auth, shell/navigation, dashboard, authoring, blog list, moderation |

Index with statuses: [README.md](README.md).

## Spec template

```markdown
# Spec: <Feature>
**Spec ID:** SPEC-<AREA>-<n>   **Status:** Draft | Approved | As-built (<branch>, <date>) | Pending — ships with <PR>
**Code:** <paths the spec governs>

## Summary            2–4 sentences: what and why
## Scope / Out of scope
## User-visible behavior
## Acceptance criteria   tables `| ID | Requirement |`, grouped by Server / Data / UI / Accessibility & motion / Responsive
## Contracts          endpoints with request/response shapes
## Edge cases
## Known gaps         defects observed in code — NOT requirements
## Related specs
```

## Rules

- **EARS phrasing:** `THE SYSTEM SHALL …`, `WHEN <trigger> THE SYSTEM SHALL …`,
  `WHILE <state> …`, `IF <unwanted condition> THEN …`. One testable behavior per row.
- **Stable IDs:** `AC-<AREA>-NN`. Never renumber or reuse an ID; mark removed criteria
  `~~AC-…~~ (removed <date>: reason)`.
- **Verifiable:** quote exact UI copy, limits and status codes. No "fast", "nice",
  "user-friendly".
- **Status meaning:** *As-built* = verified against the code on the named branch;
  *Approved* = target behavior not yet fully implemented (include a conformance column);
  *Draft* = under discussion.
- **Known gaps are not requirements.** When you fix one, move it into the AC table (or
  delete it if the AC already covers it).
- **Changing behavior?** Update the spec's ACs in the same PR and reference the IDs in the
  PR description (`Spec: specs/<area>/<file>.md — AC-…`).
- New feature → new file in the right folder + a row in `README.md`.
