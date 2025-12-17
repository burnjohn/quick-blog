# Test Setup for Quick Blog Client

This directory contains the global test configuration and utilities for testing the Quick Blog React application.

## Structure

```
test/
├── setup.js          # Global test setup and mocks
├── utils.jsx         # Custom render function and test utilities
├── mocks/
│   └── hooks.js      # Mock implementations for custom hooks
└── README.md         # This file
```

## Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once
npm test -- --run

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Test Configuration

The test setup uses:
- **Vitest**: Fast, Vite-native test framework
- **React Testing Library**: Component testing with user-centric queries
- **jsdom**: DOM environment for tests
- **@testing-library/user-event**: Realistic user interaction simulation

## Global Mocks

### setup.js

Provides global mocks for:
- `react-hot-toast`: Toast notifications
- `quill`: Rich text editor
- `URL.createObjectURL`: File preview functionality
- `window.matchMedia`: Media query matching

## Test Utilities

### utils.jsx

#### `renderWithProviders(component, options)`

Custom render function that wraps components with necessary providers:
- `AppProvider`: Application context
- `BrowserRouter`: Routing context

```javascript
import { renderWithProviders } from '../../test/utils'

const { container } = renderWithProviders(<MyComponent />)
```

#### `createMockFile(name, size, type)`

Creates mock File objects for upload testing:

```javascript
import { createMockFile } from '../../test/utils'

const file = createMockFile('test.png', 2048, 'image/png')
```

#### `createMockBlog(overrides)`

Factory function for creating mock blog data:

```javascript
import { createMockBlog } from '../../test/utils'

const blog = createMockBlog({ title: 'Custom Title' })
```

## Hook Mocks

### mocks/hooks.js

Provides mock implementations for custom hooks:

```javascript
import { createMockBlogGenerator, createMockCreateBlog } from '../../test/mocks/hooks'

const mockBlogGenerator = createMockBlogGenerator({ isGenerating: true })
const mockCreateBlog = createMockCreateBlog({ isCreating: false })
```

## Writing Tests

### Basic Component Test

```javascript
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../test/utils'
import MyComponent from './MyComponent'

describe('MyComponent', () => {
  it('should render without crashing', () => {
    renderWithProviders(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### Testing User Interactions

```javascript
import { userEvent } from '../../test/utils'

it('should handle button click', async () => {
  const user = userEvent.setup()
  renderWithProviders(<MyComponent />)
  
  await user.click(screen.getByRole('button'))
  expect(mockFunction).toHaveBeenCalled()
})
```

### Testing with Mocked Hooks

```javascript
import { vi } from 'vitest'
import { createMockBlogGenerator } from '../../test/mocks/hooks'

vi.mock('../../hooks', () => ({
  useBlogGenerator: vi.fn(),
}))

import { useBlogGenerator } from '../../hooks'

it('should handle loading state', () => {
  const mockHook = createMockBlogGenerator({ isGenerating: true })
  useBlogGenerator.mockReturnValue(mockHook)
  
  renderWithProviders(<MyComponent />)
  expect(screen.getByText('Loading...')).toBeInTheDocument()
})
```

## Best Practices

1. **Use user-centric queries**: Prefer `getByRole`, `getByLabelText`, `getByText` over `getByTestId`
2. **Test behavior, not implementation**: Focus on what the user sees and does
3. **Use `waitFor` for async operations**: Don't rely on timeouts
4. **Mock at the boundaries**: Mock API calls and external dependencies, not internal functions
5. **Keep tests isolated**: Each test should be independent and not rely on others
6. **Use descriptive test names**: Test names should explain what is being tested

## Common Patterns

### Testing Form Submissions

```javascript
it('should submit form with valid data', async () => {
  const user = userEvent.setup()
  const { container } = renderWithProviders(<FormComponent />)
  
  const input = container.querySelector('input[type="text"]')
  await user.type(input, 'test value')
  
  await user.click(screen.getByRole('button', { name: /submit/i }))
  
  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
      value: 'test value'
    }))
  })
})
```

### Testing Loading States

```javascript
it('should show loading state', () => {
  mockHook.isLoading = true
  useMyHook.mockReturnValue(mockHook)
  
  renderWithProviders(<MyComponent />)
  expect(screen.getByRole('button')).toBeDisabled()
})
```

### Testing File Uploads

```javascript
it('should handle file upload', async () => {
  const user = userEvent.setup()
  const { container } = renderWithProviders(<UploadComponent />)
  
  const file = createMockFile('image.png', 2048, 'image/png')
  const input = container.querySelector('input[type="file"]')
  
  await user.upload(input, file)
  expect(screen.getByAltText('Preview')).toHaveAttribute('src', 'mock-object-url')
})
```

## Troubleshooting

### Tests timing out

- Increase timeout in `waitFor`: `await waitFor(() => {...}, { timeout: 3000 })`
- Check that mocked functions return promises: `vi.fn(() => Promise.resolve(...))`
- Verify async operations are properly awaited

### "act()" warnings

- Use `userEvent` from `@testing-library/user-event` instead of `fireEvent`
- Wrap state updates in `waitFor`
- These warnings don't cause test failures but indicate potential issues

### Elements not found

- Use `screen.debug()` to see the current DOM
- Check if element is rendered conditionally
- Verify the correct query method is being used
- Check if element needs time to appear (use `findBy` queries)

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
