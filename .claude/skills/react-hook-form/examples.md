# React Hook Form — Code Examples

Companion to [SKILL.md](SKILL.md). Each section shows the recommended pattern and the anti-pattern to avoid.

---

## Basic Form with Zod

```tsx
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 characters"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm({ onLogin }: { onLogin: (data: FormValues) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => onLogin(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        aria-invalid={!!errors.email}
        aria-describedby="email-error"
        {...register("email")}
      />
      {errors.email && (
        <p id="email-error" role="alert">{errors.email.message}</p>
      )}

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        aria-invalid={!!errors.password}
        aria-describedby="password-error"
        {...register("password")}
      />
      {errors.password && (
        <p id="password-error" role="alert">{errors.password.message}</p>
      )}

      <button type="submit" disabled={isSubmitting}>Log in</button>
    </form>
  );
}
```

---

## Controller for Third-Party Components

**Good — Controller wraps non-native component:**

```tsx
import { useForm, Controller } from "react-hook-form";
import { TextField } from "@mui/material";

function ProfileForm() {
  const { control, handleSubmit } = useForm({
    defaultValues: { name: "" },
  });

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            label="Name"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
    </form>
  );
}
```

**Bad — Controller wrapping a native input:**

```tsx
// DON'T — unnecessary overhead
<Controller
  name="email"
  control={control}
  render={({ field }) => <input {...field} />}
/>

// DO — use register() for native inputs
<input {...register("email")} />
```

---

## useWatch vs watch — Performance

**Bad — watch re-renders the entire form:**

```tsx
function PricingForm() {
  const { register, watch, control } = useForm();
  const quantity = watch("quantity"); // re-renders everything

  return (
    <form>
      <input type="number" {...register("quantity")} />
      <p>Total: {quantity * 10}</p>
    </form>
  );
}
```

**Good — isolate useWatch in a child component:**

```tsx
function TotalDisplay({ control }: { control: Control<FormValues> }) {
  const quantity = useWatch({ control, name: "quantity" });
  return <p>Total: {quantity * 10}</p>;
}

function PricingForm() {
  const { register, control } = useForm<FormValues>();

  return (
    <form>
      <input type="number" {...register("quantity")} />
      <TotalDisplay control={control} />
    </form>
  );
}
```

---

## useFieldArray — Dynamic Fields

```tsx
import { useForm, useFieldArray } from "react-hook-form";

type FormValues = {
  items: { name: string; qty: number }[];
};

function OrderForm() {
  const { register, control, handleSubmit } = useForm<FormValues>({
    defaultValues: { items: [{ name: "", qty: 1 }] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  return (
    <form onSubmit={handleSubmit(console.log)}>
      {fields.map((field, index) => (
        // GOOD: use field.id as key, NOT index
        <div key={field.id}>
          <input {...register(`items.${index}.name`)} />
          <input type="number" {...register(`items.${index}.qty`)} />
          <button type="button" onClick={() => remove(index)}>Remove</button>
        </div>
      ))}
      <button type="button" onClick={() => append({ name: "", qty: 1 })}>
        Add item
      </button>
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## Reusable Create/Edit Hook

Bundle schema, defaults, and mode in a custom hook:

```tsx
const baseSchema = z.object({
  title: z.string().min(1, "Required"),
  body: z.string().min(10, "Min 10 characters"),
  category: z.string(),
});

type PostFormValues = z.infer<typeof baseSchema>;

function usePostForm(existingPost?: PostFormValues) {
  return useForm<PostFormValues>({
    resolver: zodResolver(baseSchema),
    defaultValues: existingPost ?? { title: "", body: "", category: "" },
    mode: "onTouched",
  });
}

// Create page
function CreatePost() {
  const form = usePostForm();
  // ...
}

// Edit page
function EditPost({ post }: { post: PostFormValues }) {
  const form = usePostForm(post);
  // ...
}
```

---

## Multi-Step Wizard

```tsx
function WizardForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});

  const next = (stepData: Record<string, unknown>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
    setStep((s) => s + 1);
  };

  const steps = [
    <StepOne onNext={next} defaults={formData} />,
    <StepTwo onNext={next} defaults={formData} />,
    <StepReview data={formData} onSubmit={handleFinalSubmit} />,
  ];

  return steps[step];
}

function StepOne({ onNext, defaults }) {
  const { register, handleSubmit, trigger } = useForm({
    defaultValues: defaults,
    resolver: zodResolver(stepOneSchema),
  });

  return (
    <form onSubmit={handleSubmit(onNext)}>
      <input {...register("name")} />
      <button type="submit">Next</button>
    </form>
  );
}
```

---

## Testing with React Testing Library

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("LoginForm", () => {
  it("shows validation errors on empty submit", async () => {
    const user = userEvent.setup();
    const onLogin = vi.fn();
    render(<LoginForm onLogin={onLogin} />);

    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(onLogin).not.toHaveBeenCalled();
  });

  it("calls onLogin with form data on valid submit", async () => {
    const user = userEvent.setup();
    const onLogin = vi.fn();
    render(<LoginForm onLogin={onLogin} />);

    await user.type(screen.getByRole("textbox", { name: /email/i }), "a@b.com");
    await user.type(screen.getByLabelText(/password/i), "securepass");
    await user.click(screen.getByRole("button", { name: /log in/i }));

    expect(onLogin).toHaveBeenCalledWith({
      email: "a@b.com",
      password: "securepass",
    });
  });
});
```

---

## FormProvider for Nested Components

```tsx
import { useForm, FormProvider, useFormContext } from "react-hook-form";

function ParentForm() {
  const methods = useForm({ defaultValues: { street: "", city: "" } });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(console.log)}>
        <AddressFields />
        <button type="submit">Save</button>
      </form>
    </FormProvider>
  );
}

function AddressFields() {
  const { register } = useFormContext();

  return (
    <>
      <input {...register("street")} placeholder="Street" />
      <input {...register("city")} placeholder="City" />
    </>
  );
}
```
