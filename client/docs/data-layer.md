# Data layer

How the client talks to the API: one Axios instance, thin endpoint wrappers, a few core hooks, one hook per data need, and a small global context.

```
component / page
   └── hooks/api/queries | hooks/api/mutations      (one hook per need)
          └── hooks/core: useApiQuery | useApiMutation | useApiRequest   (loading, error, toasts)
                 └── api/*Api.js or context axios                         (endpoint wrappers)
                        └── api/axiosConfig.js                            (baseURL, auth header, 401)
```

## Axios instance (`client/src/api/axiosConfig.js`)

| Setting | Value |
|---|---|
| `baseURL` | `import.meta.env.VITE_BASE_URL` (`.env`, default `http://localhost:5001`) |
| `withCredentials` | `true` |
| Request interceptor | Reads `localStorage.token` and sets `Authorization: <token>` (raw token, no `Bearer` prefix). Sets `Content-Type: application/json` unless the body is `FormData` (the browser sets the multipart boundary) |
| Response interceptor | On HTTP 401: removes `localStorage.token` and hard-redirects with `window.location.href = '/admin'` |

The same instance is exported as `axios` from `api/index.js` and exposed through `AppContext` (`const { axios } = useAppContext()`).

## Endpoint wrappers (`client/src/api/`)

`api/index.js` exports `axios`, `blogApi`, `commentApi`, `adminApi`. Paths come from `client/src/constants/apiEndpoints.js`.

| Wrapper | Request | Used by |
|---|---|---|
| `blogApi.getAll()` | `GET /api/blog/all` (published posts, oldest first) | `AppContext`, `useBlogs` |
| `blogApi.getById(id)` | `GET /api/blog/:id` | `useBlog` |
| `blogApi.create`, `update`, `delete` | `POST /api/blog`, `PUT/DELETE /api/blog/:id` | Unused |
| `commentApi.getByBlogId(blogId)` | `POST /api/blog/comments` `{ blogId }` | `useComments` |
| `commentApi.add(data)` | `POST /api/blog/add-comment` `{ blog, name, content }` | `useComments` |
| `commentApi.delete`, `approve` | `DELETE /api/comment/:id`, `PUT /api/comment/approve/:id` | Unused |
| `adminApi.login(credentials)` | `POST /api/admin/login` | `Login` |
| `adminApi.getStats`, `getBlogs`, `getComments` | `GET /api/admin/stats`, `/blogs`, `/comments` | Unused |

## Core hooks (`client/src/hooks/core/`)

All three treat a response as successful when `response.data.success` is truthy, take the error message from `err.response.data.message`, then `err.message`, then a fallback, and show `react-hot-toast` messages unless told not to.

### `useApiQuery(apiCall, options)`

Fetches on mount and whenever `dependencies` change.

| Option | Default | Meaning |
|---|---|---|
| `enabled` | `true` | Skip fetching when `false` |
| `dependencies` | `[]` | Extra values that trigger a refetch |
| `onSuccess(data)`, `onError(message)` | — | Callbacks |
| `showErrorToast` | `true` | Toast on failure |
| `errorMessage` | `'Failed to fetch data'` | Fallback message |

Returns `{ data, loading, error, refetch }`. `data` is the whole response body (`response.data`); hooks pick their field from it.

### `useApiMutation({ showToast = true })`

Returns `{ mutate, loading, error, reset, inProgress }`. `mutate(apiCall, config)` resolves to `{ success: true, data }`, `{ success: false, message }`, or `{ success: false, cancelled: true }` when the user dismisses the confirm dialog.

| `config` key | Meaning |
|---|---|
| `confirmMessage` | Ask with `window.confirm` first |
| `successMessage` | Toast text (falls back to `data.message`) |
| `errorMessage` | Fallback error text (default `'Operation failed'`) |
| `showSuccessToast`, `showErrorToast` | Override the hook-level `showToast` |
| `onSuccess(data)` (awaited), `onError(message)` | Callbacks |

