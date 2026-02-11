# React Best Practices — Code Examples

Good/bad patterns for each rule in [SKILL.md](SKILL.md).

---

## Derive, Don't Store

```jsx
// BAD: Storing derived state
const [fullName, setFullName] = useState('');
useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);

// GOOD: Compute during render
const fullName = `${firstName} ${lastName}`;
```

```jsx
// BAD: Filtering in useEffect
const [filteredBlogs, setFilteredBlogs] = useState(blogs);
useEffect(() => {
  setFilteredBlogs(blogs.filter(b => b.category === selected));
}, [blogs, selected]);

// GOOD: Compute (memoize only if expensive)
const filteredBlogs = useMemo(
  () => blogs.filter(b => b.category === selected),
  [blogs, selected],
);
```

---

## Memoization

```jsx
// BAD: Over-memoizing trivial operations
const greeting = useMemo(() => `Hello, ${name}!`, [name]);
const handleClick = useCallback(() => setOpen(true), []);

// GOOD: Only memoize expensive operations
const sortedBlogs = useMemo(
  () => [...blogs].sort((a, b) => new Date(b.date) - new Date(a.date)),
  [blogs],
);
```

---

## Render Factories

```jsx
// BAD: Render factory (camelCase, called as function)
const renderBlogCard = (blog) => {
  return <div className="p-4">{blog.title}</div>;
};
return <div>{renderBlogCard(blog)}</div>;

// GOOD: Proper React component (PascalCase, used as JSX)
const BlogCard = ({ blog }) => {
  return <div className="p-4">{blog.title}</div>;
};
return <div><BlogCard blog={blog} /></div>;
```

---

## Inline Creation in JSX

```jsx
// BAD: New array on every render
<CategoryFilter categories={['Tech', 'Startup', 'Lifestyle']} />

// GOOD: Stable reference (module-level constant)
const CATEGORIES = ['Tech', 'Startup', 'Lifestyle'];
<CategoryFilter categories={CATEGORIES} />
```

```jsx
// BAD: Inline style object on every render
<div style={{ padding: '16px', background: '#fff' }}>

// GOOD: Use Tailwind utility classes
<div className="p-4 bg-white">
```

---

## Container / Presenter Split

```jsx
// BAD: Mixed data fetching and rendering
const BlogList = () => {
  const { data, loading, error } = useBlogs();
  if (loading) return <Loader />;
  if (error) return <p>Error loading blogs</p>;
  // ... 150 lines of rendering logic
};

// GOOD: Container fetches, presenter renders
const BlogListContainer = () => {
  const { data, loading, error } = useBlogs();
  if (loading) return <Loader />;
  if (error) return <p>Error loading blogs</p>;
  if (!data?.blogs?.length) return <p>No blogs found</p>;
  return <BlogGrid blogs={data.blogs} />;
};

const BlogGrid = ({ blogs }) => {
  // Pure rendering — no data fetching, no effects
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {blogs.map(blog => <BlogCard key={blog._id} blog={blog} />)}
    </div>
  );
};
```

---

## State Colocation

```jsx
// BAD: State lifted too high — parent re-renders everything
const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <>
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      <BlogList /> {/* re-renders on every keystroke */}
      <Newsletter />
    </>
  );
};

// GOOD: State pushed down to where it's used
const Home = () => (
  <>
    <SearchSection /> {/* owns its own search state */}
    <BlogList />
    <Newsletter />
  </>
);

const SearchSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedTerm = useDebounce(searchTerm, 300);
  return <SearchBar value={searchTerm} onChange={setSearchTerm} />;
};
```

---

## Data Fetching in Custom Hooks

```jsx
// BAD: Fetching directly in component
const BlogDetail = ({ id }) => {
  const [blog, setBlog] = useState(null);
  useEffect(() => {
    blogApi.getBlog(id).then(res => setBlog(res.data));
  }, [id]);
  // ...
};

// GOOD: Use a custom hook
const BlogDetail = ({ id }) => {
  const { data, loading, error } = useBlog(id);
  if (loading) return <Loader />;
  if (error) return <p>Error</p>;
  return <BlogContent blog={data.blog} />;
};
```

---

## useEffect Misuse

