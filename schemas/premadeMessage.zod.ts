import { z } from 'zod';

/**
 * Schema for premade messages in story beats.
 * These are the pre-written messages that appear in the chat for each beat.
 *
 * Supports both LLM output format (snake_case) and DB format (camelCase).
 */
export const PremadeMessageSchema = z.object({
  // Sender - accepts both snake_case (LLM output) and camelCase (DB format)
  sender_id: z.string().min(1).optional(),
  sender: z.string().min(1).optional(),

  // Message content - accepts both field names
  message: z.string().optional(),
  content: z.string().optional(),

  // Language(s) for the message
  language: z.string().optional(),
  languages: z.array(z.string()).optional(),

  // Optional fields
  message_note: z.string().optional(),
  translation: z.string().optional(),
  phonetic: z.string().optional(),
  delay_seconds: z.number().optional(),
  delaySeconds: z.number().optional(),
  senderDisplayName: z.string().optional(),
  sender_name: z.string().optional(),
}).passthrough();

export type PremadeMessage = z.infer<typeof PremadeMessageSchema>;

/**
 * Normalized premade message with canonical field names.
 * Use this after transformation from LLM output.
 */
export const NormalizedPremadeMessageSchema = z.object({
  sender: z.string().min(1),
  content: z.string(),
  languages: z.array(z.string()).default([]),
  senderDisplayName: z.string().optional(),
  translation: z.string().optional(),
  phonetic: z.string().optional(),
  delaySeconds: z.number().optional(),
  messageNote: z.string().optional(),
});

export type NormalizedPremadeMessage = z.infer<typeof NormalizedPremadeMessageSchema>;
