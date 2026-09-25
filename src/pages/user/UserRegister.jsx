import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import HeaderBar from '../../components/HeaderBar';
import GameButton from '../../components/GameButton';
import { User, Sparkles, LogIn } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export default function UserRegister() {
  const navigate = useNavigate();
  const { registerWithUsername, loading } = useAuth();

  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Harap isi username.');
      return;
    }

    try {
      await registerWithUsername(username, displayName);
      sound.playCorrect();
      navigate('/join');
    } catch (err) {
      sound.playWrong();
      setError(err.message || 'Gagal mendaftar akun.');
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between bg-slate-900 text-white select-none overflow-y-auto no-scrollbar">
      <HeaderBar title="Daftar Peserta" backTo="/user/login" showSoundToggle={false} />

      <div className="flex-1 p-5 max-w-md w-full mx-auto flex flex-col justify-center">
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mb-2 shadow-lg">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black font-game text-emerald-300">
            Daftar Peserta Baru
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Buat username kamu untuk mengikuti olimpiade dan kuis
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/20 border border-rose-500 text-rose-300 text-xs text-center font-medium animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-300 font-game mb-1.5">
              Username Peserta <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: farsya123 / bintang_juara"
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-2xl text-white text-base focus:border-emerald-400 focus:outline-none transition font-game"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1 pl-1">
              Gunakan huruf dan angka tanpa spasi (min. 3 karakter)
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 font-game mb-1.5">
              Nama Lengkap / Nama Panggilan <span className="text-slate-500 text-[10px]">(Opsional)</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Contoh: Farsya Surya"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border-2 border-slate-700 rounded-2xl text-white text-sm focus:border-emerald-400 focus:outline-none transition"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1 pl-1">
              Nama ini akan muncul di papan peringkat
            </p>
          </div>

          <GameButton
            type="submit"
            variant="success"
            size="lg"
            fullWidth
            disabled={loading}
            className="mt-3 text-base py-3"
          >
            {loading ? 'Mendaftarkan...' : 'Daftar & Mulai 🚀'}
          </GameButton>
        </form>

        <div className="mt-8 text-center text-xs text-slate-400">
          Sudah punya username?{' '}
          <Link
            to="/user/login"
            className="text-emerald-400 font-bold hover:underline inline-flex items-center gap-1 font-game ml-1"
          >
            <LogIn className="w-3.5 h-3.5" /> Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
