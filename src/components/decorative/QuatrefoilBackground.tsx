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
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cpath d='M30,15 C35,15 40,20 40,25 C40,20 35,15 30,15 C25,15 20,20 20,25 C20,20 25,15 30,15 Z M45,30 C45,25 40,20 35,20 C40,20 45,25 45,30 C45,35 40,40 35,40 C40,40 45,35 45,30 Z M30,45 C25,45 20,40 20,35 C20,40 25,45 30,45 C35,45 40,40 40,35 C40,40 35,45 30,45 Z M15,30 C15,35 20,40 25,40 C20,40 15,35 15,30 C15,25 20,20 25,20 C20,20 15,25 15,30 Z' fill='hsl(var(--primary))' opacity='${opacity}' /%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px'
      }}
    />
  );
};