### `useApiRequest({ showToast, defaultErrorMessage })`

Same contract as `useApiMutation` without the confirm step; returns `{ execute, loading, error, reset, inProgress }`. Not used by any component today.

## Query hooks (`client/src/hooks/api/queries/`)

| Hook | Request | Returns | Notes |
|---|---|---|---|
| `useBlog(id)` | `blogApi.getById` | `{ blog, loading, error, refetch }` | Own `useEffect`, not `useApiQuery`. Toasts on error |
| `useBlogs()` | `blogApi.getAll` | `{ blogs, loading, error, refetch }` | Not used by pages; Home reads `blogs` from `AppContext` |
| `useComments(blogId)` | `commentApi.getByBlogId` | `{ comments, loading, error, addComment, refetch }` | Own state; `addComment(data)` posts, toasts, refetches, returns `{ success }` |
| `useAdminBlogs()` | `axios.get('/api/admin/blogs')` | `{ blogs, loading, error, refetch }` | |
| `useAdminComments()` | `axios.get('/api/admin/comments')` | `{ comments, loading, error, refetch }` | |
| `useAdminDashboard()` | `axios.get('/api/admin/dashboard')` | `{ dashboardData, loading, error, refetch }` | Defaults to `{ blogs: 0, comments: 0, drafts: 0, blogsThisMonth: 0, publishedThisMonth: 0, recentBlogs: [] }` |

## Mutation hooks (`client/src/hooks/api/mutations/`)

| Hook | Functions | Request | Extra state |
|---|---|---|---|
| `useCreateBlog()` | `createBlog(blogData, imageFile)` | `POST /api/blog/add`, `FormData` with `blog` (JSON string) and `image` | `isCreating`, `inProgress`, `error` |
| `useBlogGenerator()` | `generateContent(prompt)`, `clearContent()` | `POST /api/blog/generate` `{ prompt }`; Markdown response parsed with `marked.parse` | `generatedContent`, `isGenerating`, `inProgress`, `error` |
| `useBlogActions()` | `deleteBlog(id)` (confirm), `togglePublish(id, isPublished)` | `POST /api/blog/delete`, `/api/blog/publish`, `/api/blog/unpublish` with `{ id }` | `isDeleting`, `isToggling`, `inProgress`, `error` |
| `useCommentActions()` | `approveComment(id)`, `deleteComment(id)` (confirm) | `POST /api/admin/approve-comment`, `/api/admin/delete-comment` with `{ id }` | `isApproving`, `isDeleting`, `inProgress`, `error` |

All mutations resolve to the `useApiMutation` result shape, so callers check `result.success` and then call their `refetch` / `onUpdate`.

## Utility hooks (`client/src/hooks/utils/`)

| Hook | API | Used |
|---|---|---|
| `useForm(initialValues)` | `{ values, errors, touched, isSubmitting, handleChange(name, value), handleBlur(name), setFieldValue, setFieldError, resetForm, handleSubmit(onSubmit, validate?) }` | Not used by components |
| `useDebounce(value, delay = 500)` | Returns the value after `delay` ms without changes | Not used by components |

## `AppContext` (`client/src/context/AppContext/AppContext.jsx`)

Provided in `main.jsx` inside `BrowserRouter`. `useAppContext()` throws outside the provider.

| Value | Meaning |
|---|---|
| `token`, `setToken` | Admin JWT; initialized from `localStorage.token` on mount. `App.jsx` switches `/admin` between `Layout` and `Login` on it |
| `blogs`, `setBlogs`, `fetchBlogs` | Published posts from `blogApi.getAll()`, fetched once on mount (toasts on failure) |
| `input`, `setInput` | Front-page search term (set by `SearchBar`, read by `Home` and `BlogList`) |
| `axios` | The configured Axios instance |
| `navigate` | `useNavigate()` from React Router |

## Constants

