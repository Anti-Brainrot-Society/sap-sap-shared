export type AnalyticsEventName =
  | 'App Opened'
  | 'Auth Login Success'
  | 'Auth Logout'
  | 'Profile Updated';

export interface TrackRequest {
  event: AnalyticsEventName | (string & {});
  distinctId?: string;
  properties?: Record<string, unknown>;
  /** ISO-8601 string; if omitted, server uses current time */
  timestamp?: string;
}

export interface TrackResponse {
  enabled: boolean;
  tracked: boolean;
}

