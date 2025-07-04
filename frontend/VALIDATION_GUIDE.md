# Form Validation with React Hook Form + Zod

This project uses React Hook Form with Zod for form validation. This combination provides type-safe, performant form handling with excellent developer experience.

## Setup

The required packages are already installed:
- `react-hook-form` - Form state management
- `@hookform/resolvers` - Integration with validation libraries
- `zod` - Schema validation

## Usage Example

### 1. Create a Validation Schema

```typescript
// lib/schemas/yourForm.ts
import { z } from 'zod';

export const yourFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/, 'Please enter a valid phone number'),
});

export type YourFormData = z.infer<typeof yourFormSchema>;
```

### 2. Use in Component

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { yourFormSchema, type YourFormData } from '@/lib/schemas/yourForm';

export default function YourForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setValue,
    watch,
  } = useForm<YourFormData>({
    resolver: zodResolver(yourFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
    mode: 'onChange', // Enable real-time validation
  });

  const watchedValues = watch();

  const onSubmit = async (data: YourFormData) => {
    try {
      // Handle form submission
      console.log('Form data:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          value={watchedValues.name}
          onChange={(e) => setValue('name', e.target.value, { shouldValidate: true })}
          placeholder="Enter name"
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name.message}</span>
        )}
      </div>
      
      <button type="submit" disabled={isSubmitting || !isValid}>
        Submit
      </button>
    </form>
  );
}
```

## Key Features

### Real-time Validation
- Set `mode: 'onChange'` for immediate validation feedback
- Use `shouldValidate: true` in `setValue` calls

### Error Handling
- Access errors via `formState.errors`
- Display error messages with proper styling
- Form-level validation state with `isValid`

### Type Safety
- Full TypeScript support
- Zod schema inference for form data types
- Compile-time error checking

### Performance
- Only re-renders changed fields
- Efficient validation timing
- Minimal bundle size

## Validation Rules

### Common Patterns

```typescript
// Required field
z.string().min(1, 'This field is required')

// Email validation
z.string().email('Invalid email format')

// Phone number (international)
z.string().regex(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/, 'Invalid phone number')

// Length constraints
z.string().min(2, 'Too short').max(50, 'Too long')

// Custom regex
z.string().regex(/^[a-zA-Z\s]+$/, 'Only letters and spaces allowed')

// Transform data
z.string().transform(val => val.trim().toLowerCase())
```

### Conditional Validation

```typescript
const schema = z.object({
  email: z.string().email(),
  confirmEmail: z.string(),
}).refine((data) => data.email === data.confirmEmail, {
  message: "Emails don't match",
  path: ["confirmEmail"],
});
```

## Best Practices

1. **Create reusable schemas** for common validation patterns
2. **Use descriptive error messages** that help users understand what's wrong
3. **Enable real-time validation** for better UX
4. **Handle loading states** during form submission
5. **Provide visual feedback** for validation status
6. **Use TypeScript** for type safety

## Integration with Existing Components

The validation works seamlessly with existing UI components like `TextInput` and `Select`. Simply pass the form values and handlers to maintain consistency across the application. 