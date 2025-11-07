import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  educationLevel: z.enum(['High School', 'University', 'College', 'Other']).optional()
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum(['ZIMSEC', 'Cambridge', 'Tertiary']),
  status: z.enum(['Free', 'Premium']),
  price: z.number().positive().optional(),
  youtubeLink: z.string().url().optional().or(z.literal('')),
  resourceType: z.enum(['PDF', 'Video', 'Lesson'])
});

export const updateCourseSchema = courseSchema.partial();

export const paymentSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  phoneNumber: z.string().regex(/^(\+?263|0)[0-9]{9}$/, 'Invalid Zimbabwe phone number')
});
