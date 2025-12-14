/**
 * Multi-Type Lessons System - TypeScript Types
 *
 * Supports 4 lesson types:
 * 1. vocab_phrases - Mixed vocabulary and phrases (renamed from "flashcards")
 * 2. vocabulary - Single words only, PURE target language
 * 3. phrases - Multi-word expressions, PURE target language
 * 4. grammar - Grammar concepts with examples and exercises
 *
 * @see apps/server/lib/validation/lessons.ts for Zod validation schemas
 */

// ============================================================================
// Schema Constraints (single source of truth)
// ============================================================================

/**
 * Validation constraints for all lesson content schemas.
 * These match the Zod schemas in apps/server/lib/validation/lessons.ts
 * and should be used by both server validation and mobile rendering.
 */
export const LESSON_SCHEMA_CONSTRAINTS = {
  // vocab_phrases@1
  vocab_phrases: {
    version: 1,
    cards: { min: 1, max: 15 },
    text: { min: 1, max: 500 },
  },

  // vocabulary@1
  vocabulary: {
    version: 1,
    words: { min: 1, max: 20 },
    word: { min: 1, max: 200 },
    translation: { min: 1, max: 500 },
    context: { max: 1000 },
  },

  // phrases@1
  phrases: {
    version: 1,
    phrases: { min: 1, max: 15 },
    phrase: { min: 1, max: 300 },
    translation: { min: 1, max: 500 },
    usage: { max: 500 },
  },

  // grammar@1
  grammar: {
    version: 1,
    concepts: { min: 1, max: 5 },
    name: { min: 1, max: 200 },
    explanation: { min: 1, max: 2000 },
    examples: { min: 1, max: 10 },
    exercises: { max: 5 },
    exampleText: { min: 1, max: 500 },
    exerciseText: { min: 1, max: 500 },
  },
} as const;

/** Current schema versions */
export const LESSON_SCHEMA_VERSIONS = {
  vocab_phrases: 'vocab_phrases@1',
  vocabulary: 'vocabulary@1',
  phrases: 'phrases@1',
  grammar: 'grammar@1',
  batch_lessons: 'batch_lessons@1',
} as const;

// ============================================================================
// Base Types
// ============================================================================

export type LessonType =
  | 'vocab_phrases'  // Mixed vocab and phrases (renamed from flashcards)
  | 'vocabulary'     // Single words only
  | 'phrases'        // Multi-word expressions
  | 'grammar';       // Grammar concepts

export type LessonStatus = 'draft' | 'published' | 'archived';

export type LessonScope = 'story' | 'beat';

// ============================================================================
// Content Types (versioned schemas)
// ============================================================================

// Vocab & Phrases (v1) - Renamed from flashcards@1
export interface VocabPhrasesContent {
  schema: 'vocab_phrases@1';
  cards: VocabPhraseCard[];
}

export interface VocabPhraseCard {
  front: {
    text: string;        // Target language (PURE - no mixing)
    lang: string;        // Language code (e.g., 'es', 'ja')
  };
  back: {
    text: string;        // Native language translation
    lang: string;        // Language code (e.g., 'en')
  };
  hint?: string;         // Optional hint (native language)
  imageUrl?: string;     // Optional image URL
}

// Vocabulary (v1) - Single words only
export interface VocabularyContent {
  schema: 'vocabulary@1';
  words: VocabularyWord[];
}

export interface VocabularyWord {
  word: string;          // Target language word (PURE - no mixing)
  translation: string;   // Native language translation
  partOfSpeech?: string; // noun, verb, adjective, etc.
  context?: string;      // Example sentence in target language
  hint?: string;         // Optional hint (native language)
  imageUrl?: string;     // Optional image URL
}

// Phrases (v1) - Multi-word expressions
export interface PhrasesContent {
  schema: 'phrases@1';
  phrases: Phrase[];
}

export interface Phrase {
  phrase: string;        // Target language multi-word expression (PURE - no mixing)
  translation: string;   // Native language translation
  usage?: string;        // When/how to use it (native language)
  formality?: 'casual' | 'neutral' | 'formal';
  imageUrl?: string;     // Optional image URL
  examples?: {           // Optional example sentences
    target: string;      // Example in target language
    native: string;      // Translation in native language
    note?: string;       // Optional note (native language)
  }[];
}

