import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import HeaderBar from '../components/HeaderBar';
import GameButton from '../components/GameButton';
import StarRating from '../components/StarRating';
import CharacterAvatar from '../components/CharacterAvatar';
import { getEventById } from '../services/eventService';
import { sound } from '../utils/soundEffects';
import { RotateCcw, Map, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

export default function Result() {
  const { levelId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const id = Number(levelId);
  const state = location.state || {};
  const [levelName, setLevelName] = useState(`Babak ${id}`);

  const searchParams = new URLSearchParams(location.search);
  const eventId = searchParams.get('eventId') || state.eventId;

  const score = state.score !== undefined ? state.score : 0;
  const stars = state.stars !== undefined ? state.stars : 0;
  const correctAnswers = state.correctAnswers !== undefined ? state.correctAnswers : Math.round((score / 100) * 5);
  const wrongAnswers = state.wrongAnswers !== undefined ? state.wrongAnswers : 5 - correctAnswers;

  const isPassed = stars >= 1 || score >= 50;
  const nextLevelId = id + 1;
  const [hasNextLevel, setHasNextLevel] = useState(true);

  useEffect(() => {
    // Sound & Confetti effects
    if (stars === 3) {
      sound.playVictory();
      // Burst celebratory colorful confetti!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
          });
        }, 300);
      } catch (e) {
        console.error(e);
      }
    } else if (isPassed) {
      sound.playStar();
    } else {
      sound.playWrong();
    }
  }, [stars, isPassed]);

  useEffect(() => {
    if (eventId) {
      getEventById(eventId).then((evt) => {
        if (evt && evt.levels) {
          const l = evt.levels.find((lvl) => lvl.id === id);
          if (l) setLevelName(l.name);
          const hasNext = evt.levels.some((lvl) => lvl.id === nextLevelId);
          setHasNextLevel(hasNext);
        }
      }).catch(console.error);
    }
  }, [eventId, id, nextLevelId]);

  const handlePlayAgain = () => {
    sound.playPop();
    navigate(`/level/${id}${eventId ? `?eventId=${eventId}` : ''}`);
  };

  const handleNextLevel = () => {
    sound.playPop();
    if (hasNextLevel) {
      navigate(`/level/${nextLevelId}${eventId ? `?eventId=${eventId}` : ''}`);
    } else {
      navigate(eventId ? `/map?eventId=${eventId}` : '/map');
    }
  };

  const handleBackToMap = () => {
    sound.playPop();
    navigate(eventId ? `/map?eventId=${eventId}` : '/map');
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between bg-gradient-to-b from-indigo-900 via-purple-900 to-slate-950 text-white select-none overflow-y-auto no-scrollbar">
      <HeaderBar
        title="Hasil Petualangan"
        showBack={false}
        showSoundToggle={true}
        className="py-2.5"
      />

      <div className="flex-1 flex flex-col items-center justify-between p-4 max-w-md w-full mx-auto z-10">
        {/* Result Header Badge */}
        <div className="flex flex-col items-center text-center mt-2">
          <span className="text-4xl animate-bounce">
            {stars === 3 ? '🏆' : isPassed ? '🎉' : '💪'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-game mt-2 text-yellow-300 drop-shadow-md">
            {stars === 3
              ? 'Luar Biasa Sempurna!'
              : isPassed
                ? 'Level Selesai!'
                : 'Ayo Coba Lagi!'}
          </h1>
          <p className="text-xs sm:text-sm font-game text-slate-300 mt-1">
            {levelName}
          </p>
        </div>

        {/* Animated Stars Display */}
        <div className="my-3 py-3 px-6 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-lg flex flex-col items-center gap-1.5">
          <StarRating stars={stars} maxStars={3} size="xl" animated={true} />
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider font-game mt-1">
            {stars === 3 ? '⭐⭐⭐ 3 Bintang Penuh!' : stars === 2 ? '⭐⭐ 2 Bintang Bagus!' : stars === 1 ? '⭐ 1 Bintang Lolos!' : 'Belum Ada Bintang'}
          </span>
        </div>

        {/* Mascot Feedback */}
        <div className="my-1">
          <CharacterAvatar
            speech={
              stars === 3
                ? 'Hebat sekali! Kamu jenius!'
                : isPassed
                  ? 'Kerja bagus petualang cilik!'
                  : 'Jangan menyerah, kamu pasti bisa!'
            }
            size="md"
          />
        </div>

        {/* Score & Answers Summary Card */}
        <div className="w-full bg-white/10 backdrop-blur-md rounded-3xl p-4 border border-white/20 shadow-xl grid grid-cols-3 gap-2 text-center my-2">
          {/* Total Score */}
          <div className="flex flex-col items-center p-2 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wide">
              Skor Akhir
            </span>
            <span className="text-xl sm:text-2xl font-black font-game text-yellow-400 mt-0.5">
              {score}
              <span className="text-xs text-slate-300 font-bold">/100</span>
            </span>
          </div>

          {/* Correct Answers */}
          <div className="flex flex-col items-center p-2 rounded-2xl bg-emerald-500/20 border border-emerald-400/30">
            <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wide flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Benar
            </span>
            <span className="text-xl sm:text-2xl font-black font-game text-emerald-300 mt-0.5">
              {correctAnswers}
            </span>
          </div>

          {/* Wrong Answers */}
          <div className="flex flex-col items-center p-2 rounded-2xl bg-rose-500/20 border border-rose-400/30">
            <span className="text-[11px] font-bold text-rose-200 uppercase tracking-wide flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5 text-rose-400" /> Salah
            </span>
            <span className="text-xl sm:text-2xl font-black font-game text-rose-300 mt-0.5">
              {wrongAnswers}
            </span>
          </div>
        </div>

        {/* Completion Duration */}
        {state.durationSeconds !== undefined && state.durationSeconds > 0 && (
          <div className="w-full text-center py-1 px-3 bg-amber-400/20 border border-amber-400/40 rounded-xl text-xs font-game text-amber-300 mb-1.5 flex items-center justify-center gap-1.5">
            <span>⏱️ Waktu Pengerjaan:</span>
            <span className="font-black text-amber-200">
              {state.durationSeconds >= 60
                ? `${Math.floor(state.durationSeconds / 60)}m ${state.durationSeconds % 60}s`
                : `${state.durationSeconds} Detik`}
            </span>
          </div>
        )}

        {/* Unlock Notice if next level is unlocked */}
        {isPassed && hasNextLevel && (
          <div className="w-full text-center py-1.5 px-3 bg-emerald-400/20 border border-emerald-400/40 rounded-xl text-xs font-game text-emerald-300 mb-2 animate-pulse">
            🔓 Selamat! Level {nextLevelId} telah terbuka!
          </div>
        )}

        {/* Action Buttons */}
        <div className="w-full flex flex-col gap-2.5 mt-2">
          {/* Level Berikutnya (if passed and has next level) */}
          {isPassed && hasNextLevel && (
            <GameButton
              variant="success"
              size="lg"
              fullWidth
              icon={ArrowRight}
              onClick={handleNextLevel}
              className="text-lg py-3.5"
            >
              Level Berikutnya
            </GameButton>
          )}

          {/* Main Lagi */}
          <GameButton
            variant="warning"
            size="md"
            fullWidth
            icon={RotateCcw}
            onClick={handlePlayAgain}
          >
            Main Lagi
          </GameButton>

          {/* Papan Peringkat (if in event) */}
          {eventId && (
            <GameButton
              variant="purple"
              size="md"
              fullWidth
              onClick={() => navigate(`/leaderboard/${eventId}`)}
            >
              Lihat Papan Peringkat Lomba
            </GameButton>
          )}

          {/* Kembali ke Map */}
          <GameButton
            variant="primary"
            size="md"
            fullWidth
            icon={Map}
            onClick={handleBackToMap}
          >
            Kembali ke Peta
          </GameButton>
        </div>
      </div>
    </div>
  );
}
