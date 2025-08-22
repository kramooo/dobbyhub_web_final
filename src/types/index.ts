// Common types for the Union Checker application

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
}

export interface Union {
  id: string
  name: string
  code: string
  description?: string
  isActive: boolean
  memberCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Member {
  id: string
  unionId: string
  userId: string
  membershipNumber: string
  status: MembershipStatus
  joinedAt: Date
  expiresAt?: Date
}

export enum MembershipStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  EXPIRED = 'expired',
}

export interface CheckResult {
  id: string
  memberId: string
  checkedBy: string
  status: CheckStatus
  notes?: string
  checkedAt: Date
}

export enum CheckStatus {
  VERIFIED = 'verified',
  INVALID = 'invalid',
  PENDING = 'pending',
  ERROR = 'error',
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface UserRankData {
  rank: number
  user_id: string
  total_xp: number
  level: number
  current_xp: number
  xp_required: number
  title: string
  display_name: string
  pfp: string
}

export interface UserProfile {
  id: string
  user_id: string
  username: string | null
  full_name: string | null
  country: string | null
  avatar_url: string | null
  bio: string | null
  created_at: string
  updated_at: string
}

export interface ProfileUpdateData {
  username?: string
  full_name?: string
  country?: string
  bio?: string
  avatar_url?: string
}

// Dobby Helpers Types
export interface DobbyHelperType {
  id: string
  name: string
  display_name: string
  description: string
  icon: string
  color_from: string
  color_to: string
  system_prompt: string
  default_language: string
  is_active: boolean
  created_at: string
  updated_at: string
  metadata?: Record<string, any>
}

export interface DobbyHelperSession {
  id: string
  user_id: string
  helper_type_id: string
  title: string
  language: string
  created_at: string
  updated_at: string
  message_count: number
  is_archived: boolean
  metadata?: Record<string, any>
  messages?: DobbyHelperMessage[]
}

export interface DobbyHelperMessage {
  id: string
  session_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  created_at: string
  token_count?: number
  metadata?: Record<string, any>
}

export interface DobbyHelperSessionSummary {
  id: string
  user_id: string
  helper_type_id: string
  title: string
  language: string
  created_at: string
  updated_at: string
  message_count: number
  is_archived: boolean
  helper_type_name: string
  helper_display_name: string
  helper_icon: string
  color_from: string
  color_to: string
  last_message: string
  last_message_role: 'user' | 'assistant' | 'system'
  last_message_at: string
}

// Helper API Response Types
export interface TweetGeneratorResponse {
  tweet: string
  hashtags: string[]
  tone: 'bullish' | 'bearish' | 'neutral' | 'humorous'
  engagement_tips?: string
}

export interface TokenAnalysisResponse {
  analysis: {
    price_prediction: 'bullish' | 'bearish' | 'neutral'
    risk_level: 'low' | 'medium' | 'high'
    key_metrics: {
      market_cap: string
      volume: string
      holders: string
    }
    summary: string
    recommendations: string[]
  }
}

export interface CryptoResearchResponse {
  research: {
    project_name: string
    category: 'DeFi' | 'NFT' | 'Gaming' | 'Infrastructure' | 'Other'
    overview?: string
    strengths: string[]
    weaknesses: string[]
    market_analysis: string
    conclusion: string
    sources: string[]
  }
}

export interface BlockchainEducatorResponse {
  education: {
    topic: string
    explanations: {
      child: {
        level: string
        explanation: string
        analogy: string
        key_point: string
      }
      teen: {
        level: string
        explanation: string
        analogy: string
        key_point: string
      }
      college: {
        level: string
        explanation: string
        analogy: string
        technical_details: string
        key_point: string
      }
      grad: {
        level: string
        explanation: string
        technical_details: string
        research_context: string
        implications: string
        key_point: string
      }
      expert: {
        level: string
        explanation: string
        technical_specifications: string
        mathematical_foundations: string
        current_research: string
        practical_applications: string
        key_point: string
      }
    }
    learning_path: {
      prerequisites: string[]
      next_topics: string[]
      difficulty_progression: string
    }
  }
}

