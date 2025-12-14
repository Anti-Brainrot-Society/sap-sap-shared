/**
 * Micro-Lessons Schema for Opening Messages
 *
 * This defines the compact per-message micro-lessons structure stored in
 * story_beats.openingMessagesLessons. These are small, contextual lessons
 * tied to specific messages in a beat's opening sequence.
 *
 * Schema version: 1
 *
 * Example JSON:
 * {
 *   "v": 1,
 *   "L": "native",
 *   "items": [
 *     {
 *       "i": 0,
 *       "t": [
 *         { "k": "takeaway", "v": "Key learning point..." },
 *         { "k": "question", "v": { "q": "What does X mean?", "opts": ["A", "B", "C"], "c": 0 } }
 *       ]
 *     }
 *   ]
 * }
 */

// =============================================================================
// Core Types
// =============================================================================

/** Schema version marker */
export const MICRO_LESSONS_SCHEMA_VERSION = 1;

/** Teaching item types */
export type MicroLessonItemKind = 'takeaway' | 'question' | 'pronunciation' | 'cultural' | 'mistake' | 'related';

/** A simple takeaway/tip */
export interface MicroLessonTakeaway {
  k: 'takeaway';
  v: string;
}

/** Pronunciation tip (mainly for A0 learners) */
export interface MicroLessonPronunciation {
  k: 'pronunciation';
  v: string;
}

/** Cultural context note */
export interface MicroLessonCultural {
  k: 'cultural';
  v: string;
}

/** Common mistake warning */
export interface MicroLessonMistake {
  k: 'mistake';
  v: string;
}

/** Related expressions */
export interface MicroLessonRelated {
  k: 'related';
  v: string;
}

/** A quiz question with options */
export interface MicroLessonQuestion {
  k: 'question';
  v: {
    /** The question text */
    q: string;
    /** Answer options (2-4 choices) */
    opts: string[];
    /** Correct answer index (0-based) */
    c: number;
  };
}

/** Union of all teaching item types */
export type MicroLessonTeachingItem =
  | MicroLessonTakeaway
  | MicroLessonPronunciation
  | MicroLessonCultural
  | MicroLessonMistake
  | MicroLessonRelated
  | MicroLessonQuestion;

/** Lessons for a single message in the opening sequence */
export interface MicroLessonMessageItem {
  /** Message index (0-based) in the opening messages array */
  i: number;
  /** Array of teaching items for this message */
  t: MicroLessonTeachingItem[];
}

/** Root schema for openingMessagesLessons */
export interface MicroLessonsSchema {
  /** Schema version (currently 1) */
  v: number;
  /** Language the lessons are written in (e.g., 'native', 'target') */
  L?: string;
  /** Per-message lesson items */
  items: MicroLessonMessageItem[];
}

// =============================================================================
// Parsed/Display Types (for UI consumption)
// =============================================================================

/** Parsed takeaway ready for display */
export interface ParsedTakeaway {
  type: 'takeaway';
  text: string;
}

/** Parsed pronunciation tip */
export interface ParsedPronunciation {
  type: 'pronunciation';
  text: string;
}

/** Parsed cultural note */
export interface ParsedCultural {
  type: 'cultural';
  text: string;
}

/** Parsed common mistake */
export interface ParsedMistake {
  type: 'mistake';
  text: string;
}

/** Parsed related expressions */
export interface ParsedRelated {
  type: 'related';
  text: string;
}

/** Parsed question ready for display */
export interface ParsedQuestion {
  type: 'question';
  question: string;
  options: string[];
  correctIndex: number;
}

/** Union of parsed teaching items */
export type ParsedTeachingItem =
  | ParsedTakeaway
  | ParsedPronunciation
  | ParsedCultural
  | ParsedMistake
  | ParsedRelated
  | ParsedQuestion;

/** Parsed lessons for a single message */
export interface ParsedMessageLessons {
  messageIndex: number;
  items: ParsedTeachingItem[];
}

/** Parsed root structure */
export interface ParsedMicroLessons {
  version: number;
  language?: string;
  messages: ParsedMessageLessons[];
}

