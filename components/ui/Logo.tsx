import React from 'react';

interface LogoProps {
  variant?: string; // Kept for consumer compatibility
  className?: string;
  style?: React.CSSProperties;
}

export function Logo({ className = '', style = {} }: LogoProps) {
  // Using the pure, standalone Copper Symbol natively provided by the user.
  // This discards the complex CSS sprite-sheet logic entirely.
  return (
    <img 
      src="/coppr_icon.png"
      alt="Coppr Symbol"
      className={`object-contain ${className || 'w-12 h-12'}`}
      style={style}
      loading="lazy"
    />
  );
}
