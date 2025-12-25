/**
 * LLM Story Output Validation
 *
 * Provides Zod schemas and validation functions for LLM story output.
 * Uses transform-then-validate pattern:
 * 1. Accept raw LLM output (snake_case, various aliases)
 * 2. Transform to canonical field names using FIELD_MAPPINGS
 * 3. Validate against strict normalized schemas
 */

import { z } from 'zod';
import {
  transformEntity,
  transformPremadeMessages,
  normalizeLanguages,
  normalizeResponseSuggestions,
} from './transforms';

// ─────────────────────────────────────────────────────────────────────────────
// Voice Config Schema
// ─────────────────────────────────────────────────────────────────────────────

export const VoiceConfigSchema = z
  .object({
    stability: z.number().optional(),
    style: z.number().optional(),
    speed: z.number().optional(),
  })
  .passthrough();

// ─────────────────────────────────────────────────────────────────────────────
// Premade Message Schemas
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Raw premade message as output by LLM.
 * Accepts both snake_case and camelCase field names.
 */
export const RawPremadeMessageSchema = z
  .object({
    sender_id: z.string().optional(),
    sender: z.string().optional(),
    message: z.string().optional(),
    content: z.string().optional(),
    language: z.string().optional(),
    languages: z.array(z.string()).optional(),
    message_note: z.string().optional(),
    messageNote: z.string().optional(),
    translation: z.string().optional(),
    phonetic: z.string().optional(),
    delay_seconds: z.number().optional(),
    delaySeconds: z.number().optional(),
    senderDisplayName: z.string().optional(),
    sender_name: z.string().optional(),
  })
  .passthrough();

/**
 * Normalized premade message with canonical field names.
 */
export const NormalizedPremadeMessageSchema = z.object({
  sender: z.string().min(1),
  content: z.string(),
  languages: z.array(z.string()),
  senderDisplayName: z.string().optional(),
  translation: z.string().optional(),
  phonetic: z.string().optional(),
  delaySeconds: z.number().optional(),
  messageNote: z.string().optional(),
});

export type NormalizedPremadeMessage = z.infer<
  typeof NormalizedPremadeMessageSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Character Schemas
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Raw character as output by LLM.
 */
export const RawCharacterSchema = z
  .object({
    id: z.string().optional(),
    character_id: z.string().optional(),
    systemName: z.string().optional(),
    name: z.string().optional(),
    displayName: z.string().optional(),
    role: z.string().optional(),
    personality: z.string().optional(),
    gender: z.enum(['male', 'female', 'neutral']).or(z.string()).optional(),
    age_group: z.string().optional(),
    ageGroup: z.string().optional(),
    region: z.string().optional(),
    voicePersonality: VoiceConfigSchema.optional(),
    voice_personality: VoiceConfigSchema.optional(),
    voiceConfig: VoiceConfigSchema.optional(),
    backstory: z.string().optional(),
    backgroundInfo: z.string().optional(),
    typing_style: z.string().optional(),
    speakingStyle: z.string().optional(),
    isUser: z.boolean().optional(),
    is_user: z.boolean().optional(),
  })
  .passthrough();

/**
 * Normalized character with canonical field names.
 */
export const NormalizedCharacterSchema = z.object({
  systemName: z.string().min(1),
  displayName: z.string().min(1),
  role: z.string().optional(),
  personality: z.string().optional(),
  gender: z.enum(['male', 'female', 'neutral']).optional(),
  ageGroup: z.string().optional(),
  region: z.string().optional(),
  voiceConfig: VoiceConfigSchema.optional(),
  backgroundInfo: z.string().optional(),
  speakingStyle: z.string().optional(),
  isUser: z.boolean(),
});

export type NormalizedCharacter = z.infer<typeof NormalizedCharacterSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Chat Schemas
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Raw chat as output by LLM.
 */
export const RawChatSchema = z
  .object({
    chat_id: z.string().optional(),
    id: z.string().optional(),
    systemName: z.string().optional(),
    type: z.string().optional(),
    conversationType: z.string().optional(),
    display_title: z.string().optional(),
    title: z.string().optional(),
    name: z.string().optional(),
    displayName: z.string().optional(),
    participants: z.array(z.string()).optional(),
    description: z.string().optional(),
    learning_environment: z.string().optional(),
    learningEnvironment: z.string().optional(),
  })
  .passthrough();

/**
 * Normalized chat with canonical field names.
 */
export const NormalizedChatSchema = z.object({
  systemName: z.string().min(1),
  displayName: z.string().min(1),
  conversationType: z.enum(['dm', 'group', 'individual']),
  participants: z.array(z.string()),
  description: z.string().optional(),
  learningEnvironment: z.string().optional(),
});

