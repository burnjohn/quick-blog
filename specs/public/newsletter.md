# Spec: Newsletter signup
**Spec ID:** SPEC-NEWS-2   **Status:** As-built, UI only with no backend (chore/editorial-redesign-docs, 2026-11-20)
**Code:** `client/src/components/forms/NewsletterForm/NewsletterForm.jsx`, `client/src/components/forms/Newsletter/Newsletter.jsx` (alias), `client/src/utils/validators.js` (`validateEmail`), `client/src/pages/public/Home/Home.jsx`

## Summary
A newsletter block near the bottom of the front page asks readers to subscribe by email. It is a front-end stub: the address is checked on the client and a success message appears after a fake one-second delay. No request is sent and nothing is stored.

## Scope / Out of scope
**In scope:** the newsletter block's placement, copy, validation, loading and success behavior.

**Out of scope:** storing subscribers, sending email, unsubscribing, double opt-in. None of these exist on the server.

## User-visible behavior
A full-width light (`bg-surface`) band follows the front-page sections, with a halftone corner. On the left: a small ink label `The newsletter`, the large headline `Never miss a blog!` with `a blog!` highlighted in signal yellow, and the line `Subscribe to get the latest blog, new tech, and exclusive news.` On the right: a dark card with a tilted `Free · weekly` sticker, an `Email address` field, a full-width `Subscribe →` button and the note `One email a week. Unsubscribe any time.`

## Acceptance criteria

### Placement
| ID | Requirement |
|----|-------------|
| AC-NEWS-01 | THE Home page SHALL render the newsletter block inside `main`, after the numbered sections and before the Footer. The article page SHALL NOT render it. |
| AC-NEWS-02 | `Newsletter` SHALL be an alias that renders `NewsletterForm`. |

### Content
| ID | Requirement |
|----|-------------|
| AC-NEWS-03 | THE block SHALL be a `section` with `aria-labelledby="newsletter-title"`, the label `The newsletter`, an `h2#newsletter-title` reading `Never miss a blog!` (with `a blog!` in an `<em>`), and the text `Subscribe to get the latest blog, new tech, and exclusive news.` |
| AC-NEWS-04 | THE form SHALL use `noValidate`. It SHALL contain the label `Email address` tied to `input#newsletter-email` (`type="email"`, `autoComplete="email"`, placeholder `Enter your email id`, `required`), a `Subscribe →` submit button, a `Free · weekly` sticker and the note `One email a week. Unsubscribe any time.` |

### Behavior
| ID | Requirement |
|----|-------------|
| AC-NEWS-05 | IF the submitted email does not match `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` THEN THE SYSTEM SHALL toast `Please enter a valid email address` and stop. |
| AC-NEWS-06 | WHEN the email is valid THE SYSTEM SHALL put the button in its loading state (disabled, text `Loading...`), then after 1000 ms toast `Successfully subscribed to newsletter!`, clear the field and end the loading state. |
| AC-NEWS-07 | THE SYSTEM SHALL NOT make any network request when the form is submitted. |

### Motion & responsive
| ID | Requirement |
|----|-------------|
| AC-NEWS-08 | THE text column and the form card SHALL each appear through `Reveal`, the card one stagger step (0.06 s) later, following the reduced-motion rules in AC-HOME-56/57. |
| AC-NEWS-09 | ON `lg` THE block SHALL split into 7/12 (text) and 5/12 (form) columns, centered vertically; below `lg` they SHALL stack. The headline SHALL be `text-6xl`, and `text-8xl` from `sm` up. |

## Contracts
None. There is no API.

## Edge cases
- **Empty field:** fails the regex and shows the toast; the browser's `required` message is suppressed by `noValidate`.
- **Leading or trailing spaces** (`" a@b.co"`): fail the regex, because the value isn't trimmed.
- **Submitting again within 1 s:** the button is disabled while loading, so it can't happen.

## Known gaps
- **The success message is false.** Subscription is faked with `setTimeout`, so `Successfully subscribed to newsletter!` claims something that didn't happen.
- **The timer is never cleared.** Leaving the page within 1 s causes a state update after unmount.
- **Errors are announced only by toast.** There is no inline error and no `aria-invalid` on the input.
- The email isn't trimmed before validation.
- **The copy promises a schedule.** `Free · weekly` and `One email a week` describe a cadence nothing implements.

## Related specs
- [home-front-page.md](home-front-page.md): page composition and motion rules
