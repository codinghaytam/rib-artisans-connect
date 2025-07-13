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
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill='none' stroke='hsl(var(--primary))' stroke-width='1' opacity='${opacity}'%3E%3Cpath d='M50 10c-11 0-20 9-20 20 0 6.6 3.2 12.4 8.1 16.1C32.4 50.4 30 56.6 30 63.3c0 11 9 20 20 20 6.7 0 12.9-2.4 17.2-6.7C71.1 81.5 76.9 84.7 83.5 84.7c11 0 20-9 20-20 0-6.7-2.4-12.9-6.7-17.2 4.3-4.3 6.7-10.1 6.7-16.8 0-11-9-20-20-20-6.7 0-12.9 2.4-17.2 6.7C62 13.1 56.2 10.7 49.5 10.7z'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '50px 50px'
      }}
    />
  );
};