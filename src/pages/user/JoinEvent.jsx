import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import HeaderBar from '../../components/HeaderBar';
import GameButton from '../../components/GameButton';
import { getEventByCode, getOpenEvents } from '../../services/eventService';
import { Trophy, ArrowRight, Play, Sparkles, Key, Hash, LogOut } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export default function JoinEvent() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const [eventCode, setEventCode] = useState('');
  const [openEvents, setOpenEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Auth Check: jika belum login, kembalikan ke /user/login
    if (!currentUser) {
      navigate('/user/login');
      return;
    }

    // Jika admin login ke sini, arahkan ke dashboard admin
    if (currentUser.role === 'admin') {
      navigate('/admin/dashboard');
      return;
    }

    loadOpenEvents();
  }, [currentUser]);

  const loadOpenEvents = async () => {
    try {
      const list = await getOpenEvents();
      setOpenEvents(list);
    } catch (e) {
      console.error(e);
    }
  };

  const handleJoinByCode = async (e) => {
    e.preventDefault();
    setError('');

    const cleanCode = eventCode.trim();
    if (!cleanCode || cleanCode.length !== 4) {
      setError('Masukkan 4 angka kode event lomba.');
      return;
    }

    setLoading(true);
    try {
      sound.playPop();
      const event = await getEventByCode(cleanCode);
      if (!event) {
        sound.playWrong();
        setError(`Event dengan kode "${cleanCode}" tidak ditemukan.`);
        setLoading(false);
        return;
      }

      if (event.status !== 'open') {
        sound.playWrong();
        setError(`Event "${event.title}" masih berstatus Draft / belum dibuka oleh penyelenggara.`);
        setLoading(false);
        return;
      }

      sound.playCorrect();
      sessionStorage.setItem('activeCompetitionEvent', JSON.stringify(event));
      navigate(`/map?eventId=${event.id}`);
    } catch (err) {
      sound.playWrong();
      setError(err.message || 'Gagal bergabung ke event.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEvent = (event) => {
    sound.playPop();
    sessionStorage.setItem('activeCompetitionEvent', JSON.stringify(event));
    navigate(`/map?eventId=${event.id}`);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between bg-slate-900 text-white select-none overflow-y-auto no-scrollbar">
      <HeaderBar
        title="Masuk Arena Lomba"
        backTo="/home"
        showSoundToggle={false}
      />

      <div className="flex-1 p-4 max-w-md w-full mx-auto flex flex-col gap-4">
        {/* User Greeting Strip */}
        <div className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700/80 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-emerald-400 font-game uppercase tracking-wider">
              Akun Peserta Aktif
            </span>
            <h2 className="text-sm font-bold font-game text-white truncate max-w-[170px]">
              {currentUser?.displayName || 'Sahabat Petualang'}
            </h2>
            <span className="text-[10px] text-slate-400">{currentUser?.email}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                navigate('/leaderboard');
              }}
              className="p-2 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 font-game font-bold text-xs flex items-center gap-1 hover:bg-purple-500 hover:text-white transition cursor-pointer"
              title="Papan Peringkat"
            >
              <Trophy className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={async () => {
                sound.playPop();
                await logout();
                navigate('/home');
              }}
              className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition cursor-pointer"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form: Masukkan 4 Angka Acak Kode Event */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-850 rounded-3xl p-5 border-2 border-amber-400 shadow-xl">
          <div className="flex items-center gap-2 mb-1.5">
            <Hash className="w-5 h-5 text-amber-400" />
            <h3 className="font-game font-black text-white text-base">
              Masukkan 4 Angka Kode Lomba
            </h3>
          </div>
          <p className="text-xs text-slate-300 mb-3 leading-relaxed">
            Mintalah 4 angka kode event lomba dari guru / penyelenggara:
          </p>

          {error && (
            <div className="mb-3 p-2.5 rounded-xl bg-rose-500/20 border border-rose-500 text-rose-300 text-xs text-center font-medium animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleJoinByCode} className="flex flex-col gap-3">
            <div className="flex justify-center">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                required
                value={eventCode}
                onChange={(e) => setEventCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="0 0 0 0"
                className="w-44 text-center tracking-[0.5em] text-3xl font-black font-game py-2.5 bg-slate-950 border-2 border-amber-400 rounded-2xl text-amber-300 placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-amber-400/30"
              />
            </div>

            <GameButton
              type="submit"
              variant="warning"
              size="md"
              fullWidth
              icon={ArrowRight}
              disabled={loading || eventCode.length !== 4}
              className="text-base py-3 mt-1"
            >
              {loading ? 'Mengecek Kode...' : 'Masuk Arena Lomba'}
            </GameButton>
          </form>
        </div>

        {/* Daftar Event yang Sedang Dibuka / Live */}
        <div>
          <h3 className="font-game font-bold text-slate-300 text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Event Lomba Tersedia ({openEvents.length})
          </h3>

          {openEvents.length === 0 ? (
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 text-center text-xs text-slate-400">
              Belum ada event terbuka saat ini. Masukkan 4 angka kode lomba di atas jika Anda memilikinya.
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {openEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => handleSelectEvent(evt)}
                  className="bg-slate-800 hover:bg-slate-750 p-3.5 rounded-2xl border border-slate-700/80 shadow-md flex items-center justify-between cursor-pointer transition active:scale-98"
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[11px] font-game font-black tracking-wider">
                        Kode: {evt.code}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate">
                        {evt.adminName}
                      </span>
                    </div>
                    <h4 className="font-game font-bold text-white text-sm mt-1 truncate">
                      {evt.title}
                    </h4>
                  </div>

                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-game text-xs font-bold flex items-center gap-1 flex-shrink-0 shadow-sm">
                    <Play className="w-3 h-3 fill-white" /> Ikuti
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick link: Latihan Bebas 10 Level */}
        <div className="mt-1 mb-4 pt-2 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              sessionStorage.removeItem('activeCompetitionEvent');
              navigate('/map');
            }}
            className="text-xs font-game text-slate-400 hover:text-amber-300 underline cursor-pointer"
          >
            Atau mainkan Mode Latihan 10 Level Standar
          </button>
        </div>
      </div>
    </div>
  );
}
