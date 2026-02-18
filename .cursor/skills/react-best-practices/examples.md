# React Best Practices — Code Examples

Companion to [SKILL.md](SKILL.md). Organized by section.

---

## Component Design

### Good: Small, focused components with composition

```tsx
interface UserCardProps {
  name: string;
  email: string;
  avatar: string;
  actions?: React.ReactNode;
}

export function UserCard({ name, email, avatar, actions }: UserCardProps) {
  return (
    <article className="user-card">
      <img src={avatar} alt="" />
      <div>
        <h3>{name}</h3>
        <p>{email}</p>
      </div>
      {actions && <div className="user-card__actions">{actions}</div>}
    </article>
  );
}
```

### Bad: Component defined inside another component

```tsx
function ParentPage() {
  // WRONG — ChildItem re-mounts on every render, losing state
  function ChildItem({ label }: { label: string }) {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(c => c + 1)}>{label}: {count}</button>;
  }

  return <ChildItem label="Clicks" />;
}
```

### Good: Compound component pattern

```tsx
const TabsContext = createContext<{ active: string; setActive: (id: string) => void } | null>(null);

function Tabs({ defaultTab, children }: { defaultTab: string; children: React.ReactNode }) {
  const [active, setActive] = useState(defaultTab);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div role="tablist">{children}</div>
    </TabsContext.Provider>
  );
}

function Tab({ id, children }: { id: string; children: React.ReactNode }) {
  const ctx = use(TabsContext);
  if (!ctx) throw new Error('Tab must be used within Tabs');
  return (
    <button role="tab" aria-selected={ctx.active === id} onClick={() => ctx.setActive(id)}>
      {children}
    </button>
  );
}

function TabPanel({ id, children }: { id: string; children: React.ReactNode }) {
  const ctx = use(TabsContext);
  if (!ctx) throw new Error('TabPanel must be used within Tabs');
  if (ctx.active !== id) return null;
  return <div role="tabpanel">{children}</div>;
}

Tabs.Tab = Tab;
Tabs.Panel = TabPanel;
export { Tabs };

// Usage:
<Tabs defaultTab="settings">
  <Tabs.Tab id="profile">Profile</Tabs.Tab>
  <Tabs.Tab id="settings">Settings</Tabs.Tab>
  <Tabs.Panel id="profile"><ProfileForm /></Tabs.Panel>
  <Tabs.Panel id="settings"><SettingsForm /></Tabs.Panel>
</Tabs>
```

---

## React 19 Features

### Good: useActionState for form submission

```jsx
import { useActionState } from 'react';
import { createComment } from '@/api/commentApi';

function CommentForm({ blogId }) {
  const [error, submitAction, isPending] = useActionState(
    async (_prevState, formData) => {
      const result = await createComment({
        blogId,
        name: formData.get('name'),
        content: formData.get('content'),
      });
      if (result.error) return result.error;
      return null;
    },
    null,
  );

  return (
    <form action={submitAction}>
      <input name="name" placeholder="Your name" required />
      <textarea name="content" placeholder="Your comment" required />
      <SubmitButton />
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
```

### Good: useFormStatus for child submit button

```jsx
import { useFormStatus } from 'react-dom';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : 'Submit'}
    </button>
  );
}
```

### Good: useOptimistic for instant feedback

```jsx
import { useOptimistic } from 'react';

function CommentList({ comments, onDelete }) {
  const [optimisticComments, removeOptimistic] = useOptimistic(
    comments,
    (state, removedId) => state.filter(c => c.id !== removedId),
  );

  const handleDelete = async (id) => {
    removeOptimistic(id);
    await onDelete(id);
  };

  return (
    <ul>
      {optimisticComments.map(c => (
        <li key={c.id}>
          {c.content}
          <button onClick={() => handleDelete(c.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
```

### Good: use(Context) — replaces useContext, can be conditional

```jsx
import { use, createContext } from 'react';

const ThemeContext = createContext('light');

function ThemedIcon({ showIcon }) {
  if (!showIcon) return null;

  const theme = use(ThemeContext);
  return <Icon color={theme === 'dark' ? 'white' : 'black'} />;
}
```

### Good: ref as a regular prop (no forwardRef)

