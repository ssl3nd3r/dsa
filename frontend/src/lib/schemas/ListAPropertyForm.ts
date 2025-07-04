import { z } from 'zod';

// title: '',
// description: '',
// area: 0,
// address: {
//   street: '',
//   city: '',
// },
// coordinates: {
//   lat: 0,
//   lng: 0,
// },
// property_type: '',
// room_type: '',
// size: 0,
// bedrooms: 0,
// bathrooms: 0,
// price: 0,
// currency: 'AED',
// billing_cycle: 'Monthly',
// utilities_included: false,
// utilities_cost: 0,
// amenities: [],
// images: [],
export const ListAPropertyFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters')
    .trim(),
  
  description: z
    .string()
    .min(1, 'Description is required')
    .min(10, 'Description must be at least 10 characters')
    .trim(),
  
  location: z
    .string()
    .min(1, 'Location is required')
    .trim(),

  property_type: z
    .string()
    .min(1, 'Property type is required')
    .trim(),
  
  address: z.object({
    street: z.string().min(1, 'Street is required').trim(),
    city: z.string().min(1, 'City is required').trim(),
  }),
  
    // coordinates: z.object({
    //   lat: z.number(),
    //   lng: z.number(),
    // }),
  
  room_type: z
    .string()
    .min(1, 'Room type is required'),
  
  size: z
    .number()
    .min(1, 'Size is required')
    .int('Size must be a whole number'),
  
  bedrooms: z
    .number()
    .min(0, 'Bedrooms cannot be negative')
    .int('Bedrooms must be a whole number'),
  
  bathrooms: z
    .number()
    .min(0, 'Bathrooms cannot be negative')
    .int('Bathrooms must be a whole number'),
  
  price: z
    .number()
    .min(0, 'Price cannot be negative'),
  
  currency: z
    .string()
    .optional(),
  
  billing_cycle: z
    .string()
    .min(1, 'Billing cycle is required'),
  
  utilities_included: z
    .boolean(),

  utilities_cost: z
    .number()
    .min(0, 'Utilities cost cannot be negative')
    .optional(),

  amenities: z
    .array(z.string())
    .min(1, 'At least one amenity is required'),
  
  available_from: z
    .string()
    .min(1, 'Available from date is required')
    .refine((date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate >= today;
    }, 'Available from date must be today or in the future'),
  
  // minimum_stay: z
  //   .number()
  //   .min(1, 'Minimum stay must be at least 1 month')
  //   .int('Minimum stay must be a whole number')
  //   .default(1),
  
  // maximum_stay: z
  //   .number()
  //   .min(1, 'Maximum stay must be at least 1 month')
  //   .int('Maximum stay must be a whole numbe r')
  //   .default(12),
  
  images: z
    .array(z.any())
    .min(1, 'At least one image is required')
    .refine((files) => {
      return files.every((file) => file?.size <= 15 * 1000000); 
    }, `Max image size is 15MB.`)
    .refine((files) => {
      return files.length <= 6; 
    }, `Max image count is 6.`)
    .refine(
      (files) => {
        return files.every((file) => 
          ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file?.type)
        );
      },
      "Only jpeg, png, jpg, and webp images are accepted."
    )
  
  // roommate_preferences: z.object({
  //   age_range: z.string().optional(),
  //   gender: z.string().optional(),
  //   occupation: z.string().optional(),
  //   lifestyle: z.array(z.string()).optional(),
  //   smoking: z.boolean().optional(),
  //   pets: z.boolean().optional(),
  // }).optional(),
});

export type ListAPropertyFormData = z.infer<typeof ListAPropertyFormSchema>;