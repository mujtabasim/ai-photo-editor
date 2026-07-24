export type ToolCategory = 
  | 'all'
  | 'enhance'
  | 'erase'
  | 'generative'
  | 'style'
  | 'portrait'
  | 'adjust';

export interface AITool {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  iconName: string;
  gradient: string[];
  isComingSoon: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  badgeText?: string;
}

export type ProcessingStatus = 'completed' | 'processing' | 'failed' | 'queued';

export interface ProjectHistory {
  id: string;
  title: string;
  thumbnailUrl: string;
  thumbnail_url?: string;
  originalUrl: string;
  original_url?: string;
  originalImageId?: string;
  processedUrl?: string;
  processed_url?: string;
  toolUsed: string;
  tool_used?: string;
  createdAt: string;
  created_at?: string;
  status?: ProcessingStatus;
  isFavorite: boolean;
  is_favorite?: boolean;
  fileSize?: string;
  dimensions?: { width: number; height: number };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  plan: 'free' | 'pro' | 'unlimited';
  storageUsedMB: number;
  storageLimitMB: number;
  referralCode: string;
  totalExports: number;
  joinedDate: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  savingsPercentage: number;
  isPopular?: boolean;
  features: string[];
}

export interface AdjustmentState {
  brightness: number;
  contrast: number;
  saturation: number;
  sharpness: number;
  exposure: number;
  vibrance: number;
  shadows: number;
  highlights: number;
  temperature: number;
  tint: number;
}

export interface EditorSnapshot {
  imageUri: string | null;
  adjustments: AdjustmentState;
  activeTool: string | null;
  timestamp: number;
}

export interface EditorState {
  currentProject: ProjectHistory | null;
  selectedImageUri: string | null;
  activeTool: string | null;
  adjustments: AdjustmentState;
  history: EditorSnapshot[];
  historyIndex: number;
  zoomScale: number;
  isProcessing: boolean;
  processingProgress: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  autoSaveToGallery: boolean;
  highQualityExport: boolean;
  notificationsEnabled: boolean;
  hapticsEnabled: boolean;
  language: string;
}