```jsx
// React 19 — forwardRef is no longer needed
function Input({ ref, label, ...props }) {
  return (
    <div>
      <label>{label}</label>
      <input ref={ref} {...props} />
    </div>
  );
}

// Usage
function SearchForm() {
  const inputRef = useRef(null);
  return <Input ref={inputRef} label="Search" />;
}
```

### Good: Context as a provider (no .Provider)

```jsx
const ThemeContext = createContext('light');

// React 19 — use <Context> directly instead of <Context.Provider>
function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext value={theme}>
      <Main />
    </ThemeContext>
  );
}
```

---

## Hooks

### Bad: Derived state in useEffect

```tsx
function FilteredList({ items, query }: { items: string[]; query: string }) {
  const [filtered, setFiltered] = useState(items);

  // WRONG — extra render, stale UI flash, unnecessary complexity
  useEffect(() => {
    setFiltered(items.filter(item => item.includes(query)));
  }, [items, query]);

  return <ul>{filtered.map(item => <li key={item}>{item}</li>)}</ul>;
}
```

### Good: Derive during render

```tsx
function FilteredList({ items, query }: { items: string[]; query: string }) {
  const filtered = items.filter(item => item.includes(query));
  return <ul>{filtered.map(item => <li key={item}>{item}</li>)}</ul>;
}
```

### Good: useMemo for expensive computation

```tsx
function Analytics({ transactions }: { transactions: Transaction[] }) {
  const summary = useMemo(() => {
    return transactions.reduce((acc, t) => ({
      total: acc.total + t.amount,
      count: acc.count + 1,
      average: (acc.total + t.amount) / (acc.count + 1),
    }), { total: 0, count: 0, average: 0 });
  }, [transactions]);

  return <StatsCard {...summary} />;
}
```

### Good: useEffect with proper cleanup

```tsx
function useWebSocket(url: string) {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const ws = new WebSocket(url);
    ws.onmessage = (event) => setMessages(prev => [...prev, event.data]);

    return () => ws.close();
  }, [url]);

  return messages;
}
```

### Bad: useEffect to reset state when prop changes

```jsx
function EditForm({ itemId }) {
  const [title, setTitle] = useState('');

  // WRONG — extra render, stale state flash
  useEffect(() => {
    setTitle('');
  }, [itemId]);

  return <input value={title} onChange={e => setTitle(e.target.value)} />;
}
```

### Good: Use key to reset component state

```jsx
// Parent resets EditForm's entire state by changing its key
function ItemPage({ itemId }) {
  return <EditForm key={itemId} itemId={itemId} />;
}

function EditForm({ itemId }) {
  const [title, setTitle] = useState('');
  return <input value={title} onChange={e => setTitle(e.target.value)} />;
}
```

### Bad: useEffect to send analytics on user action

```jsx
function BuyButton({ productId }) {
  const [bought, setBought] = useState(false);

  // WRONG — analytics belongs in the event handler, not an effect
  useEffect(() => {
    if (bought) {
      sendAnalytics('purchase', productId);
    }
  }, [bought, productId]);

  return <button onClick={() => setBought(true)}>Buy</button>;
}
```

### Good: Analytics in the event handler

```jsx
function BuyButton({ productId }) {
  const handleBuy = () => {
    sendAnalytics('purchase', productId);
    submitPurchase(productId);
  };

  return <button onClick={handleBuy}>Buy</button>;
}
```

### Bad: Conditional hook call

```jsx
function Profile({ userId }) {
  // WRONG — breaks Rules of Hooks
  if (!userId) return <p>No user</p>;
  const [user, setUser] = useState(null);
  // ...
}
```

### Good: Unconditional hooks, conditional render

```jsx
function Profile({ userId }) {
  const [user, setUser] = useState(null);

  if (!userId) return <p>No user</p>;
  // ...
}
```

---

## Custom Hooks

### Good: Focused custom hook with typed output

```tsx
interface UseDebounceResult<T> {
  debouncedValue: T;
}

function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}

// Usage:
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  // fetch with debouncedQuery...
}
```

### Good: useLocalStorage hook

```tsx
function useLocalStorage<T>(key: string, initialValue: T) {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStored(prev => {
      const next = value instanceof Function ? value(prev) : value;
      window.localStorage.setItem(key, JSON.stringify(next));
      return next;
    });
  }, [key]);

  return [stored, setValue] as const;
}
```

---

## State Management

### Bad: Single giant context with unrelated concerns

