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
refactor(hooks): extract filtering logic to useFilteredBlogs hook
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

### Feature PR

**Title:** `feat(BLOG-68): add category filter for blog posts`

```markdown
## What was done

- Added `CategoryFilter` component with category buttons
- Updated `BlogList.jsx` to filter posts by selected category
- Added category constants in `constants/categories.js`
```

### Bug fix PR

**Title:** `fix(BLOG-42): clear error message on modal close`

```markdown
## What was done

- Fixed error state not resetting when blog form closes in `AddBlog.jsx`
- Removed redundant useEffect causing re-renders in `BlogDetail.jsx`
```

### Refactor PR

**Title:** `refactor: simplify blog API layer`

```markdown
## What was done

- Extracted shared request config to `api/axiosConfig.js`
- Simplified error handling in `blogApi.js`
- Removed unused helper functions from `utils/helpers.js`
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
```
