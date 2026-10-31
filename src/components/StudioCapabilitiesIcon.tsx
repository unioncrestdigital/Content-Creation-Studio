import React from 'react';

interface StudioCapabilitiesIconProps {
  className?: string;
}

export const StudioCapabilitiesIcon: React.FC<StudioCapabilitiesIconProps> = ({
  className = 'w-9 h-9',
}) => {
  return (
    <div
      className={`${className} relative rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center`}
    >
      <div className="w-full h-full bg-slate-950/90 rounded-[10px] flex items-center justify-center overflow-hidden relative">
        {/* Multi-capability SVG: Camera Aperture + Film Track + Photo Prism Glow */}
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-indigo-400"
        >
          {/* Aperture ring */}
          <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.75" />
          {/* Inner lens iris blades */}
          <path
            d="M16 5L20 16L16 27M5 16L16 20L27 16"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            className="text-cyan-300"
          />
          {/* Photo sparkle star at top right */}
          <path
            d="M23 7L24 9.5L26.5 10.5L24 11.5L23 14L22 11.5L19.5 10.5L22 9.5L23 7Z"
            fill="#818CF8"
          />
          {/* Center core */}
          <circle cx="16" cy="16" r="3" fill="#6366F1" />
        </svg>
      </div>
    </div>
  );
};
