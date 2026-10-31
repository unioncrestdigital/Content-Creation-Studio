import React from 'react';

interface MediaLabelProps {
  /** What the clip is. The thing a person reads first. */
  label: string;
  /** The qualifier: how it was made, or what to notice. Optional. */
  detail?: string;
  /** A live indicator, for a clip that is playing. */
  live?: boolean;
  className?: string;
}

/**
 * The label that sits over a video.
 *
 * One component for every player, so the three on the home page cannot drift
 * into three different chips. What it replaced was a 10px uppercase monospace
 * string in cyan, on black, inside a glowing cyan border, reading
 * "AI AUTO-EDITED TRIP VLOG · FAST CUTS & TRANSITIONS".
 *
 * Four things were wrong with that, and this fixes each one:
 *
 *   Uppercase monospace reads as terminal output, not as a product. It is the
 *   house style of a tech demo. Sentence case in the UI font reads as a caption.
 *
 *   Everything was one size, one weight and one colour, so nothing came first.
 *   There are two levels here: what the clip is, then the qualifier, separated
 *   by a hairline rather than a middle dot.
 *
 *   A translucent fill, a blur and a saturated border are three surface
 *   treatments competing inside a chip twenty pixels tall. One fill and one
 *   hairline ring is enough to lift it off any footage.
 *
 *   Cyan-on-black belongs to no other part of this app, which is indigo and
 *   slate throughout. A label should not introduce a palette.
 */
export const MediaLabel: React.FC<MediaLabelProps> = ({
  label,
  detail,
  live = false,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-2.5 rounded-full bg-slate-950/70 backdrop-blur-md py-1.5 pl-3 pr-3.5 ring-1 ring-white/15 ${className}`}
    >
      {live && (
        <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
          {/* motion-safe only: a pulsing dot is decoration, and anyone who has
              asked for less of it should not get it anyway. */}
          <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
      )}
      <span className="text-[11px] font-medium leading-none text-white whitespace-nowrap">
        {label}
      </span>
      {detail && (
        <>
          <span className="h-3 w-px bg-white/20 shrink-0" aria-hidden="true" />
          <span className="text-[11px] leading-none text-white/60 whitespace-nowrap">
            {detail}
          </span>
        </>
      )}
    </div>
  );
};
