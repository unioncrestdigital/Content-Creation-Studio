import React, { useState, useRef, useCallback } from 'react';
import { Sliders, Sparkles, Image as ImageIcon, ArrowUpDown } from 'lucide-react';
import { GENERATED_ASSETS } from '../data/mockStudioData';

interface InteractiveColorGradeCompareProps {
  onOpenColorLab: () => void;
}

export const InteractiveColorGradeCompare: React.FC<InteractiveColorGradeCompareProps> = ({
  onOpenColorLab,
}) => {
  // Split percentage from top (0 = all bottom/graded, 100 = all top/raw)
  const [splitPos, setSplitPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [activeLut, setActiveLut] = useState<'teal-orange' | 'cine-gold' | 'cyber-noir'>('teal-orange');

  const containerRef = useRef<HTMLDivElement>(null);
  const photoUrl = GENERATED_ASSETS.rawGoldenGate;

  const handlePointerDown = () => {
    setIsDragging(true);
  };

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const pct = Math.max(5, Math.min(95, (y / rect.height) * 100));
      setSplitPos(pct);
    },
    [isDragging]
  );

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Color grade filter style for the graded half
  const gradedFilterStyle =
    activeLut === 'teal-orange'
      ? 'brightness(1.15) contrast(1.35) saturate(1.4) sepia(0.08) hue-rotate(-8deg)'
      : activeLut === 'cine-gold'
      ? 'brightness(1.12) contrast(1.25) saturate(1.3) sepia(0.25) hue-rotate(4deg)'
      : 'brightness(1.08) contrast(1.4) saturate(1.5) hue-rotate(-12deg)';

  return (
    <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            <Sliders className="w-3.5 h-3.5" />
            <span>Grading</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
            Color Grader
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Drag the line to compare the ungraded stock against the graded result.
          </p>
        </div>

        {/* LUT Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <select
            value={activeLut}
            onChange={(e) => setActiveLut(e.target.value as any)}
            className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 font-medium shadow-2xs"
          >
            <option value="teal-orange">Teal & Orange Blockbuster</option>
            <option value="cine-gold">Cine Gold 35mm Warm</option>
            <option value="cyber-noir">Cyberpunk Neon Noir</option>
          </select>
        </div>
      </div>

      {/* Interactive Split Canvas Comparison Area */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="relative w-full aspect-video sm:h-80 rounded-xl overflow-hidden bg-black border border-slate-200 dark:border-slate-800 cursor-row-resize select-none touch-none shadow-inner"
      >
        {/* Layer 1: Professional Color Graded (Bottom / Full Layer) */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src={photoUrl}
            alt="Professionally Color Graded"
            referrerPolicy="no-referrer"
            style={{ filter: gradedFilterStyle }}
            className="w-full h-full object-cover"
          />
          {/* Label in bottom corner */}
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-slate-950/70 backdrop-blur-md py-1.5 px-3 ring-1 ring-white/15 text-[11px] text-white">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Graded<span className="text-white/55"> · {activeLut}</span></span>
          </div>
        </div>

        {/* Layer 2: Raw / Under-graded Stock Photo (Top Layer clipped by splitPos) */}
        <div
          className="absolute inset-x-0 top-0 overflow-hidden"
          style={{ height: `${splitPos}%` }}
        >
          <img
            src={photoUrl}
            alt="Raw Uncorrected Stock"
            referrerPolicy="no-referrer"
            className="absolute top-0 left-0 w-full object-cover"
            style={{
              height: containerRef.current ? `${containerRef.current.offsetHeight}px` : '100%',
              filter: 'saturate(0.7) contrast(0.85) brightness(0.92)', // flat uncorrected log look
            }}
          />
          {/* Label in top corner */}
          <div className="absolute top-3 left-3 inline-flex items-center gap-2 rounded-full bg-slate-950/70 backdrop-blur-md py-1.5 px-3 ring-1 ring-white/15 text-[11px] text-white/80">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Raw, ungraded</span>
          </div>
        </div>

        {/* Draggable Divider Line */}
        <div
          onPointerDown={handlePointerDown}
          className="absolute inset-x-0 z-20 flex items-center justify-center cursor-row-resize"
          style={{ top: `${splitPos}%`, transform: 'translateY(-50%)' }}
        >
          {/* Glowing horizontal line */}
          <div className="w-full h-0.5 bg-gradient-to-r from-indigo-500 via-white to-indigo-500 shadow-md shadow-white/50" />

          {/* Central Handle Pill */}
          <div className="absolute px-3 py-1 bg-slate-900/90 border border-indigo-400 text-white rounded-full shadow-sm flex items-center gap-1.5 text-[11px] font-medium">
            <ArrowUpDown className="w-3 h-3 text-indigo-400" />
            <span>Drag</span>
          </div>
        </div>
      </div>

      {/* Footer Info & 1-Click Launch Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs pt-1">
        <span className="text-slate-600 dark:text-slate-400">
          Showing <span className="text-slate-900 dark:text-slate-200 font-medium tabular-nums">{splitPos.toFixed(0)}%</span> Raw vs{' '}
          <span className="text-indigo-600 dark:text-indigo-300 font-medium tabular-nums">{(100 - splitPos).toFixed(0)}%</span> Color Graded.
        </span>

        <button
          type="button"
          onClick={onOpenColorLab}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch Full Color & Photo Lab</span>
        </button>
      </div>
    </div>
  );
};
