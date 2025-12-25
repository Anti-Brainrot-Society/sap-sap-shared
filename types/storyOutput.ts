/**
 * Pure TypeScript types for LLM story output.
 *
 * These types are safe to import in mobile (no Zod runtime dependency).
 * For validation, use the Zod schemas from '@anti-brainrot-society/shared/schemas/llmOutput'.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Premade Message Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Raw premade message as output by LLM (snake_case, various field names).
 */
export interface RawPremadeMessage {
  sender_id?: string;
  sender?: string;
  message?: string;
  content?: string;
  language?: string;
  languages?: string[];
  message_note?: string;
  translation?: string;
  phonetic?: string;
  delay_seconds?: number;
  delaySeconds?: number;
  senderDisplayName?: string;
  sender_name?: string;
}

/**
 * Normalized premade message with canonical field names.
 */
export interface PremadeMessage {
  sender: string;
  content: string;
  languages: string[];
  senderDisplayName?: string;
  translation?: string;
  phonetic?: string;
  delaySeconds?: number;
  messageNote?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Character Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Raw character as output by LLM.
 */
export interface RawCharacter {
  id?: string;
  character_id?: string;
  name?: string;
  displayName?: string;
  role?: string;
  personality?: string;
  gender?: 'male' | 'female' | 'neutral' | string;
  age_group?: string;
  ageGroup?: string;
  region?: string;
  voicePersonality?: VoiceConfig;
  voice_personality?: VoiceConfig;
  voiceConfig?: VoiceConfig;
  backstory?: string;
  typing_style?: string;
  emoji_usage?: string;
  ongoing_storylines?: string;
  relationship_to_user?: string;
  language_mixing_pattern?: string;
  isUser?: boolean;
  is_user?: boolean;
  lesson?: CharacterLesson;
  prompt_context?: Record<string, unknown>;
}

/**
 * Normalized character with canonical field names.
 */
export interface Character {
  systemName: string;
  displayName: string;
  role?: string;
  personality?: string;
  gender?: 'male' | 'female' | 'neutral';
  ageGroup?: string;
  region?: string;
  voiceConfig?: VoiceConfig;
  backgroundInfo?: string;
  speakingStyle?: string;
  isUser: boolean;
  lesson?: CharacterLesson;
  promptContext?: Record<string, unknown>;
}

export interface VoiceConfig {
  stability?: number;
  style?: number;
  speed?: number;
}

export interface CharacterLesson {
  teaching_role?: string;
  pedagogical_function?: string;
  language_exposure?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Chat/Conversation Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Raw chat as output by LLM.
 */
export interface RawChat {
  chat_id?: string;
  id?: string;
  type?: 'dm' | 'group' | 'individual' | string;
  display_title?: string;
  title?: string;
  name?: string;
  participants?: string[];
  description?: string;
  learning_environment?: string;
  prompt_context?: Record<string, unknown>;
}

/**
 * Normalized chat with canonical field names.
 */
export interface Chat {
  systemName: string;
  displayName: string;
  conversationType: 'dm' | 'group' | 'individual';
  participants: string[];
  description?: string;
  learningEnvironment?: string;
  promptContext?: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Beat Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Raw beat as output by LLM.
 */
export interface RawBeat {
  beat_id?: string;
  id?: string;
  display_title?: string;
  title?: string;
  chat_id?: string;
  conversation_id?: string;
  conversationId?: string;
  type?: string;
  participants?: string[];
  sequence_number?: number;
  sequencePosition?: number;
  premade_messages?: RawPremadeMessage[];
  openingMessages?: RawPremadeMessage[] | Record<string, RawPremadeMessage>;
  messages?: RawPremadeMessage[];
  problem_type?: string;
  response_suggestion?: string | string[];
  response_suggestions?: string[];
  lesson?: BeatLesson;
  prompt_context?: Record<string, unknown>;
}

/**
 * Normalized beat with canonical field names.
 */
export interface Beat {
  systemName: string;
  displayName: string;
  conversationId: string;
  sequencePosition: number;
  openingMessages: PremadeMessage[];
  participants?: string[];
  problemType?: string;
  responseSuggestions?: string[];
  lesson?: BeatLesson;
  promptContext?: Record<string, unknown>;
  isActive: boolean;
}

export interface BeatLesson {
  learning_focus?: string;
  key_structures?: string[];
  key_vocabulary?: string[];
  cultural_element?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Story Types
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Raw story as output by LLM.
 */
export interface RawStory {
  story_id?: string;
  systemName?: string;
  story_type?: 'story' | 'aula' | string;
  genre?: string;
  story_code?: string;
  title?: string;
  description?: StoryDescription | string;
  settings?: StorySettings;
  lesson?: StoryLesson;
  prompt_context?: Record<string, unknown>;
}

/**
 * Normalized story with canonical field names.
 */
export interface Story {
  systemName: string;
  displayName: string;
  storyType?: 'story' | 'aula';
  genre?: string;
  storyCode?: string;
  description?: StoryDescription;
  settings?: StorySettings;
  lesson?: StoryLesson;
  promptContext?: Record<string, unknown>;
}

export interface StoryDescription {
  summary?: string;
  language?: string;
  languageLong?: string;
  friends?: string;
}

export interface StorySettings {
  native_language?: string;
  nativeLanguage?: string;
  target_language?: string;
  targetLanguage?: string;
  target_level?: string;
  level?: string;
  starting_city?: string;
  region?: string;
  user_backstory?: string;
  user_living_situation?: string;
  season?: string;
  user_interests?: string[];
}

export interface StoryLesson {
  story_level_objectives?: string[];
  vocabulary_introduction_strategy?: string;
  grammar_progression?: string;
  cultural_integration?: string;
  assessment_opportunities?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Full Story Output (LLM Response)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Raw story output as produced by LLM.
 * All fields use snake_case or mixed conventions.
 */
export interface RawStoryOutput {
  story?: RawStory;
  story_info?: RawStory;
  characters?: RawCharacter[];
  cast?: RawCharacter[];
  chats?: RawChat[];
  new_chats?: RawChat[];
  conversations?: RawChat[];
  rooms?: RawChat[];
  beats?: RawBeat[];
  all_beats?: RawBeat[];
  entities?: {
    characters?: RawCharacter[];
    chats?: RawChat[];
  };
}

/**
 * Normalized story output with canonical field names.
 */
export interface NormalizedStoryOutput {
  story: Story;
  characters: Character[];
  chats: Chat[];
  beats: Beat[];
}
