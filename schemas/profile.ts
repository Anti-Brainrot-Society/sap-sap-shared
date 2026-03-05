import { z } from 'zod';

export const profileUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  // Treat empty string as undefined so users can leave it blank
  avatar: z.preprocess(
    (v) => (typeof v === 'string' && v.trim() === '' ? undefined : v),
    z.string().url({ message: 'Invalid URL' }).optional(),
  ),
  // Social handle: lowercase letters, numbers, underscores only
  username: z
    .string()
    .min(3, 'Handle must be at least 3 characters')
    .max(30, 'Handle must be 30 characters or less')
    .regex(/^[a-z0-9_]+$/, 'Only lowercase letters, numbers, and underscores')
    .optional()
    .nullable(),
  // Bio: plain text, trimmed, max 150 chars
  bio: z
    .string()
    .max(150, 'Bio must be 150 characters or less')
    .transform((v) => v.replace(/\s+/g, ' ').trim())
    .optional()
    .nullable(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
