import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderBar from '../components/HeaderBar';
import GameButton from '../components/GameButton';
import { sound } from '../utils/soundEffects';
import { bgm } from '../utils/bgmManager';
import { Volume2, VolumeX, RotateCcw, AlertTriangle, Check, Shield } from 'lucide-react';

export default function Settings() {
  const navigate = useNavigate();
  const [soundEnabled, setSoundEnabled] = useState(sound.enabled);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    sound.setSoundEnabled(next);
    bgm.setMuted(!next);
    setSoundEnabled(next);
    if (next) sound.playPop();
  };

  const handleReset = () => {
    sound.playPop();
    sessionStorage.removeItem('activeCompetitionEvent');
    // Clear event progress
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('progress_') || key === 'gameProgress') {
        localStorage.removeItem(key);
      }
    });
    setShowConfirmReset(false);
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      navigate('/home');
    }, 1200);
  };

  return (
    <div className="relative w-full h-full min-h-[100dvh] flex flex-col bg-slate-900 text-white select-none">
      <HeaderBar title="Pengaturan Game" backTo="/home" showSoundToggle={false} />

      <div className="flex-1 p-5 max-w-md w-full mx-auto flex flex-col justify-between">
        <div className="flex flex-col gap-4 mt-2">
          {/* Audio Setting */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-game font-bold text-white text-base">Efek Suara Game</h3>
                <p className="text-xs text-slate-400">Suara tombol, kuis, dan kemenangan</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleToggleSound}
              className={`w-14 h-8 rounded-full transition-colors p-1 cursor-pointer flex items-center ${
                soundEnabled ? 'bg-emerald-500 justify-end' : 'bg-slate-600 justify-start'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-white shadow-md transform transition-transform" />
            </button>
          </div>

          {/* Reset Progress Section */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 flex flex-col gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-game font-bold text-white text-base">Reset Petualangan</h3>
                <p className="text-xs text-slate-400">Kembalikan level ke Level 1 dan hapus bintang</p>
              </div>
            </div>

            <GameButton
              variant="rose"
              size="sm"
              icon={RotateCcw}
              onClick={() => {
                sound.playPop();
                setShowConfirmReset(true);
              }}
              className="mt-1"
            >
              Reset Semua Progress
            </GameButton>
          </div>

          {/* Storage & Architecture Info */}
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/40 text-xs text-slate-400 flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-300">Penyimpanan Bersih (Modular)</p>
              <p className="mt-0.5 leading-relaxed">
                Saat ini data disimpan di localStorage browser dan arsitektur service siap dihubungkan ke Firebase Firestore di masa depan.
              </p>
            </div>
          </div>
        </div>

        {/* Confirmation Modal for Reset */}
        {showConfirmReset && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
            <div className="w-full max-w-xs bg-slate-800 border-2 border-rose-500 rounded-3xl p-5 text-center shadow-2xl">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center mb-3">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black font-game text-white">Yakin Ingin Reset?</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Semua bintang dan level yang telah dibuka akan kembali terkunci seperti baru.
              </p>
              <div className="flex gap-2 mt-5">
                <GameButton
                  variant="neutral"
                  size="sm"
                  fullWidth
                  onClick={() => setShowConfirmReset(false)}
                >
                  Batal
                </GameButton>
                <GameButton
                  variant="rose"
                  size="sm"
                  fullWidth
                  onClick={handleReset}
                >
                  Ya, Reset!
                </GameButton>
              </div>
            </div>
          </div>
        )}

        {/* Reset Success Toast */}
        {resetSuccess && (
          <div className="fixed top-12 left-1/2 -translate-x-1/2 bg-emerald-500 text-white font-game px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-sm z-50 animate-bounce">
            <Check className="w-4 h-4" /> Progress berhasil direset!
          </div>
        )}

        <div className="mb-4">
          <GameButton
            variant="neutral"
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
