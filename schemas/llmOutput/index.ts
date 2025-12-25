/**
 * LLM Output Schema Utilities
 *
 * Provides field mappings, transformation utilities, and validation functions
 * for converting LLM output (snake_case, various aliases) to canonical DB format (camelCase).
 */

// Field mappings and transform utilities
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

// Validation schemas and functions
export {
  // Raw schemas (accept LLM output format)
  RawPremadeMessageSchema,
  RawCharacterSchema,
  RawChatSchema,
  RawBeatSchema,
  RawStorySchema,
  RawStoryOutputSchema,
  // Normalized schemas (canonical DB format)
  NormalizedPremadeMessageSchema,
  NormalizedCharacterSchema,
  NormalizedChatSchema,
  NormalizedBeatSchema,
  NormalizedStorySchema,
  NormalizedStoryOutputSchema,
  VoiceConfigSchema,
  StoryDescriptionSchema,
  StorySettingsSchema,
  // Validation functions
  validateLLMStoryOutput,
  validateStrictStoryOutput,
  // Types
  type RawStoryOutput,
  type NormalizedPremadeMessage,
  type NormalizedCharacter,
  type NormalizedChat,
  type NormalizedBeat,
  type NormalizedStory,
  type NormalizedStoryOutput,
  type ValidationWarning,
  type ValidationResult,
} from './validate';
