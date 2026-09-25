import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderBar from '../components/HeaderBar';
import GameButton from '../components/GameButton';
import CharacterAvatar from '../components/CharacterAvatar';
import { Compass, BookOpen, Star, Trophy, Sparkles, Heart } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full min-h-[100dvh] flex flex-col bg-slate-900 text-white select-none">
      <HeaderBar title="Tentang Game" backTo="/home" showSoundToggle={false} />

      <div className="flex-1 p-5 max-w-md w-full mx-auto flex flex-col justify-between overflow-y-auto no-scrollbar">
        <div className="flex flex-col items-center text-center mt-2">
          {/* Character */}
          <CharacterAvatar speech="Selamat datang di Petualangan Cilik!" size="md" />

          <h2 className="text-2xl font-black font-game text-yellow-300 mt-3">
            Petualangan Cilik
          </h2>
          <span className="text-xs font-bold text-sky-400 font-game tracking-wider">
            Game Edukasi & Petualangan Interaktif
          </span>

          {/* Cards */}
          <div className="w-full flex flex-col gap-3 mt-4 text-left">
            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 shadow-lg flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-game font-bold text-white text-sm">Konsep Adventure Map</h3>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  Jelajahi 10 level bertema dari Hutan Pengetahuan, Sungai Ajaib, Tata Surya hingga Puncak Menara Juara.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 shadow-lg flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-game font-bold text-white text-sm">Kuis Edukatif & Pembahasan</h3>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  Setiap pertanyaan dilengkapi penjelasan ilmiah ramah anak untuk menambah wawasan secara menyenangkan.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 shadow-lg flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 text-yellow-400 flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 fill-yellow-400" />
              </div>
              <div>
                <h3 className="font-game font-bold text-white text-sm">Sistem Bintang & Progres</h3>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  Dapatkan hingga 3 bintang di setiap level dan buka rute petualangan baru secara bertahap.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 text-center text-xs text-slate-400 flex items-center justify-center gap-1">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> untuk anak-anak Indonesia
          </div>
        </div>

        <div className="mt-6 mb-4">
          <GameButton
            variant="primary"
            size="md"
            fullWidth
            onClick={() => navigate('/home')}
          >
            Kembali ke Menu
          </GameButton>
        </div>
      </div>
    </div>
  );
}
