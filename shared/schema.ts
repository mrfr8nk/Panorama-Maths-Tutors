import { z } from "zod";

export const educationLevelEnum = z.enum([
  "High School",
  "University",
  "College",
  "Other"
]);

export const userRoleEnum = z.enum(["student", "tutor", "admin"]);

export const courseTypeEnum = z.enum(["ZIMSEC", "Cambridge", "Tertiary"]);

export const courseStatusEnum = z.enum(["Free", "Premium"]);

export const resourceTypeEnum = z.enum(["PDF", "Video", "Lesson"]);

export const userSchema = z.object({
  _id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: userRoleEnum,
  educationLevel: educationLevelEnum.optional(),
  enrolledCourses: z.array(z.string()).default([]),
  createdAt: z.date().or(z.string()),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  educationLevel: educationLevelEnum.optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const courseSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  type: courseTypeEnum,
  status: courseStatusEnum,
  price: z.number().optional(),
  fileUrl: z.string().optional(),
  youtubeLink: z.string().optional(),
  resourceType: resourceTypeEnum,
  createdBy: z.string(),
  enrollments: z.number().default(0),
  createdAt: z.date().or(z.string()),
});

export const createCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  type: courseTypeEnum,
  status: courseStatusEnum,
  price: z.number().min(0).optional(),
  youtubeLink: z.string().url().optional().or(z.literal("")),
  resourceType: resourceTypeEnum,
});

export const updateCourseSchema = createCourseSchema.partial();

export const paymentSchema = z.object({
  _id: z.string(),
  userId: z.string(),
  courseId: z.string(),
  amount: z.number(),
  status: z.enum(["pending", "completed", "failed"]),
  paymentMethod: z.string(),
  pollUrl: z.string().optional(),
  createdAt: z.date().or(z.string()),
});

export type User = z.infer<typeof userSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type Course = z.infer<typeof courseSchema>;
export type CreateCourse = z.infer<typeof createCourseSchema>;
export type UpdateCourse = z.infer<typeof updateCourseSchema>;
export type Payment = z.infer<typeof paymentSchema>;
export type EducationLevel = z.infer<typeof educationLevelEnum>;
export type UserRole = z.infer<typeof userRoleEnum>;
export type CourseType = z.infer<typeof courseTypeEnum>;
export type CourseStatus = z.infer<typeof courseStatusEnum>;
export type ResourceType = z.infer<typeof resourceTypeEnum>;
