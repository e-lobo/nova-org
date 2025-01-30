import { z } from 'zod';

export const createKYCSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    // dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
    dateOfBirth: z.string(),
    nationality: z.string().min(2, 'Nationality must be at least 2 characters'),
    address: z.string().min(5, 'Address must be at least 5 characters'),
    phoneNumber: z.string(),
    //   phoneNumber: z
    //   .string()
    //   .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  }),
});

export const updateKYCStatusSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'RETURNED', 'APPROVED', 'REJECTED']),
    notes: z.string().optional(),
  }),
});
