/**
 * LLM Output → DB Schema field mappings.
 *
 * Maps field names from LLM output format (snake_case, various aliases)
 * to canonical DB format (camelCase).
 *
 * The transform layer resolves aliases before validation, so schemas
 * only need to validate the canonical form.
 */

/**
 * Field mappings for story entity.
 * Left: LLM output field names (snake_case, aliases)
 * Right: DB schema field names (camelCase)
 */
export const STORY_FIELD_MAPPINGS = {
  story_id: 'systemName',
  system_name: 'systemName',
  systemName: 'systemName',
  title: 'displayName',
  display_name: 'displayName',
  displayName: 'displayName',
  story_type: 'storyType',
  storyType: 'storyType',
} as const;

/**
 * Field mappings for character entity.
 */
export const CHARACTER_FIELD_MAPPINGS = {
  // ID fields
  id: 'systemName',
  character_id: 'systemName',
  system_name: 'systemName',
  systemName: 'systemName',

  // Display name
  name: 'displayName',
  display_name: 'displayName',
  displayName: 'displayName',

  // Demographic fields
  age_group: 'ageGroup',
  ageGroup: 'ageGroup',
  gender: 'gender',
  region: 'region',

  // Voice configuration
  voicePersonality: 'voiceConfig',
  voice_personality: 'voiceConfig',
  voiceConfig: 'voiceConfig',
  voice_config: 'voiceConfig',

  // User flag
  isUser: 'isUser',
  is_user: 'isUser',

  // Role and backstory
  role: 'role',
  backstory: 'backgroundInfo',
  background_info: 'backgroundInfo',
  backgroundInfo: 'backgroundInfo',

  // Speaking style
  typing_style: 'speakingStyle',
  typingStyle: 'speakingStyle',
  speakingStyle: 'speakingStyle',
} as const;

/**
 * Field mappings for chat/conversation entity.
 */
export const CHAT_FIELD_MAPPINGS = {
  chat_id: 'systemName',
  id: 'systemName',
  system_name: 'systemName',
  systemName: 'systemName',

  display_title: 'displayName',
  title: 'displayName',
  name: 'displayName',
  displayName: 'displayName',

  type: 'conversationType',
  conversation_type: 'conversationType',
  conversationType: 'conversationType',

  participants: 'participants',
  description: 'description',
  learning_environment: 'learningEnvironment',
  learningEnvironment: 'learningEnvironment',
} as const;

/**
 * Field mappings for beat entity.
 */
export const BEAT_FIELD_MAPPINGS = {
  // ID fields
  beat_id: 'systemName',
  id: 'systemName',
  system_name: 'systemName',
  systemName: 'systemName',

  // Display name
  display_title: 'displayName',
  title: 'displayName',
  displayName: 'displayName',

  // Conversation reference
  chat_id: 'conversationId',
  conversation_id: 'conversationId',
  conversationId: 'conversationId',
  room_id: 'conversationId',

  // Sequence
  sequence_number: 'sequencePosition',
  sequencePosition: 'sequencePosition',
  index: 'sequencePosition',

  // Messages
  premade_messages: 'openingMessages',
  openingMessages: 'openingMessages',
  messages: 'openingMessages',
  content: 'openingMessages',

  // Response suggestions
  response_suggestion: 'responseSuggestions',
  response_suggestions: 'responseSuggestions',
  responseSuggestion: 'responseSuggestions',
  responseSuggestions: 'responseSuggestions',

  // Problem type
  problem_type: 'problemType',
  problemType: 'problemType',

  // Participants
  participants: 'participants',
  participantsIds: 'participants',

  // Prompt context
  prompt_context: 'promptContext',
  promptContext: 'promptContext',
} as const;

/**
 * Field mappings for premade message entity.
 */
export const PREMADE_MESSAGE_FIELD_MAPPINGS = {
  sender_id: 'sender',
  sender: 'sender',

  message: 'content',
  content: 'content',

  language: 'languages',
  languages: 'languages',

  message_note: 'messageNote',
  messageNote: 'messageNote',

  delay_seconds: 'delaySeconds',
  delaySeconds: 'delaySeconds',

  sender_name: 'senderDisplayName',
  senderDisplayName: 'senderDisplayName',
} as const;

/**
 * All field mappings grouped by entity type.
 */
export const FIELD_MAPPINGS = {
  story: STORY_FIELD_MAPPINGS,
  character: CHARACTER_FIELD_MAPPINGS,
  chat: CHAT_FIELD_MAPPINGS,
  beat: BEAT_FIELD_MAPPINGS,
  premadeMessage: PREMADE_MESSAGE_FIELD_MAPPINGS,
} as const;

export type EntityType = keyof typeof FIELD_MAPPINGS;

/**
 * Transform an object's field names using the provided mapping.
 * Unknown fields are passed through unchanged (passthrough behavior).
 *
 * @param obj - The object to transform
 * @param mapping - Field name mapping (source → target)
 * @returns Object with transformed field names
 */
export function transformFields<T extends Record<string, unknown>>(
  obj: T,
  mapping: Record<string, string>
): Record<string, unknown> {
  if (!obj || typeof obj !== 'object') return obj as Record<string, unknown>;

  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(obj)) {
    const targetKey = mapping[key] || key;
    // If multiple source keys map to same target, later values win
    // (This handles aliases like sender_id and sender both mapping to sender)
    if (result[targetKey] === undefined || value !== undefined) {
      result[targetKey] = value;
    }
  }

  return result;
}

/**
 * Transform an entity using the appropriate field mappings.
 *
 * @param entityType - Type of entity ('story', 'character', 'chat', 'beat', 'premadeMessage')
 * @param obj - The object to transform
 * @returns Object with canonical field names
 */
export function transformEntity<T extends Record<string, unknown>>(
  entityType: EntityType,
  obj: T
): Record<string, unknown> {
  const mapping = FIELD_MAPPINGS[entityType];
  return transformFields(obj, mapping as Record<string, string>);
}

/**
 * Transform premade messages array, handling both array and object formats.
 *
 * @param messages - Array of messages or object keyed by ID
 * @returns Array of messages with canonical field names
 */
export function transformPremadeMessages(
  messages: unknown
): Record<string, unknown>[] {
  if (!messages) return [];

  // Handle array format
  if (Array.isArray(messages)) {
    return messages.map((m) =>
      transformEntity('premadeMessage', m as Record<string, unknown>)
    );
  }

  // Handle object format (keyed by ID)
  if (typeof messages === 'object') {
    return Object.values(messages).map((m) =>
      transformEntity('premadeMessage', m as Record<string, unknown>)
    );
  }

  return [];
}

/**
 * Normalize a language field to an array format.
 * Handles: string → [string], array → array, undefined → []
 */
export function normalizeLanguages(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v) => typeof v === 'string');
  if (typeof value === 'string') return [value];
  return [];
}

/**
 * Normalize response suggestions to array format.
 * Handles: string → [string], array → array, undefined → []
 */
export function normalizeResponseSuggestions(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((v) => typeof v === 'string');
  if (typeof value === 'string') return [value];
  return [];
}
