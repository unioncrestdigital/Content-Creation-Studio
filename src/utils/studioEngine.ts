/**
 * Core studio engine logic for HiggsRea Studio:
 * - Scene transition intelligence
 * - Timeline timing & timecode formatting
 * - Color grading & filter computation
 * - Aspect ratio math
 * - Social distribution peak engagement metrics
 */

export type AspectRatioType = '9:16' | '16:9' | '1:1' | '4:5';

export type TransitionType = 
  | 'auto'
  | 'morph-cut'
  | 'whip-pan'
  | 'lens-flare'
  | 'glitch-dissolve'
  | 'match-cut'
  | 'cross-dissolve'
  | 'zoom-rush';

export interface VideoClip {
  id: string;
  title: string;
  duration: number; // in seconds
  sourceType: 'ai-generated' | 'stock' | 'user-upload';
  mediaUrl: string;
  thumbnailUrl: string;
  tags?: string[];
  visualTone?: 'cyberpunk' | 'warm-golden' | 'lush-nature' | 'editorial-monochrome' | 'cinematic';
  motionIntensity?: 'low' | 'medium' | 'high';
  suggestedTransition?: TransitionType;
}

export interface ColorGradeSettings {
  exposure: number; // -100 to +100
  contrast: number; // -100 to +100
  highlights: number; // -100 to +100
  shadows: number; // -100 to +100
  temperature: number; // -100 (cool) to +100 (warm)
  tint: number; // -100 (green) to +100 (magenta)
  saturation: number; // -100 to +100
  vibrance: number; // -100 to +100
  lut: 'none' | 'teal-orange' | 'cine-gold' | 'bleach-bypass' | 'kodachrome' | 'cyber-noir';
  vignette: number; // 0 to 100
}

export const DEFAULT_COLOR_GRADE: ColorGradeSettings = {
  exposure: 0,
  contrast: 0,
  highlights: 0,
  shadows: 0,
  temperature: 0,
  tint: 0,
  saturation: 0,
  vibrance: 0,
  lut: 'none',
  vignette: 0,
};

/**
 * Intelligently analyzes two adjacent clips to determine the optimal cinematic transition.
 */
export function analyzeSceneTransition(clipA: VideoClip, clipB: VideoClip): TransitionType {
  if (!clipA || !clipB) return 'cross-dissolve';

  // High motion to high motion -> Whip Pan or Zoom Rush
  if (clipA.motionIntensity === 'high' && clipB.motionIntensity === 'high') {
    return 'whip-pan';
  }

  // Cyberpunk or futuristic aesthetic -> Glitch Dissolve
  if (clipA.visualTone === 'cyberpunk' || clipB.visualTone === 'cyberpunk') {
    return 'glitch-dissolve';
  }

  // Warm golden hour or sunny scenes -> Lens Flare Fade
  if (clipA.visualTone === 'warm-golden' || clipB.visualTone === 'warm-golden') {
    return 'lens-flare';
  }

  // Consistent tone & medium motion -> Morph Cut or Match Cut
  if (clipA.visualTone === clipB.visualTone) {
    return 'morph-cut';
  }

  // High to low motion contrast -> Zoom rush
  if (clipA.motionIntensity === 'high' && clipB.motionIntensity === 'low') {
    return 'zoom-rush';
  }

  return 'cross-dissolve';
}

/**
 * Calculates total timeline duration including transition overlaps.
 */
export function calculateTimelineDuration(clips: VideoClip[], transitionDuration = 0.5): number {
  if (!clips || clips.length === 0) return 0;
  if (clips.length === 1) return clips[0].duration;

  const totalRawDuration = clips.reduce((acc, c) => acc + c.duration, 0);
  const totalOverlap = (clips.length - 1) * transitionDuration;
  return Math.max(0, totalRawDuration - totalOverlap);
}

/**
 * Formats seconds into MM:SS.ms or HH:MM:SS
 */