```jsx
// WRONG — every consumer re-renders on ANY state change
// Mixing auth, data, UI state, and navigation in one context
const AppContext = createContext({
  token: null,
  blogs: [],
  input: '',
  setToken: () => {},
  setBlogs: () => {},
  setInput: () => {},
  navigate: () => {},
  fetchBlogs: () => {},
});
```

### Good: Split contexts by domain

```jsx
const AuthContext = createContext(null);
const ThemeContext = createContext({ mode: 'light' });

// Server data (blogs) belongs in TanStack Query, not Context
// Navigation belongs where it's used (useNavigate), not in Context
```

### Good: Memoize context values

```jsx
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const value = useMemo(() => ({ user, setUser }), [user]);

  // React 19: <AuthContext value={...}> instead of <AuthContext.Provider value={...}>
  return <AuthContext value={value}>{children}</AuthContext>;
}
```

### Good: Zustand store

```tsx
import { create } from 'zustand';

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  total: () => number;
}

const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
  total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
}));

// Usage — only subscribes to what it needs
function CartBadge() {
  const count = useCartStore((s) => s.items.length);
  return <span>{count}</span>;
}
```

---

## Data Fetching

### Bad: useEffect + useState fetch

```tsx
function UserProfile({ id }: { id: string }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // WRONG — no caching, no dedup, no cancellation, race conditions
  useEffect(() => {
    setLoading(true);
    fetch(`/api/users/${id}`)
      .then(res => res.json())
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage />;
  return <div>{user.name}</div>;
}
```

### Good: TanStack Query

```tsx
import { useQuery } from '@tanstack/react-query';
import { userKeys, fetchUser } from '@/api/users';

function UserProfile({ id }: { id: string }) {
  const { data: user, isPending, error } = useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUser(id),
  });

  if (isPending) return <Spinner />;
  if (error) return <ErrorMessage error={error} />;
  return <div>{user.name}</div>;
}
```

### Good: Query key factory

```tsx
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};
```

### Good: useSuspenseQuery with Suspense boundary

```tsx
import { useSuspenseQuery } from '@tanstack/react-query';

function UserProfile({ id }: { id: string }) {
  const { data: user } = useSuspenseQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => fetchUser(id),
  });

  // data is guaranteed to be defined — no loading/error checks needed
  return <div>{user.name}</div>;
}

// Parent wraps in Suspense + ErrorBoundary
<ErrorBoundary fallback={<ErrorMessage />}>
  <Suspense fallback={<Spinner />}>
    <UserProfile id={userId} />
  </Suspense>
</ErrorBoundary>
```

### Bad: Custom fetch hook with race condition

```jsx
function useBlog(id) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // WRONG — no cancellation, race condition if id changes quickly
  useEffect(() => {
    setLoading(true);
    axios.get(`/api/blogs/${id}`)
      .then(res => {
        setBlog(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  return { blog, loading };
}
```

### Good: Custom fetch hook with AbortController

```jsx
function useBlog(id) {
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    axios.get(`/api/blogs/${id}`, { signal: controller.signal })
      .then(res => {
        setBlog(res.data);
        setLoading(false);
      })
      .catch(err => {
        if (!controller.signal.aborted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [id]);

  return { blog, loading, error };
}
```

### Good: Prefetching on hover

```tsx
function UserLink({ id, name }: { id: string; name: string }) {
  const queryClient = useQueryClient();

  const prefetch = () => {
    queryClient.prefetchQuery({
      queryKey: userKeys.detail(id),
      queryFn: () => fetchUser(id),
      staleTime: 5 * 60 * 1000,
    });
  };

  return <Link to={`/users/${id}`} onMouseEnter={prefetch}>{name}</Link>;
}
```

---

## Performance

### Good: Route-based code splitting

```jsx
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const BlogEditor = lazy(() => import('./pages/BlogEditor'));

function AppRoutes() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/editor/:id" element={<BlogEditor />} />
      </Routes>
    </Suspense>
  );
}
```

### Good: Revoking object URLs to prevent memory leaks

```jsx
function ImagePreview({ file }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  return previewUrl ? <img src={previewUrl} alt="Preview" /> : null;
}
```