export type NormalizedChat = z.infer<typeof NormalizedChatSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Beat Schemas
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Raw beat as output by LLM.
 */
export const RawBeatSchema = z
  .object({
    beat_id: z.string().optional(),
    id: z.string().optional(),
    systemName: z.string().optional(),
    display_title: z.string().optional(),
    title: z.string().optional(),
    displayName: z.string().optional(),
    chat_id: z.string().optional(),
    conversation_id: z.string().optional(),
    conversationId: z.string().optional(),
    sequence_number: z.number().optional(),
    sequencePosition: z.number().optional(),
    index: z.number().optional(),
    premade_messages: z.array(RawPremadeMessageSchema).optional(),
    openingMessages: z
      .union([
        z.array(RawPremadeMessageSchema),
        z.record(RawPremadeMessageSchema),
      ])
      .optional(),
    messages: z.array(RawPremadeMessageSchema).optional(),
    content: z.array(RawPremadeMessageSchema).optional(),
    participants: z.array(z.string()).optional(),
    problem_type: z.string().optional(),
    problemType: z.string().optional(),
    response_suggestion: z.union([z.string(), z.array(z.string())]).optional(),
    response_suggestions: z.array(z.string()).optional(),
    responseSuggestions: z.array(z.string()).optional(),
  })
  .passthrough();

/**
 * Normalized beat with canonical field names.
 */
export const NormalizedBeatSchema = z.object({
  systemName: z.string().min(1),
  displayName: z.string().min(1),
  conversationId: z.string().min(1),
  sequencePosition: z.number(),
  openingMessages: z.array(NormalizedPremadeMessageSchema),
  participants: z.array(z.string()).optional(),
  problemType: z.string().optional(),
  responseSuggestions: z.array(z.string()).optional(),
  isActive: z.boolean(),
});

export type NormalizedBeat = z.infer<typeof NormalizedBeatSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Story Schemas
// ─────────────────────────────────────────────────────────────────────────────

export const StoryDescriptionSchema = z
  .object({
    summary: z.string().optional(),
    language: z.string().optional(),
    languageLong: z.string().optional(),
    friends: z.string().optional(),
  })
  .passthrough();

export const StorySettingsSchema = z
  .object({
    native_language: z.string().optional(),
    nativeLanguage: z.string().optional(),
    target_language: z.string().optional(),
    targetLanguage: z.string().optional(),
    target_level: z.string().optional(),
    level: z.string().optional(),
    starting_city: z.string().optional(),
    region: z.string().optional(),
    season: z.string().optional(),
  })
  .passthrough();

/**
 * Raw story as output by LLM.
 */
export const RawStorySchema = z
  .object({
    story_id: z.string().optional(),
    systemName: z.string().optional(),
    story_type: z.string().optional(),
    storyType: z.string().optional(),
    genre: z.string().optional(),
    title: z.string().optional(),
    displayName: z.string().optional(),
    description: z.union([StoryDescriptionSchema, z.string()]).optional(),
    settings: StorySettingsSchema.optional(),
  })
  .passthrough();

/**
 * Normalized story with canonical field names.
 */
export const NormalizedStorySchema = z.object({
  systemName: z.string().min(1),
  displayName: z.string().min(1),
  storyType: z.enum(['story', 'aula']).optional(),
  genre: z.string().optional(),
  description: StoryDescriptionSchema.optional(),
  settings: StorySettingsSchema.optional(),
});

export type NormalizedStory = z.infer<typeof NormalizedStorySchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Full Story Output Schemas
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Raw story output as produced by LLM.
 */
export const RawStoryOutputSchema = z
  .object({
    story: RawStorySchema.optional(),
    story_info: RawStorySchema.optional(),
    characters: z.array(RawCharacterSchema).optional(),
    cast: z.array(RawCharacterSchema).optional(),
    chats: z.array(RawChatSchema).optional(),
    new_chats: z.array(RawChatSchema).optional(),
    conversations: z.array(RawChatSchema).optional(),
    rooms: z.array(RawChatSchema).optional(),
    beats: z.array(RawBeatSchema).optional(),
    all_beats: z.array(RawBeatSchema).optional(),
    entities: z
      .object({
        characters: z.array(RawCharacterSchema).optional(),
        chats: z.array(RawChatSchema).optional(),
      })
      .optional(),
  })
  .passthrough();

export type RawStoryOutput = z.infer<typeof RawStoryOutputSchema>;

/**
 * Normalized story output with canonical field names.
 */
