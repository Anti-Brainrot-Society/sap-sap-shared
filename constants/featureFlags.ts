import type {
  FeatureFlags,
  FlattenedFeatureFlags,
  FeatureFlagPrimitive,
  FeatureFlagPath,
} from '../types/featureFlags';

// Default values for all feature flags, organized by feature set.
export const DEFAULT_FLAGS: FeatureFlags = {
  // ===========================================================================
  // ACTIVE FLAGS
  // ===========================================================================
  chat: {
    enableGuidedReadingMode: true,
    // --- DEPRECATED: hardcoded values, remove after cleanup ---
    newMessagingV2: true,
    enableThreads: false,
    enableReadReceipts: true,
    enableTypingIndicators: true,
    enableGiphy: false,
    useMockConversations: false, // Changed to false - should never be true in prod
    useMockMessages: false, // Changed to false - should never be true in prod
    enableCameraButton: false,
    clientBeatTriggers: true,
    clientBeatTriggersAppOpen: false,
  },
  notifications: {
    enablePushDebugTools: false,
    useOneSignalClient: false,
    enableInAppBeatAlerts: true,
    preferInAppWhenForeground: true,
  },
  debug: {
    debugMode: false,
    showFeatureFlagsInspector: false,
  },
  paywall: {
    enabled: false,
    freeBeatsPerStory: 2,
    useNativePaywallUI: true,
  },
  // ===========================================================================
  // DEPRECATED SETS - Remove after regression testing
  // ===========================================================================
  onboarding: {
    useNewOnboarding: false,
    showInterestsStep: false,
  },
  profile: {
    enableExperimentalProfile: false,
    allowAvatarUploadR2: false,
    learningProfileUiEnabled: true, // Shows new learning profile screen with streaks/stats
  },
  lessons: {
    enabled: true,
  },
};

// Utility: flatten structured flags into a dotted-key map
function flatten(obj: FeatureFlags | Record<string, unknown>, prefix = ''): Record<string, FeatureFlagPrimitive> {
  const out: Record<string, FeatureFlagPrimitive> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(out, flatten(v as Record<string, unknown>, key));
    } else {
      out[key] = v as FeatureFlagPrimitive;
    }
  }
  return out;
}

export const DEFAULT_FLAG_MAP = flatten(DEFAULT_FLAGS) as FlattenedFeatureFlags;

// Narrow helpers for runtime safety
export function isFeatureFlagPath(key: string): key is FeatureFlagPath {
  return Object.prototype.hasOwnProperty.call(DEFAULT_FLAG_MAP, key);
}