### Good: Virtualized list

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualList({ items }: { items: string[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
  });

  return (
    <div ref={parentRef} style={{ height: 400, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((row) => (
          <div key={row.key} style={{ height: row.size, transform: `translateY(${row.start}px)` }}>
            {items[row.index]}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Forms

### Good: React Hook Form + Zod

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const blogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10),
  category: z.enum(['tech', 'lifestyle', 'travel']),
});

type BlogFormData = z.infer<typeof blogSchema>;

function BlogForm({ onSubmit }: { onSubmit: (data: BlogFormData) => Promise<void> }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label htmlFor="title">Title</label>
        <input id="title" {...register('title')} aria-invalid={!!errors.title} aria-describedby={errors.title ? 'title-error' : undefined} />
        {errors.title && <p id="title-error" role="alert">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="content">Content</label>
        <textarea id="content" {...register('content')} />
        {errors.content && <p role="alert">{errors.content.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Publish'}
      </button>
    </form>
  );
}
```

---

## Error Handling

### Good: react-error-boundary with reset

```tsx
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div role="alert">
      <h2>Something went wrong</h2>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={(error) => logErrorToService(error)}>
      <MainContent />
    </ErrorBoundary>
  );
}
```

### Good: Surfacing async errors into boundary

```tsx
function DataLoader() {
  const { showBoundary } = useErrorBoundary();

  const handleLoad = async () => {
    try {
      await fetchCriticalData();
    } catch (error) {
      showBoundary(error);
    }
  };

  return <button onClick={handleLoad}>Load Data</button>;
}
```

---

## TypeScript

### Good: Extending native element props

```tsx
interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

function Button({ variant, isLoading, children, disabled, ...rest }: ButtonProps) {
  return (
    <button className={`btn btn--${variant}`} disabled={disabled || isLoading} {...rest}>
      {isLoading ? <Spinner /> : children}
    </button>
  );
}
```

### Good: Generic data table

```tsx
interface Column<T> {
  key: keyof T & string;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string;
}

function DataTable<T>({ data, columns, keyExtractor }: DataTableProps<T>) {
  return (
    <table>
      <thead>
        <tr>{columns.map(col => <th key={col.key}>{col.header}</th>)}</tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={keyExtractor(row)}>
            {columns.map(col => (
              <td key={col.key}>{col.render ? col.render(row[col.key], row) : String(row[col.key])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Good: Discriminated union for state machine

```tsx
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function UserDisplay({ state }: { state: AsyncState<User> }) {
  switch (state.status) {
    case 'idle': return null;
    case 'loading': return <Spinner />;
    case 'success': return <UserCard user={state.data} />;
    case 'error': return <ErrorMessage error={state.error} />;
  }
}
```

---

## Security

### Bad: Unsanitized dangerouslySetInnerHTML

```jsx
// WRONG — direct XSS vulnerability, especially with user/AI-generated content
function BlogContent({ content }) {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}
```

### Good: Sanitized HTML rendering

```jsx
import DOMPurify from 'dompurify';

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'blockquote', 'code', 'pre', 'img'],
  ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'class'],
};

function BlogContent({ content }) {
  const sanitized = DOMPurify.sanitize(content, SANITIZE_CONFIG);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
```

### Good: URL validation

```tsx
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (!isValidUrl(href)) return <span>{children}</span>;
  return <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>;
}
```

---

## Accessibility

### Good: Accessible modal with focus trap

```tsx
function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) closeRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <h2 id="modal-title">{title}</h2>
      {children}
      <button ref={closeRef} onClick={onClose} aria-label="Close dialog">
        &times;
      </button>
    </div>
  );
}
```

### Good: Accessible form field

```tsx
function FormField({ id, label, error, ...inputProps }: FormFieldProps) {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        {...inputProps}
      />
      {error && <p id={errorId} role="alert">{error}</p>}
    </div>
  );
}
```

---

## Code Organization

### Good: Feature-based folder structure

```
src/
├── features/
│   ├── blog/
│   │   ├── components/
│   │   │   ├── BlogCard.tsx
│   │   │   └── BlogList.tsx
│   │   ├── hooks/
│   │   │   └── useBlogQueries.ts
│   │   ├── api/
│   │   │   └── blogApi.ts
│   │   ├── types.ts
│   │   └── index.ts          # barrel export
│   └── auth/
│       ├── components/
│       ├── hooks/
│       ├── api/
│       └── index.ts
├── components/                # shared/reusable UI
│   ├── Button.tsx
│   └── Spinner.tsx
├── hooks/                     # shared hooks
├── utils/                     # shared helpers
└── api/                       # shared API config
```
