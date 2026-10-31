import React, { useState } from 'react';
import {
  Send,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  Share2,
  TrendingUp,
  Flame,
  Check,
} from 'lucide-react';
import { SocialAccount, ScheduledPost } from '../types/studio';
import { VideoClip, AspectRatioType, getPeakEngagementTimes } from '../utils/studioEngine';
import { SOCIAL_ACCOUNTS, INITIAL_SCHEDULED_POSTS } from '../data/mockStudioData';

interface SocialSchedulerProps {
  currentClips: VideoClip[];
  aspectRatio: AspectRatioType;
}

export const SocialScheduler: React.FC<SocialSchedulerProps> = ({ currentClips, aspectRatio }) => {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(INITIAL_SCHEDULED_POSTS);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Array<'tiktok' | 'instagram' | 'youtube' | 'x'>>([
    'tiktok',
    'instagram',
    'youtube',
  ]);
  const [caption, setCaption] = useState(
    'Watch till the end! ⚡ Stitched using Content Creation Studio with intelligent AI scene transitions. Which frame is your favorite?'
  );
  const [hashtags, setHashtags] = useState(['#viral', '#shorts', '#aiart', '#contentstudio', '#reels']);
  const [isPublishingNow, setIsPublishingNow] = useState(false);
  const [publishSuccessBanner, setPublishSuccessBanner] = useState<string | null>(null);

  const activeClip = currentClips[0];
  const peakTimesTiktok = getPeakEngagementTimes('tiktok');
  const peakTimesInstagram = getPeakEngagementTimes('instagram');
  const peakTimesYoutube = getPeakEngagementTimes('youtube');

  const togglePlatform = (p: 'tiktok' | 'instagram' | 'youtube' | 'x') => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter((item) => item !== p));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleGenerateViralHashtags = () => {
    const sets = [
      ['#creator', '#filmmaking', '#colorgrade', '#cinematic', '#trendingnow'],
      ['#fyp', '#foryoupage', '#tech', '#aiart', '#visualeffects'],
      ['#filmmakersoftiktok', '#cinematography', '#higgsfield', '#futuretech'],
    ];
    const picked = sets[Math.floor(Math.random() * sets.length)];
    setHashtags([...new Set([...hashtags, ...picked])]);
  };

  // Immediate Publish Now
  const handlePublishNow = () => {
    if (selectedPlatforms.length === 0) return;
    setIsPublishingNow(true);

    setTimeout(() => {
      setIsPublishingNow(false);
      const newPost: ScheduledPost = {
        id: `post-${Date.now()}`,
        clipTitle: activeClip?.title || 'Content Creation Studio Project',
        clipThumbnail: activeClip?.thumbnailUrl || '/assets/images/ref_cyber_cinematic_1793384810139.jpg',
        platforms: selectedPlatforms,
        caption,
        hashtags,
        scheduledTime: 'Just now (Instant Post)',
        status: 'published',
        engagementPredicted: 96,
        targetAspectRatio: aspectRatio,
      };

      setScheduledPosts([newPost, ...scheduledPosts]);
      setPublishSuccessBanner(
        `Successfully published video to ${selectedPlatforms.map((p) => p.toUpperCase()).join(', ')}!`
      );
      setTimeout(() => setPublishSuccessBanner(null), 4000);
    }, 1200);
  };

  // Schedule for Peak Engagement Time
  const handleSchedulePeak = (timeSlot: string) => {
    const newPost: ScheduledPost = {
      id: `post-sched-${Date.now()}`,
      clipTitle: activeClip?.title || 'Content Creation Studio Project',
      clipThumbnail: activeClip?.thumbnailUrl || '/assets/images/ref_cyber_cinematic_1793384810139.jpg',
      platforms: selectedPlatforms,
      caption,
      hashtags,
      scheduledTime: timeSlot,
      status: 'scheduled',
      engagementPredicted: 98,
      targetAspectRatio: aspectRatio,
    };

    setScheduledPosts([newPost, ...scheduledPosts]);
    setPublishSuccessBanner(`Queued for peak engagement: ${timeSlot}`);
    setTimeout(() => setPublishSuccessBanner(null), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Editorial Subheader */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 mb-1">
            <span>Direct Social Distribution</span>
            <span aria-hidden="true">·</span>
            <span>Peak Engagement Algorithmic Scheduling</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Publish & Smart Scheduler
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Post finished reels, shorts, and TikTok videos directly to all connected channels or automate distribution at optimal peak viewer windows.
          </p>
        </div>
      </div>

      {/* Success Notification Banner */}
      {publishSuccessBanner && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-xl flex items-center gap-3 text-xs text-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{publishSuccessBanner}</span>
        </div>
      )}

      {/* Main Grid: Direct Publishing Deck (7 cols) + Peak Engagement Calendar & Queue (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Post Creator (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-5">
            <h3 className="text-sm font-semibold text-white flex items-center justify-between">
              <span>Target Social Media Channels</span>
              <span className="text-xs text-slate-400 font-mono">Aspect Ratio: {aspectRatio}</span>
            </h3>

            {/* Platform Account Selectors */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SOCIAL_ACCOUNTS.map((acc) => {
                const isSelected = selectedPlatforms.includes(acc.platform);
                return (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => togglePlatform(acc.platform)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-500/20'
                        : 'bg-slate-950 border-slate-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white capitalize">{acc.platform}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                    </div>
                    <div className="mt-3">
                      <div className="text-[11px] text-slate-300 truncate">{acc.handle}</div>
                      <div className="text-[10px] text-slate-500">{(acc.followerCount / 1000).toFixed(1)}k followers</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Caption & Hashtag Editor */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-white">Post Caption & Hook</label>
                <span className="text-[11px] text-slate-500">{caption.length} / 2200</span>
              </div>
              <textarea
                rows={3}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write an engaging hook..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-indigo-500 resize-none"
              />

              {/* Hashtags bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Virality Hashtags</span>
                  <button
                    type="button"
                    onClick={handleGenerateViralHashtags}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Suggest Hashtags
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-slate-800 text-indigo-300 rounded text-[11px] font-mono border border-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions: Instant Publish or Schedule */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handlePublishNow}
                disabled={isPublishingNow}
                className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isPublishingNow ? 'Publishing to Channels...' : 'Post to Channels Now'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSchedulePeak('Today at 7:00 PM (TikTok Peak)')}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Auto-Schedule at Peak</span>
              </button>
            </div>
          </div>

          {/* Peak Engagement Times Intelligence Box */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-semibold text-white">Algorithmic Peak Engagement Windows</h3>
            </div>
            <p className="text-xs text-slate-400">
              Based on historical cross-platform viewer engagement cycles, scheduling at these slots yields up to +34% retention.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>TikTok Peak</span>
                  <span className="text-[10px] text-indigo-400 font-mono">98% Score</span>
                </div>
                <div className="text-xs text-slate-300 font-mono">{peakTimesTiktok[0]?.time} Today</div>
                <div className="text-[11px] text-slate-500">{peakTimesTiktok[0]?.label}</div>
                <button
                  type="button"
                  onClick={() => handleSchedulePeak(`Today at ${peakTimesTiktok[0]?.time} (TikTok Peak)`)}
                  className="w-full mt-1 py-1 text-[11px] bg-indigo-950 hover:bg-indigo-900 text-indigo-300 rounded border border-indigo-800 transition-colors"
                >
                  Schedule Slot
                </button>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>Instagram Reels</span>
                  <span className="text-[10px] text-indigo-400 font-mono">96% Score</span>
                </div>
                <div className="text-xs text-slate-300 font-mono">{peakTimesInstagram[1]?.time} Today</div>
                <div className="text-[11px] text-slate-500">{peakTimesInstagram[1]?.label}</div>
                <button
                  type="button"
                  onClick={() => handleSchedulePeak(`Today at ${peakTimesInstagram[1]?.time} (Reels Peak)`)}
                  className="w-full mt-1 py-1 text-[11px] bg-indigo-950 hover:bg-indigo-900 text-indigo-300 rounded border border-indigo-800 transition-colors"
                >
                  Schedule Slot
                </button>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="text-xs font-bold text-white flex items-center justify-between">
                  <span>YouTube Shorts</span>
                  <span className="text-[10px] text-indigo-400 font-mono">97% Score</span>
                </div>
                <div className="text-xs text-slate-300 font-mono">{peakTimesYoutube[0]?.time} Today</div>
                <div className="text-[11px] text-slate-500">{peakTimesYoutube[0]?.label}</div>
                <button
                  type="button"
                  onClick={() => handleSchedulePeak(`Today at ${peakTimesYoutube[0]?.time} (Shorts Peak)`)}
                  className="w-full mt-1 py-1 text-[11px] bg-indigo-950 hover:bg-indigo-900 text-indigo-300 rounded border border-indigo-800 transition-colors"
                >
                  Schedule Slot
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Scheduled Posts Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">Content Distribution Queue</h3>
              </div>
              <span className="text-xs font-mono text-slate-400">{scheduledPosts.length} Queued</span>
            </div>

            <div className="space-y-3">
              {scheduledPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex gap-3 text-xs"
                >
                  <img
                    src={post.clipThumbnail}
                    alt={post.clipTitle}
                    referrerPolicy="no-referrer"
                    className="w-16 h-20 object-cover rounded-lg shrink-0 border border-slate-800"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="font-semibold text-slate-200 line-clamp-1">{post.clipTitle}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{post.caption}</div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {post.platforms.map((p) => (
                          <span
                            key={p}
                            className="text-[9px] uppercase font-mono px-1.5 py-0.2 bg-slate-800 rounded text-slate-300"
                          >
                            {p}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>{post.scheduledTime}</span>
                        <span
                          className={
                            post.status === 'published'
                              ? 'text-emerald-400 font-semibold'
                              : 'text-indigo-400'
                          }
                        >
                          {post.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
