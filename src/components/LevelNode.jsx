import React from 'react';
import { Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import StarRating from './StarRating';
import CharacterAvatar from './CharacterAvatar';
import { sound } from '../utils/soundEffects';

/**
 * LevelNode Component
 * Represents a single level on the adventure world map
 * Separate modular star and lock components as required
 */
export default function LevelNode({
  level,
  isCurrent = false,
  onSelectLevel
}) {
  const { id, name, unlocked, completed, stars, bestScore } = level;

  const handleClick = () => {
    if (!unlocked) {
      sound.playWrong();
      return;
    }
    sound.playPop();
    if (onSelectLevel) {
      onSelectLevel(level);
    }
  };

  return (
    <div className="relative flex flex-col items-center group my-2">
      {/* Current Player Mascot standing on this active node */}
      {isCurrent && (
        <div className="absolute -top-20 z-30 transition-transform">
          <CharacterAvatar speech={`Level ${id}!`} size="sm" />
        </div>
      )}

      {/* Main Node Circular Button */}
      <button
        type="button"
        onClick={handleClick}
        disabled={!unlocked}
        aria-label={`Level ${id} - ${name} ${unlocked ? 'Terbuka' : 'Terkunci'}`}
        className={`
          relative w-20 h-20 rounded-full flex flex-col items-center justify-center
          transition-all duration-200 select-none z-10
          ${
            unlocked
              ? 'cursor-pointer active:scale-95 shadow-[0_8px_0_#1e3a8a,0_12px_20px_rgba(0,0,0,0.3)] hover:-translate-y-1'
              : 'cursor-not-allowed opacity-80 shadow-[0_6px_0_#334155,0_10px_15px_rgba(0,0,0,0.2)]'
          }
          ${
            unlocked
              ? isCurrent
                ? 'bg-gradient-to-b from-amber-300 via-amber-400 to-amber-500 border-4 border-yellow-200 ring-4 ring-yellow-400/50 animate-pulse-gentle'
                : completed
                ? 'bg-gradient-to-b from-emerald-400 via-emerald-500 to-green-600 border-4 border-emerald-200 shadow-emerald-950/40'
                : 'bg-gradient-to-b from-sky-400 via-sky-500 to-blue-600 border-4 border-sky-200 shadow-blue-950/40'
              : 'bg-gradient-to-b from-slate-500 via-slate-600 to-slate-700 border-4 border-slate-400'
          }
        `}
      >
        {/* Subtle circular inner highlight ring */}
        <div className="absolute inset-1 rounded-full border border-white/40 pointer-events-none" />

        {unlocked ? (
          <>
            {/* Level Number */}
            <span
              className={`
                text-2xl font-black font-game leading-none drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]
                ${isCurrent ? 'text-amber-950' : 'text-white'}
              `}
            >
              {id}
            </span>

            {/* Completed badge checkmark if 3 stars or completed */}
            {completed && (
              <div className="absolute -top-1.5 -right-1 bg-white text-emerald-600 rounded-full p-0.5 shadow-sm">
                <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-white" />
              </div>
            )}
          </>
        ) : (
          /* Separate Lock Icon component */
          <div className="flex flex-col items-center justify-center text-slate-300">
            <Lock className="w-7 h-7 drop-shadow-sm text-slate-300" strokeWidth={2.2} />
          </div>
        )}
      </button>

      {/* Dynamic Star Rating below Node (Rendered separately, never static) */}
      <div className="mt-1 min-h-[22px] flex items-center justify-center z-10">
        {unlocked ? (
          <StarRating stars={stars} maxStars={3} size="sm" showEmpty={completed} />
        ) : (
          <span className="text-[11px] font-bold text-slate-300/80 uppercase tracking-wider">
            Terkunci
          </span>
        )}
      </div>

      {/* Level Name Banner Badge */}
      <div
        className={`
          mt-0.5 px-3 py-0.5 rounded-full text-xs font-game font-bold tracking-wide shadow-md whitespace-nowrap z-10 border
          ${
            unlocked
              ? 'bg-slate-900/85 text-white border-amber-400/40 backdrop-blur-xs'
              : 'bg-slate-800/70 text-slate-400 border-slate-600/40'
          }
        `}
      >
        {name}
      </div>
    </div>
  );
}