export function formatTimecode(seconds: number, includeHours = false): string {
  if (isNaN(seconds) || seconds < 0) seconds = 0;
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.floor((seconds % 1) * 100);

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (includeHours || hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}.${pad(millis)}`;
}

/**
 * Converts aspect ratio string into precise canvas render dimensions.
 */
export function getAspectRatioDimensions(ratio: AspectRatioType, targetMax = 1080): { width: number; height: number; ratioFloat: number } {
  switch (ratio) {
    case '9:16':
      return { width: Math.round(targetMax * (9 / 16)), height: targetMax, ratioFloat: 9 / 16 };
    case '16:9':
      return { width: targetMax, height: Math.round(targetMax * (9 / 16)), ratioFloat: 16 / 9 };
    case '1:1':
      return { width: targetMax, height: targetMax, ratioFloat: 1 };
    case '4:5':
      return { width: Math.round(targetMax * (4 / 5)), height: targetMax, ratioFloat: 4 / 5 };
    default:
      return { width: targetMax, height: targetMax, ratioFloat: 1 };
  }
}

/**
 * Generates CSS filter string corresponding to color grade settings.
 */
export function computeColorFilterStyle(grade: ColorGradeSettings): string {
  const brightness = 1 + (grade.exposure / 100) * 0.5;
  const contrast = 1 + (grade.contrast / 100) * 0.5;
  const saturation = 1 + (grade.saturation / 100) * 0.8;
  const sepia = grade.temperature > 0 ? (grade.temperature / 100) * 0.35 : 0;
  const hueRotate = grade.temperature < 0 ? (grade.temperature / 100) * 15 : (grade.tint / 100) * 15;

  let filters = `brightness(${brightness.toFixed(2)}) contrast(${contrast.toFixed(2)}) saturate(${saturation.toFixed(2)})`;
  if (sepia > 0) filters += ` sepia(${sepia.toFixed(2)})`;
  if (hueRotate !== 0) filters += ` hue-rotate(${hueRotate.toFixed(1)}deg)`;

  if (grade.lut === 'teal-orange') {
    filters += ` contrast(1.15) saturate(1.2)`;
  } else if (grade.lut === 'bleach-bypass') {
    filters += ` contrast(1.3) saturate(0.6)`;
  } else if (grade.lut === 'cine-gold') {
    filters += ` sepia(0.2) saturate(1.15) contrast(1.05)`;
  } else if (grade.lut === 'cyber-noir') {
    filters += ` contrast(1.25) saturate(1.4) hue-rotate(-10deg)`;
  }

  return filters;
}

/**
 * Determines peak engagement time recommendations by platform.
 */
export function getPeakEngagementTimes(platform: 'tiktok' | 'instagram' | 'youtube' | 'x'): Array<{
  day: string;
  time: string;
  engagementScore: number;
  label: string;
}> {
  switch (platform) {
    case 'tiktok':
      return [
        { day: 'Today', time: '19:00', engagementScore: 98, label: 'Prime Peak (Gen Z / Active)' },
        { day: 'Tomorrow', time: '12:30', engagementScore: 92, label: 'Lunch Break Spike' },
        { day: 'Saturday', time: '21:00', engagementScore: 95, label: 'Weekend Night Rush' },
      ];
    case 'instagram':
      return [
        { day: 'Today', time: '12:00', engagementScore: 94, label: 'Midday Story & Reels Peak' },
        { day: 'Today', time: '18:30', engagementScore: 96, label: 'Evening Commute' },
        { day: 'Sunday', time: '11:00', engagementScore: 91, label: 'Weekend Brunch Browse' },
      ];
    case 'youtube':
      return [
        { day: 'Today', time: '16:00', engagementScore: 97, label: 'After-school / Pre-primetime' },
        { day: 'Friday', time: '15:00', engagementScore: 95, label: 'Weekend Kickoff' },
        { day: 'Saturday', time: '09:30', engagementScore: 90, label: 'Morning Watch Queue' },
      ];
    case 'x':
      return [
        { day: 'Today', time: '09:00', engagementScore: 93, label: 'Morning News & Trends' },
        { day: 'Today', time: '17:00', engagementScore: 89, label: 'Post-Market Wrap' },
      ];
  }
}

/**
 * Formats numerical metrics with K/M abbreviations cleanly.
 */
export function formatMetricCount(num: number): string {
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

export interface AssistantDirectorPlan {
  title: string;
  targetRatio: AspectRatioType;
  platforms: Array<'tiktok' | 'instagram' | 'youtube' | 'x'>;
  suggestedTransition: TransitionType;
  colorLut: ColorGradeSettings['lut'];
  summary: string;
  recommendedTime: string;
}

/**
 * Intelligent intent parser for the conversational New Post creation flow.
 */
export function parseCreationIntent(input: string): AssistantDirectorPlan {
  const lower = input.toLowerCase();

  // Determine platforms
  const platforms: Array<'tiktok' | 'instagram' | 'youtube' | 'x'> = [];
  if (lower.includes('tiktok') || lower.includes('tik tok')) platforms.push('tiktok');
  if (lower.includes('reels') || lower.includes('instagram') || lower.includes('ig')) platforms.push('instagram');
  if (lower.includes('shorts') || lower.includes('youtube') || lower.includes('yt')) platforms.push('youtube');
  if (lower.includes('twitter') || lower.includes('x post') || lower.includes(' x ')) platforms.push('x');
  if (platforms.length === 0) {
    platforms.push('tiktok', 'instagram'); // default social
  }

  // Determine aspect ratio
  let targetRatio: AspectRatioType = '9:16';
  if (lower.includes('16:9') || lower.includes('landscape') || lower.includes('widescreen') || lower.includes('long form')) {
    targetRatio = '16:9';
  } else if (lower.includes('square') || lower.includes('1:1')) {
    targetRatio = '1:1';
  } else if (lower.includes('4:5') || lower.includes('portrait')) {
    targetRatio = '4:5';
  }

  // Transition intelligence
  let suggestedTransition: TransitionType = 'morph-cut';
  if (lower.includes('cyber') || lower.includes('tech') || lower.includes('glitch') || lower.includes('neon')) {
    suggestedTransition = 'glitch-dissolve';
  } else if (lower.includes('fast') || lower.includes('action') || lower.includes('car') || lower.includes('whip')) {
    suggestedTransition = 'whip-pan';
  } else if (lower.includes('sunset') || lower.includes('golden') || lower.includes('warm') || lower.includes('flare')) {
    suggestedTransition = 'lens-flare';
  }

  // Color LUT selection
  let colorLut: ColorGradeSettings['lut'] = 'teal-orange';
  if (lower.includes('vintage') || lower.includes('retro') || lower.includes('kodak')) {
    colorLut = 'kodachrome';
  } else if (lower.includes('noir') || lower.includes('cyber') || lower.includes('dark')) {
    colorLut = 'cyber-noir';
  } else if (lower.includes('warm') || lower.includes('gold') || lower.includes('sunset') || lower.includes('cinematic')) {
    colorLut = 'cine-gold';
  }

  const primePeak = getPeakEngagementTimes(platforms[0] || 'tiktok')[0];

  return {
    title: input.length > 40 ? input.slice(0, 37) + '...' : input || 'Viral AI Reel',
    targetRatio,
    platforms,
    suggestedTransition,
    colorLut,
    summary: `Configured ${targetRatio} ${platforms.join('/')} video with ${suggestedTransition} transitions and ${colorLut} Hollywood grading.`,
    recommendedTime: `${primePeak.day} @ ${primePeak.time} (${primePeak.label})`,
  };
}

