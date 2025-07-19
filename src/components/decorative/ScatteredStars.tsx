import React from 'react';

interface ScatteredStarsProps {
  count?: number;
  className?: string;
}

export const ScatteredStars: React.FC<ScatteredStarsProps> = ({ count = 15, className = "" }) => {
  // Static predefined positions, sizes, and rotations
  const predefinedStars = [
    { id: 0, left: 15, top: 20, size: 70, rotation: 45, opacity: 0.15, animationDelay: 0 },
    { id: 1, left: 75, top: 10, size: 90, rotation: 120, opacity: 0.2, animationDelay: 1.5 },
    { id: 2, left: 25, top: 60, size: 56, rotation: 270, opacity: 0.18, animationDelay: 3 },
    { id: 3, left: 85, top: 40, size: 84, rotation: 180, opacity: 0.12, animationDelay: 4.5 },
    { id: 4, left: 55, top: 80, size: 76, rotation: 90, opacity: 0.22, animationDelay: 2 },
    { id: 5, left: 10, top: 85, size: 64, rotation: 315, opacity: 0.16, animationDelay: 6 },
    { id: 6, left: 90, top: 75, size: 90, rotation: 60, opacity: 0.14, animationDelay: 7.5 },
    { id: 7, left: 40, top: 25, size: 104, rotation: 200, opacity: 0.25, animationDelay: 1 },
    { id: 8, left: 65, top: 55, size: 60, rotation: 135, opacity: 0.19, animationDelay: 5 },
    { id: 9, left: 20, top: 45, size: 96, rotation: 300, opacity: 0.13, animationDelay: 3.5 },
    { id: 10, left: 80, top: 20, size: 72, rotation: 240, opacity: 0.21, animationDelay: 2.5 },
    { id: 11, left: 45, top: 70, size: 80, rotation: 30, opacity: 0.17, animationDelay: 4 },
    { id: 12, left: 5, top: 50, size: 88, rotation: 150, opacity: 0.15, animationDelay: 6.5 },
    { id: 13, left: 70, top: 85, size: 68, rotation: 225, opacity: 0.2, animationDelay: 1.2 },
    { id: 14, left: 35, top: 15, size: 92, rotation: 75, opacity: 0.18, animationDelay: 5.5 },
    { id: 15, left: 95, top: 60, size: 58, rotation: 330, opacity: 0.14, animationDelay: 3.8 },
    { id: 16, left: 60, top: 35, size: 82, rotation: 165, opacity: 0.23, animationDelay: 7 },
    { id: 17, left: 12, top: 75, size: 74, rotation: 105, opacity: 0.16, animationDelay: 2.8 },
    { id: 18, left: 82, top: 50, size: 66, rotation: 285, opacity: 0.19, animationDelay: 4.2 },
    { id: 19, left: 50, top: 5, size: 78, rotation: 195, opacity: 0.17, animationDelay: 6.8 }
  ];

  const stars = predefinedStars.slice(0, count);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute animate-pulse"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            transform: `rotate(${star.rotation}deg)`,
            opacity: star.opacity,
            animationDelay: `${star.animationDelay}s`,
            animationDuration: '8s',
          }}
        >
          <img 
            src="public/New Project (1).png"
            alt=""
            width={star.size}
            height={star.size}
            className="text-primary/30 hover:text-primary/50 transition-colors duration-1000" 
          />
        </div>
      ))}
    </div>
  );
};
