import React, { useState } from 'react';
import { Sparkles, Wand2, RefreshCw, Plus, Check, Play, Film, Camera, Image as ImageIcon, SlidersHorizontal, Layers } from 'lucide-react';
import { ReferenceAsset, AIGenerationSettings } from '../types/studio';
import { AspectRatioType, VideoClip } from '../utils/studioEngine';
import { GENERATED_ASSETS } from '../data/mockStudioData';

interface AIVideoGeneratorProps {
  referenceAssets: ReferenceAsset[];
  aspectRatio: AspectRatioType;
  setAspectRatio: (ratio: AspectRatioType) => void;
  onAddClipToTimeline: (clip: VideoClip) => void;
}

export const AIVideoGenerator: React.FC<AIVideoGeneratorProps> = ({
  referenceAssets,
  aspectRatio,
  setAspectRatio,
  onAddClipToTimeline,
}) => {
  const [settings, setSettings] = useState<AIGenerationSettings>({
    prompt: 'Cinematic continuous drone push-in toward futuristic glowing neon cyber street, atmospheric rain reflection, anamorphic lens flare',
    negativePrompt: 'blurry, low resolution, jitter, distorted face, oversaturated cartoon',
    mode: 'text-to-video',
    stylePreset: 'cinematic-realism',
    aspectRatio: aspectRatio,
    duration: 5,
    motionIntensity: 'medium',
    cameraMotion: 'dolly-forward',
    referenceAssetId: referenceAssets[0]?.id,
    consistencyWeight: 0.85,
    fps: 30,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [activeStepText, setActiveStepText] = useState('');
  const [generatedResult, setGeneratedResult] = useState<{
    url: string;
    title: string;
    duration: number;
  } | null>({
    url: GENERATED_ASSETS.cyberCinematic,
    title: 'Futuristic Neo Street Drone Flythrough',
    duration: 5,
  });

  // Prompt enhancement helper
  const handleEnhancePrompt = () => {
    const enhancements = [
      '8k cinematic master shot, photorealistic volumetric lighting, Panavision anamorphic 35mm lens, atmospheric mist, ultra-smooth stabilization',
      'hyper-detailed cinematic composition, golden hour rim lighting, subtle handheld micro-shake, film grain, IMAX depth of field',
      'dynamic motion tracking, blade runner aesthetic, hyper-clean fluid camera trajectory, color graded with Kodak Vision3 tones',
    ];
    const picked = enhancements[Math.floor(Math.random() * enhancements.length)];
    setSettings((prev) => ({
      ...prev,
      prompt: `${prev.prompt.trim()}, ${picked}`,
    }));
  };

  // Generation execution simulation
  const handleStartGeneration = () => {
    setIsGenerating(true);
    setGenerationProgress(5);
    setActiveStepText('Analyzing prompt & reference consistency...');

    const steps = [
      { progress: 25, text: 'Extracting style geometry & keyframe depth...' },
      { progress: 50, text: 'Synthesizing continuous motion latent vectors...' },
      { progress: 75, text: 'Applying temporal consistency & anti-jitter passes...' },
      { progress: 95, text: 'Finalizing 4K upscaling & color profile encoding...' },
      { progress: 100, text: 'Video generation complete!' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setGenerationProgress(steps[currentStep].progress);
        setActiveStepText(steps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsGenerating(false);

        // Pick one of the generated high-quality assets based on the prompt/style
        const resultUrl =
          settings.stylePreset === 'cyberpunk-noir'
            ? GENERATED_ASSETS.cyberCinematic
            : settings.stylePreset === 'golden-hour'
            ? GENERATED_ASSETS.droneCityscape
            : settings.stylePreset === 'cinematic-realism'
            ? GENERATED_ASSETS.fashionPortrait
            : GENERATED_ASSETS.natureWaterfall;

        setGeneratedResult({
          url: resultUrl,
          title: `AI Video: ${settings.prompt.slice(0, 32)}...`,
          duration: settings.duration,
        });
      }
    }, 600);
  };

  const handleSendToTimeline = () => {
    if (!generatedResult) return;
    const newClip: VideoClip = {
      id: `ai-gen-${Date.now()}`,
      title: generatedResult.title,
      duration: generatedResult.duration,
      sourceType: 'ai-generated',
      mediaUrl: generatedResult.url,
      thumbnailUrl: generatedResult.url,
      tags: ['ai-generated', settings.stylePreset, settings.cameraMotion],
      visualTone:
        settings.stylePreset === 'cyberpunk-noir'
          ? 'cyberpunk'
          : settings.stylePreset === 'golden-hour'
          ? 'warm-golden'
          : 'cinematic',
      motionIntensity: settings.motionIntensity,
      suggestedTransition: settings.motionIntensity === 'high' ? 'whip-pan' : 'morph-cut',
    };
    onAddClipToTimeline(newClip);
  };

  const selectedRef = referenceAssets.find((r) => r.id === settings.referenceAssetId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Editorial Subheader */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-1">
            <span>Higgsfield & REA Neural Architecture</span>
            <span aria-hidden="true">·</span>
            <span>Zero Slop Latent Diffusion</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            AI Video Generation Studio
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            Synthesize high-fidelity cinematic video clips with precise camera trajectories, character reference consistency, and multi-ratio exports.
          </p>
        </div>

        {/* Mode selector */}
        <div className="flex items-center p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-medium shrink-0 shadow-2xs">
          <button
            onClick={() => setSettings((s) => ({ ...s, mode: 'text-to-video' }))}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              settings.mode === 'text-to-video' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Text to Video
          </button>
          <button
            onClick={() => setSettings((s) => ({ ...s, mode: 'image-to-video' }))}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              settings.mode === 'image-to-video' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Image to Video
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Creative Controls & Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Prompt Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-xs transition-colors">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Prompt & Vision Description
              </label>
              <button
                type="button"
                onClick={handleEnhancePrompt}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Enhance Prompt
              </button>
            </div>

            <textarea
              rows={3}
              value={settings.prompt}
              onChange={(e) => setSettings({ ...settings, prompt: e.target.value })}
              placeholder="Describe your scene in rich cinematic detail..."
              className="w-full bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
            />

            {/* Quick Inspiration Prompts */}
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                'Cyberpunk neon rain reflections 4K',
                'Golden hour drone over ocean yachts',
                'Minimalist editorial model slow motion',
                'Misty rainforest waterfall hyper-lapse',
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setSettings({ ...settings, prompt: suggestion })}
                  className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded border border-slate-200 dark:border-slate-700/60 transition-colors cursor-pointer"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Reference Image / Video Consistency Panel */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-semibold text-white">Reference Matching & Consistency</h3>
              </div>
              <span className="text-xs text-slate-400">
                Consistency Weight: {Math.round(settings.consistencyWeight * 100)}%
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Select reference image or video footage to lock character face, color palette, or environmental geometry across generations.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {referenceAssets.map((ref) => {
                const isSelected = settings.referenceAssetId === ref.id;
                return (
                  <button
                    key={ref.id}
                    type="button"
                    onClick={() =>
                      setSettings({
                        ...settings,
                        referenceAssetId: isSelected ? undefined : ref.id,
                      })
                    }
                    className={`relative rounded-lg overflow-hidden border text-left group transition-all ${
                      isSelected
                        ? 'border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg'
                        : 'border-slate-800 hover:border-slate-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={ref.thumbnailUrl}
                      alt={ref.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-2 bg-slate-950/90 text-xs">
                      <div className="font-medium text-slate-200 truncate">{ref.name}</div>
                      <div className="text-[10px] text-slate-400 capitalize">{ref.type} ref</div>
                    </div>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedRef && (
              <div className="p-3 bg-indigo-950/30 border border-indigo-900/50 rounded-lg flex items-center justify-between text-xs text-indigo-200">
                <span>Active Anchor: {selectedRef.name}</span>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={settings.consistencyWeight}
                  onChange={(e) => setSettings({ ...settings, consistencyWeight: parseFloat(e.target.value) })}
                  className="w-32 accent-indigo-500"
                />
              </div>
            )}
          </div>

          {/* Camera Motion & Director Controls */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-indigo-400" />
                Director Camera Trajectory
              </label>
              <span className="text-xs text-slate-400 capitalize font-mono">
                {settings.cameraMotion.replace('-', ' ')}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'dolly-forward', label: 'Dolly Forward' },
                { id: 'pan-right', label: 'Pan Right' },
                { id: 'tilt-up', label: 'Tilt Up' },
                { id: 'zoom-in', label: 'Zoom In' },
                { id: 'orbit', label: '360° Orbit' },
                { id: 'pan-left', label: 'Pan Left' },
                { id: 'static', label: 'Static Lock' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSettings({ ...settings, cameraMotion: m.id as any })}
                  className={`py-2 px-3 rounded-lg border text-center transition-colors ${
                    settings.cameraMotion === m.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-medium'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Motion Intensity & Duration Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Motion Intensity</span>
                  <span className="font-mono text-slate-300 capitalize">{settings.motionIntensity}</span>
                </div>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSettings({ ...settings, motionIntensity: lvl })}
                      className={`flex-1 py-1.5 text-xs rounded border capitalize transition-colors ${
                        settings.motionIntensity === lvl
                          ? 'bg-slate-800 border-indigo-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Clip Duration</span>
                  <span className="font-mono text-slate-300">{settings.duration}s</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="10"
                  step="1"
                  value={settings.duration}
                  onChange={(e) => setSettings({ ...settings, duration: parseInt(e.target.value) })}
                  className="w-full accent-indigo-500 mt-2"
                />
              </div>
            </div>
          </div>

          {/* Style Presets & Aspect Ratio Selection */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                Cinematic Style Preset
              </label>
              <div className="flex items-center gap-1 text-xs">
                {(['9:16', '16:9', '1:1', '4:5'] as AspectRatioType[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setAspectRatio(r);
                      setSettings((s) => ({ ...s, aspectRatio: r }));
                    }}
                    className={`px-2 py-1 rounded font-mono ${
                      aspectRatio === r ? 'bg-indigo-600 text-white font-medium' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {[
                { id: 'cinematic-realism', name: 'Cinematic Realism' },
                { id: 'cyberpunk-noir', name: 'Cyberpunk Noir' },
                { id: 'golden-hour', name: 'Golden Hour Film' },
                { id: 'hyper-lapse', name: 'High-Speed Hyper-Lapse' },
                { id: 'anime-neo', name: 'Anime Neo Unreal' },
                { id: '3d-render', name: 'Octane 3D Visual' },
              ].map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSettings({ ...settings, stylePreset: preset.id as any })}
                  className={`p-2.5 rounded-lg border text-left transition-colors ${
                    settings.stylePreset === preset.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-white font-medium'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold">{preset.name}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Custom Color & Motion</div>
                </button>
              ))}
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={handleStartGeneration}
            disabled={isGenerating}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Generating Neural Clip ({generationProgress}%)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Video with Studio AI</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Live Video Canvas & Generation Output (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-indigo-400" />
                Generation Output & Preview
              </h3>
              <span className="text-xs font-mono text-slate-400 uppercase">
                {aspectRatio} · {settings.fps} FPS
              </span>
            </div>

            {/* Video Preview Canvas Frame */}
            <div
              className={`w-full rounded-xl overflow-hidden bg-black border border-slate-800 relative flex items-center justify-center ${
                aspectRatio === '9:16'
                  ? 'aspect-[9/16] max-h-[520px] mx-auto'
                  : aspectRatio === '16:9'
                  ? 'aspect-video'
                  : aspectRatio === '1:1'
                  ? 'aspect-square'
                  : 'aspect-[4/5] max-h-[500px] mx-auto'
              }`}
            >
              {isGenerating ? (
                <div className="p-6 text-center space-y-4 w-full">
                  <div className="w-14 h-14 mx-auto rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">{activeStepText}</div>
                    <div className="text-xs text-slate-400 mt-1">Simulating diffusion frames in real time</div>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>
                </div>
              ) : generatedResult ? (
                <div className="relative w-full h-full group">
                  <img
                    src={generatedResult.url}
                    alt={generatedResult.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle video preview overlay scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-end p-4">
                    <div className="text-xs font-semibold text-white line-clamp-1">{generatedResult.title}</div>
                    <div className="text-[11px] text-slate-300 flex items-center gap-2 mt-1">
                      <span>{generatedResult.duration}s duration</span>
                      <span>·</span>
                      <span>{aspectRatio} social ready</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 text-slate-500">
                  <Film className="w-10 h-10 mx-auto stroke-[1.2] mb-2" />
                  <p className="text-xs">No video generated yet. Set parameters and hit Generate Video.</p>
                </div>
              )}
            </div>

            {/* Output Actions */}
            {generatedResult && !isGenerating && (
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-2">
                <button
                  type="button"
                  onClick={handleSendToTimeline}
                  className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Insert into Video Timeline
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = generatedResult.url;
                      link.download = `higgsrea-${Date.now()}.jpg`;
                      link.click();
                    }}
                    className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors text-center"
                  >
                    Download Frame
                  </button>
                  <button
                    type="button"
                    onClick={handleStartGeneration}
                    className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors text-center"
                  >
                    Re-roll Seed
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
