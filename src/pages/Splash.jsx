import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CharacterAvatar from '../components/CharacterAvatar';
import { Compass, Sparkles, BookOpen } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export default function Splash() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            navigate('/home');
          }, 400);
          return 100;
        }
        return prev + 10;
      });
    }, 180);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleSkip = () => {
    sound.playPop();
    navigate('/home');
  };

  return (
    <div
      onClick={handleSkip}
      className="relative w-full h-full flex flex-col items-center justify-between p-6 bg-gradient-to-b from-sky-400 via-indigo-500 to-purple-700 text-white cursor-pointer select-none overflow-hidden"
    >
      {/* Background Floating Stars & Circles */}
      <div className="absolute top-10 left-6 opacity-30 animate-pulse">
        <Sparkles className="w-12 h-12 text-yellow-300" />
      </div>
      <div className="absolute top-28 right-8 opacity-25 animate-bounce">
        <Compass className="w-16 h-16 text-white" />
      </div>
      <div className="absolute bottom-24 left-10 opacity-20">
        <BookOpen className="w-14 h-14 text-yellow-200" />
      </div>

      {/* Top Banner / Badge */}
      <div className="mt-8 flex flex-col items-center z-10 text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs sm:text-sm font-game font-semibold tracking-wider text-amber-200 uppercase shadow-lg">
          <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
          Game Edukasi Anak Cerdas
        </div>

        {/* Main Game Logo */}
        <div className="mt-5 relative">
          <h1 className="text-4xl sm:text-5xl font-black font-game tracking-wider text-white drop-shadow-[0_6px_0_#1e1b4b] leading-tight">
            PETUALANGAN
          </h1>
          <span className="block text-4xl sm:text-5xl font-black font-game tracking-wider text-amber-300 drop-shadow-[0_6px_0_#92400e]">
            CILIK
          </span>
          <p className="mt-2 text-sm sm:text-base font-game text-sky-100 font-medium tracking-wide">
            Jelajah 10 Dunia Ilmu & Kuis Seru!
          </p>
        </div>
      </div>

      {/* Mascot Avatar with welcome speech */}
      <div className="z-10 my-auto flex flex-col items-center">
        <CharacterAvatar speech="Halo Petualang Cilik! Ayo bersiap!" size="lg" />
      </div>

      {/* Loading Progress Bar & Tap to Start */}
      <div className="w-full max-w-xs z-10 flex flex-col items-center gap-3 mb-6">
        <div className="w-full bg-black/30 backdrop-blur-sm rounded-full h-4 p-0.5 border border-white/20 shadow-inner overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-400 to-yellow-300 h-full rounded-full transition-all duration-200 ease-out shadow-sm"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-xs text-amber-100/90 font-game animate-pulse">
          {progress < 100 ? `Memuat petualangan... ${progress}%` : 'Siap bertualang!'}
        </p>

        <span className="text-[11px] text-white/60 tracking-wider">
          Ketuk layar untuk langsung mulai
        </span>
      </div>
    </div>
  );
}
