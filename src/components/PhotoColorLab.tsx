import React, { useState } from 'react';
import {
  Sliders,
  Crop,
  RotateCw,
  FlipHorizontal,
  Check,
  Undo2,
  Sparkles,
  Download,
  Eye,
  Layers,
} from 'lucide-react';
import { ColorGradeSettings, DEFAULT_COLOR_GRADE, computeColorFilterStyle, AspectRatioType } from '../utils/studioEngine';
import { VideoClip } from '../utils/studioEngine';

interface PhotoColorLabProps {
  clips: VideoClip[];
  onApplyGradeToAll: (grade: ColorGradeSettings) => void;
}

export const PhotoColorLab: React.FC<PhotoColorLabProps> = ({ clips, onApplyGradeToAll }) => {
  const [selectedClipIndex, setSelectedClipIndex] = useState(0);
  const [grade, setGrade] = useState<ColorGradeSettings>({
    exposure: 10,
    contrast: 15,
    highlights: -5,
    shadows: 8,
    temperature: 12,
    tint: -4,
    saturation: 15,
    vibrance: 20,
    lut: 'teal-orange',
    vignette: 25,
  });

  const [rotation, setRotation] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeCropRatio, setActiveCropRatio] = useState<AspectRatioType | 'free'>('9:16');
  const [showBeforeAfter, setShowBeforeAfter] = useState(false);
  const [appliedFeedback, setAppliedFeedback] = useState(false);

  const activeClip = clips[selectedClipIndex] || clips[0];
  const filterStyle = computeColorFilterStyle(grade);

  const handleReset = () => {
    setGrade(DEFAULT_COLOR_GRADE);
    setRotation(0);
    setIsFlipped(false);
  };

  const handleApplyToAll = () => {
    onApplyGradeToAll(grade);
    setAppliedFeedback(true);
    setTimeout(() => setAppliedFeedback(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Editorial Subheader */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 mb-1">
            <span>Color Grading & Photo Lab</span>
            <span aria-hidden="true">·</span>
            <span>Hollywood 3D LUTs & Tone Mapping</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Photo Editing & Color Grading Suite
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Perform precision color correction, white balance adjustment, social ratio cropping, and Hollywood LUT grading.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" />
            Reset Grade
          </button>

          <button
            type="button"
            onClick={handleApplyToAll}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            {appliedFeedback ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
            {appliedFeedback ? 'Grade Applied to All!' : 'Apply to All Clips'}
          </button>
        </div>
      </div>

      {/* Main Grid: Visual Canvas Inspector (7 cols) + Precision Color Wheels & Sliders (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Visual Canvas & Tools (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Clip Selector Strip */}
          <div className="flex items-center gap-2 overflow-x-auto p-2 bg-slate-900/60 border border-slate-800 rounded-xl">
            {clips.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedClipIndex(i)}
                className={`relative shrink-0 rounded-lg overflow-hidden border w-24 h-14 text-left transition-all ${
                  selectedClipIndex === i
                    ? 'border-indigo-500 ring-2 ring-indigo-500/40'
                    : 'border-slate-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={c.thumbnailUrl}
                  alt={c.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-1">
                  <span className="text-[10px] text-white font-medium truncate">Clip #{i + 1}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Active Canvas Display */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Preview Canvas</span>
                <span className="text-slate-500">·</span>
                <span className="font-mono text-slate-400">
                  LUT: {grade.lut.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              {/* Before / After toggle */}
              <button
                type="button"
                onClick={() => setShowBeforeAfter(!showBeforeAfter)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
                  showBeforeAfter ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                {showBeforeAfter ? 'Showing Original (Raw)' : 'Split Before / After'}
              </button>
            </div>

            {/* Viewport with CSS Filter / Grade applied */}
            <div className="relative w-full bg-black/95 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center min-h-[420px]">
              {activeClip && (
                <div
                  className={`relative overflow-hidden transition-all duration-200 flex items-center justify-center ${
                    activeCropRatio === '9:16'
                      ? 'aspect-[9/16] h-[400px]'
                      : activeCropRatio === '16:9'
                      ? 'aspect-video w-full'
                      : activeCropRatio === '1:1'
                      ? 'aspect-square h-[380px]'
                      : activeCropRatio === '4:5'
                      ? 'aspect-[4/5] h-[390px]'
                      : 'w-full h-[400px]'
                  }`}
                  style={{
                    transform: `rotate(${rotation}deg) scaleX(${isFlipped ? -1 : 1})`,
                  }}
                >
                  <img
                    src={activeClip.mediaUrl}
                    alt={activeClip.title}
                    referrerPolicy="no-referrer"
                    style={{
                      filter: showBeforeAfter ? 'none' : filterStyle,
                    }}
                    className="w-full h-full object-cover transition-all duration-150"
                  />

                  {/* Vignette Overlay */}
                  {!showBeforeAfter && grade.vignette > 0 && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        boxShadow: `inset 0 0 ${grade.vignette * 1.5}px rgba(0,0,0,${grade.vignette / 100})`,
                      }}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Cropping, Rotation & Flip Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-slate-800">
              <div className="flex items-center gap-1 font-mono">
                <span className="text-slate-400 mr-1 flex items-center gap-1">
                  <Crop className="w-3.5 h-3.5 text-indigo-400" />
                  Crop:
                </span>
                {(['9:16', '1:1', '16:9', '4:5', 'free'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setActiveCropRatio(r)}
                    className={`px-2 py-1 rounded transition-colors ${
                      activeCropRatio === r
                        ? 'bg-indigo-600 text-white font-medium'
                        : 'bg-slate-950 text-slate-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1"
                  title="Rotate 90 degrees"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>{rotation}°</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsFlipped(!isFlipped)}
                  className={`p-1.5 rounded-lg border flex items-center gap-1 transition-colors ${
                    isFlipped
                      ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200'
                      : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border-slate-800'
                  }`}
                  title="Flip Horizontal"
                >
                  <FlipHorizontal className="w-3.5 h-3.5" />
                  <span>Flip</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Color Grading Wheels & Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Hollywood Film LUT Presets */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Cinematic LUT Grade Presets
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {[
                { id: 'none', label: 'Neutral Rec.709' },
                { id: 'teal-orange', label: 'Teal & Orange' },
                { id: 'cine-gold', label: 'Cine Gold 35mm' },
                { id: 'bleach-bypass', label: 'Bleach Bypass' },
                { id: 'kodachrome', label: 'Kodachrome 64' },
                { id: 'cyber-noir', label: 'Cyber Noir Matrix' },
              ].map((lut) => (
                <button
                  key={lut.id}
                  type="button"
                  onClick={() => setGrade({ ...grade, lut: lut.id as any })}
                  className={`py-2 px-2.5 rounded-lg border text-left transition-colors ${
                    grade.lut === lut.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200 font-semibold'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {lut.label}
                </button>
              ))}
            </div>
          </div>

          {/* Exposure & Tone Controls */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              Exposure & Tone Mapping
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Exposure</span>
                  <span className="font-mono text-slate-200">{grade.exposure > 0 ? `+${grade.exposure}` : grade.exposure}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={grade.exposure}
                  onChange={(e) => setGrade({ ...grade, exposure: parseInt(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Contrast</span>
                  <span className="font-mono text-slate-200">{grade.contrast > 0 ? `+${grade.contrast}` : grade.contrast}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={grade.contrast}
                  onChange={(e) => setGrade({ ...grade, contrast: parseInt(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Highlights</span>
                    <span className="font-mono text-slate-200">{grade.highlights}</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={grade.highlights}
                    onChange={(e) => setGrade({ ...grade, highlights: parseInt(e.target.value) })}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Shadows</span>
                    <span className="font-mono text-slate-200">{grade.shadows}</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    value={grade.shadows}
                    onChange={(e) => setGrade({ ...grade, shadows: parseInt(e.target.value) })}
                    className="w-full accent-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Color Balance & White Balance */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white">White Balance & Color Vibrancy</h3>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Temperature (Cool / Warm)</span>
                  <span className="font-mono text-slate-200">
                    {grade.temperature < 0 ? `${grade.temperature}K (Cool)` : `+${grade.temperature}K (Warm)`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={grade.temperature}
                  onChange={(e) => setGrade({ ...grade, temperature: parseInt(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Tint (Green / Magenta)</span>
                  <span className="font-mono text-slate-200">{grade.tint}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={grade.tint}
                  onChange={(e) => setGrade({ ...grade, tint: parseInt(e.target.value) })}
                  className="w-full accent-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Saturation</span>
                  <span className="font-mono text-slate-200">{grade.saturation}</span>
                </div>
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={grade.saturation}
                  onChange={(e) => setGrade({ ...grade, saturation: parseInt(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Vignette Falloff</span>
                  <span className="font-mono text-slate-200">{grade.vignette}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={grade.vignette}
                  onChange={(e) => setGrade({ ...grade, vignette: parseInt(e.target.value) })}
                  className="w-full accent-slate-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
