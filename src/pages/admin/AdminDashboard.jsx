import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import HeaderBar from '../../components/HeaderBar';
import GameButton from '../../components/GameButton';
import { 
  getEventsByAdmin, 
  createEvent, 
  setEventStatus,
  generate4DigitCode
} from '../../services/eventService';
import { 
  PlusCircle, 
  Trophy, 
  Settings2, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  LogOut, 
  Share2, 
  X,
  FileQuestion,
  Users,
  RefreshCw
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [createError, setCreateError] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    loadEvents();
  }, [currentUser]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await getEventsByAdmin(currentUser.uid);
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setCreateError('');

    if (!title || !code) {
      setCreateError('Judul dan Kode Event wajib diisi.');
      return;
    }

    try {
      sound.playPop();
      const newEvent = await createEvent(currentUser, { title, description, code });
      setShowCreateModal(false);
      setTitle('');
      setDescription('');
      setCode('');
      sound.playCorrect();
      loadEvents();
      // Navigate to event manage to add questions
      navigate(`/admin/event/${newEvent.id}`);
    } catch (err) {
      sound.playWrong();
      setCreateError(err.message || 'Gagal membuat event.');
    }
  };

  const handleTogglePublish = async (event) => {
    sound.playPop();
    const nextStatus = event.status === 'open' ? 'draft' : 'open';
    await setEventStatus(event.id, nextStatus);
    if (nextStatus === 'open') sound.playStar();
    loadEvents();
  };

  const handleCopyCode = (eventCode) => {
    navigator.clipboard?.writeText(eventCode);
    setCopiedCode(eventCode);
    sound.playPop();
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleLogout = async () => {
    sound.playPop();
    await logout();
    navigate('/home');
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between bg-slate-900 text-white select-none overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <HeaderBar
        title="Dashboard Penyelenggara"
        showBack={true}
        backTo="/home"
        showSoundToggle={false}
      />

      <div className="flex-1 p-4 max-w-md w-full mx-auto flex flex-col gap-4">
        {/* Admin Profile Strip */}
        <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/80 shadow-md flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-400 font-game uppercase tracking-wider">
              Penyelenggara Lomba
            </span>
            <h2 className="text-base font-bold font-game text-white truncate">
              {currentUser?.displayName || 'Admin'}
            </h2>
            <span className="text-xs text-slate-400">{currentUser?.email}</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Keluar"
            className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Action: Buat Event Baru */}
        <GameButton
          variant="warning"
          size="md"
          fullWidth
          icon={PlusCircle}
          onClick={() => {
            sound.playPop();
            setCode(generate4DigitCode());
            setShowCreateModal(true);
          }}
          className="text-base py-3"
        >
          Buat Event Lomba Baru
        </GameButton>

        {/* Event List Title */}
        <div className="flex items-center justify-between mt-1">
          <h3 className="font-game font-bold text-slate-200 text-sm flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            Daftar Event Lomba ({events.length})
          </h3>
        </div>

        {/* Events Cards */}
        {loading ? (
          <div className="py-12 text-center font-game text-sm text-slate-400 animate-pulse">
            Memuat event lomba...
          </div>
        ) : events.length === 0 ? (
          <div className="bg-slate-800/40 border-2 border-dashed border-slate-700 rounded-3xl p-8 text-center flex flex-col items-center">
            <FileQuestion className="w-12 h-12 text-slate-500 mb-2" />
            <p className="font-game font-bold text-slate-300 text-sm">Belum Ada Event</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Klik tombol "Buat Event Lomba Baru" untuk memulai menyusun babak dan soal kuis olimpiade.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {events.map((event) => {
              const totalQ = event.levels?.reduce((acc, l) => acc + (l.questions?.length || 0), 0) || 0;
              const isOpen = event.status === 'open';

              return (
                <div
                  key={event.id}
                  className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 shadow-lg flex flex-col gap-3 transition hover:border-slate-600"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-game font-black uppercase ${
                            isOpen
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {isOpen ? '● Event Terbuka (Live)' : '○ Draft'}
                        </span>
                      </div>
                      <h4 className="font-game font-bold text-white text-base leading-snug">
                        {event.title}
                      </h4>
                      {event.description && (
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                          {event.description}
                        </p>
                      )}
                    </div>

                    {/* Event Code PIN */}
                    <button
                      type="button"
                      onClick={() => handleCopyCode(event.code)}
                      className="flex flex-col items-end cursor-pointer group"
                      title="Klik untuk salin kode"
                    >
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Kode Masuk
                      </span>
                      <div className="px-2.5 py-1 bg-amber-400/20 border border-amber-400/40 rounded-xl text-amber-300 font-game font-black text-sm group-hover:bg-amber-400 group-hover:text-amber-950 transition">
                        {copiedCode === event.code ? 'Tersalin! ✓' : event.code}
                      </div>
                    </button>
                  </div>

                  {/* Level & Question Stats */}
                  <div className="flex items-center gap-3 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/50">
                    <span>
                      Babak / Level: <b className="text-amber-300">{event.levels?.length || 0}</b>
                    </span>
                    <span>•</span>
                    <span>
                      Total Soal: <b className="text-emerald-300">{totalQ}</b>
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {/* Kelola Soal */}
                    <button
                      type="button"
                      onClick={() => {
                        sound.playPop();
                        navigate(`/admin/event/${event.id}`);
                      }}
                      className="px-2 py-2 bg-sky-600 hover:bg-sky-500 active:scale-95 rounded-xl text-white font-game text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition cursor-pointer"
                    >
                      <Settings2 className="w-3.5 h-3.5" /> Kelola Soal
                    </button>

                    {/* Buka / Tutup Event */}
                    <button
                      type="button"
                      onClick={() => handleTogglePublish(event)}
                      className={`px-2 py-2 rounded-xl text-white font-game text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition cursor-pointer active:scale-95 ${
                        isOpen
                          ? 'bg-amber-600 hover:bg-amber-500'
                          : 'bg-emerald-600 hover:bg-emerald-500'
                      }`}
                    >
                      {isOpen ? (
                        <>
                          <Lock className="w-3.5 h-3.5" /> Tutup Event
                        </>
                      ) : (
                        <>
                          <Unlock className="w-3.5 h-3.5" /> Buka Event
                        </>
                      )}
                    </button>

                    {/* Leaderboard */}
                    <button
                      type="button"
                      onClick={() => {
                        sound.playPop();
                        navigate(`/leaderboard/${event.id}`);
                      }}
                      className="px-2 py-2 bg-purple-600 hover:bg-purple-500 active:scale-95 rounded-xl text-white font-game text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" /> Juara
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Buat Event Baru */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-slate-800 border-2 border-amber-400 rounded-3xl p-5 shadow-2xl relative text-white">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-black font-game text-yellow-300 mb-1">
              Buat Event Lomba Baru
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Tentukan nama kompetisi dan kode unik untuk dibagikan ke peserta
            </p>

            {createError && (
              <div className="mb-3 p-2.5 rounded-xl bg-rose-500/20 border border-rose-500 text-rose-300 text-xs">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateEvent} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 font-game mb-1">
                  Nama Event Lomba
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Olimpiade Matematika SD 2026"
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-300 font-game">
                    Kode Event (Otomatis 4 Angka Acak)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      sound.playPop();
                      setCode(generate4DigitCode());
                    }}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" /> Acak Ulang
                  </button>
                </div>
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="4 Angka"
                  className="w-full text-center tracking-widest text-xl font-black font-game py-2.5 bg-slate-900 border-2 border-amber-400/80 rounded-xl text-amber-300 focus:border-amber-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Peserta cukup memasukkan 4 angka ini untuk bergabung ke lomba.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 font-game mb-1">
                  Deskripsi / Keterangan (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Petunjuk atau aturan lomba..."
                  className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 mt-2">
                <GameButton
                  variant="neutral"
                  size="sm"
                  fullWidth
                  onClick={() => setShowCreateModal(false)}
                >
                  Batal
                </GameButton>
                <GameButton
                  type="submit"
                  variant="warning"
                  size="sm"
                  fullWidth
                >
                  Simpan & Lanjut
                </GameButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
