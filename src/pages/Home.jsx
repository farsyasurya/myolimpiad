import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Map, Settings, Info, Star, Trophy, Sparkles } from 'lucide-react';
import GameButton from '../components/GameButton';
import CharacterAvatar from '../components/CharacterAvatar';
import CloudDecoration from '../components/decorations/CloudDecoration';
import TreeDecoration from '../components/decorations/TreeDecoration';
import { getGameStats } from '../services/gameProgressService';

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalStars: 0, completedCount: 0 });

  useEffect(() => {
    setStats(getGameStats());
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 sm:p-5 bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-400 text-slate-800 select-none overflow-hidden">
      {/* Floating Cloud Background Elements */}
      <div className="absolute top-6 -left-6">
        <CloudDecoration className="w-28 opacity-90 animate-pulse-gentle" />
      </div>
      <div className="absolute top-16 -right-6">
        <CloudDecoration className="w-32 opacity-80" />
      </div>
      <div className="absolute bottom-16 -left-4">
        <TreeDecoration type="oak" className="w-16 h-20 opacity-80" />
      </div>
      <div className="absolute bottom-14 -right-4">
        <TreeDecoration type="pine" className="w-16 h-20 opacity-80" />
      </div>

      {/* Top Stat Bar */}
      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-2xl shadow-md border-2 border-amber-300">
          <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
          <span className="text-sm font-black font-game text-amber-900">
            {stats.totalStars} <span className="text-xs text-amber-700/70 font-bold">/ 30 Bintang</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-2xl shadow-md border-2 border-emerald-300">
          <Trophy className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-black font-game text-emerald-900">
            {stats.completedCount} / 10 Selesai
          </span>
        </div>
      </div>

      {/* Center Hero: Logo & Mascot */}
      <div className="my-auto flex flex-col items-center z-10 text-center">
        {/* Game Title with 3D text styling */}
        <div className="relative mb-3">
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-400 text-amber-950 font-black text-xs font-game rounded-full uppercase tracking-wider mb-2 shadow-sm border border-amber-300">
            <Sparkles className="w-3.5 h-3.5 fill-amber-950" />
            Game Edukasi Petualangan
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-game tracking-wider text-white drop-shadow-[0_5px_0_#0369a1] leading-none">
            PETUALANGAN
          </h1>
          <span className="block text-4xl sm:text-5xl font-black font-game tracking-wider text-yellow-300 drop-shadow-[0_5px_0_#b45309] mt-1">
            CILIK
          </span>
        </div>

        {/* Mascot */}
        <div className="my-2">
          <CharacterAvatar speech="Siap bertualang hari ini?" size="lg" />
        </div>
      </div>

      {/* Main Menu Action Buttons */}
      <div className="w-full max-w-xs z-10 flex flex-col gap-3 mb-4">
        {/* Mulai Bermain Button */}
        <GameButton
          variant="success"
          size="lg"
          fullWidth
          icon={Play}
          onClick={() => navigate('/map')}
          className="text-xl tracking-wide uppercase py-4"
        >
          Mulai Bermain
        </GameButton>

        {/* Pilih Level Button */}
        <GameButton
          variant="primary"
          size="md"
          fullWidth
          icon={Map}
          onClick={() => navigate('/map')}
        >
          Pilih Level
        </GameButton>

        {/* Bottom Row: Pengaturan & Tentang */}
        <div className="grid grid-cols-2 gap-3 mt-1">
          <GameButton
            variant="purple"
            size="sm"
            icon={Settings}
            onClick={() => navigate('/settings')}
            className="py-2.5"
          >
            Pengaturan
          </GameButton>

          <GameButton
            variant="warning"
            size="sm"
            icon={Info}
            onClick={() => navigate('/about')}
            className="py-2.5"
          >
            Tentang
          </GameButton>
        </div>
      </div>
    </div>
  );
}
