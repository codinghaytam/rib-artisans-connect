import React from 'react';

interface MoroccanPatternsProps {
  className?: string;
  variant?: 'star' | 'diamond' | 'flower' | 'geometric' | 'cross' | 'circle';
  size?: 'sm' | 'md' | 'lg';
  opacity?: number;
}

export const MoroccanPatterns: React.FC<MoroccanPatternsProps> = ({
  className = '',
  variant = 'star',
  size = 'md',
  opacity = 0.1
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const patterns = {
    star: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={`${sizeClasses[size]} ${className}`} style={{ opacity }}>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      </svg>
    ),
    diamond: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={`${sizeClasses[size]} ${className}`} style={{ opacity }}>
        <path d="M12 2L2 12l10 10 10-10L12 2z"/>
      </svg>
    ),
    flower: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={`${sizeClasses[size]} ${className}`} style={{ opacity }}>
        <path d="M12 2C8 2 5 5 5 9c0 2 1 4 3 5-2 1-3 3-3 5 0 4 3 7 7 7s7-3 7-7c0-2-1-4-3-5 2-1 3-3 3-5 0-4-3-7-7-7zm0 4c2 0 3 1 3 3s-1 3-3 3-3-1-3-3 1-3 3-3zm0 10c-2 0-3-1-3-3s1-3 3-3 3 1 3 3-1 3-3 3z"/>
      </svg>
    ),
    geometric: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={`${sizeClasses[size]} ${className}`} style={{ opacity }}>
        <path d="M12 2L2 7v10l10 5 10-5V7l-10-5zM12 4.8L19.6 8.5 12 12.2 4.4 8.5 12 4.8zM4 10l7 3.5v7L4 17v-7zm16 0v7l-7 3.5v-7L20 10z"/>
      </svg>
    ),
    cross: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={`${sizeClasses[size]} ${className}`} style={{ opacity }}>
        <path d="M9 3v6H3v6h6v6h6v-6h6V9h-6V3H9z"/>
      </svg>
    ),
    circle: (
      <svg viewBox="0 0 24 24" fill="currentColor" className={`${sizeClasses[size]} ${className}`} style={{ opacity }}>
        <circle cx="12" cy="12" r="8"/>
        <circle cx="12" cy="12" r="4" fill="white"/>
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
      </svg>
    )
  };

  return patterns[variant];
};

interface PatternGridProps {
  className?: string;
  density?: 'low' | 'medium' | 'high';
  color?: string;
}

export const MoroccanPatternGrid: React.FC<PatternGridProps> = ({
  className = '',
  density = 'low',
  color = 'text-accent'
}) => {
  const patterns = ['star', 'diamond', 'flower', 'geometric', 'cross', 'circle'] as const;
  const sizes = ['sm', 'md', 'lg'] as const;
  
  const gridCounts = {
    low: 8,
    medium: 15,
    high: 25
  };

  const patternElements = Array.from({ length: gridCounts[density] }, (_, i) => {
    const pattern = patterns[i % patterns.length];
    const size = sizes[i % sizes.length];
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100;
    const randomOpacity = 0.05 + Math.random() * 0.1;
    const randomRotation = Math.random() * 360;

    return (
      <div
        key={i}
        className="absolute pointer-events-none"
        style={{
          left: `${randomX}%`,
          top: `${randomY}%`,
          transform: `rotate(${randomRotation}deg)`,
        }}
      >
        <MoroccanPatterns
          variant={pattern}
          size={size}
          opacity={randomOpacity}
          className={color}
        />
      </div>
    );
  });

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {patternElements}
    </div>
  );
};