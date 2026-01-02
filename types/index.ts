// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Auth types
export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// Subscriptions / Payments (foundation)
export type SubscriptionStatus = 'inactive' | 'active' | 'past_due' | 'canceled';

export interface SubscriptionInfo {
  provider: 'stripe' | 'revenuecat';
  status: SubscriptionStatus;
  currentPlanId?: string;
  renewsAt?: string; // ISO-8601
}

export interface PaymentsConfig {
  enabled: boolean;
}

// Plans / Catalog
export type PlanInterval = 'month' | 'year' | 'lifetime';

export interface Plan {
  slug: string; // e.g., 'pro-monthly'
  displayName: string; // e.g., 'Pro Monthly'
  interval: PlanInterval;
  price?: string; // e.g., '$9.99'
  currency?: string; // e.g., 'USD'
  stripePriceId?: string; // e.g., 'price_...'
  rcProductId?: string; // e.g., RevenueCat product id
  rcProductIdIos?: string; // iOS-specific product id (if different)
  rcProductIdAndroid?: string; // Android-specific product id (if different)
}

export interface PlanCatalog {
  plans: Plan[];
}

// Lessons types
export * from './lessons';

// Micro-lessons types (for opening messages)
export * from './microLessons';

// Affiliate/referral system types
export * from './affiliate';

// Voice/TTS types
export * from './voice';

// Story output types (LLM output format)
export * from './storyOutput';

// Story influencer types (branded stories)
export * from './storyInfluencer';

// Secret code types (story unlocking)
export * from './secretCode';
