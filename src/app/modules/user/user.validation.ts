import { z } from 'zod';

const userRoles = z.enum(['student', 'lecturer', 'admin']);

const createUserValidation = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Valid email is required'),
    role: userRoles,
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .optional(),
    avatar: z.string().url().optional(),
    department: z.string().optional(),
    course: z.string().optional(),
    studentId: z.string().optional(),
    employeeId: z.string().optional(),
    year: z.number().optional(),
    gpa: z.number().optional(),
    enrolledSubjects: z.array(z.string()).optional(),
    subjects: z.array(z.string()).optional(),
    permissions: z.array(z.string()).optional(),
  }),
});

const updateUserValidation = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email('Valid email is required').optional(),
    role: userRoles.optional(),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .optional(),
    avatar: z.string().url().optional(),
    department: z.string().optional(),
    course: z.string().optional(),
    studentId: z.string().optional(),
    employeeId: z.string().optional(),
    year: z.number().optional(),
    gpa: z.number().optional(),
    enrolledSubjects: z.array(z.string()).optional(),
    subjects: z.array(z.string()).optional(),
    permissions: z.array(z.string()).optional(),
  }),
});

const getUsersQueryValidation = z.object({
  query: z.object({
    role: userRoles.optional(),
    department: z.string().optional(),
    q: z.string().optional(),
  }),
});

const changePasswordValidation = z.object({
  body: z.object({
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters long')
      .max(50, 'Password is too long'),
  }),
});

export const UserValidation = {
  createUserValidation,
  updateUserValidation,
  getUsersQueryValidation,
  changePasswordValidation,
};
