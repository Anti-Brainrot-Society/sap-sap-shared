import { z } from 'zod';

export const profileUpdateSchema = z
  .object({
    name: z.string().min(1).max(100).optional(),
    // Treat empty string as undefined so users can leave it blank
    avatar: z.preprocess(
      (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
      z.string().url({ message: 'Invalid URL' }).optional(),
    ),
  })
  .strict();

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
