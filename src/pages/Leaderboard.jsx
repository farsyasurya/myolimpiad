import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderBar from '../components/HeaderBar';
import GameButton from '../components/GameButton';
import { getEventLeaderboard, getOpenEvents, getEventById } from '../services/eventService';
import { Trophy, Star, Crown, CheckCircle2, Clock, Zap } from 'lucide-react';
import { sound } from '../utils/soundEffects';

export default function Leaderboard() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [selectedEventId, setSelectedEventId] = useState(eventId || '');
  const [openEvents, setOpenEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      loadBoard(selectedEventId);
    } else {
      if (openEvents.length > 0) {
        setSelectedEventId(openEvents[0].id);
      } else {
        setLoading(false);
      }
    }
  }, [selectedEventId, openEvents]);

  const loadEvents = async () => {
    try {
      const events = await getOpenEvents();
      setOpenEvents(events);
      if (!selectedEventId && events.length > 0) {
        setSelectedEventId(events[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadBoard = async (id) => {
    setLoading(true);
    try {
      const [boardData, eventData] = await Promise.all([
        getEventLeaderboard(id),
        getEventById(id)
      ]);
      setLeaderboard(boardData);
      setCurrentEvent(eventData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds = 0) => {
    if (!seconds || seconds <= 0) return '-';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between bg-slate-900 text-white select-none overflow-y-auto no-scrollbar">
      <HeaderBar
        title="Papan Peringkat Juara"
        backTo="/home"
        showSoundToggle={false}
      />

      <div className="flex-1 p-4 max-w-md w-full mx-auto flex flex-col gap-3.5">
        {/* Leaderboard Header Banner */}
        <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/30 to-amber-500/20 border-2 border-amber-400 rounded-3xl p-4 text-center shadow-lg">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 mx-auto flex items-center justify-center shadow-md mb-2">
            <Trophy className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black font-game text-yellow-300">
            Papan Peringkat Juara
          </h2>

          {/* Aturan / Kriteria Ranking */}
          <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900/80 border border-amber-400/40 rounded-full text-[10px] font-game text-amber-200">
            <Zap className="w-3 h-3 text-amber-400" />
            Level Tertinggi → Bintang Terbanyak → Waktu Tercepat
          </div>

          {/* Event Selector Dropdown */}
          {openEvents.length > 0 && (
            <div className="mt-3">
              <select
                value={selectedEventId}
                onChange={(e) => {
                  sound.playPop();
                  setSelectedEventId(e.target.value);
                }}
                className="w-full px-3 py-2 bg-slate-900 border border-amber-400/60 rounded-xl text-amber-200 font-game font-bold text-xs focus:outline-none cursor-pointer"
              >
                {openEvents.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    Event: {evt.title} (Kode: {evt.code})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Podium for Top 3 */}
        {leaderboard.length >= 3 && (
          <div className="grid grid-cols-3 gap-2 items-end pt-3 pb-1 px-1">
            {/* Rank 2 (Silver) */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-900 flex items-center justify-center font-black font-game text-xs mb-1 shadow-md">
                2
              </div>
              <span className="text-xs font-bold font-game text-white truncate max-w-[80px]">
                {leaderboard[1].userName}
              </span>
              <div className="w-full h-20 bg-slate-400/30 border-t-2 border-slate-300 rounded-t-xl flex flex-col items-center justify-center mt-1 p-1">
                <span className="text-xs font-black font-game text-slate-200">
                  {leaderboard[1].totalScore} Poin
                </span>
                <span className="text-[10px] text-amber-300 font-bold">
                  ⭐ {leaderboard[1].totalStars}
                </span>
                <span className="text-[10px] text-sky-300 flex items-center gap-0.5 mt-0.5">
                  <Clock className="w-2.5 h-2.5" /> {formatDuration(leaderboard[1].totalDurationSeconds)}
                </span>
              </div>
            </div>

            {/* Rank 1 (Gold Crown) */}
            <div className="flex flex-col items-center">
              <Crown className="w-6 h-6 text-yellow-300 mb-1 animate-bounce" />
              <div className="w-10 h-10 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center font-black font-game text-sm mb-1 shadow-lg ring-2 ring-yellow-200">
                1
              </div>
              <span className="text-xs font-black font-game text-yellow-300 truncate max-w-[90px]">
                {leaderboard[0].userName}
              </span>
              <div className="w-full h-28 bg-amber-500/30 border-t-2 border-yellow-300 rounded-t-xl flex flex-col items-center justify-center mt-1 p-1">
                <span className="text-sm font-black font-game text-yellow-300">
                  {leaderboard[0].totalScore} Poin
                </span>
                <span className="text-xs text-amber-300 font-bold">
                  ⭐ {leaderboard[0].totalStars}
                </span>
                <span className="text-[10px] text-emerald-300 font-bold flex items-center gap-0.5 mt-0.5">
                  <Clock className="w-2.5 h-2.5" /> {formatDuration(leaderboard[0].totalDurationSeconds)}
                </span>
              </div>
            </div>

            {/* Rank 3 (Bronze) */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-amber-700 text-amber-100 flex items-center justify-center font-black font-game text-xs mb-1 shadow-md">
                3
              </div>
              <span className="text-xs font-bold font-game text-white truncate max-w-[80px]">
                {leaderboard[2].userName}
              </span>
              <div className="w-full h-16 bg-amber-800/30 border-t-2 border-amber-600 rounded-t-xl flex flex-col items-center justify-center mt-1 p-1">
                <span className="text-xs font-black font-game text-amber-200">
                  {leaderboard[2].totalScore} Poin
                </span>
                <span className="text-[10px] text-amber-300 font-bold">
                  ⭐ {leaderboard[2].totalStars}
                </span>
                <span className="text-[10px] text-sky-300 flex items-center gap-0.5 mt-0.5">
                  <Clock className="w-2.5 h-2.5" /> {formatDuration(leaderboard[2].totalDurationSeconds)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Full Ranking List */}
        <div className="flex flex-col gap-2">
          {loading ? (
            <div className="py-8 text-center text-xs font-game text-slate-400 animate-pulse">
              Memuat data peringkat...
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 text-center text-xs text-slate-400">
              Belum ada peserta yang menyelesaikan kuis pada event ini.
              Jadilah yang pertama bermain dan raih juara 1!
            </div>
          ) : (
            leaderboard.map((item, idx) => {
              const rank = idx + 1;

              return (
                <div
                  key={item.id || idx}
                  className={`p-3 rounded-2xl border flex items-center justify-between shadow-md transition ${
                    rank === 1
                      ? 'bg-amber-500/15 border-amber-400/60'
                      : rank === 2
                      ? 'bg-slate-400/15 border-slate-300/40'
                      : rank === 3
                      ? 'bg-amber-700/15 border-amber-600/40'
                      : 'bg-slate-800/80 border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center font-black font-game text-xs flex-shrink-0 ${
                        rank === 1
                          ? 'bg-amber-400 text-amber-950 shadow-sm'
                          : rank === 2
                          ? 'bg-slate-300 text-slate-900'
                          : rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {rank}
                    </span>

                    <div>
                      <h4 className="font-game font-bold text-white text-sm leading-tight">
                        {item.userName}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1 text-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Babak {item.highestLevel || item.levelsCompleted || 1}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-amber-300">
                          <Clock className="w-3 h-3" />
                          {formatDuration(item.totalDurationSeconds)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 text-right">
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span className="text-xs font-black font-game">{item.totalStars}</span>
                    </div>

                    <div className="min-w-[48px]">
                      <span className="text-sm font-black font-game text-yellow-300">
                        {item.totalScore}
                      </span>
                      <span className="block text-[8px] text-slate-400 uppercase font-bold">
                        Poin
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Back Button */}
        <div className="mt-2 mb-4">
          <GameButton
            variant="neutral"
            size="md"
            fullWidth
            onClick={() => navigate('/home')}
          >
            Kembali ke Menu Utama
          </GameButton>
        </div>
      </div>
    </div>
  );
}
