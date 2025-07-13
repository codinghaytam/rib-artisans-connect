import React from 'react';

interface QuatrefoilBackgroundProps {
  className?: string;
  opacity?: number;
}

export const QuatrefoilBackground: React.FC<QuatrefoilBackgroundProps> = ({
  className = '',
  opacity = 0.05
}) => {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 100 40'%3E%3Cpath d='M20 10 C25 10, 30 15, 30 20 C30 15, 25 10, 20 10 Z M30 20 C30 25, 25 30, 20 30 C25 30, 30 25, 30 20 Z M20 30 C15 30, 10 25, 10 20 C10 25, 15 30, 20 30 Z M10 20 C10 15, 15 10, 20 10 C15 10, 10 15, 10 20 Z' fill='none' stroke='hsl(var(--primary))' stroke-width='0.5' opacity='${opacity}' /%3E%3C/svg%3E")`,
        backgroundSize: '40px 40px'
      }}
    />
  );
};