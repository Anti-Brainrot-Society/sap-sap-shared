/**
 * Voice metadata types for TTS (Text-to-Speech) generation
 */

// Gender options for voice selection
export type Gender = 'male' | 'female' | 'neutral';

// Age group options for voice selection
export type AgeGroup = 'child' | 'young' | 'adult' | 'elderly';

// Voice provider options
export type VoiceProvider = 'chatterbox' | 'piper' | 'polly' | 'kokoro';

/**
 * Voice metadata attached to characters for TTS
 */
export interface VoiceMetadata {
  gender?: Gender | null;
  ageGroup?: AgeGroup | null;
  voiceId?: string | null; // Explicit voice override (e.g., 'piper-es-davefx')
}

/**
 * Voice profile for TTS generation
 */
export interface VoiceProfile {
  id: string;
  provider: VoiceProvider;
  voiceId: string; // Provider-specific voice ID
  displayName: string;
  language: string; // ISO language code (e.g., 'es', 'en', 'pt')
  gender: Gender;
  ageGroup: AgeGroup;
  sampleUrl?: string; // URL to sample audio
}

/**
 * Voice generation request
 */
export interface VoiceGenerationRequest {
  text: string;
  language: string;
  characterId?: string;
  voiceProfile?: VoiceProfile;
  // Optional overrides
  speed?: number; // 0.5 - 2.0, default 1.0
  emotion?: string; // For providers that support it (e.g., 'happy', 'sad')
  emotionIntensity?: number; // 0 - 1, default 0.5
}

/**
 * Voice generation result
 */
export interface VoiceGenerationResult {
  audioUrl: string; // URL to generated audio (R2/CDN)
  audioBuffer?: ArrayBuffer; // Raw audio buffer (optional)
  format: 'mp3' | 'wav' | 'ogg';
  durationMs: number;
  provider: VoiceProvider;
  voiceId: string;
  cached: boolean; // Whether this was served from cache
}

/**
 * Voice audio cache entry (stored in DB or R2 metadata)
 */
export interface VoiceCacheEntry {
  id: string;
  textHash: string; // Hash of the text content
  characterId?: string;
  beatId?: string;
  messageIndex?: number;
  audioUrl: string;
  durationMs: number;
  provider: VoiceProvider;
  voiceId: string;
  createdAt: string; // ISO timestamp
}

/**
 * Batch voice generation request
 */
export interface BatchVoiceGenerationRequest {
  items: Array<{
    id: string; // Beat ID or message ID
    text: string;
    characterId?: string;
    language: string;
  }>;
  provider?: VoiceProvider;
  dryRun?: boolean;
}

/**
 * Batch voice generation result
 */
export interface BatchVoiceGenerationResult {
  ok: boolean;
  dryRun: boolean;
  total: number;
  processed: number;
  cached: number; // Already had audio
  generated: number; // Newly generated
  errors: number;
  results: Record<string, {
    ok: boolean;
    audioUrl?: string;
    durationMs?: number;
    cached?: boolean;
    error?: string;
  }>;
}
