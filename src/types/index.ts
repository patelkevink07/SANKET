export type PlatformType = 'x' | 'telegram' | 'instagram' | 'facebook' | 'reddit' | 'youtube';

export type PostType = 'post' | 'comment' | 'reply' | 'channel_message';

export type InteractionType = 'like' | 'retweet' | 'reply' | 'mention' | 'share' | 'reaction';

export type EdgeType = 'follow' | 'mention' | 'reply' | 'retweet' | 'co_mention';

export type IngestionStatus = 'pending' | 'running' | 'succeeded' | 'failed' | 'rate_limited';

export type PrimarySentiment = 'supportive' | 'against' | 'anxious' | 'excited' | 'sarcastic' | 'neutral';

export interface Account {
  id: string;
  platform_id: PlatformType;
  platform_user_id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url?: string;
  follower_count: number;
  following_count: number;
  account_created_at: string;
  first_seen_at: string;
  last_seen_at: string;
  is_protected: boolean;
  is_bot_suspected: boolean;
  bot_score: number; // 0 to 1
  dominant_sentiment?: PrimarySentiment;
  influence_rank?: number;
  raw_metadata: Record<string, any>;
}

export interface SentimentScore {
  id: string;
  post_id: string;
  primary_label: PrimarySentiment;
  polarity_score: number; // -1.0 to +1.0
  sarcasm_score: number; // 0.0 to 1.0
  anxiety_score: number; // 0.0 to 1.0
  excitement_score: number; // 0.0 to 1.0
  support_score: number; // 0.0 to 1.0
  opposition_score: number; // 0.0 to 1.0
  confidence: number; // 0.0 to 1.0
  model_version: string;
  analyzed_at: string;
}

export interface Post {
  id: string;
  platform_id: PlatformType;
  platform_post_id: string;
  account_id: string;
  account?: Account;
  parent_post_id?: string;
  post_type: PostType;
  content: string;
  language: string; // e.g. 'hi-en', 'en', 'hi', 'ta'
  posted_at: string;
  ingested_at: string;
  url?: string;
  like_count: number;
  share_count: number;
  comment_count: number;
  is_deleted: boolean;
  sentiment?: SentimentScore;
  topics: string[];
  raw_metadata: Record<string, any>;
}

export interface DemographicProfile {
  id: string;
  account_id: string;
  age_bracket: '18-24' | '25-34' | '35-44' | '45-54' | '55+';
  age_confidence: number;
  geography: string;
  geo_confidence: number;
  language: string;
  professional_interest: string;
  interest_confidence: number;
  overall_confidence: number;
  model_version: string;
  computed_at: string;
}

export interface Topic {
  id: string;
  keyword: string;
  normalized_keyword: string;
  category: 'Defense & Policy' | 'Telecom & Infra' | 'Cyber Security' | 'Geopolitics' | 'Public Sentiment' | 'General';
  first_detected_at: string;
}

export interface TrendSnapshot {
  id: string;
  topic_id: string;
  topic_keyword: string;
  category: string;
  platform_id: PlatformType | 'all';
  window_start: string;
  window_end: string;
  mention_count: number;
  velocity: number; // percentage change vs prior window
  rank: number;
  predicted_next_rank: number;
  trajectory: number[]; // sparkline data
  computed_at: string;
}

export interface NetworkEdge {
  id: string;
  source_account_id: string;
  target_account_id: string;
  platform_id: PlatformType;
  edge_type: EdgeType;
  weight: number;
  first_seen_at: string;
  last_seen_at: string;
}

export interface InfluenceScore {
  id: string;
  account_id: string;
  platform_id: PlatformType;
  centrality_type: 'betweenness' | 'eigenvector' | 'in_degree';
  score: number;
  rank: number;
  computed_at: string;
}

export interface IngestionJob {
  id: string;
  platform_id: PlatformType;
  status: IngestionStatus;
  started_at: string;
  completed_at?: string;
  records_ingested: number;
  error_message?: string;
  rate_limit_remaining: number;
  rate_limit_reset: string;
  latency_ms: number;
}

export interface FilterState {
  platforms: PlatformType[];
  timeWindow: '1h' | '6h' | '24h' | '7d' | '30d';
  searchQuery: string;
  selectedTopic: string | null;
  excludeBots: boolean;
  sentimentFilter?: PrimarySentiment | 'all';
}

export interface LiveAiInference {
  primary_label: PrimarySentiment;
  polarity_score: number;
  sarcasm_score: number;
  anxiety_score: number;
  excitement_score: number;
  support_score: number;
  opposition_score: number;
  confidence: number;
  model_version: string;
  language_detected: string;
  inferred_demographics: {
    age_bracket: string;
    age_confidence: number;
    geography: string;
    geo_confidence: number;
    language: string;
    professional_interest: string;
    interest_confidence: number;
    overall_confidence: number;
  };
  bot_analysis: {
    is_bot_suspected: boolean;
    bot_score: number;
    reasoning: string;
  };
  topics_extracted: string[];
}

export interface IntelligenceBrief {
  executiveSummary: string;
  keyFindings: string[];
  threatOrAlertLevel: 'LOW' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  recommendedActions: string[];
  generatedAt: string;
}
