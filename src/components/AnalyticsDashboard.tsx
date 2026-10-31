import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Eye,
  Clock,
  Share2,
  Heart,
  Sparkles,
  ArrowUpRight,
  Flame,
} from 'lucide-react';
import { PlatformAnalytics } from '../types/studio';
import { formatMetricCount } from '../utils/studioEngine';
import { PLATFORM_ANALYTICS } from '../data/mockStudioData';

interface AnalyticsDashboardProps {
  onRemixVideo?: (title: string) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ onRemixVideo }) => {
  const [activePlatform, setActivePlatform] = useState<'all' | 'tiktok' | 'instagram' | 'youtube'>('all');

  const tiktokData = PLATFORM_ANALYTICS.tiktok;
  const instaData = PLATFORM_ANALYTICS.instagram;
  const youtubeData = PLATFORM_ANALYTICS.youtube;

  const totalAggregatedViews =
    tiktokData.totalViews + instaData.totalViews + youtubeData.totalViews;
  const totalAggregatedWatchHours = Math.round(
    (tiktokData.watchTimeMinutes + instaData.watchTimeMinutes + youtubeData.watchTimeMinutes) / 60
  );
  const totalAggregatedShares =
    tiktokData.sharesCount + instaData.sharesCount + youtubeData.sharesCount;
  const averageCompletionRate = (
    (tiktokData.completionRate + instaData.completionRate + youtubeData.completionRate) /
    3
  ).toFixed(1);

  const currentData: PlatformAnalytics | null =
    activePlatform === 'tiktok'
      ? tiktokData
      : activePlatform === 'instagram'
      ? instaData
      : activePlatform === 'youtube'
      ? youtubeData
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Editorial Subheader */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 mb-1">
            <span>Unified Audience Telemetry</span>
            <span aria-hidden="true">·</span>
            <span>Cross-Platform Performance Matrix</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Performance Analytics & Retention
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track engagement, retention curves, and algorithmic reach across TikTok, Instagram Reels, and YouTube Shorts.
          </p>
        </div>

        {/* Platform Filter Buttons */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium shrink-0">
          {(['all', 'tiktok', 'instagram', 'youtube'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setActivePlatform(p)}
              className={`px-3 py-1.5 rounded-md capitalize transition-colors ${
                activePlatform === p ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {p === 'all' ? 'All Channels' : p === 'instagram' ? 'Reels' : p === 'youtube' ? 'Shorts' : p}
            </button>
          ))}
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Video Views</span>
            <Eye className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {formatMetricCount(currentData ? currentData.totalViews : totalAggregatedViews)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{currentData ? currentData.viewsGrowth : 27.3}% vs last 30d</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Watch Time</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {currentData ? Math.round(currentData.watchTimeMinutes / 60) : totalAggregatedWatchHours} hrs
          </div>
          <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-mono">
            <span>High Retention Cohort</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Average Completion Rate</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {currentData ? `${currentData.completionRate}%` : `${averageCompletionRate}%`}
          </div>
          <div className="text-xs text-slate-400">
            <span>Algorithm baseline is 50%</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Shares & Reposts</span>
            <Share2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {formatMetricCount(currentData ? currentData.sharesCount : totalAggregatedShares)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
            <span>High Virality Score</span>
          </div>
        </div>
      </div>

      {/* Audience Retention Curve & Platform Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Retention Curve Chart (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Audience Retention Curve (First 15 Seconds)</h3>
            <span className="text-xs text-slate-400 font-mono">Shorts / Reels Benchmarks</span>
          </div>

          <div className="h-56 w-full flex items-end gap-6 sm:gap-12 pt-8 pb-4 px-2 border-b border-slate-800">
            {[
              { label: '0s (Hook)', val: 100 },
              { label: '3s (Transition)', val: 86 },
              { label: '7s (Climax)', val: 74 },
              { label: '11s (Payoff)', val: 68 },
              { label: '15s (Loop)', val: 64 },
            ].map((pt, i) => (
              <div key={pt.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-xs font-mono text-indigo-300 tabular-nums">{pt.val}%</span>
                <div
                  className="w-full bg-gradient-to-t from-indigo-700 to-indigo-500 rounded-t-md transition-all duration-500"
                  style={{ height: `${pt.val}%` }}
                />
                <span className="text-[11px] text-slate-400 text-center whitespace-nowrap">{pt.label}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400">
            Retention remains well above the 50% social virality threshold across the 3s and 7s scene transition boundaries.
          </p>
        </div>

        {/* Platform Share & Virality Ratios (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-white">Platform View Share</h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="font-semibold">TikTok</span>
                <span className="font-mono text-indigo-400 tabular-nums">48.2% · 1.42M views</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '48.2%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="font-semibold">Instagram Reels</span>
                <span className="font-mono text-indigo-400 tabular-nums">30.1% · 890K views</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-pink-500 h-2 rounded-full" style={{ width: '30.1%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span className="font-semibold">YouTube Shorts</span>
                <span className="font-mono text-indigo-400 tabular-nums">21.7% · 654K views</span>
              </div>
              <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '21.7%' }} />
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 mt-4">
            <span className="font-semibold text-slate-200">Recommendation:</span> High retention on 9:16 vertical cuts indicates optimal performance when auto-scheduling between 6:30 PM and 8:00 PM local time.
          </div>
        </div>
      </div>

      {/* Top Performing Videos Deck */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-white">Top Performing Creative Outputs</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              platform: 'TikTok',
              title: tiktokData.topVideo.title,
              views: tiktokData.topVideo.views,
              completion: tiktokData.topVideo.completionRate,
              thumb: tiktokData.topVideo.thumbnail,
            },
            {
              platform: 'Instagram Reels',
              title: instaData.topVideo.title,
              views: instaData.topVideo.views,
              completion: instaData.topVideo.completionRate,
              thumb: instaData.topVideo.thumbnail,
            },
            {
              platform: 'YouTube Shorts',
              title: youtubeData.topVideo.title,
              views: youtubeData.topVideo.views,
              completion: youtubeData.topVideo.completionRate,
              thumb: youtubeData.topVideo.thumbnail,
            },
          ].map((item) => (
            <div
              key={item.platform}
              className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex gap-3 text-xs"
            >
              <img
                src={item.thumb}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-16 h-20 object-cover rounded-lg shrink-0 border border-slate-800"
              />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-[10px] font-mono text-indigo-400 uppercase">{item.platform}</div>
                  <div className="font-semibold text-slate-200 line-clamp-1 mt-0.5">{item.title}</div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{formatMetricCount(item.views)} views</span>
                    <span className="text-emerald-400">{item.completion}% comp.</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
