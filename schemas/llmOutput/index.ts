/**
 * LLM Output Schema Utilities
 *
 * Provides field mappings and transformation utilities for converting
 * LLM output (snake_case, various aliases) to canonical DB format (camelCase).
 */

export {
  FIELD_MAPPINGS,
  STORY_FIELD_MAPPINGS,
  CHARACTER_FIELD_MAPPINGS,
  CHAT_FIELD_MAPPINGS,
  BEAT_FIELD_MAPPINGS,
  PREMADE_MESSAGE_FIELD_MAPPINGS,
  transformFields,
  transformEntity,
  transformPremadeMessages,
  normalizeLanguages,
  normalizeResponseSuggestions,
  type EntityType,
} from './transforms';