| File | Contents |
|---|---|
| `constants/apiEndpoints.js` | `API_ENDPOINTS` paths (blog, comment, admin) |
| `constants/messages.js` | `MESSAGES.SUCCESS_*`, `ERROR_*`, `VALIDATION_*`, `INFO_*` toast and UI strings |
| `constants/routes.js` | `ROUTES`, `getBlogDetailPath(id)` |
| `constants/categories.js` | `BLOG_CATEGORIES = ['All', 'Technology', 'Startup', 'Lifestyle', 'Finance']` |

## Adding a hook

1. **Read** → `hooks/api/queries/useThing/useThing.js` + `index.js`, built on `useApiQuery`; export it from `hooks/api/queries/index.js`.
2. **Write** → `hooks/api/mutations/useThingActions/…` built on `useApiMutation`; export from `hooks/api/mutations/index.js`.
3. **Pure helper hook** → `hooks/utils/`, no API calls.
4. Add the path to `constants/apiEndpoints.js` and a wrapper in `api/` instead of an inline string.
5. Name queries `useThing` / `useThings`, mutations `useCreateThing` or `useThingActions`. Expose specific busy flags (`isCreating`, `isDeleting`) and `inProgress`.
6. Return a named field with a safe default (`data?.things || []`), never the raw response.

```js
// hooks/api/queries/useThings/useThings.js
import { useApiQuery } from '../../../core'
import { thingApi } from '../../../../api'
import { MESSAGES } from '../../../../constants/messages'

export function useThings({ limit = 10 } = {}) {
  const { data, loading, error, refetch } = useApiQuery(
    () => thingApi.getAll({ limit }),
    { dependencies: [limit], errorMessage: MESSAGES.ERROR_GENERIC }
  )
  return { things: data?.things || [], loading, error, refetch }
}
```

```js
// hooks/api/mutations/useThingActions/useThingActions.js
import { useApiMutation } from '../../../core'
import { thingApi } from '../../../../api'

export function useThingActions() {
  const { mutate, loading, error } = useApiMutation()
  const deleteThing = (id) => mutate(() => thingApi.delete(id), {
    confirmMessage: 'Delete this thing?',
    successMessage: 'Deleted'
  })
  return { deleteThing, isDeleting: loading, inProgress: loading, error }
}
```

Hooks import `useAppContext` only when they need `axios` from context; prefer the `api/` wrappers.

## Known gaps

- **Endpoint drift.** Admin and mutation hooks call inline paths through the context `axios` (`/api/admin/dashboard`, `/api/blog/add`, `/api/blog/delete`, `/api/blog/publish`, `/api/admin/approve-comment`, …) instead of `API_ENDPOINTS` + `api/` wrappers. Meanwhile `blogApi.create/update/delete`, `commentApi.delete/approve` and `adminApi.getStats/getBlogs/getComments` point at paths the server does not define (`server/src/routes/*.js`) and are unused.
- **`useBlogGenerator` stale value.** `generateContent` returns `generatedContent` from the render in which it was called; `setGeneratedContent` inside `onSuccess` does not update that variable. The first generation returns `content: null` (Add Blog then clears the editor), later ones return the previous draft. The test only checks that a `content` key exists.
- **Debug logging.** `useCreateBlog` logs the payload and every `FormData` entry with `console.log`; `AddBlog` logs the form too.
- **Inconsistent query hooks.** `useBlog` and `useComments` re-implement fetching instead of using `useApiQuery`; `useBlogs`, `useApiRequest`, `useForm` and `useDebounce` are not used by any component.
- **`useApiQuery` refetch closure.** The fetch callback depends on `apiCall`, which callers pass as a new inline function each render, so `refetch` identity changes every render.
- **Direct API calls from components.** `components/admin/auth/Login/Login.jsx` calls `adminApi` directly, bypassing the hooks layer.
- **401 handling** does a full page reload to `/admin` and does not clear `token` in React state first.
