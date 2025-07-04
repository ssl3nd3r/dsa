import { z } from 'zod';

export const ChangePasswordFormSchema = z.object({
  current_password: z
    .string()
    .min(1, 'Current password is required')
    .min(8, 'Current password must be at least 8 characters')
    .trim(),
  
  new_password: z
    .string()
    .min(1, 'New password is required')
    .min(8, 'New password must be at least 8 characters')
    .trim(),
  
  confirm_password: z
    .string()
    .min(1, 'Confirm password is required')
    .min(8, 'Confirm password must be at least 8 characters')
  
})
.refine((data) => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
});

export type ChangePasswordFormData = z.infer<typeof ChangePasswordFormSchema>; 