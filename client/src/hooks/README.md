# Hooks Directory Structure

This directory contains all custom React hooks organized following best practices.

## 📁 Directory Structure

```
hooks/
├── core/              # Core reusable hook abstractions
│   ├── useApiRequest.js   # Generic API request handler
│   ├── useApiQuery.js     # Data fetching with auto-fetch
│   ├── useApiMutation.js  # Data mutations with confirmation
│   └── index.js
├── api/              # API-related hooks
│   ├── queries/      # Data fetching hooks (GET)
│   │   ├── useBlog.js
│   │   ├── useBlogs.js
│   │   ├── useComments.js
│   │   ├── useAdminBlogs.js
│   │   ├── useAdminComments.js
│   │   ├── useAdminDashboard.js
│   │   └── index.js
│   ├── mutations/    # Data modification hooks (POST, PUT, DELETE)
│   │   ├── useCreateBlog.js
│   │   ├── useBlogGenerator.js
│   │   ├── useBlogActions.js
│   │   ├── useCommentActions.js
│   │   └── index.js
│   └── index.js
├── utils/            # Utility hooks
│   ├── useForm.js
│   ├── useDebounce.js
│   └── index.js
└── index.js          # Main export file
```

## 🎯 Core Hooks

### `useApiRequest`
Generic hook for handling any API request with loading, error, and success states.

**Usage:**
```javascript
const { execute, loading, error } = useApiRequest()

const handleAction = async () => {
  const result = await execute(
    () => axios.post('/api/endpoint'),
    {
      successMessage: 'Success!',
      errorMessage: 'Failed',
      onSuccess: (data) => console.log(data)
    }
  )
}
```

### `useApiQuery`
Hook for data fetching that automatically runs on mount. Best for GET requests.

**Usage:**
```javascript
const { data, loading, error, refetch } = useApiQuery(
  () => api.getData(),
  {
    errorMessage: 'Failed to fetch data'
  }
)
```

### `useApiMutation`
Hook for data mutations with optional confirmation dialogs. Best for POST, PUT, DELETE.

**Usage:**
```javascript
const { mutate, loading, error } = useApiMutation()

const deleteItem = async (id) => {
  const result = await mutate(
    () => axios.delete(`/api/items/${id}`),
    {
      confirmMessage: 'Are you sure?',
      successMessage: 'Deleted successfully',
      errorMessage: 'Failed to delete'
    }
  )
}
```

## 📊 API Hooks

### Queries (Data Fetching)

**Pattern:** Used for reading data, automatically fetches on mount.

- `useBlog(id)` - Fetch single blog by ID
- `useBlogs()` - Fetch all published blogs
- `useComments(blogId)` - Fetch comments for a blog
- `useAdminBlogs()` - Fetch all blogs (admin)
- `useAdminComments()` - Fetch all comments (admin)
- `useAdminDashboard()` - Fetch dashboard statistics

**Common Return:**
```javascript
{
  data,      // The fetched data
  loading,   // Loading state
  error,     // Error message
  refetch    // Function to refetch data
}
```

### Mutations (Data Modification)

**Pattern:** Used for creating, updating, or deleting data.

- `useCreateBlog()` - Create a new blog post
- `useBlogGenerator()` - Generate blog content using AI
- `useBlogActions()` - Delete or toggle publish status
- `useCommentActions()` - Approve or delete comments

**Common Return:**
```javascript
{
  mutationFunction,  // The mutation function to call
  loading,          // Loading state (also as isX, e.g., isCreating)
  error,           // Error message
  inProgress       // Alias for loading
}
```

## 🛠️ Utility Hooks

### `useForm`
Comprehensive form state management with validation.

**Usage:**
```javascript
const {
  values,
  errors,
  touched,
  isSubmitting,
  handleChange,
  handleBlur,
  setFieldValue,
  resetForm,
  handleSubmit
} = useForm({ name: '', email: '' })
```

### `useDebounce`
Debounce a value to prevent excessive updates.

**Usage:**
```javascript
const [searchTerm, setSearchTerm] = useState('')
const debouncedSearch = useDebounce(searchTerm, 500)

// Use debouncedSearch for API calls
```

## 📋 Best Practices

### When to Use Core Hooks

1. **useApiQuery** - For any GET request that should fetch on mount
2. **useApiMutation** - For POST/PUT/DELETE that needs confirmation or complex logic
3. **useApiRequest** - For simple one-off requests or when you need more control

### Naming Conventions

- **Queries**: `useSomething` (e.g., `useBlogs`, `useComments`)
- **Mutations**: `useSomethingAction` or `useCreateSomething` (e.g., `useBlogActions`, `useCreateBlog`)
- **Utilities**: `useSomething` (e.g., `useForm`, `useDebounce`)

### Error Handling

All API hooks automatically:
- Show toast notifications on success/error
- Set error state for component-level handling
- Provide consistent error messages from constants

### Loading States

All API hooks provide:
- `loading` - Standard loading state
- `inProgress` - Alias for loading (for better semantics)
- Specific states like `isCreating`, `isDeleting` for mutations

## 🔄 Migration Guide

If you need to create a new API hook:

1. **For data fetching (GET):**
   - Create in `api/queries/`
   - Use `useApiQuery` for simple cases
   - Export from `api/queries/index.js`

2. **For data modification (POST/PUT/DELETE):**
   - Create in `api/mutations/`
   - Use `useApiMutation` for simple cases
   - Export from `api/mutations/index.js`

3. **For utilities:**
   - Create in `utils/`
   - Keep it pure (no API calls)
   - Export from `utils/index.js`

## 💡 Examples

### Creating a New Query Hook

```javascript
// api/queries/useProducts.js
import { useApiQuery } from '../../core'
import { productApi } from '../../../api'

export function useProducts() {
  const { data, loading, error, refetch } = useApiQuery(
    () => productApi.getAll(),
    {
      errorMessage: 'Failed to fetch products'
    }
  )

  return {
    products: data?.products || [],
    loading,
    error,
    refetch
  }
}
```

### Creating a New Mutation Hook

```javascript
// api/mutations/useProductActions.js
import { useApiMutation } from '../../core'
import { useAppContext } from '../../../context/AppContext'

export function useProductActions() {
  const { axios } = useAppContext()
  const { mutate, loading, error } = useApiMutation()

  const deleteProduct = async (id) => {
    return mutate(
      () => axios.delete(`/api/products/${id}`),
      {
        confirmMessage: 'Delete this product?',
        successMessage: 'Product deleted',
        errorMessage: 'Failed to delete product'
      }
    )
  }

  return { deleteProduct, isDeleting: loading, error }
}
```

## 🚀 Benefits

1. **DRY Principle** - Common patterns extracted into reusable hooks
2. **Consistency** - All API hooks behave similarly
3. **Maintainability** - Changes to error handling or loading states in one place
4. **Type Safety** - Clear separation between queries and mutations
5. **Discoverability** - Easy to find hooks by purpose (query vs mutation)
6. **Testing** - Core hooks can be tested once, API hooks are thin wrappers

