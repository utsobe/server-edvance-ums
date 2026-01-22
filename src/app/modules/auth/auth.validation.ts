import { z } from 'zod';

export const authValidation = {
  login: z.object({
    body: z.object({
      email: z.string().email('Valid email is required'),
      password: z.string().min(6, 'Password is required'),
      role: z.enum(['student', 'lecturer', 'admin']),
    }),
  }),
};
