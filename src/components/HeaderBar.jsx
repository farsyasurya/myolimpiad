import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Volume2, VolumeX, Settings } from 'lucide-react';
import { sound } from '../utils/soundEffects';
import { bgm } from '../utils/bgmManager';

export default function HeaderBar({
  title = '',
  showBack = true,
  backTo = '/map',
  starsCount = null,
  maxStars = 30,
  showSoundToggle = true,
  className = ''
}) {
  const navigate = useNavigate();
  const [soundOn, setSoundOn] = React.useState(sound.enabled);

  const handleBack = () => {
    sound.playPop();
    if (typeof backTo === 'string') {
      navigate(backTo);
    } else if (typeof backTo === 'function') {
      backTo();
    }
  };

  const toggleSound = () => {
    const next = !soundOn;
    sound.setSoundEnabled(next);
    bgm.setMuted(!next);
    setSoundOn(next);
    if (next) sound.playPop();
  };

  return (
    <header
      className={`
        sticky top-0 z-40 w-full px-4 py-3 flex items-center justify-between
        bg-slate-900/80 backdrop-blur-md border-b border-white/10 select-none
        ${className}
      `}
    >
      {/* Left: Back button or Placeholder */}
      <div className="flex items-center gap-2 min-w-[70px]">
        {showBack && (
          <button
            type="button"
            onClick={handleBack}
            aria-label="Kembali"
            className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition border border-white/20 shadow-sm cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Middle: Title */}
      <div className="flex-1 text-center">
        {title && (
          <h1 className="text-base sm:text-lg font-bold font-game text-white tracking-wide truncate drop-shadow-sm">
            {title}
          </h1>
        )}
      </div>

      {/* Right: Stars counter & Sound / Settings */}
      <div className="flex items-center gap-2 justify-end min-w-[70px]">
        {starsCount !== null && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
            <span className="text-xs font-black font-game text-amber-300">
              {starsCount}{maxStars ? `/${maxStars}` : ''}
            </span>
          </div>
        )}

        {showSoundToggle && (
          <button
            type="button"
            onClick={toggleSound}
            aria-label={soundOn ? "Matikan Suara" : "Nyalakan Suara"}
            className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition border border-white/15 cursor-pointer"
          >
            {soundOn ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>
        )}
      </div>
    </header>
  );
}
