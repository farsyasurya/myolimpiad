import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import HeaderBar from '../../components/HeaderBar';
import GameButton from '../../components/GameButton';
import { Shield, Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Harap isi email dan password.');
      return;
    }

    try {
      await login(email, password, 'admin');
      sound.playCorrect();
      navigate('/admin/dashboard');
    } catch (err) {
      sound.playWrong();
      setError(err.message || 'Gagal login sebagai admin.');
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between bg-slate-900 text-white select-none overflow-y-auto no-scrollbar">
      <HeaderBar title="Login Penyelenggara" backTo="/home" showSoundToggle={false} />

      <div className="flex-1 p-5 max-w-md w-full mx-auto flex flex-col justify-center">
        {/* Admin Badge Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border-2 border-amber-400 text-amber-400 flex items-center justify-center mb-3 shadow-lg">
            <Shield className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-black font-game text-yellow-300">
            Portal Penyelenggara
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Masuk untuk membuat event lomba, kelola level, dan buat soal
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/20 border border-rose-500 text-rose-300 text-xs text-center font-medium animate-shake">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-300 font-game mb-1">
              Email Penyelenggara
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sekolah.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border-2 border-slate-700 rounded-2xl text-white text-sm focus:border-amber-400 focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 font-game mb-1">
              Password
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
            icon={LogIn}
            disabled={loading}
            className="mt-2 text-base"
          >
            {loading ? 'Memproses...' : 'Masuk Dashboard Admin'}
          </GameButton>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center text-xs text-slate-400">
          Belum punya akun penyelenggara?{' '}
          <Link
            to="/admin/register"
            className="text-amber-400 font-bold hover:underline inline-flex items-center gap-1"
          >
            <UserPlus className="w-3.5 h-3.5" /> Daftar di sini
          </Link>
        </div>
      </div>
    </div>
  );
}