// Grammar (v1) - Grammar concepts
export interface GrammarContent {
  schema: 'grammar@1';
  concepts: GrammarConcept[];
}

export interface GrammarConcept {
  name: string;          // E.g., "Present Progressive"
  explanation: string;   // Brief explanation (native language)
  headerImageUrl?: string; // Optional header image
  examples: GrammarExample[];
  exercises?: GrammarExercise[];
}

export interface GrammarExample {
  target: string;        // Example in target language
  native: string;        // Translation in native language
  note?: string;         // Optional note (native language)
  imageUrl?: string;     // Optional inline image
}

export interface GrammarExercise {
  prompt: string;        // Exercise prompt (native language)
  answer: string;        // Correct answer (target language)
}

// Union type for all content types
export type LessonContent =
  | VocabPhrasesContent
  | VocabularyContent
  | PhrasesContent
  | GrammarContent;

// ============================================================================
// Batch Generation Types
// ============================================================================

// Batch generation for all 4 types
export interface BatchLessonsContent {
  schema: 'batch_lessons@1';
  results: BatchLessonResult[];
}

export interface BatchLessonResult {
  beat_id: string;
  lessons: {
    vocab_phrases?: VocabPhrasesContent;
    vocabulary?: VocabularyContent;
    phrases?: PhrasesContent;
    grammar?: GrammarContent;
  };
}

// Legacy batch flashcards (backward compatibility)
export interface BatchFlashcardsContent {
  schema: 'batch_flashcards@1';
  results: {
    beat_id: string;
    flashcards: VocabPhrasesContent; // Maps to vocab_phrases now
  }[];
}

// ============================================================================
// Lesson Envelope (API response)
// ============================================================================

export interface LessonEnvelope {
  id: string;
  storyId?: string;
  storyBeatId?: string;
  type: LessonType;
  version: number;
  status: LessonStatus;
  rank: number;
  content: LessonContent;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// Type Guards
// ============================================================================

export function isVocabPhrasesContent(content: LessonContent): content is VocabPhrasesContent {
  return content.schema === 'vocab_phrases@1';
}

export function isVocabularyContent(content: LessonContent): content is VocabularyContent {
  return content.schema === 'vocabulary@1';
}

export function isPhrasesContent(content: LessonContent): content is PhrasesContent {
  return content.schema === 'phrases@1';
}

export function isGrammarContent(content: LessonContent): content is GrammarContent {
  return content.schema === 'grammar@1';
}

export function isBatchLessonsContent(content: any): content is BatchLessonsContent {
  return content.schema === 'batch_lessons@1';
}

export function isBatchFlashcardsContent(content: any): content is BatchFlashcardsContent {
  return content.schema === 'batch_flashcards@1';
}

// ============================================================================
// Validation Helpers
// ============================================================================

export const LESSON_TYPES: LessonType[] = ['vocab_phrases', 'vocabulary', 'phrases', 'grammar'];
export const LESSON_STATUSES: LessonStatus[] = ['draft', 'published', 'archived'];

export function isValidLessonType(type: string): type is LessonType {
  return LESSON_TYPES.includes(type as LessonType);
}

export function isValidLessonStatus(status: string): status is LessonStatus {
  return LESSON_STATUSES.includes(status as LessonStatus);
}

// ============================================================================
// Display Helpers
// ============================================================================

export const LESSON_TYPE_LABELS: Record<LessonType, string> = {
  vocab_phrases: 'Vocab & Phrases',
  vocabulary: 'Vocabulary',
  phrases: 'Phrases',
  grammar: 'Grammar'
};

export function getLessonTypeLabel(type: LessonType): string {
  return LESSON_TYPE_LABELS[type] || type;
}

export const LESSON_TYPE_DESCRIPTIONS: Record<LessonType, string> = {
  vocab_phrases: 'Mixed vocabulary words and multi-word phrases with translations',
  vocabulary: 'Individual vocabulary words with translations and context',
  phrases: 'Multi-word expressions and common phrases',
  grammar: 'Grammar concepts with examples and exercises'
};

export function getLessonTypeDescription(type: LessonType): string {
  return LESSON_TYPE_DESCRIPTIONS[type] || '';
}
