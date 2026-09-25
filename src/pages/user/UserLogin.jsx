import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import HeaderBar from '../../components/HeaderBar';
import GameButton from '../../components/GameButton';
import { User, LogIn, UserPlus, Compass } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export default function UserLogin() {
  const navigate = useNavigate();
  const { loginWithUsername, loading } = useAuth();

  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Harap masukkan username kamu.');
      return;
    }

    try {
      await loginWithUsername(username);
      sound.playCorrect();
      navigate('/join');
    } catch (err) {
      sound.playWrong();
      setError(err.message || 'Gagal masuk sebagai peserta.');
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between bg-slate-900 text-white select-none overflow-y-auto no-scrollbar">
      <HeaderBar title="Masuk Peserta" backTo="/home" showSoundToggle={false} />

      <div className="flex-1 p-5 max-w-md w-full mx-auto flex flex-col justify-center">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-3xl bg-sky-500/20 border-2 border-sky-400 text-sky-400 flex items-center justify-center mb-3 shadow-lg">
            <Compass className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-black font-game text-sky-300">
            Masuk Peserta Lomba
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Cukup masukkan username kamu untuk lanjut bermain dan bersaing di papan peringkat
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/20 border border-rose-500 text-rose-300 text-xs text-center font-medium animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 font-game mb-1.5">
              Username Peserta
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Contoh: farsya / budi123"
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border-2 border-slate-700 rounded-2xl text-white text-base focus:border-sky-400 focus:outline-none transition font-game"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1 pl-1">
              Gunakan huruf dan angka tanpa spasi
            </p>
          </div>

          <GameButton
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            icon={LogIn}
            disabled={loading}
            className="mt-2 text-base py-3"
          >
            {loading ? 'Memeriksa...' : 'Mulai Petualangan 🚀'}
          </GameButton>
        </form>

        <div className="mt-8 text-center text-xs text-slate-400">
          Belum punya username peserta?{' '}
          <Link
            to="/user/register"
            className="text-sky-400 font-bold hover:underline inline-flex items-center gap-1 font-game ml-1"
          >
            <UserPlus className="w-3.5 h-3.5" /> Daftar di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
