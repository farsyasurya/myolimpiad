import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Trophy, Settings, Info, Star, Sparkles, Shield, AlertCircle, LogOut } from 'lucide-react';
import GameButton from '../components/GameButton';
import CharacterAvatar from '../components/CharacterAvatar';
import CloudDecoration from '../components/decorations/CloudDecoration';
import TreeDecoration from '../components/decorations/TreeDecoration';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/soundEffects';

export default function Home() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [showAdminNotice, setShowAdminNotice] = useState(false);

  // Alur "Mulai Petualangan":
  // 1. Belum terdeteksi login / register -> Redirect ke /user/login
  // 2. Terdeteksi login sebagai admin / penyelenggara -> Tampilkan peringatan bahwa penyelenggara tidak bisa ikut
  // 3. Terdeteksi login sebagai user / peserta -> Masuk ke http://localhost:5173/join
  const handleStartAdventure = () => {
    sound.playPop();

    if (!currentUser) {
      navigate('/user/login');
      return;
    }

    if (currentUser.role === 'admin') {
      sound.playWrong();
      setShowAdminNotice(true);
      return;
    }

    // User terdeteksi -> redirect ke /join
    navigate('/join');
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 sm:p-5 bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-400 text-slate-800 select-none overflow-y-auto no-scrollbar">
      {/* Floating Scenery Background Elements */}
      <div className="absolute top-6 -left-6 pointer-events-none">
        <CloudDecoration className="w-28 opacity-90 animate-pulse-gentle" />
      </div>
      <div className="absolute top-16 -right-6 pointer-events-none">
        <CloudDecoration className="w-32 opacity-80" />
      </div>
      <div className="absolute bottom-16 -left-4 pointer-events-none">
        <TreeDecoration type="oak" className="w-16 h-20 opacity-80" />
      </div>
      <div className="absolute bottom-14 -right-4 pointer-events-none">
        <TreeDecoration type="pine" className="w-16 h-20 opacity-80" />
      </div>

      {/* Top Bar: User Info & Portal Penyelenggara */}
      <div className="w-full flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-2xl shadow-md border-2 border-amber-300">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-black font-game text-amber-900">
            {currentUser ? (currentUser.role === 'admin' ? 'Penyelenggara Lomba' : 'Peserta Lomba') : 'Olimpiade Matematika'}
          </span>
        </div>

        {/* Status Login / Portal Penyelenggara */}
        <div className="flex items-center gap-1.5">
          {currentUser ? (
            <div className="flex items-center gap-1">
              <span className="px-2.5 py-1 bg-white/90 border border-slate-300 text-slate-800 font-game font-bold text-xs rounded-xl truncate max-w-[120px]">
                {currentUser.displayName || currentUser.email?.split('@')[0] || 'Peserta'}
              </span>
              <button
                type="button"
                onClick={() => {
                  sound.playPop();
                  logout();
                }}
                title="Keluar Akun"
                className="p-1.5 rounded-xl bg-slate-800/80 text-white hover:bg-slate-700 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                navigate('/admin/dashboard');
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-amber-950 rounded-2xl shadow-md border-2 border-amber-200 font-game font-bold text-xs transition cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5" />
              Penyelenggara
            </button>
          )}
        </div>
      </div>

      {/* Center Hero: Logo & Mascot */}
      <div className="my-auto flex flex-col items-center z-10 text-center py-2">
        <div className="relative mb-2">
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-amber-400 text-amber-950 font-black text-xs font-game rounded-full uppercase tracking-wider mb-2 shadow-sm border border-amber-300">
            <Sparkles className="w-3.5 h-3.5 fill-amber-950" />
            Olimpiade Matematika Cilik
          </div>
          <h1 className="text-4xl sm:text-5xl font-black font-game tracking-wider text-white drop-shadow-[0_5px_0_#0369a1] leading-none">
            PETUALANGAN
          </h1>
          <span className="block text-4xl sm:text-5xl font-black font-game tracking-wider text-yellow-300 drop-shadow-[0_5px_0_#b45309] mt-1">
            MATEMATIKA
          </span>
        </div>

        {/* Mascot */}
        <div className="my-1">
          <CharacterAvatar speech="Siap bertualang & berhitung?" size="md" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-xs z-10 flex flex-col gap-2.5 mb-3">
        {/* Tombol Utama: Mulai Petualangan */}
        <GameButton
          variant="success"
          size="lg"
          fullWidth
          icon={Play}
          onClick={handleStartAdventure}
          className="text-lg tracking-wide uppercase py-4 shadow-emerald-950/40"
        >
          Mulai Petualangan
        </GameButton>

        {/* Papan Peringkat Juara */}
        <GameButton
          variant="purple"
          size="md"
          fullWidth
          icon={Trophy}
          onClick={() => {
            sound.playPop();
            navigate('/leaderboard');
          }}
        >
          Papan Peringkat Juara
        </GameButton>

        {/* Pengaturan & Tentang */}
        <div className="grid grid-cols-2 gap-2 mt-0.5">
          <GameButton
            variant="neutral"
            size="sm"
            icon={Settings}
            onClick={() => navigate('/settings')}
            className="py-2 text-xs"
          >
            Pengaturan
          </GameButton>

          <GameButton
            variant="neutral"
            size="sm"
            icon={Info}
            onClick={() => navigate('/about')}
            className="py-2 text-xs"
          >
            Tentang
          </GameButton>
        </div>

        {/* Link Portal Penyelenggara if logged in as user or logged out */}
        {currentUser?.role !== 'admin' && (
          <div className="text-center mt-1">
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                navigate('/admin/login');
              }}
              className="text-[11px] font-game text-slate-700 hover:text-slate-900 font-bold underline cursor-pointer"
            >
              Masuk sebagai Penyelenggara Lomba
            </button>
          </div>
        )}
      </div>

      {/* Modal Peringatan: Penyelenggara Tidak Bisa Ikut Bermain */}
      {showAdminNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-xs bg-slate-900 border-2 border-amber-400 rounded-3xl p-5 text-center text-white shadow-2xl relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-3">
              <AlertCircle className="w-7 h-7" />
            </div>

            <h3 className="text-base font-black font-game text-yellow-300">
              Penyelenggara Tidak Bisa Ikut
            </h3>

            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Akun Anda terdaftar sebagai <b>Penyelenggara Lomba (Admin)</b>.
              Penyelenggara bertugas membuat soal dan mengelola lomba, sehingga tidak dapat ikut bertanding sebagai peserta.
            </p>

            <div className="flex flex-col gap-2 mt-4">
              <GameButton
                variant="warning"
                size="sm"
                fullWidth
                onClick={() => {
                  setShowAdminNotice(false);
                  navigate('/admin/dashboard');
                }}
              >
                Ke Dashboard Admin
              </GameButton>

              <GameButton
                variant="neutral"
                size="sm"
                fullWidth
                onClick={async () => {
                  setShowAdminNotice(false);
                  await logout();
                  navigate('/user/login');
                }}
              >
                Ganti ke Akun Peserta
              </GameButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