export const NormalizedStoryOutputSchema = z.object({
  story: NormalizedStorySchema,
  characters: z.array(NormalizedCharacterSchema),
  chats: z.array(NormalizedChatSchema),
  beats: z.array(NormalizedBeatSchema),
});

export type NormalizedStoryOutput = z.infer<typeof NormalizedStoryOutputSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Validation Result Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ValidationWarning {
  path: string;
  message: string;
  value?: unknown;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  warnings: ValidationWarning[];
  errors: ValidationWarning[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Transform Functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Transform a raw premade message to normalized format.
 */
function transformPremadeMessage(
  raw: Record<string, unknown>
): Record<string, unknown> {
  const transformed = transformEntity('premadeMessage', raw);

  // Normalize languages field
  if (transformed.languages !== undefined || raw.language !== undefined) {
    transformed.languages = normalizeLanguages(
      transformed.languages ?? raw.language
    );
  }

  return transformed;
}

/**
 * Transform a raw character to normalized format.
 */
function transformCharacter(
  raw: Record<string, unknown>
): Record<string, unknown> {
  const transformed = transformEntity('character', raw);

  // Ensure isUser is boolean (default false)
  if (typeof transformed.isUser !== 'boolean') {
    transformed.isUser = false;
  }

  // Normalize gender enum
  if (transformed.gender && typeof transformed.gender === 'string') {
    const normalizedGender = transformed.gender.toLowerCase();
    if (['male', 'female', 'neutral'].includes(normalizedGender)) {
      transformed.gender = normalizedGender;
    }
  }

  return transformed;
}

/**
 * Transform a raw chat to normalized format.
 */
function transformChat(raw: Record<string, unknown>): Record<string, unknown> {
  const transformed = transformEntity('chat', raw);

  // Normalize conversation type
  if (transformed.conversationType) {
    const type = String(transformed.conversationType).toLowerCase();
    if (type === 'individual' || type === '1:1' || type === 'one-on-one') {
      transformed.conversationType = 'dm';
    } else if (type === 'group' || type === 'group_chat') {
      transformed.conversationType = 'group';
    } else if (type !== 'dm') {
      // Default to dm for unknown types
      transformed.conversationType = 'dm';
    }
  } else {
    transformed.conversationType = 'dm';
  }

  // Ensure participants is array
  if (!Array.isArray(transformed.participants)) {
    transformed.participants = [];
  }

  return transformed;
}

/**
 * Transform a raw beat to normalized format.
 */
function transformBeat(raw: Record<string, unknown>): Record<string, unknown> {
  const transformed = transformEntity('beat', raw);

  // Get messages from various possible field names
  const rawMessages =
    raw.premade_messages ||
    raw.openingMessages ||
    raw.messages ||
    raw.content ||
    [];

  // Transform opening messages
  const messages = transformPremadeMessages(rawMessages);
  transformed.openingMessages = messages.map(transformPremadeMessage);

  // Normalize response suggestions
  const rawSuggestions =
    raw.response_suggestions ||
    raw.response_suggestion ||
    raw.responseSuggestions;
  transformed.responseSuggestions =
    normalizeResponseSuggestions(rawSuggestions);

  // Default sequence position
  if (typeof transformed.sequencePosition !== 'number') {
    transformed.sequencePosition = 0;
  }

  // Default isActive
  if (typeof transformed.isActive !== 'boolean') {
    transformed.isActive = true;
  }

  return transformed;
}

/**
 * Transform a raw story to normalized format.
 */
function transformStory(raw: Record<string, unknown>): Record<string, unknown> {
  const transformed = transformEntity('story', raw);

  // Handle description that might be a string
  if (typeof transformed.description === 'string') {
    transformed.description = { summary: transformed.description };
  }

  // Normalize story type
  if (transformed.storyType) {
    const type = String(transformed.storyType).toLowerCase();
    if (type === 'story' || type === 'aula') {
      transformed.storyType = type;
    }
  }

  return transformed;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Validation Function
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validate and transform raw LLM story output to normalized format.
 *
 * This function:
 * 1. Parses the raw input loosely (accepts various field names)
 * 2. Transforms to canonical field names
 * 3. Validates against strict normalized schemas
 * 4. Returns structured result with data, warnings, and errors
 *
 * @param raw - Raw LLM output (object or JSON string)
 * @returns Validation result with transformed data if successful
 */
export function validateLLMStoryOutput(
  raw: unknown
): ValidationResult<NormalizedStoryOutput> {
  const warnings: ValidationWarning[] = [];
  const errors: ValidationWarning[] = [];

  // Parse JSON if string
  let parsed: unknown = raw;
  if (typeof raw === 'string') {
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      return {
        success: false,
        warnings: [],
        errors: [{ path: '', message: 'Invalid JSON input' }],
      };
    }
  }

  if (!parsed || typeof parsed !== 'object') {
    return {
      success: false,
      warnings: [],
      errors: [{ path: '', message: 'Input must be an object' }],
    };
  }

  const input = parsed as Record<string, unknown>;

  // Extract story (might be nested under story or story_info)
  const rawStory = (input.story || input.story_info || {}) as Record<
    string,
    unknown
  >;
  const story = transformStory(rawStory);

  // Check for missing story ID
  if (!story.systemName) {
    errors.push({
      path: 'story.systemName',
      message: 'Story is missing systemName (story_id)',
    });
  }
  if (!story.displayName) {
    warnings.push({
      path: 'story.displayName',
      message: 'Story is missing displayName (title)',
    });
    story.displayName = story.systemName || 'Untitled';
  }

  // Extract characters (might be nested under characters, cast, or entities.characters)
  const rawCharacters = (input.characters ||
    input.cast ||
    (input.entities as Record<string, unknown>)?.characters ||
    []) as Record<string, unknown>[];

  const characters = rawCharacters.map((c, i) => {
    const transformed = transformCharacter(c);

    if (!transformed.systemName) {
      warnings.push({
        path: `characters[${i}].systemName`,
        message: `Character at index ${i} missing systemName (id)`,
      });
      transformed.systemName = `character_${i}`;
    }
    if (!transformed.displayName) {
      transformed.displayName = transformed.systemName as string;
    }

    return transformed;
  });

  // Extract chats (might be under chats, new_chats, conversations, rooms, or entities.chats)
  const rawChats = (input.chats ||
    input.new_chats ||
    input.conversations ||
    input.rooms ||
    (input.entities as Record<string, unknown>)?.chats ||
    []) as Record<string, unknown>[];

  const chats = rawChats.map((c, i) => {
    const transformed = transformChat(c);

    if (!transformed.systemName) {
      warnings.push({
        path: `chats[${i}].systemName`,
        message: `Chat at index ${i} missing systemName (chat_id)`,
      });
      transformed.systemName = `chat_${i}`;
    }
    if (!transformed.displayName) {
      transformed.displayName = transformed.systemName as string;
    }

    return transformed;
  });

  // Extract beats (might be under beats or all_beats)
  const rawBeats = (input.beats || input.all_beats || []) as Record<
    string,
    unknown
  >[];

  const beats = rawBeats.map((b, i) => {
    const transformed = transformBeat(b);

    if (!transformed.systemName) {
      warnings.push({
        path: `beats[${i}].systemName`,
        message: `Beat at index ${i} missing systemName (beat_id)`,
      });
      transformed.systemName = `beat_${i}`;
    }
    if (!transformed.displayName) {
      transformed.displayName = transformed.systemName as string;
    }
    if (!transformed.conversationId) {
      warnings.push({
        path: `beats[${i}].conversationId`,
        message: `Beat ${transformed.systemName} missing conversationId (chat_id)`,
      });
    }

    // Check opening messages
    const openingMessages = transformed.openingMessages as Record<
      string,
      unknown
    >[];
    openingMessages.forEach((msg, j) => {
      if (!msg.sender) {
        warnings.push({
          path: `beats[${i}].openingMessages[${j}].sender`,
          message: `Message missing sender (sender_id)`,
          value: msg,
        });
      }
      if (!msg.content) {
        warnings.push({
          path: `beats[${i}].openingMessages[${j}].content`,
          message: `Message missing content (message)`,
          value: msg,
        });
      }
    });

    return transformed;
  });

  // Build the normalized output
  const output: NormalizedStoryOutput = {
    story: story as NormalizedStory,
    characters: characters as NormalizedCharacter[],
    chats: chats as NormalizedChat[],
    beats: beats as NormalizedBeat[],
  };

  return {
    success: errors.length === 0,
    data: output,
    warnings,
    errors,
  };
}

/**
 * Validate only, returning Zod-style result.
 * Use this for strict validation without transformation warnings.
 */
export function validateStrictStoryOutput(
  raw: unknown
): z.SafeParseReturnType<unknown, NormalizedStoryOutput> {
  const result = validateLLMStoryOutput(raw);

  if (!result.success || !result.data) {
    return {
      success: false,
      error: new z.ZodError(
        result.errors.map((e) => ({
          code: z.ZodIssueCode.custom,
          path: e.path.split('.'),
          message: e.message,
        }))
      ),
    };
  }

  return {
    success: true,
    data: result.data,
  };
}
