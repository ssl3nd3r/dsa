import { z } from 'zod';

export const informationFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .trim(),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/, 'Please enter a valid phone number')
    .transform((val) => val.replace(/[\s\-\(\)]/g, '')), // Remove formatting for storage
  
  lifestyle: z
    .array(z.string())
    .min(1, 'Please select at least one lifestyle preference'),
  
  work_schedule: z
    .string()
    .min(1, 'Please select a work schedule'),
});

export type InformationFormData = z.infer<typeof informationFormSchema>; 