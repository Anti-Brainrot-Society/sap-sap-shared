/**
 * Affiliate/Referral System Types
 *
 * Used for tracking affiliate attributions and conversions across
 * mobile app, server, and admin panel.
 *
 * Provider: Insert Affiliate (https://insertaffiliate.com)
 */

// ============================================
// Attribution Types (Mobile → Server)
// ============================================

/** How the user was attributed to an affiliate */
export type AffiliateAttributionSource = 'deep_link' | 'deferred' | 'manual';

/** Affiliate provider identifier */
export type AffiliateProvider = 'insertaffiliate' | 'gomarketme' | 'manual';

/**
 * Attribution data captured when a user is referred by an affiliate.
 * Sent from mobile app to server on registration/login.
 */
export interface AffiliateAttribution {
  /** Unique code identifying the affiliate */
  affiliateCode: string;
  /** Campaign identifier (if applicable) */
  campaignId?: string;
  /** When the attribution was captured */
  attributedAt: Date | string;
  /** How the attribution was detected */
  attributionSource: AffiliateAttributionSource;
  /** Which provider detected the attribution */
  provider: AffiliateProvider;
}

/**
 * Attribution data stored on User record in database.
 * Extends AffiliateAttribution with nullable fields for unattributed users.
 */
export interface UserAffiliateData {
  affiliateCode: string | null;
  affiliateCampaign: string | null;
  affiliateProvider: AffiliateProvider | null;
  affiliateAttributedAt: Date | string | null;
  affiliateSource: AffiliateAttributionSource | null;
}

// ============================================
// Conversion Types (Server/Webhooks)
// ============================================

/** Types of conversion events */
export type AffiliateConversionType =
  | 'trial_started'
  | 'subscription'
  | 'renewal'
  | 'cancellation'
  | 'refund';

/**
 * A conversion event - when a referred user takes a monetizable action.
 */
export interface AffiliateConversion {
  id: string;
  userId: string;
  affiliateCode: string;
  eventType: AffiliateConversionType;
  productId?: string;
  /** Revenue in cents (USD) */
  revenueAmount?: number;
  /** Commission in cents (USD) */
  commissionAmount?: number;
  provider: AffiliateProvider;
  /** External event ID for deduplication */
  providerEventId?: string;
  occurredAt: Date | string;
  createdAt: Date | string;
}

// ============================================
// Affiliate Management Types (Admin)
// ============================================

/** Affiliate type/tier */
export type AffiliateType = 'staff' | 'influencer' | 'user';

/** Affiliate account status */
export type AffiliateStatus = 'active' | 'pending' | 'suspended';

/**
 * An affiliate in the system.
 * Note: Full affiliate management is in Insert Affiliate dashboard.
 * This is for display in admin panel.
 */
export interface Affiliate {
  id: string;
  code: string;
  name: string;
  email?: string;
  type: AffiliateType;
  status: AffiliateStatus;
  /** Commission rate as decimal (0.15 = 15%) */
  commissionRate: number;
  createdAt: Date | string;
}

/**
 * Aggregated earnings for an affiliate over a period.
 */
export interface AffiliateEarnings {
  affiliateCode: string;
  period: {
    start: Date | string;
    end: Date | string;
  };
  /** Number of users who signed up via this affiliate */
  totalSignups: number;
  /** Number of signups that converted to paid */
  totalConversions: number;
  /** Total revenue in cents (USD) */
  totalRevenue: number;
  /** Total commission earned in cents (USD) */
  totalCommission: number;
  /** Commission pending payout in cents */
  pendingPayout: number;
  /** Commission already paid out in cents */
  paidOut: number;
}

/**
 * Summary stats for admin dashboard.
 */
export interface AffiliateStats {
  code: string;
  signups: number;
  conversions: number;
  /** Revenue in cents */
  revenue: number;
  /** Commission in cents */
  commission: number;
}

// ============================================
// API Request/Response Types
// ============================================

/**
 * Request body when saving attribution on registration.
 */
export interface SaveAttributionRequest {
  affiliateCode: string;
  affiliateCampaign?: string;
  affiliateSource?: AffiliateAttributionSource;
}

/**
 * Response from attribution update endpoint.
 */
export interface SaveAttributionResponse {
  updated: boolean;
  reason?: 'already_attributed' | 'invalid_code';
  existingCode?: string;
}

/**
 * Query params for fetching affiliate stats.
 */
export interface AffiliateStatsQuery {
  since?: string; // ISO-8601 date
  affiliateCode?: string;
  type?: AffiliateType;
}

/**
 * Response from admin affiliate stats endpoint.
 */
export interface AffiliateStatsResponse {
  period: {
    since: string;
  };
  affiliates: AffiliateStats[];
  totals: {
    signups: number;
    conversions: number;
    revenue: number;
    commission: number;
  };
}

// ============================================
// Webhook Types (Insert Affiliate → Server)
// ============================================

/**
 * Webhook event types from Insert Affiliate.
 * Note: Actual payload structure should be confirmed with Insert Affiliate docs.
 */
export type InsertAffiliateWebhookType =
  | 'conversion'
  | 'refund'
  | 'affiliate_created'
  | 'affiliate_updated'
  | 'payout_completed';

/**
 * Base webhook payload from Insert Affiliate.
 */
export interface InsertAffiliateWebhookPayload {
  event_id: string;
  event_type: InsertAffiliateWebhookType;
  timestamp: string;
  data: Record<string, unknown>;
}

/**
 * Conversion webhook payload.
 */
export interface InsertAffiliateConversionPayload {
  event_id: string;
  event_type: 'conversion';
  timestamp: string;
  data: {
    affiliate_code: string;
    user_id?: string;
    product_id?: string;
    revenue_cents?: number;
    commission_cents?: number;
    transaction_id?: string;
  };
}
