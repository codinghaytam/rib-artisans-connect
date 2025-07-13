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
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%23D4B866' stroke-width='1.5' opacity='${opacity}'%3E%3Cpath d='M40,10 C35,10 30,15 30,20 C30,25 35,30 40,30 C45,30 50,25 50,20 C50,15 45,10 40,10 Z M70,40 C70,35 65,30 60,30 C55,30 50,35 50,40 C50,45 55,50 60,50 C65,50 70,45 70,40 Z M40,70 C45,70 50,65 50,60 C50,55 45,50 40,50 C35,50 30,55 30,60 C30,65 35,70 40,70 Z M10,40 C10,45 15,50 20,50 C25,50 30,45 30,40 C30,35 25,30 20,30 C15,30 10,35 10,40 Z'/%3E%3C/g%3E%3C/svg%3E")`,
        backgroundSize: '40px 40px'
      }}
    />
  );
};