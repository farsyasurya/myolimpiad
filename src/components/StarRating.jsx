import React from 'react';
import { Star } from 'lucide-react';

/**
 * StarRating component
 * Renders dynamically based on `stars` count (0, 1, 2, 3)
 * Completely separated from background, with optional pop animations
 */
export default function StarRating({
  stars = 0,
  maxStars = 3,
  size = 'md',
  animated = false,
  showEmpty = true,
  className = ''
}) {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-9 h-9',
    xl: 'w-12 h-12'
  };

  const iconSize = sizeClasses[size] || sizeClasses.md;

  return (
    <div className={`flex items-center justify-center gap-1 ${className}`}>
      {Array.from({ length: maxStars }).map((_, index) => {
        const isFilled = index < stars;
        if (!isFilled && !showEmpty) return null;

        return (
          <div
            key={index}
            className={`relative transition-all duration-300 ${
              animated && isFilled ? 'animate-star-pop' : ''
            }`}
            style={{
              animationDelay: animated ? `${index * 180}ms` : '0ms'
            }}
          >
            {isFilled ? (
              <div className="relative">
                <Star
                  className={`${iconSize} fill-amber-400 text-amber-500 drop-shadow-[0_2px_4px_rgba(245,158,11,0.5)] transform hover:scale-110 transition-transform`}
                  strokeWidth={1.5}
                />
                <span className="absolute top-0.5 right-1 w-1 h-1 bg-white rounded-full opacity-80 pointer-events-none" />
              </div>
            ) : (
              <Star
                className={`${iconSize} fill-slate-300/40 text-slate-400 stroke-slate-400/80`}
                strokeWidth={1.5}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
