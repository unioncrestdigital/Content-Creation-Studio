import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Paperclip,
  X,
  Play,
  Pause,
  Film,
  PlaySquare,
  Video,
  Plus,
  ExternalLink,
} from 'lucide-react';
import { VideoClip, AspectRatioType } from '../utils/studioEngine';
import { ReferenceAsset } from '../types/studio';
import { GENERATED_ASSETS } from '../data/mockStudioData';
import { StudioCapabilitiesIcon } from './StudioCapabilitiesIcon';
import { InteractiveColorGradeCompare } from './InteractiveColorGradeCompare';
import { AIVideoEditorDemo } from './AIVideoEditorDemo';

interface HomeScreenProps {
  onSelectTool: (
    tool: 'new-post' | 'generator' | 'timeline' | 'color-lab' | 'stock' | 'social-schedule' | 'analytics'
  ) => void;
  onStartWithPrompt: (
    prompt: string,
    attachment?: { type: 'image' | 'video'; url: string; name: string }
  ) => void;
  aspectRatio: AspectRatioType;
  setAspectRatio: (r: AspectRatioType) => void;
  recentClips: VideoClip[];
  referenceAssets: ReferenceAsset[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectTool,
  onStartWithPrompt,
  aspectRatio,
  setAspectRatio,
  recentClips,
  referenceAssets,
}) => {
  const [quickPrompt, setQuickPrompt] = useState('');
  const [selectedAttachment, setSelectedAttachment] = useState<{
    type: 'image' | 'video';
    url: string;
    name: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    const url = URL.createObjectURL(file);
    setSelectedAttachment({
      type: isVideo ? 'video' : 'image',
      url,
      name: file.name,
    });
    e.target.value = '';
  };

  // Video playback state for AI generated drone flythrough with scroll-based autoplay
  const [isPlayingAIVideo, setIsPlayingAIVideo] = useState(true);
  const aiVideoRef = useRef<HTMLVideoElement>(null);

  // Scroll observer: autoplays AI drone forward video whenever scrolled into view
  useEffect(() => {
    const aiEl = aiVideoRef.current;
    if (!aiEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          aiEl.play().catch(() => {});
          setIsPlayingAIVideo(true);
        } else {
          aiEl.pause();
          setIsPlayingAIVideo(false);
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(aiEl);
    return () => observer.disconnect();
  }, []);

  const handleLaunchCreation = () => {
    onStartWithPrompt(quickPrompt, selectedAttachment || undefined);
  };

  const toggleAIVideoPlay = () => {
    if (aiVideoRef.current) {
      if (isPlayingAIVideo) {
        aiVideoRef.current.pause();
      } else {
        aiVideoRef.current.play();
      }
      setIsPlayingAIVideo(!isPlayingAIVideo);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Studio Header Brand Banner */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-3">
          <StudioCapabilitiesIcon className="w-10 h-10" />
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Content Creation Studio
          </h1>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Neural AI video generation, professional color grading, real stock footage, and direct social distribution.
        </p>
      </div>

      {/* Main Creation Card Container (Prompt Box + Cropping Selector + Full Scroll Page Advertisements) */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm dark:shadow-2xl space-y-8 transition-colors">
        {/* Top Part: Cropping Selector, Prompt Input, Attach & Create */}
        <div className="space-y-4">
          {/* Select Output Social Layout (Clean cropping selector moved here from top right) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800/80">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              <span>Select Output Social Layout:</span>
            </span>

            {/* Cropping Selection: 9x16, 16x9, 1:1, 4:5 */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono">
              {[
                { id: '9:16' as AspectRatioType, label: '9x16', tooltip: 'Vertical Video (TikTok, Shorts, Reels)' },
                { id: '16:9' as AspectRatioType, label: '16x9', tooltip: 'Horizontal Landscape (YouTube)' },
                { id: '1:1' as AspectRatioType, label: '1:1', tooltip: 'Square (Instagram Feed)' },
                { id: '4:5' as AspectRatioType, label: '4:5', tooltip: 'Portrait (Instagram & Social Feeds)' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setAspectRatio(item.id)}
                  title={item.tooltip}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer font-semibold ${
                    aspectRatio === item.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Unified Chat & Prompt Input Bar */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 flex items-center gap-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
            <input
              type="text"
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleLaunchCreation();
              }}
              placeholder="Describe a video, reel, or shorts idea to create with AI..."
              className="flex-1 bg-transparent border-0 px-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
            />

            {/* Hidden Native File Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="video/*,image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-900 rounded-xl transition-colors shrink-0 flex items-center gap-1.5 text-xs cursor-pointer border border-transparent"
              title="Upload raw footage or photo from your device"
            >
              <Paperclip className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline font-medium">Attach</span>
            </button>

            <button
              type="button"
              onClick={handleLaunchCreation}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all shrink-0 cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Post</span>
            </button>
          </div>

          {/* Active Uploaded Attachment Badge */}
          {selectedAttachment && (
            <div className="flex items-center gap-2.5 px-3.5 py-2 bg-slate-50 dark:bg-slate-950 border border-indigo-500/30 dark:border-indigo-500/40 rounded-xl text-xs w-max shadow-xs">
              {selectedAttachment.type === 'video' ? (
                <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 border border-indigo-300 dark:border-indigo-500/50 flex items-center justify-center shrink-0">
                  <Film className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                </div>
              ) : (
                <img
                  src={selectedAttachment.url}
                  alt="attached"
                  className="w-7 h-7 rounded-lg object-cover shrink-0 border border-slate-300 dark:border-slate-700"
                />
              )}
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                  {selectedAttachment.type === 'video' ? 'RAW FOOTAGE UPLOADED' : 'PHOTO UPLOADED'}
                </span>
                <span className="text-slate-800 dark:text-slate-200 font-medium truncate max-w-xs">{selectedAttachment.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAttachment(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-md ml-2 cursor-pointer transition-colors"
                title="Remove attachment"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Scroll Page Advertisements: All Capabilities Laid Out Vertically in Sequence */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 space-y-8">
          <div className="flex items-center justify-between pb-1">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Studio Capabilities & Feature Showcases</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Explore real-time demonstrations of Hollywood color grading, authentic 4K stock video, neural AI synthesis, and smart transitions.
              </p>
            </div>
          </div>

          {/* Advertisement 1: Interactive Up/Down Before-After Color Grading Slider */}
          <div className="space-y-3">
            <InteractiveColorGradeCompare onOpenColorLab={() => onSelectTool('color-lab')} />
          </div>

          {/* Advertisement 2: Real 4K Cinematic Stock Video (B-Roll & Landing Page Style) */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Real Stock Video (Not AI Generated) · B-Roll & Landing Page Backdrops</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  Real 4K Cinematic Stock Video
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl">
                  Authentic high-definition footage pulled directly for cinematic B-roll, background layers, and landing page backdrops to remix with your raw camera uploads. Autoplays when scrolled into view.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSelectTool('stock')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add High-Quality Stock Footage</span>
              </button>
            </div>

            {/* Real Video Player with YouTube 4K stream */}
            <div className="relative aspect-video sm:h-96 w-full rounded-xl overflow-hidden bg-black border border-slate-200 dark:border-slate-800 group shadow-inner">
              <iframe
                src="https://www.youtube-nocookie.com/embed/TEjHDF9QXTY?autoplay=1&mute=1&loop=1&playlist=TEjHDF9QXTY&controls=1&rel=0&modestbranding=1&playsinline=1"
                title="USA 4K - Scenic Relaxation Film With Calming Music (YouTube CC)"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />

              {/* Overlaid Badges */}
              <div className="absolute top-3 left-3 px-3 py-1 bg-black/80 backdrop-blur-md rounded-md text-[10px] font-mono text-emerald-300 border border-emerald-500/30 flex items-center gap-2 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>REAL 4K CINEMATIC STOCK · USA 4K SCENIC RELAXATION (YOUTUBE CC)</span>
              </div>

              {/* Direct YouTube 4K External Link Button */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <a
                  href="https://youtu.be/TEjHDF9QXTY?si=jYkPrxhuZ_ULXgVl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-md bg-black/80 hover:bg-black text-white text-[10px] font-medium border border-white/20 transition-colors flex items-center gap-1.5 shadow-sm"
                  title="Watch original 4K video on YouTube"
                >
                  <ExternalLink className="w-3 h-3 text-red-500" />
                  <span>Watch on YouTube</span>
                </a>
              </div>
            </div>

            {/* Clean bottom action row (Replaced old categories with direct Add callout) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <button
                type="button"
                onClick={() => onSelectTool('stock')}
                className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold cursor-pointer text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add High-Quality Stock Footage</span>
              </button>
              <span className="text-emerald-700 dark:text-emerald-400 font-mono text-[11px]">
                100% Commercial-Safe YouTube Creative Commons & 4K Royalty-Free · Scenic Relaxation
              </span>
            </div>
          </div>

          {/* Advertisement 3: AI Video Generator Showcase (Real generated forward drone shot) */}
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  <Video className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Neural Latent Diffusion & Continuous Camera Flight</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  AI Video Generator
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl">
                  Real generated video moving forward as a TV background drone shot through a futuristic cyber street. Starts playing automatically when you scroll down to see it.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onSelectTool('generator')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch AI Video Generator</span>
              </button>
            </div>

            {/* AI Video Display: Real generated drone shot moving forward */}
            <div className="relative aspect-video sm:h-80 w-full rounded-xl overflow-hidden bg-black border border-slate-200 dark:border-slate-800 group shadow-inner">
              <video
                ref={aiVideoRef}
                src={GENERATED_ASSETS.aiDroneForwardVideo}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-cover"
              />

              {/* Overlaid Drone Telemetry Badge */}
              <div className="absolute top-3 left-3 px-3 py-1 bg-black/80 backdrop-blur-md rounded-md text-[10px] font-mono text-cyan-300 border border-cyan-500/30 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>AI GENERATED DRONE SHOT · MOVING FORWARD (4K 60FPS)</span>
              </div>

              <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
                <button
                  type="button"
                  onClick={toggleAIVideoPlay}
                  className="p-2 rounded-full bg-black/80 hover:bg-black text-white border border-white/20 transition-colors cursor-pointer"
                  title={isPlayingAIVideo ? 'Pause AI video' : 'Play AI video'}
                >
                  {isPlayingAIVideo ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4 pointer-events-none">
                <div className="text-sm font-bold text-white">
                  "Cinematic Coastal City Drone Flight (4K 60FPS)"
                </div>
                <div className="flex items-center gap-2 text-[11px] text-cyan-300 mt-1 font-mono">
                  <span>Camera: Dolly Forward Drone Flythrough</span>
                  <span>·</span>
                  <span>Autoplays on Scroll</span>
                  <span>·</span>
                  <span>Smooth 60FPS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Advertisement 4: AI Video Editor (Fast-Cut Phone Footage Demonstration) */}
          <AIVideoEditorDemo onOpenTimeline={() => onSelectTool('timeline')} />
        </div>
      </div>
    </div>
  );
};
