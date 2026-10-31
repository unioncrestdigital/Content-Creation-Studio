import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  Scissors,
  Trash2,
  Plus,
  Sparkles,
  Maximize2,
  Volume2,
  VolumeX,
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  Music,
  Download,
  Share2,
} from 'lucide-react';
import { VideoClip, AspectRatioType, TransitionType, analyzeSceneTransition, formatTimecode, calculateTimelineDuration } from '../utils/studioEngine';

interface TimelineEditorProps {
  clips: VideoClip[];
  setClips: React.Dispatch<React.SetStateAction<VideoClip[]>>;
  aspectRatio: AspectRatioType;
  setAspectRatio: (r: AspectRatioType) => void;
  onOpenStockBrowser: () => void;
  onOpenExport: () => void;
  onOpenSocialPost: () => void;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = ({
  clips,
  setClips,
  aspectRatio,
  setAspectRatio,
  onOpenStockBrowser,
  onOpenExport,
  onOpenSocialPost,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(clips[0]?.id || null);
  const [isMuted, setIsMuted] = useState(false);
  const [audioTrackActive, setAudioTrackActive] = useState(true);
  const [activeTransitionIndex, setActiveTransitionIndex] = useState<number | null>(null);

  const totalDuration = calculateTimelineDuration(clips);

  // Playback timer loop
  useEffect(() => {
    let animFrame: number;
    let lastTimestamp = performance.now();

    const updateLoop = (now: number) => {
      if (isPlaying) {
        const delta = (now - lastTimestamp) / 1000;
        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return next;
        });
      }
      lastTimestamp = now;
      if (isPlaying) {
        animFrame = requestAnimationFrame(updateLoop);
      }
    };

    if (isPlaying) {
      animFrame = requestAnimationFrame(updateLoop);
    }

    return () => cancelAnimationFrame(animFrame);
  }, [isPlaying, totalDuration]);

  // Determine which clip is currently active under the playhead
  const getActiveClipAtTime = (time: number) => {
    let elapsed = 0;
    for (const clip of clips) {
      if (time >= elapsed && time <= elapsed + clip.duration) {
        return { clip, localTime: time - elapsed };
      }
      elapsed += clip.duration - 0.5; // transition overlap
    }
    return { clip: clips[clips.length - 1] || null, localTime: 0 };
  };

  const { clip: activeClip } = getActiveClipAtTime(currentTime);

  // Auto-Detect & Apply Smart Transitions on all clips
  const handleAutoDetectTransitions = () => {
    const updated = [...clips];
    for (let i = 0; i < updated.length - 1; i++) {
      const bestTransition = analyzeSceneTransition(updated[i], updated[i + 1]);
      updated[i].suggestedTransition = bestTransition;
    }
    setClips(updated);
  };

