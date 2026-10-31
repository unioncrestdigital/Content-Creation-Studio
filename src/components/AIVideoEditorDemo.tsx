import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Smartphone,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  Film,
  Zap,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { GENERATED_ASSETS } from '../data/mockStudioData';
import { MediaLabel } from './MediaLabel';

interface AIVideoEditorDemoProps {
  onOpenTimeline: () => void;
}

export const AIVideoEditorDemo: React.FC<AIVideoEditorDemoProps> = ({ onOpenTimeline }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(11.08);

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll observer: autoplays video when scrolled into view
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoEl.play().catch(() => {});
          setIsPlaying(true);
        } else {
          videoEl.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(videoEl);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  return (
    <div ref={containerRef} className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-5 shadow-xs transition-colors">
      {/* Header and Value Proposition */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <Smartphone className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Cutting</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            AI Video Editor
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl mt-1">
            Put any footage you have on your phone from videos of a trip, vacation, YouTube takes, or camera roll clips.
            The AI automatically edits your raw timeline into a fastly cut, punchy montage with whip pans, morph cuts, and lens flare transitions.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenTimeline}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-semibold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Phone Footage & Auto-Edit</span>
        </button>
      </div>

      {/* Clean Cinematic Matte Display: Fast-Cut Trip Vlog */}
      <div className="relative rounded-2xl p-2 bg-gradient-to-b from-slate-200 to-slate-100 dark:from-slate-900 dark:to-black border border-slate-300 dark:border-slate-800/80 shadow-xs dark:shadow-2xl">
        {/* Cinematic Matte Bezel */}
        <div className="relative aspect-video sm:h-96 w-full rounded-xl overflow-hidden bg-black border border-slate-300 dark:border-slate-800 group shadow-inner">
          <video
            ref={videoRef}
            src={GENERATED_ASSETS.tripVlogCutVideo}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onTimeUpdate={handleTimeUpdate}
            className="w-full h-full object-cover"
          />

          <MediaLabel
            className="absolute top-3 left-3"
            live
            label="Auto-edited trip vlog"
            detail="Fast cuts and transitions"
          />

          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <button
              type="button"
              onClick={toggleMute}
              className="p-2 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 transition-colors cursor-pointer"
              title={isMuted ? 'Unmute video audio' : 'Mute video audio'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={togglePlay}
              className="p-2 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 transition-colors cursor-pointer"
              title={isPlaying ? 'Pause trip vlog' : 'Play trip vlog'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>
          </div>

          {/* Bottom Bar: Pacing Details & Scrubber */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-8">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-[13px] font-medium text-white truncate">
                  Trip highlights montage
                </span>
                <span className="hidden sm:inline text-[12px] text-white/55 truncate">
                  Auto pacing, whip-pan transitions
                </span>
              </div>
              {/* font-mono stays here on purpose: a timecode that ticks every
                  frame jitters in a proportional face. */}
              <span className="text-[11px] font-mono tabular-nums text-white/70 shrink-0">
                {currentTime.toFixed(1)}s / {duration.toFixed(1)}s
              </span>
            </div>

            {/* Video Progress Line */}
            <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-500 transition-all duration-100"
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Explanatory Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <div className="p-3 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white">
            <Smartphone className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Direct Phone Uploads</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Takes the file straight off the camera roll, no conversion step.
          </p>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white">
            <Zap className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>Fast-Paced Action Cuts</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Automatically trims pauses and dead space, syncing jump cuts and camera whips to music rhythm and beat drops.
          </p>
        </div>

        <div className="p-3 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Intelligent Transitions</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            Seamlessly stitches scenes with AI morph cuts, directional whip pans, and anamorphic lens flare fades.
          </p>
        </div>
      </div>
    </div>
  );
};