// =============================================================================
// Type Guards
// =============================================================================

export function isMicroLessonTakeaway(item: MicroLessonTeachingItem): item is MicroLessonTakeaway {
  return item.k === 'takeaway' && typeof item.v === 'string';
}

export function isMicroLessonPronunciation(item: MicroLessonTeachingItem): item is MicroLessonPronunciation {
  return item.k === 'pronunciation' && typeof item.v === 'string';
}

export function isMicroLessonCultural(item: MicroLessonTeachingItem): item is MicroLessonCultural {
  return item.k === 'cultural' && typeof item.v === 'string';
}

export function isMicroLessonMistake(item: MicroLessonTeachingItem): item is MicroLessonMistake {
  return item.k === 'mistake' && typeof item.v === 'string';
}

export function isMicroLessonRelated(item: MicroLessonTeachingItem): item is MicroLessonRelated {
  return item.k === 'related' && typeof item.v === 'string';
}

export function isMicroLessonQuestion(item: MicroLessonTeachingItem): item is MicroLessonQuestion {
  return (
    item.k === 'question' &&
    typeof item.v === 'object' &&
    item.v !== null &&
    typeof item.v.q === 'string' &&
    Array.isArray(item.v.opts)
  );
}

export function isMicroLessonsSchema(data: unknown): data is MicroLessonsSchema {
  if (typeof data !== 'object' || data === null) return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.v === 'number' &&
    Array.isArray(obj.items)
  );
}

// =============================================================================
// Parser Functions
// =============================================================================

/**
 * Parse raw openingMessagesLessons JSON into a structured format for UI display.
 * Returns null if the data is invalid or missing.
 */
export function parseMicroLessons(raw: unknown): ParsedMicroLessons | null {
  if (!isMicroLessonsSchema(raw)) {
    return null;
  }

  const messages: ParsedMessageLessons[] = [];

  for (const msgItem of raw.items) {
    if (typeof msgItem.i !== 'number' || !Array.isArray(msgItem.t)) {
      continue;
    }

    const items: ParsedTeachingItem[] = [];

    for (const teachItem of msgItem.t) {
      if (isMicroLessonTakeaway(teachItem)) {
        items.push({
          type: 'takeaway',
          text: teachItem.v,
        });
      } else if (isMicroLessonPronunciation(teachItem)) {
        items.push({
          type: 'pronunciation',
          text: teachItem.v,
        });
      } else if (isMicroLessonCultural(teachItem)) {
        items.push({
          type: 'cultural',
          text: teachItem.v,
        });
      } else if (isMicroLessonMistake(teachItem)) {
        items.push({
          type: 'mistake',
          text: teachItem.v,
        });
      } else if (isMicroLessonRelated(teachItem)) {
        items.push({
          type: 'related',
          text: teachItem.v,
        });
      } else if (isMicroLessonQuestion(teachItem)) {
        items.push({
          type: 'question',
          question: teachItem.v.q,
          options: teachItem.v.opts,
          correctIndex: typeof teachItem.v.c === 'number' ? teachItem.v.c : 0,
        });
      }
    }

    if (items.length > 0) {
      messages.push({
        messageIndex: msgItem.i,
        items,
      });
    }
  }

  if (messages.length === 0) {
    return null;
  }

  return {
    version: raw.v,
    language: raw.L,
    messages,
  };
}

/**
 * Get lessons for a specific message index.
 * Returns null if no lessons exist for that message.
 */
export function getLessonsForMessage(
  parsed: ParsedMicroLessons | null,
  messageIndex: number
): ParsedTeachingItem[] | null {
  if (!parsed) return null;
  const msg = parsed.messages.find((m) => m.messageIndex === messageIndex);
  return msg?.items ?? null;
}

/**
 * Check if there are any lessons available for a specific message.
 */
export function hasLessonsForMessage(
  parsed: ParsedMicroLessons | null,
  messageIndex: number
): boolean {
  return getLessonsForMessage(parsed, messageIndex) !== null;
}
