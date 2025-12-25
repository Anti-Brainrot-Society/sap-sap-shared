import { describe, it, expect } from 'vitest';
import {
  validateLLMStoryOutput,
  transformEntity,
  normalizeLanguages,
  transformPremadeMessages,
} from '../llmOutput';

describe('Field Transformations', () => {
  describe('transformEntity', () => {
    it('transforms character fields from snake_case to camelCase', () => {
      const raw = {
        id: 'char_lucas',
        name: 'Lucas',
        is_user: false,
        age_group: 'young_adult',
        voice_personality: { stability: 0.7 },
      };
      const result = transformEntity('character', raw);

      expect(result.systemName).toBe('char_lucas');
      expect(result.displayName).toBe('Lucas');
      expect(result.isUser).toBe(false);
      expect(result.ageGroup).toBe('young_adult');
      expect(result.voiceConfig).toEqual({ stability: 0.7 });
    });

    it('transforms premade message fields correctly', () => {
      const raw = {
        sender_id: 'lucas',
        message: 'Hola, como estas?',
        language: 'es',
      };
      const result = transformEntity('premadeMessage', raw);

      expect(result.sender).toBe('lucas');
      expect(result.content).toBe('Hola, como estas?');
      expect(result.languages).toBe('es'); // normalizeLanguages called separately
    });

    it('transforms beat fields with conversation reference', () => {
      const raw = {
        beat_id: 'beat_001',
        chat_id: 'lucas_dm',
        sequence_number: 1,
        premade_messages: [{ sender_id: 'lucas', message: 'Hey!' }],
      };
      const result = transformEntity('beat', raw);

      expect(result.systemName).toBe('beat_001');
      expect(result.conversationId).toBe('lucas_dm');
      expect(result.sequencePosition).toBe(1);
      expect(result.openingMessages).toEqual([{ sender_id: 'lucas', message: 'Hey!' }]);
    });

    it('passes through unknown fields unchanged', () => {
      const raw = {
        id: 'test',
        custom_field: 'value',
        another_unknown: 123,
      };
      const result = transformEntity('character', raw);

      expect(result.systemName).toBe('test');
      expect(result.custom_field).toBe('value');
      expect(result.another_unknown).toBe(123);
    });
  });

  describe('normalizeLanguages', () => {
    it('converts string to array', () => {
      expect(normalizeLanguages('es')).toEqual(['es']);
    });

    it('keeps array as-is', () => {
      expect(normalizeLanguages(['es', 'en'])).toEqual(['es', 'en']);
    });

    it('returns empty array for undefined', () => {
      expect(normalizeLanguages(undefined)).toEqual([]);
    });

    it('filters non-string values from array', () => {
      expect(normalizeLanguages(['es', 123, 'en', null])).toEqual(['es', 'en']);
    });
  });

  describe('transformPremadeMessages', () => {
    it('transforms array of messages', () => {
      const messages = [
        { sender_id: 'lucas', message: 'Hola!' },
        { sender_id: 'user', message: 'Hi!' },
      ];
      const result = transformPremadeMessages(messages);

      expect(result).toHaveLength(2);
      expect(result[0].sender).toBe('lucas');
      expect(result[0].content).toBe('Hola!');
    });

    it('handles object format (keyed by id)', () => {
      const messages = {
        msg_1: { sender_id: 'lucas', message: 'Hola!' },
        msg_2: { sender_id: 'user', message: 'Hi!' },
      };
      const result = transformPremadeMessages(messages);

      expect(result).toHaveLength(2);
      expect(result[0].sender).toBe('lucas');
    });

    it('returns empty array for null/undefined', () => {
      expect(transformPremadeMessages(null)).toEqual([]);
      expect(transformPremadeMessages(undefined)).toEqual([]);
    });
  });
});

