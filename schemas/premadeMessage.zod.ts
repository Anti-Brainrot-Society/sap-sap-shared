import { z } from 'zod';

/**
 * Schema for premade messages in story beats.
 * These are the pre-written messages that appear in the chat for each beat.
 *
 * Supports both LLM output format (snake_case) and DB format (camelCase).
 *
 * @deprecated Use RawPremadeMessageSchema from './llmOutput' for new code.
 * This schema is kept for backwards compatibility.
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

// Re-export normalized schema from llmOutput for backwards compatibility
export {
  NormalizedPremadeMessageSchema,
  type NormalizedPremadeMessage,
} from './llmOutput/validate';