```jsx
// BAD: useEffect for event handling
const handleSubmit = () => {
  setSubmitted(true);
};
useEffect(() => {
  if (submitted) {
    api.createBlog(formData);
    setSubmitted(false);
  }
}, [submitted]);

// GOOD: Logic in the event handler
const handleSubmit = async () => {
  await api.createBlog(formData);
  toast.success('Blog created!');
  navigate('/admin/blogs');
};
```

---

## Early Returns for States

```jsx
// BAD: Nested ternaries
return loading ? <Loader /> : error ? <Error /> : data ? <Content data={data} /> : <Empty />;

// GOOD: Early returns
if (loading) return <Loader />;
if (error) return <p className="text-red-500">Something went wrong</p>;
if (!data?.blogs?.length) return <p>No blogs yet</p>;
return <BlogGrid blogs={data.blogs} />;
```

---

## Error Boundaries

```jsx
import { ErrorBoundary } from 'react-error-boundary';
import { useLocation } from 'react-router-dom';

// BAD: No error boundary — unhandled errors crash the whole app
const App = () => <Routes>...</Routes>;

// GOOD: Error boundary with route-aware reset and recovery
const ErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="p-8 text-center">
    <p className="text-red-500">Something went wrong</p>
    <button onClick={resetErrorBoundary} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
      Try again
    </button>
  </div>
);

const App = () => {
  const location = useLocation();
  return (
    <ErrorBoundary resetKeys={[location.pathname]} FallbackComponent={ErrorFallback}>
      <Routes>...</Routes>
    </ErrorBoundary>
  );
};
```

---

## Key Prop Patterns

```jsx
// BAD: Index as key — causes state bugs when list changes
{blogs.map((blog, index) => <BlogCard key={index} blog={blog} />)}

// GOOD: Stable unique ID as key
{blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}

// BAD: Random key — forces full remount every render
{blogs.map((blog) => <BlogCard key={Math.random()} blog={blog} />)}

// GOOD: Key on Fragment when mapping fragments
{items.map((item) => (
  <React.Fragment key={item.id}>
    <dt>{item.label}</dt>
    <dd>{item.value}</dd>
  </React.Fragment>
))}
```

---

## Conditional Rendering Gotcha

```jsx
// BAD: Renders literal "0" when count is 0
{count && <Badge>{count}</Badge>}

// GOOD: Explicit comparison
{count > 0 && <Badge>{count}</Badge>}

// GOOD: Ternary for clarity
{count ? <Badge>{count}</Badge> : null}
```

---

## Accessibility

```jsx
// BAD: Icon button without label — invisible to screen readers
<button onClick={onDelete}><TrashIcon /></button>

// GOOD: Accessible icon button
<button onClick={onDelete} aria-label="Delete blog post"><TrashIcon /></button>

// BAD: Error not associated with field
<input type="email" />
{error && <span className="text-red-500">{error}</span>}

// GOOD: Error linked to field
<input type="email" aria-invalid={!!error} aria-describedby="email-error" />
{error && <span id="email-error" className="text-red-500">{error}</span>}

// GOOD: Live region for dynamic updates
<div aria-live="polite">{searchResults.length} results found</div>
```

---

## Route-Level Code Splitting

```jsx
import { lazy, Suspense } from 'react';

// BAD: All pages in main bundle
import AdminDashboard from './pages/admin/Dashboard';
import AddBlog from './pages/admin/AddBlog';

// GOOD: Lazy-loaded routes
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AddBlog = lazy(() => import('./pages/admin/AddBlog'));

const App = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/add" element={<AddBlog />} />
    </Routes>
  </Suspense>
);
```

---

## Axios Request Cancellation

```jsx
// BAD: No cleanup — stale responses update unmounted component
useEffect(() => {
  axios.get('/api/blogs').then(res => setBlogs(res.data));
}, []);

// GOOD: Cancel on cleanup with AbortController
useEffect(() => {
  const controller = new AbortController();
  axios.get('/api/blogs', { signal: controller.signal })
    .then(res => setBlogs(res.data.blogs))
    .catch(err => {
      if (!axios.isCancel(err)) setError(err.message);
    });
  return () => controller.abort();
}, []);
```

---

## React 19: ref as Prop

```jsx
// OLD (React 18): forwardRef boilerplate
const Input = forwardRef((props, ref) => (
  <input ref={ref} {...props} />
));

// NEW (React 19): ref as a regular prop
const Input = ({ ref, ...props }) => (
  <input ref={ref} {...props} />
);
```
