import React from 'react';

/**
 * CharacterAvatar Component
 * Animated friendly explorer character (Piko si Penjelajah)
 * Modular vector art that can also be easily replaced by Canva character PNG
 */
export default function CharacterAvatar({
  speech = '',
  size = 'md',
  animate = true,
  className = ''
}) {
  const sizeMap = {
    sm: 'w-12 h-14',
    md: 'w-16 h-20',
    lg: 'w-24 h-28',
    xl: 'w-32 h-36'
  };

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Optional Speech Bubble */}
      {speech && (
        <div className="mb-1.5 px-2.5 py-1 bg-white text-slate-800 text-xs font-bold font-game rounded-xl shadow-md border-2 border-amber-300 relative whitespace-nowrap animate-bounce">
          {speech}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-amber-300" />
        </div>
      )}

      {/* Character Graphic */}
      <div className={`relative ${sizeMap[size] || sizeMap.md} ${animate ? 'animate-bobbing' : ''}`}>
        <svg
          viewBox="0 0 100 120"
          className="w-full h-full drop-shadow-md overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shadow underneath */}
          <ellipse cx="50" cy="115" rx="30" ry="6" fill="#0f172a" fillOpacity="0.25" />

          {/* Explorer Backpack behind */}
          <rect x="25" y="55" width="50" height="42" rx="14" fill="#92400e" stroke="#78350f" strokeWidth="3" />
          <rect x="35" y="70" width="30" height="20" rx="6" fill="#b45309" />
          <path d="M35 70 H65" stroke="#78350f" strokeWidth="2" strokeDasharray="3 2" />

          {/* Body / Shirt */}
          <path
            d="M32 60 C32 50, 68 50, 68 60 L72 96 C72 100, 28 100, 28 96 Z"
            fill="#059669"
            stroke="#047857"
            strokeWidth="3"
          />
          {/* Collar & Buttons */}
          <path d="M44 55 L50 65 L56 55" stroke="#fef08a" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="50" cy="74" r="2.5" fill="#fef08a" />
          <circle cx="50" cy="85" r="2.5" fill="#fef08a" />

          {/* Scarf / Bandana */}
          <path d="M38 56 Q50 64 62 56 Q50 60 38 56 Z" fill="#ef4444" />
          <polygon points="50,62 46,70 54,70" fill="#dc2626" />

          {/* Head */}
          <circle cx="50" cy="38" r="22" fill="#fed7aa" stroke="#fba760" strokeWidth="2.5" />

          {/* Cheeks Blush */}
          <ellipse cx="36" cy="44" rx="4" ry="2.5" fill="#f87171" fillOpacity="0.5" />
          <ellipse cx="64" cy="44" rx="4" ry="2.5" fill="#f87171" fillOpacity="0.5" />

          {/* Eyes - Happy & Expressive */}
          <ellipse cx="40" cy="37" rx="3.5" ry="4.5" fill="#1e293b" />
          <circle cx="41.5" cy="35" r="1.5" fill="white" />
          <ellipse cx="60" cy="37" rx="3.5" ry="4.5" fill="#1e293b" />
          <circle cx="61.5" cy="35" r="1.5" fill="white" />

          {/* Friendly Smile */}
          <path d="M44 45 Q50 51 56 45" stroke="#991b1b" strokeWidth="2.5" strokeLinecap="round" fill="#ef4444" />

          {/* Explorer Safari Hat */}
          {/* Hat Brim */}
          <ellipse cx="50" cy="24" rx="36" ry="8" fill="#d97706" stroke="#b45309" strokeWidth="2.5" />
          {/* Hat Crown */}
          <path
            d="M26 24 C26 7, 74 7, 74 24 Z"
            fill="#f59e0b"
            stroke="#b45309"
            strokeWidth="2.5"
          />
          {/* Hat Ribbon */}
          <path
            d="M26 22 Q50 25 74 22 L74 19 Q50 22 26 19 Z"
            fill="#15803d"
          />
          {/* Explorer Badge on Hat */}
          <polygon points="50,11 53,17 47,17" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />

          {/* Hands */}
          {/* Left Hand Holding Binoculars or waving */}
          <circle cx="23" cy="70" r="6" fill="#fed7aa" stroke="#fba760" strokeWidth="2" />
          {/* Right Hand Waving */}
          <circle cx="77" cy="58" r="6" fill="#fed7aa" stroke="#fba760" strokeWidth="2" />
          <path d="M74 54 L81 48 M78 52 L85 50" stroke="#fba760" strokeWidth="2" strokeLinecap="round" />

          {/* Shoes */}
          <rect x="33" y="98" width="13" height="8" rx="4" fill="#78350f" />
          <rect x="54" y="98" width="13" height="8" rx="4" fill="#78350f" />
        </svg>
      </div>
    </div>
  );
}
