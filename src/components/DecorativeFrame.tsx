import React from 'react';

interface DecorativeFrameProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function DecorativeFrame({ children, className = '', style }: DecorativeFrameProps) {
  return (
    <div className={`relative ${className}`} style={style}>
      <svg className="absolute -top-2 -left-2 w-8 h-8 text-[#3c6150]" viewBox="0 0 32 32" fill="currentColor">
        <path d="M4 16c0-6.627 5.373-12 12-12M4 8c0-2.21 1.79-4 4-4h4" stroke="currentColor" strokeWidth="2" fill="none"/>
        <circle cx="8" cy="8" r="3" fill="#a77a72"/>
      </svg>
      <svg className="absolute -top-2 -right-2 w-8 h-8 text-[#3c6150] rotate-90" viewBox="0 0 32 32" fill="currentColor">
        <path d="M4 16c0-6.627 5.373-12 12-12M4 8c0-2.21 1.79-4 4-4h4" stroke="currentColor" strokeWidth="2" fill="none"/>
        <circle cx="8" cy="8" r="3" fill="#a77a72"/>
      </svg>
      <svg className="absolute -bottom-2 -left-2 w-8 h-8 text-[#3c6150] -rotate-90" viewBox="0 0 32 32" fill="currentColor">
        <path d="M4 16c0-6.627 5.373-12 12-12M4 8c0-2.21 1.79-4 4-4h4" stroke="currentColor" strokeWidth="2" fill="none"/>
        <circle cx="8" cy="8" r="3" fill="#a77a72"/>
      </svg>
      <svg className="absolute -bottom-2 -right-2 w-8 h-8 text-[#3c6150] rotate-180" viewBox="0 0 32 32" fill="currentColor">
        <path d="M4 16c0-6.627 5.373-12 12-12M4 8c0-2.21 1.79-4 4-4h4" stroke="currentColor" strokeWidth="2" fill="none"/>
        <circle cx="8" cy="8" r="3" fill="#a77a72"/>
      </svg>
      {children}
    </div>
  );
}
