// Social handles for influencer profiles
export interface SocialHandles {
  tiktok?: string;      // handle (@ stripped)
  instagram?: string;   // handle (@ stripped)
  youtube?: string;     // channel handle or URL
  twitter?: string;     // handle (@ stripped)
  threads?: string;     // handle (@ stripped)
  website?: string;     // full URL
}

// Brand info for story partnerships
export interface BrandInfo {
  isBranded?: boolean;    // Explicit flag for filtering
  partnerName?: string;   // Sponsoring brand/company name
  promoCode?: string;     // Associated discount code
  ctaUrl?: string;        // Call-to-action link
  ctaText?: string;       // CTA button text (e.g., "Shop Now")
}

// Story influencer (for branded stories)
export interface StoryInfluencer {
  id: string;
  name: string;
  bio?: string | null;
  profileImage?: string | null;
  socialHandles: SocialHandles;
  isActive: boolean;
  createdAt: string;  // ISO-8601
  updatedAt: string;  // ISO-8601
}

// Story influencer with story count (for admin lists)
export interface StoryInfluencerWithCount extends StoryInfluencer {
  _count: { stories: number };
}
