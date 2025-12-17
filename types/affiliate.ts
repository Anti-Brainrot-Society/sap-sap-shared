/**
 * Affiliate/Referral System Types
 *
 * Used for tracking affiliate attributions and conversions across
 * mobile app, server, and admin panel.
 *
 * Mobile Provider: GoMarketMe (https://gomarketme.co)
 * Web Provider (Future): Rewardful or FirstPromoter (TBD)
 */

// ============================================
// Attribution Types (Mobile → Server)
// ============================================

/** How the user was attributed to an affiliate */
export type AffiliateAttributionSource = 'deep_link' | 'deferred' | 'manual';

/** Affiliate provider identifier */
export type AffiliateProvider =
  | 'gomarketme'      // Mobile app affiliates
  | 'rewardful'       // Web affiliates (future)
  | 'firstpromoter'   // Web affiliates (future)
  | 'manual';         // Manual attribution

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
 * Note: Full affiliate management is in provider dashboard (GoMarketMe, etc).
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
// Webhook Types (GoMarketMe → Server)
// ============================================

/**
 * Webhook event types from GoMarketMe.
 * Note: Confirm exact payload structure with GoMarketMe docs.
 */
export type GoMarketMeWebhookType =
  | 'conversion'
  | 'refund'
  | 'payout';

/**
 * Base webhook payload from GoMarketMe.
 */
export interface GoMarketMeWebhookPayload {
  event_id: string;
  event_type: GoMarketMeWebhookType;
  timestamp: string;
  data: Record<string, unknown>;
}

/**
 * Conversion webhook payload from GoMarketMe.
 */
export interface GoMarketMeConversionPayload {
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

/**
 * Refund webhook payload from GoMarketMe.
 */
export interface GoMarketMeRefundPayload {
  event_id: string;
  event_type: 'refund';
  timestamp: string;
  data: {
    affiliate_code: string;
    original_event_id?: string;
    refund_amount_cents?: number;
  };
}
