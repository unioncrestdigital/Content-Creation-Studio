import React from 'react';

interface StudioCapabilitiesIconProps {
  className?: string;
}

/**
 * The mark: a camera body with an aperture lens.
 *
 * One silhouette rather than the previous aperture-plus-sparkle composite. At
 * 32px the sparkle and the iris blades landed within a couple of pixels of each
 * other and read as noise, which is the size the header actually uses.
 */
export const StudioCapabilitiesIcon: React.FC<StudioCapabilitiesIconProps> = ({
  className = 'w-9 h-9',
}) => {
  return (
    <div
      className={`${className} relative rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center`}
    >
      <div className="w-full h-full bg-slate-950/90 rounded-[10px] flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[18px] h-[18px]"
          aria-hidden="true"
        >
          {/* Body, with the viewfinder bump on the shoulder */}
          <path
            d="M4 11.5a2.5 2.5 0 0 1 2.5-2.5h2.9c.5 0 1-.26 1.3-.7l1-1.5c.3-.44.78-.7 1.3-.7h6c.52 0 1 .26 1.3.7l1 1.5c.3.44.8.7 1.3.7h2.9A2.5 2.5 0 0 1 28 11.5v11a2.5 2.5 0 0 1-2.5 2.5h-19A2.5 2.5 0 0 1 4 22.5v-11Z"
            stroke="#A5B4FC"
            strokeWidth="1.9"
            strokeLinejoin="round"
          />
          {/* Lens */}
          <circle cx="16" cy="17" r="5.2" stroke="#67E8F9" strokeWidth="1.9" />
          {/* Aperture, kept as one stroke so it still reads at 32px */}
          <circle cx="16" cy="17" r="2" fill="#6366F1" />
        </svg>
      </div>
    </div>
  );
};