describe('validateLLMStoryOutput', () => {
  describe('basic validation', () => {
    it('validates minimal story output', () => {
      const input = {
        story: { story_id: 'test_story', title: 'Test Story' },
        characters: [],
        chats: [],
        beats: [],
      };
      const result = validateLLMStoryOutput(input);

      expect(result.success).toBe(true);
      expect(result.data?.story.systemName).toBe('test_story');
      expect(result.data?.story.displayName).toBe('Test Story');
    });

    it('handles JSON string input', () => {
      const input = JSON.stringify({
        story: { story_id: 'test', title: 'Test' },
        characters: [],
        chats: [],
        beats: [],
      });
      const result = validateLLMStoryOutput(input);

      expect(result.success).toBe(true);
    });

    it('returns error for invalid JSON', () => {
      const result = validateLLMStoryOutput('{ invalid json }');

      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].message).toContain('Invalid JSON');
    });
  });

  describe('character validation', () => {
    it('transforms character fields correctly', () => {
      const input = {
        story: { story_id: 'test', title: 'Test' },
        characters: [
          {
            id: 'lucas',
            name: 'Lucas',
            is_user: false,
            gender: 'male',
            age_group: 'young_adult',
            voicePersonality: { stability: 0.7, speed: 1.0 },
            region: 'Mexico City',
          },
          {
            id: 'user',
            name: 'Player',
            isUser: true,
          },
        ],
        chats: [],
        beats: [],
      };
      const result = validateLLMStoryOutput(input);

      expect(result.success).toBe(true);
      const lucas = result.data?.characters[0];
      expect(lucas?.systemName).toBe('lucas');
      expect(lucas?.displayName).toBe('Lucas');
      expect(lucas?.isUser).toBe(false);
      expect(lucas?.gender).toBe('male');
      expect(lucas?.ageGroup).toBe('young_adult');
      expect(lucas?.voiceConfig).toEqual({ stability: 0.7, speed: 1.0 });
      expect(lucas?.region).toBe('Mexico City');

      const user = result.data?.characters[1];
      expect(user?.isUser).toBe(true);
    });
  });

  describe('beat and message validation', () => {
    it('transforms beat messages with sender_id and message fields', () => {
      const input = {
        story: { story_id: 'test', title: 'Test' },
        characters: [{ id: 'lucas', name: 'Lucas' }],
        chats: [{ chat_id: 'lucas_dm', title: 'Lucas DM', type: 'dm' }],
        beats: [
          {
            beat_id: 'beat_001',
            chat_id: 'lucas_dm',
            sequence_number: 1,
            premade_messages: [
              { sender_id: 'lucas', message: 'Hola!', language: 'es' },
              { sender_id: 'lucas', message: 'Como estas?', languages: ['es', 'en'] },
            ],
          },
        ],
      };
      const result = validateLLMStoryOutput(input);

      expect(result.success).toBe(true);
      const beat = result.data?.beats[0];
      expect(beat?.systemName).toBe('beat_001');
      expect(beat?.conversationId).toBe('lucas_dm');
      expect(beat?.openingMessages).toHaveLength(2);

      const msg1 = beat?.openingMessages[0];
      expect(msg1?.sender).toBe('lucas');
      expect(msg1?.content).toBe('Hola!');
      expect(msg1?.languages).toEqual(['es']);

      const msg2 = beat?.openingMessages[1];
      expect(msg2?.languages).toEqual(['es', 'en']);
    });

    it('handles alternative field names for messages', () => {
      const input = {
        story: { story_id: 'test', title: 'Test' },
        characters: [],
        chats: [],
        beats: [
          {
            id: 'beat_001',
            conversation_id: 'chat_1',
            index: 0,
            messages: [
              { sender: 'lucas', content: 'Hey!', languages: ['es'] },
            ],
          },
        ],
      };
      const result = validateLLMStoryOutput(input);

      expect(result.success).toBe(true);
      const beat = result.data?.beats[0];
      expect(beat?.systemName).toBe('beat_001');
      expect(beat?.conversationId).toBe('chat_1');
      expect(beat?.sequencePosition).toBe(0);

      const msg = beat?.openingMessages[0];
      expect(msg?.sender).toBe('lucas');
      expect(msg?.content).toBe('Hey!');
    });
  });

  describe('warnings', () => {
    it('warns about missing conversation ID on beats', () => {
      const input = {
        story: { story_id: 'test', title: 'Test' },
        characters: [],
        chats: [],
        beats: [
          { beat_id: 'beat_001', premade_messages: [] },
        ],
      };
      const result = validateLLMStoryOutput(input);

      expect(result.success).toBe(true);
      expect(result.warnings.some(w => w.message.includes('conversationId'))).toBe(true);
    });

    it('warns about messages missing sender', () => {
      const input = {
        story: { story_id: 'test', title: 'Test' },
        characters: [],
        chats: [],
        beats: [
          {
            beat_id: 'beat_001',
            chat_id: 'chat_1',
            premade_messages: [
              { message: 'Hello!' }, // missing sender_id
            ],
          },
        ],
      };
      const result = validateLLMStoryOutput(input);

      expect(result.warnings.some(w => w.message.includes('sender'))).toBe(true);
    });

    it('warns about messages missing content', () => {
      const input = {
        story: { story_id: 'test', title: 'Test' },
        characters: [],
        chats: [],
        beats: [
          {
            beat_id: 'beat_001',
            chat_id: 'chat_1',
            premade_messages: [
              { sender_id: 'lucas' }, // missing message
            ],
          },
        ],
      };
      const result = validateLLMStoryOutput(input);

      expect(result.warnings.some(w => w.message.includes('content'))).toBe(true);
    });
  });

  describe('alternative root structures', () => {
    it('accepts characters under cast key', () => {
      const input = {
        story: { story_id: 'test', title: 'Test' },
        cast: [{ id: 'lucas', name: 'Lucas' }],
        chats: [],
        beats: [],
      };
      const result = validateLLMStoryOutput(input);

      expect(result.success).toBe(true);
      expect(result.data?.characters).toHaveLength(1);
    });

    it('accepts chats under conversations key', () => {
      const input = {
        story: { story_id: 'test', title: 'Test' },
        characters: [],
        conversations: [{ chat_id: 'chat_1', title: 'Chat 1', type: 'dm' }],
        beats: [],
      };
      const result = validateLLMStoryOutput(input);

      expect(result.success).toBe(true);
      expect(result.data?.chats).toHaveLength(1);
    });

    it('accepts beats under all_beats key', () => {
      const input = {
        story: { story_id: 'test', title: 'Test' },
        characters: [],
        chats: [],
        all_beats: [{ beat_id: 'beat_1', chat_id: 'chat_1' }],
      };
      const result = validateLLMStoryOutput(input);

      expect(result.success).toBe(true);
      expect(result.data?.beats).toHaveLength(1);
    });

    it('accepts story under story_info key', () => {
      const input = {
        story_info: { story_id: 'test', title: 'Test' },
        characters: [],
        chats: [],
        beats: [],
      };
      const result = validateLLMStoryOutput(input);

      expect(result.success).toBe(true);
      expect(result.data?.story.systemName).toBe('test');
    });
  });
});

