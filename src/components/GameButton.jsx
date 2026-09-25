import React from 'react';
import { sound } from '../utils/soundEffects';

export default function GameButton({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  icon: Icon,
  fullWidth = false,
  soundEffect = true,
  type = 'button'
}) {
  const handleClick = (e) => {
    if (disabled) return;
    if (soundEffect) {
      sound.playPop();
    }
    if (onClick) {
      onClick(e);
    }
  };

  const variantClasses = {
    primary: 'game-btn-primary text-white shadow-sky-900/40',
    success: 'game-btn-success text-white shadow-emerald-900/40',
    warning: 'game-btn-warning text-amber-950 font-bold shadow-amber-900/40',
    purple: 'game-btn-purple text-white shadow-purple-900/40',
    rose: 'game-btn-rose text-white shadow-rose-900/40',
    neutral: 'game-btn-neutral text-slate-700 shadow-slate-900/20'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-xl',
    md: 'px-5 py-2.5 text-base rounded-2xl',
    lg: 'px-6 py-3.5 text-lg rounded-2xl font-bold tracking-wide'
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative inline-flex items-center justify-center gap-2 select-none
        font-game font-semibold cursor-pointer active:outline-none focus:outline-none
        transition-all duration-100 ease-out shadow-lg
        ${variantClasses[variant] || variantClasses.primary}
        ${sizeClasses[size] || sizeClasses.md}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed filter grayscale' : 'hover:brightness-105'}
        ${className}
      `}
    >
      {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
      <span>{children}</span>
    </button>
  );
}
