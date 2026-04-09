---
name: react-hook-form
description: "React Hook Form best practices, validation with Zod, performance patterns, and testing. Use when building, reviewing, or refactoring forms, form validation, useForm, useFieldArray, Controller, or integrating React Hook Form with UI libraries."
---

# React Hook Form Best Practices

Modern conventions for React Hook Form (v7+). Covers setup, validation, performance, testing, and common patterns. For code examples, see [examples.md](examples.md). For source URLs, see [references.md](references.md).

## Severity Levels

- **CRITICAL** — Will cause bugs, broken forms, or data loss
- **HIGH** — Will cause performance issues or poor UX
- **MEDIUM** — Will hurt maintainability or developer experience

---

## Core Setup (CRITICAL)

- Always install with Zod resolver: `react-hook-form @hookform/resolvers zod`
- Use `useForm<T>()` with a TypeScript generic matching your Zod schema's inferred type
- Set `mode` explicitly — `"onBlur"` or `"onTouched"` for UX; `"onSubmit"` (default) for simple forms
- Use `zodResolver(schema)` in the `resolver` option — never mix inline `rules` with schema resolvers
- Type submit handlers with `SubmitHandler<T>` and error handlers with `SubmitErrorHandler<T>`

## Validation with Zod (CRITICAL)

- Define one Zod schema per form — single source of truth for types and validation
- Infer the TypeScript type from the schema: `type FormValues = z.infer<typeof schema>`
- Never duplicate validation logic between Zod schema and inline `rules` prop
- Use Zod transforms and preprocessing for data coercion (e.g., `z.preprocess` for FileList, string-to-number)
- For create/edit form reuse, bundle schema + defaults in a custom hook

## Uncontrolled Components (CRITICAL)

- Use `register()` for native HTML inputs — this is the default and most performant pattern
- Avoid wrapping native inputs with `Controller` — `register()` is lighter and faster
- `Controller` is ONLY for third-party UI components that don't expose a `ref` (MUI, Ant Design, etc.)
- Never use `useState` alongside `useForm` for the same field — let RHF own the form state

## Performance (HIGH)

### watch() vs useWatch vs getValues

- `watch()` re-renders the **entire** component on every change — use sparingly
- `useWatch({ control, name })` re-renders only the **subscribing** component — prefer this
- `getValues()` reads values **without subscribing** — use in event handlers where re-renders aren't needed

### Re-render Minimization

- Isolate `useWatch` calls into small child components to limit re-render scope
- Use `useFormState({ control })` instead of destructuring `formState` from `useForm` in deeply nested components
- For large forms (50+ fields), split into sub-components with their own `useWatch`/`useFormState`
- Never call `watch()` inside event handlers — use `getValues()` instead

### useFieldArray

- Use `useFieldArray` for dynamic field lists — never manage arrays with manual `useState`
- Always use the `id` from `fields` as the `key` prop, not the array index
- Prefer `update()` over `remove()` + `append()` for modifying existing items

## Controller Pattern (HIGH)

Use `Controller` only when `register()` won't work (non-native inputs):

- Pass `control` from `useForm()` to `Controller`
- Spread `{...field}` onto the wrapped component inside the `render` prop
- Show errors via `fieldState.error` in the same `render` function
- Set `defaultValue` on Controller or in `useForm({ defaultValues })` — never leave it undefined

## FormProvider & useFormContext (HIGH)

- Use `FormProvider` to pass form methods to deeply nested components without prop drilling
- Access methods in children with `useFormContext()`
- Avoid `useFormContext` in large dynamic lists — pass `control` directly instead (performance)

## Multi-Step / Wizard Forms (MEDIUM)

- Each step is a separate component with its own validation schema
- Parent component manages step state and aggregates values
- Use `trigger()` to validate the current step before advancing
- Persist partial data with `getValues()` when moving between steps

## Error Handling & Accessibility (HIGH)

- Use `shouldFocusError: true` (default) — auto-focuses the first invalid field on submit
- Display errors only after interaction — configure `mode: "onTouched"` or `"onBlur"`
- Add `aria-invalid={!!errors.fieldName}` on inputs
- Add `aria-describedby` linking the input to its error message element
- Use `role="alert"` on error message containers

## DevTools (MEDIUM)

- Install `@hookform/devtools` as a dev dependency
- Render `<DevTool control={control} />` next to your form during development
- Remove or conditionally exclude in production builds

## Testing (HIGH)

- Test forms through the UI, not by mocking RHF internals
- Use `getByRole` queries (textbox, button, combobox) — not `getByTestId`
- Use `userEvent` (not `fireEvent`) for realistic interaction simulation
- For components receiving `control` as a prop, use `renderHook(() => useForm())` to provide it
- Assert on visible error messages after submitting with invalid data
- Assert on the submit handler being called with correct data after valid submission

## Anti-Patterns

| Pattern | Why It's Bad | Fix |
|---------|-------------|-----|
| `useState` + RHF for same field | Dual state, desync bugs | Let RHF own it |
| `watch()` in event handlers | Unnecessary subscriptions, lag | Use `getValues()` |
| Index as `key` in `useFieldArray` | Broken reconciliation on reorder | Use `field.id` |
| `Controller` for native `<input>` | Unnecessary overhead | Use `register()` |
| Inline `rules` + `zodResolver` | Conflicting validation, confusion | Pick one: schema only |
| `useFormContext` in large lists | Re-renders entire list on change | Pass `control` directly |
| Untyped `useForm()` | No autocomplete, no type safety | `useForm<SchemaType>()` |
