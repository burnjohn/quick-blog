# Git Workflow Examples

Complete examples for commits, PRs, and branches.

## Commit Messages

### Single feature
```
feat(BLOG-68): add category filter for blog posts
```

### Bug fix
```
fix(BLOG-42): clear error message on modal close
```

### Refactor with context
```
refactor(BLOG-100): extract filtering logic to useFilteredBlogs hook
```

### Multiple files changed, single concern
```
feat(BLOG-200): add empty state for blog list
```
Not:
```
feat(BLOG-200): add empty state component, update styles, add api call
```

### Test addition
```
test: add unit tests for blog validation helpers
```

### Chore / dependencies
```
chore: upgrade react-router-dom to v7.6
```

### What NOT to do
```
# BAD: multi-line with bullet points
feat(BLOG-68): add category filter

- Added CategoryFilter component
- Updated BlogList component
- Added new constants

# BAD: past tense
feat(BLOG-68): added category filter

# BAD: trailing period
feat(BLOG-68): add category filter.

# BAD: too vague
fix(BLOG-42): fix bug
```

---

## Pull Request Descriptions

### Feature PR (simple)

**Title:** `feat(BLOG-68): add category filter for blog posts`

```markdown
## What was done

- Added `CategoryFilter` component with category buttons in `components/blog/`
- Updated `BlogList.jsx` to filter posts by selected category
- Added category constants in `constants/categories.js`
- Updated `Home.jsx` to pass filter state to BlogList

**Logic:** +127 −12

## Ticket

BLOG-68
```

### Feature PR with tests

**Title:** `feat(BLOG-200): add empty state for blog list`

```markdown
## What was done

- Added `EmptyState` component with illustration and CTA button
- Updated `BlogList.jsx` to render `EmptyState` when no posts match filter
- Added empty state styles to `blog.css`

**Logic:** +135 −8 | **Tests:** +68 −0

## Tests

`EmptyState.test.jsx` (4 tests):
- Renders empty message and CTA button
- Navigates to create page on CTA click

`BlogList.test.jsx` (2 tests):
- Shows empty state when posts array is empty
- Shows empty state when filter matches no posts

## Ticket

BLOG-200
```

### Feature PR with design rationale

**Title:** `feat(BLOG-150): add AI content generation for blog posts`

```markdown
## What was done

- Added `GenerateButton` component in `components/blog/GenerateButton.jsx`
- Created `useGenerateContent` hook for Gemini API integration
- Updated `AddBlog.jsx` to include generation UI in the form
- Added generation endpoint in `apiEndpoints.js`

**Logic:** +189 −14

**Why server-side proxy over direct Gemini API call:**

- **Direct client call** — exposes API key in browser, blocked by CORS
- **Serverless function** — adds deployment complexity for a simple proxy
- **Express endpoint proxy** — keeps API key on server, reuses existing auth middleware, minimal code

## Ticket

BLOG-150
```

### Bug fix PR

**Title:** `fix(BLOG-42): clear error message on modal close`

```markdown
## What was done

- Fixed error state not resetting when blog form closes in `AddBlog.jsx`
- Removed redundant useEffect causing re-renders in `BlogDetail.jsx`

**Logic:** +6 −11

## Ticket

BLOG-42
```

### Refactor PR

**Title:** `refactor: simplify blog API layer`

```markdown
## What was done

- Extracted shared request config to `api/axiosConfig.js`
- Simplified error handling in `blogApi.js`
- Removed unused helper functions from `utils/helpers.js`

**Logic:** +45 −89
```

### What NOT to do in PR descriptions

```markdown
# BAD: too vague
## What was done
- Updated components
- Fixed some bugs

# BAD: obvious/filler bullets
## What was done
- Updated imports
- Fixed linting errors
- Ran prettier

# BAD: more than 7 bullets
## What was done
- Changed line 42 in BlogCard.jsx
- Changed line 55 in BlogCard.jsx
- Changed line 12 in CommentItem.jsx
- ...etc

# BAD: including alternatives without asking the user
## What was done
- Added caching layer
**Why Redis over in-memory cache:**
- ...
(should have asked the user if they want this section)
```

---

## Branch Names

### Feature with ticket
```
feature/BLOG-68/category-filter
feat/BLOG-200/empty-state
```

### Bug fix with ticket
```
fix/BLOG-42/modal-error-clear
```

### Without ticket
```
docs/update-readme
chore/upgrade-dependencies
test/add-hook-tests
refactor/simplify-api-layer
```

---

## Complete Workflow Example

Branch: `feature/BLOG-68/category-filter`

**Commits on the branch:**
```
feat(BLOG-68): add CategoryFilter component
feat(BLOG-68): integrate filter with BlogList
feat(BLOG-68): add category constants
```

**PR:**

Title: `feat(BLOG-68): add category filter for blog posts`

```markdown
## What was done

- Added `CategoryFilter` component with clickable category buttons
- Updated `BlogList.jsx` to filter displayed posts by category
- Added category definitions in `constants/categories.js`
- Updated `Home.jsx` to pass filter state to BlogList

**Logic:** +127 −12

## Ticket

BLOG-68
```
