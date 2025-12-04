import React from 'react';

interface FloralDividerProps {
  variant?: 'default' | 'vine' | 'mushroom';
}

export default function FloralDivider({ variant = 'default' }: FloralDividerProps) {
  const FlowerSVG = () => (
    <svg className="w-6 h-6 text-[#5f3c43]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2c1.5 2 2 4 2 6 2-2 4-2.5 6-2-2 1.5-2.5 4-2 6 2-.5 4 0 6 2-2 0-4 .5-6 2 .5 2 0 4-2 6 0-2-.5-4-2-6-1.5 2-4 2.5-6 2 2-1.5 2.5-4 2-6-2 .5-4 0-6-2 2 0 4-.5 6-2-.5-2 0-4 2-6z"/>
      <circle cx="12" cy="12" r="3" fill="#a77a72"/>
    </svg>
  );

  const LeafSVG = () => (
    <svg className="w-5 h-5 text-[#3c6150]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
    </svg>
  );

  const MushroomSVG = () => (
    <svg className="w-6 h-6 text-[#a77a72]" viewBox="0 0 24 24" fill="currentColor">
      <ellipse cx="12" cy="8" rx="8" ry="5" fill="#5f3c43"/>
      <rect x="10" y="12" width="4" height="8" rx="1" fill="#f5f1ed" stroke="#a77a72"/>
      <circle cx="9" cy="7" r="1.5" fill="#f5f1ed"/>
      <circle cx="14" cy="6" r="1" fill="#f5f1ed"/>
    </svg>
  );

  return (
    <div className="flex items-center justify-center my-6 animate-fade-in">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#a77a72] to-transparent"></div>
      <div className="mx-4 flex items-center gap-3">
        {variant === 'mushroom' ? (
          <>
            <LeafSVG />
            <MushroomSVG />
            <LeafSVG />
          </>
        ) : variant === 'vine' ? (
          <>
            <LeafSVG />
            <FlowerSVG />
            <LeafSVG />
          </>
        ) : (
          <>
            <FlowerSVG />
            <LeafSVG />
            <FlowerSVG />
          </>
        )}
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#a77a72] to-transparent"></div>
    </div>
  );
}
