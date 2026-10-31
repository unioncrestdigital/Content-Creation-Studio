import { AspectRatioType, ColorGradeSettings, TransitionType, VideoClip } from '../utils/studioEngine';

export interface ReferenceAsset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'character' | 'style';
  url: string;
  thumbnailUrl: string;
  description: string;
  weight: number; // 0 to 1 consistency influence
}

export interface StockFootageItem {
  id: string;
  title: string;
  platform: 'YouTube' | 'Pexels' | 'Pixabay' | 'Community CC';
  duration: number;
  orientation: 'vertical' | 'horizontal';
  category: 'Cinematic' | 'Nature' | 'Urban' | 'Cyberpunk' | 'Fashion' | 'Tech';
  videoUrl: string;
  thumbnailUrl: string;
  author: string;
  license: string;
  tags: string[];
}

export interface SocialAccount {
  id: string;
  platform: 'tiktok' | 'instagram' | 'youtube' | 'x';
  handle: string;
  avatarUrl: string;
  connected: boolean;
  followerCount: number;
}

export interface ScheduledPost {
  id: string;
  clipTitle: string;
  clipThumbnail: string;
  platforms: Array<'tiktok' | 'instagram' | 'youtube' | 'x'>;
  caption: string;
  hashtags: string[];
  scheduledTime: string; // ISO date string or formatted time
  status: 'scheduled' | 'published' | 'queued';
  engagementPredicted: number; // percentage
  targetAspectRatio: AspectRatioType;
}

export interface PlatformAnalytics {
  platform: 'tiktok' | 'instagram' | 'youtube';
  totalViews: number;
  viewsGrowth: number; // percentage
  watchTimeMinutes: number;
  completionRate: number; // percentage
  sharesCount: number;
  likesCount: number;
  topVideo: {
    title: string;
    views: number;
    completionRate: number;
    thumbnail: string;
  };
  retentionCurve: number[]; // percentage at 0%, 25%, 50%, 75%, 100%
}

export interface AIGenerationSettings {
  prompt: string;
  negativePrompt: string;
  mode: 'text-to-video' | 'image-to-video';
  stylePreset: 'cinematic-realism' | 'hyper-lapse' | 'anime-neo' | '3d-render' | 'cyberpunk-noir' | 'golden-hour';
  aspectRatio: AspectRatioType;
  duration: number; // 3 to 10 seconds
  motionIntensity: 'low' | 'medium' | 'high';
  cameraMotion: 'pan-left' | 'pan-right' | 'tilt-up' | 'zoom-in' | 'dolly-forward' | 'orbit' | 'static';
  referenceAssetId?: string;
  consistencyWeight: number; // 0.1 to 1.0
  fps: 24 | 30 | 60;
}
