import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import HeaderBar from '../../components/HeaderBar';
import GameButton from '../../components/GameButton';
import { ShieldCheck, User, Mail, Lock, LogIn } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export default function AdminRegister() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Harap lengkapi semua kolom.');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    try {
      await register(name, email, password, 'admin');
      sound.playCorrect();
      navigate('/admin/dashboard');
    } catch (err) {
      sound.playWrong();
      setError(err.message || 'Gagal mendaftar sebagai admin.');
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between bg-slate-900 text-white select-none overflow-y-auto no-scrollbar">
      <HeaderBar title="Daftar Penyelenggara" backTo="/admin/login" showSoundToggle={false} />

      <div className="flex-1 p-5 max-w-md w-full mx-auto flex flex-col justify-center">
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-14 h-14 rounded-3xl bg-amber-500/20 border-2 border-amber-400 text-amber-400 flex items-center justify-center mb-2 shadow-lg">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black font-game text-yellow-300">
            Daftar Penyelenggara Lomba
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftarkan diri Anda atau instansi untuk mulai membuat event
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/20 border border-rose-500 text-rose-300 text-xs text-center font-medium animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 font-game mb-1">
              Nama Penyelenggara / Sekolah / Organisasi
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Tim Olimpiade Matematika SD 1"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border-2 border-slate-700 rounded-2xl text-white text-sm focus:border-amber-400 focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 font-game mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="penyelenggara@sekolah.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border-2 border-slate-700 rounded-2xl text-white text-sm focus:border-amber-400 focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 font-game mb-1">
              Password (min. 6 karakter)
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border-2 border-slate-700 rounded-2xl text-white text-sm focus:border-amber-400 focus:outline-none transition"
              />
            </div>
          </div>

          <GameButton
            type="submit"
            variant="warning"
            size="lg"
            fullWidth
            disabled={loading}
            className="mt-2 text-base"
          >
            {loading ? 'Mendaftarkan...' : 'Buat Akun Penyelenggara'}
          </GameButton>
        </form>

        <div className="mt-5 text-center text-xs text-slate-400">
          Sudah punya akun?{' '}
          <Link
            to="/admin/login"
            className="text-amber-400 font-bold hover:underline inline-flex items-center gap-1"
          >
            <LogIn className="w-3.5 h-3.5" /> Masuk di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
