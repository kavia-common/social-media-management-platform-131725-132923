/**
 * Data models for the frontend. Adjust fields to match backend OpenAPI responses.
 */

export type UUID = string;

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface User {
  id: UUID;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export type Platform = 'facebook' | 'instagram' | 'twitter' | 'youtube';

export interface SocialAccount {
  id: UUID;
  platform: Platform;
  handle: string;
  connectedAt: string; // ISO
  status: 'connected' | 'expired' | 'revoked';
}

export interface ScheduledPost {
  id: UUID;
  platform: Platform;
  content: string;
  mediaUrls?: string[];
  scheduledAt: string; // ISO
  status: 'scheduled' | 'posted' | 'failed' | 'canceled';
  targetAccounts: UUID[]; // SocialAccount IDs
}

export interface PostedItem {
  id: UUID;
  platform: Platform;
  content: string;
  mediaUrls?: string[];
  postedAt: string; // ISO
  metrics?: Record<string, number>;
  targetAccounts: UUID[];
}

export interface AnalyticsKPI {
  label: string;
  value: number;
  delta?: number;
}

export interface AnalyticsSeriesPoint {
  x: string | number; // time or category
  y: number;
}

export interface AnalyticsSeries {
  label: string;
  points: AnalyticsSeriesPoint[];
}

export interface AutomationRule {
  id: UUID;
  name: string;
  description?: string;
  active: boolean;
  trigger: {
    type: 'time' | 'event' | 'metric';
    cron?: string; // for time
    eventName?: string;
    metric?: string;
    condition?: 'gt' | 'gte' | 'eq' | 'lte' | 'lt';
    threshold?: number;
  };
  action: {
    type: 'post' | 'reschedule' | 'notify';
    templateId?: string;
    delayMinutes?: number;
  };
  createdAt: string;
  updatedAt: string;
}
