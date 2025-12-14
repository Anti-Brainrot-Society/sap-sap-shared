// Feature Flags: typed sets and helpers
// Organize flags by feature set to avoid a flat, unstructured bag of keys.

export type FeatureFlagPrimitive = boolean | number | string;

// =============================================================================
// ACTIVE FLAGS - These are in use and managed via the feature flags system
// =============================================================================

// Chat-related flags
export interface ChatFlags {
  // Guided Reading practice mode (Easy/Hard) UI and logic
  enableGuidedReadingMode: boolean;

  // --- DEPRECATED: Remove after regression testing ---
  /** @deprecated Always true - remove after cleanup */
  newMessagingV2: boolean;
  /** @deprecated Not implemented - remove after cleanup */
  enableThreads: boolean;
  /** @deprecated Always true - remove after cleanup */
  enableReadReceipts: boolean;
  /** @deprecated Always true - remove after cleanup */
  enableTypingIndicators: boolean;
  /** @deprecated Not implemented - remove after cleanup */
  enableGiphy: boolean;
  /** @deprecated Should be false in prod - remove after cleanup */
  useMockConversations: boolean;
  /** @deprecated Should be false in prod - remove after cleanup */
  useMockMessages: boolean;
  /** @deprecated Not implemented - remove after cleanup */
  enableCameraButton: boolean;
  /** @deprecated Always true - remove after cleanup */
  clientBeatTriggers: boolean;
  /** @deprecated Always false - remove after cleanup */
  clientBeatTriggersAppOpen: boolean;
}

// Notifications-related flags
export interface NotificationsFlags {
  // Enable advanced push debug tooling in-app
  enablePushDebugTools: boolean;
  // Use OneSignal client SDK when installed and configured
  useOneSignalClient: boolean;
  // Show in-app banners when new beats are available
  enableInAppBeatAlerts: boolean;
  // Prefer in-app banner over OS alert when app is foreground
  preferInAppWhenForeground: boolean;
}

// Debug/Developer tooling flags
export interface DebugFlags {
  // Expose debug-only screens and controls
  debugMode: boolean;
  // Show a feature flags inspector (when implemented)
  showFeatureFlagsInspector: boolean;
}

// Paywall-related flags (mobile app)
export interface PaywallFlags {
  // Enable client-side paywall gating
  enabled: boolean;
  // Number of free beats per story before requiring Pro
  freeBeatsPerStory: number;
  // Prefer showing native RC paywall UI when available
  useNativePaywallUI: boolean;
}

// Teacher Portal flags
export interface TeacherPortalFlags {
  // Whether to enforce trial expiry (false = rolling extensions pre-launch)
  enforceTrialExpiry: boolean;
  // Number of days for auto-granted trial on signup
  autoTrialDays: number;
  // Enable TikTok content creator feature
  tiktokEnabled: boolean;
  // Enable pack builder feature
  packBuilderEnabled: boolean;
}

// =============================================================================
// DEPRECATED FLAG SETS - Remove entire sections after regression testing
// =============================================================================

/** @deprecated Entire set unused - remove after cleanup */
export interface OnboardingFlags {
  useNewOnboarding: boolean;
  showInterestsStep: boolean;
}

export interface ProfileFlags {
  /** @deprecated Unused - remove after cleanup */
  enableExperimentalProfile: boolean;
  /** @deprecated Unused - remove after cleanup */
  allowAvatarUploadR2: boolean;
  // Shows new learning profile screen with streaks/stats instead of settings
  learningProfileUiEnabled: boolean;
}

/** @deprecated Entire set unused - remove after cleanup */
export interface LessonsFlags {
  enabled: boolean;
}

// =============================================================================

export interface FeatureFlags {
  chat: ChatFlags;
  notifications: NotificationsFlags;
  debug: DebugFlags;
  paywall: PaywallFlags;
  // Teacher Portal flags (paywall, features)
  teacherPortal: TeacherPortalFlags;
  // Profile flags (learning profile, etc.)
  profile: ProfileFlags;
  // --- DEPRECATED SETS ---
  /** @deprecated Remove after cleanup */
  onboarding: OnboardingFlags;
  /** @deprecated Remove after cleanup */
  lessons: LessonsFlags;
}

export type FeatureFlagSetName = keyof FeatureFlags; // 'chat' | 'onboarding' | ...

// Utility: Flag key within a given set, e.g., FlagKey<'chat'> -> keyof ChatFlags
export type FlagKey<S extends FeatureFlagSetName> = keyof FeatureFlags[S] & string;

// Utility: Dotted path key: "chat.newMessagingV2" | "onboarding.useNewOnboarding" | ...
export type FeatureFlagPath = {
  [S in FeatureFlagSetName]: `${S}.${FlagKey<S>}`
}[FeatureFlagSetName];

// Resolve the value type for a dotted path key
export type FeatureFlagValueByPath<K extends FeatureFlagPath> = K extends `${infer S}.${infer P}`
  ? S extends FeatureFlagSetName
    ? P extends keyof FeatureFlags[S]
      ? FeatureFlags[S][P]
      : never
    : never
  : never;

// Provider interface used by both mobile and server implementations
export interface FeatureFlagsProvider {
  // Initialize provider (fetch/activate config, load overrides, etc.)
  init(): Promise<void> | void;

  // Get all flags (structured object)
  getAll(): FeatureFlags;

  // Read a single key via dotted path, e.g., "chat.newMessagingV2"
  get<K extends FeatureFlagPath>(key: K): FeatureFlagValueByPath<K>;

  // Optional: local override management (dev/testing)
  setOverride?<K extends FeatureFlagPath>(key: K, value: FeatureFlagValueByPath<K>): Promise<void> | void;
  clearOverride?<K extends FeatureFlagPath>(key: K): Promise<void> | void;
  clearAllOverrides?(): Promise<void> | void;

  // Optional: force refresh from remote provider
  refresh?(): Promise<void> | void;

  // Optional: subscribe to flag changes (provider decides when to emit)
  subscribe?(cb: (flags: FeatureFlags) => void): () => void;
}

// Helper: A flattened map representation using dotted keys
export type FlattenedFeatureFlags = Record<FeatureFlagPath, FeatureFlagPrimitive>;