describe('Real LLM Output Fixtures', () => {
  it('validates typical ChatGPT story output format', () => {
    const input = {
      story: {
        story_id: "sarita_adventure",
        title: "Sarita's Adventure",
        description: {
          summary: "A language learning story set in Mexico City",
          language: "es",
          languageLong: "Spanish",
        },
        settings: {
          target_language: "Spanish",
          native_language: "English",
          target_level: "A2",
          region: "Mexico City",
        },
      },
      characters: [
        {
          character_id: "sarita__lucas",
          name: "Lucas",
          role: "friend",
          gender: "male",
          age_group: "young_adult",
          personality: "Friendly and helpful",
          voice_personality: { stability: 0.75, style: 0.6 },
          is_user: false,
        },
        {
          character_id: "sarita__user",
          name: "You",
          is_user: true,
        },
      ],
      new_chats: [
        {
          chat_id: "lucas_dm",
          display_title: "Lucas",
          type: "dm",
          participants: ["sarita__lucas", "sarita__user"],
        },
      ],
      beats: [
        {
          beat_id: "beat_001",
          chat_id: "lucas_dm",
          display_title: "First Meeting",
          sequence_number: 1,
          premade_messages: [
            {
              sender_id: "sarita__lucas",
              message: "Hola! Soy Lucas. Mucho gusto!",
              language: "es",
              translation: "Hi! I'm Lucas. Nice to meet you!",
              message_note: "Common greeting in Mexico",
            },
            {
              sender_id: "sarita__lucas",
              message: "Como te llamas?",
              language: "es",
              translation: "What's your name?",
            },
          ],
          response_suggestions: [
            "Hola, me llamo...",
            "Mucho gusto, soy...",
          ],
        },
      ],
    };

    const result = validateLLMStoryOutput(input);

    expect(result.success).toBe(true);
    expect(result.warnings.length).toBeLessThan(5); // Some warnings acceptable

    // Verify story transformation
    expect(result.data?.story.systemName).toBe('sarita_adventure');
    expect(result.data?.story.displayName).toBe("Sarita's Adventure");

    // Verify character transformation
    const lucas = result.data?.characters.find(c => c.displayName === 'Lucas');
    expect(lucas?.isUser).toBe(false);
    expect(lucas?.gender).toBe('male');
    expect(lucas?.ageGroup).toBe('young_adult');
    expect(lucas?.voiceConfig).toEqual({ stability: 0.75, style: 0.6 });

    const user = result.data?.characters.find(c => c.isUser);
    expect(user).toBeDefined();

    // Verify beat and message transformation
    const beat = result.data?.beats[0];
    expect(beat?.conversationId).toBe('lucas_dm');
    expect(beat?.openingMessages).toHaveLength(2);

    const firstMsg = beat?.openingMessages[0];
    expect(firstMsg?.sender).toBe('sarita__lucas');
    expect(firstMsg?.content).toBe('Hola! Soy Lucas. Mucho gusto!');
    expect(firstMsg?.languages).toEqual(['es']);
    expect(firstMsg?.translation).toBe('Hi! I\'m Lucas. Nice to meet you!');
    expect(firstMsg?.messageNote).toBe('Common greeting in Mexico');
  });
});