  // Move clip left/right in sequence
  const handleMoveClip = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= clips.length) return;

    const newClips = [...clips];
    const [moved] = newClips.splice(index, 1);
    newClips.splice(targetIndex, 0, moved);
    setClips(newClips);
  };

  // Delete clip
  const handleDeleteClip = (id: string) => {
    const filtered = clips.filter((c) => c.id !== id);
    setClips(filtered);
    if (selectedClipId === id) {
      setSelectedClipId(filtered[0]?.id || null);
    }
  };

  // Change individual transition
  const handleSetTransition = (index: number, trans: TransitionType) => {
    const updated = [...clips];
    if (updated[index]) {
      updated[index].suggestedTransition = trans;
      setClips(updated);
    }
    setActiveTransitionIndex(null);
  };

  const selectedClip = clips.find((c) => c.id === selectedClipId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Studio View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 mb-1">
            <span>Sequencer & Canvas Renderer</span>
            <span aria-hidden="true">·</span>
            <span>Intelligent Scene Blending</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Multi-Clip Timeline & Video Editor
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Combine raw uploads and stock footage with AI transitions. Preview and export in 9:16 Shorts/Reels/TikTok or 16:9 YouTube.
          </p>
        </div>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAutoDetectTransitions}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-indigo-200 bg-indigo-950/60 border border-indigo-800/80 hover:bg-indigo-900/60 rounded-lg transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Auto-Detect Smart Transitions
          </button>

          <button
            type="button"
            onClick={onOpenStockBrowser}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Stock Footage
          </button>
        </div>
      </div>

      {/* Main Studio Workspace: Live Preview & Canvas (Top) + Multi-Track Timeline (Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Central Video Monitor (8 cols) */}
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Live Monitor</span>
              <span className="text-slate-500">·</span>
              <span className="font-mono text-indigo-400 tabular-nums">
                {formatTimecode(currentTime)} / {formatTimecode(totalDuration)}
              </span>
            </div>

            {/* Aspect Ratio Switcher */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-md border border-slate-800 font-mono text-[11px]">
              {(['9:16', '16:9', '1:1', '4:5'] as AspectRatioType[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setAspectRatio(r)}
                  className={`px-2 py-0.5 rounded transition-colors ${
                    aspectRatio === r ? 'bg-indigo-600 text-white font-medium' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Active Canvas Display */}
          <div className="relative w-full bg-black/90 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center min-h-[380px] max-h-[480px]">
            {activeClip ? (
              <div
                className={`relative overflow-hidden transition-all duration-300 flex items-center justify-center ${
                  aspectRatio === '9:16'
                    ? 'aspect-[9/16] h-[460px]'
                    : aspectRatio === '16:9'
                    ? 'aspect-video w-full max-w-[700px]'
                    : aspectRatio === '1:1'
                    ? 'aspect-square h-[420px]'
                    : 'aspect-[4/5] h-[440px]'
                }`}
              >
                <img
                  src={activeClip.mediaUrl}
                  alt={activeClip.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />

                {/* Transition Simulation Visual Indicator */}
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono text-slate-300 border border-slate-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Scene: {activeClip.title.slice(0, 24)}</span>
                </div>

                {/* Active Transition Badge if approaching boundary */}
                {activeClip.suggestedTransition && (
                  <div className="absolute top-3 right-3 bg-indigo-950/90 border border-indigo-700/60 text-indigo-300 px-2 py-0.5 rounded text-[10px] font-mono capitalize">
                    {activeClip.suggestedTransition.replace('-', ' ')}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center p-8 text-slate-500">
                <p>Timeline is empty. Add video clips from generator or stock hub.</p>
              </div>
            )}
          </div>

          {/* Player Transport Controls */}
          <div className="space-y-2 pt-2">
            {/* Scrubber slider */}
            <input
              type="range"
              min="0"
              max={totalDuration || 1}
              step="0.05"
              value={currentTime}
              onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentTime(0)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Rewind to start"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenExport}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Render & Export
                </button>

                <button
                  type="button"
                  onClick={onOpenSocialPost}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Distribute
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Clip Inspector (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center justify-between">
            <span>Clip Properties</span>
            {selectedClip && (
              <span className="text-[11px] font-mono text-slate-400 capitalize">
                {selectedClip.sourceType}
              </span>
            )}
          </h3>

          {selectedClip ? (
            <div className="space-y-4 text-xs">
              <div className="rounded-lg overflow-hidden border border-slate-800 h-36 bg-black relative">
                <img
                  src={selectedClip.thumbnailUrl}
                  alt={selectedClip.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/80 rounded text-[10px] text-white font-mono">
                  {selectedClip.duration}s
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Title</label>
                <input
                  type="text"
                  value={selectedClip.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setClips(clips.map((c) => (c.id === selectedClip.id ? { ...c, title } : c)));
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Clip Duration</span>
                  <span className="font-mono text-slate-200">{selectedClip.duration.toFixed(1)}s</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  step="0.5"
                  value={selectedClip.duration}
                  onChange={(e) => {
                    const dur = parseFloat(e.target.value);
                    setClips(clips.map((c) => (c.id === selectedClip.id ? { ...c, duration: dur } : c)));
                  }}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Intelligent Scene Transition Out</label>
                <select
                  value={selectedClip.suggestedTransition || 'cross-dissolve'}
                  onChange={(e) => {
                    const val = e.target.value as TransitionType;
                    setClips(clips.map((c) => (c.id === selectedClip.id ? { ...c, suggestedTransition: val } : c)));
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-200 text-xs capitalize cursor-pointer"
                >
                  <option value="cross-dissolve">Cross Dissolve (Standard)</option>
                  <option value="whip-pan">Whip Pan (High Energy Action)</option>
                  <option value="morph-cut">Morph Cut (AI Subject Continuity)</option>
                  <option value="lens-flare">Lens Flare Fade (Golden Warmth)</option>
                  <option value="glitch-dissolve">Glitch Dissolve (Cyber/Tech)</option>
                  <option value="zoom-rush">Zoom Rush (Impact Drop)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => handleDeleteClip(selectedClip.id)}
                  className="flex-1 py-2 px-3 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/60 text-red-300 font-medium flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove Clip
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500">Select any clip in the timeline below to inspect and customize.</p>
          )}
        </div>
      </div>

      {/* Multi-Track Sequencer (Bottom) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white">Timeline Tracks</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400">{clips.length} Clips Loaded</span>
            <span className="text-slate-500">·</span>
            <span className="font-mono text-slate-300">{formatTimecode(totalDuration)} Total</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenStockBrowser}
              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              Insert Stock Footage
            </button>
          </div>
        </div>

        {/* Video Track with Clip Thumbnails and Transition Intersections */}
        <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max py-2">
            {clips.map((clip, idx) => {
              const isSelected = clip.id === selectedClipId;
              const hasNext = idx < clips.length - 1;

              return (
                <React.Fragment key={clip.id}>
                  {/* Clip Card on Track */}
                  <div
                    onClick={() => setSelectedClipId(clip.id)}
                    className={`relative rounded-lg overflow-hidden border cursor-pointer group transition-all w-48 sm:w-56 shrink-0 ${
                      isSelected
                        ? 'border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg'
                        : 'border-slate-800 hover:border-slate-700 bg-slate-900'
                    }`}
                  >
                    <div className="relative h-20 bg-slate-950">
                      <img
                        src={clip.thumbnailUrl}
                        alt={clip.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                      />
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/70 rounded text-[9px] font-mono text-slate-300">
                        #{idx + 1}
                      </div>
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 rounded text-[10px] font-mono text-white">
                        {clip.duration}s
                      </div>
                    </div>

                    <div className="p-2 bg-slate-900 flex items-center justify-between text-xs">
                      <div className="truncate text-slate-200 font-medium text-[11px]">{clip.title}</div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveClip(idx, 'left');
                          }}
                          disabled={idx === 0}
                          className="p-1 hover:text-white disabled:opacity-30"
                          title="Move left"
                        >
                          <ChevronLeft className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveClip(idx, 'right');
                          }}
                          disabled={idx === clips.length - 1}
                          className="p-1 hover:text-white disabled:opacity-30"
                          title="Move right"
                        >
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Transition Connector between clips */}
                  {hasNext && (
                    <div className="relative shrink-0 flex flex-col items-center">
                      <button
                        type="button"
                        onClick={() => setActiveTransitionIndex(activeTransitionIndex === idx ? null : idx)}
                        className={`px-2 py-1.5 rounded-lg border text-[10px] font-mono flex items-center gap-1 transition-colors ${
                          clip.suggestedTransition
                            ? 'bg-indigo-950/80 border-indigo-700 text-indigo-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                        title="Click to configure transition effect"
                      >
                        <ArrowRightLeft className="w-3 h-3 text-indigo-400" />
                        <span className="capitalize">{clip.suggestedTransition || 'Cross'}</span>
                      </button>

                      {/* Transition Dropdown Popover */}
                      {activeTransitionIndex === idx && (
                        <div className="absolute top-10 z-30 w-44 bg-slate-900 border border-slate-700 rounded-lg shadow-xl p-1 text-xs space-y-0.5">
                          <div className="px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase">
                            AI Scene Transition
                          </div>
                          {(['whip-pan', 'morph-cut', 'lens-flare', 'glitch-dissolve', 'cross-dissolve', 'zoom-rush'] as TransitionType[]).map((t) => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => handleSetTransition(idx, t)}
                              className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white capitalize flex items-center justify-between"
                            >
                              <span>{t.replace('-', ' ')}</span>
                              {clip.suggestedTransition === t && <span className="text-indigo-400">✓</span>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Audio / BGM Track Layer */}
        <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-950/60 text-indigo-400 rounded-lg">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-slate-200">Cinematic Ambient Synth & Beat (Royalty-Free)</div>
              <div className="text-[11px] text-slate-400">Master Audio · 48kHz Stereo · Sync to Beats</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400">Volume</span>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue="80"
              className="w-24 accent-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
