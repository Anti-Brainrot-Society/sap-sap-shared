/**
 * Secret Code types for story unlocking
 *
 * Used by:
 * - Server: unlock endpoint, code generation
 * - Mobile: unlock modal, API calls
 * - Admin: code management UI
 */

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Character set for secret codes.
 * Excludes ambiguous characters: O/0, I/1/L
 * 31 characters = ~923k combinations with 4-char codes
 */
export const SECRET_CODE_CHARSET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

/** Length of generated secret codes */
export const SECRET_CODE_LENGTH = 4;

// ─────────────────────────────────────────────────────────────────────────────
// Request/Response Types
// ─────────────────────────────────────────────────────────────────────────────

/** POST /api/stories/unlock request body */
export interface UnlockCodeRequest {
  code: string;
}

/** Error codes returned by unlock endpoint */
export type UnlockCodeError = 'invalid_code' | 'too_many_attempts';

/** POST /api/stories/unlock response */
export interface UnlockCodeResponse {
  success: boolean;
  /** Story ID if unlock succeeded */
  storyId?: string;
  /** Story display name if unlock succeeded */
  storyName?: string;
  /** Error code if unlock failed */
  error?: UnlockCodeError;
  /** Seconds until retry allowed (for rate limiting) */
  retryAfter?: number;
}
