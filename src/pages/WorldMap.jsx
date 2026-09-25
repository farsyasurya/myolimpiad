import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import HeaderBar from '../components/HeaderBar';
import LevelNode from '../components/LevelNode';
import GameButton from '../components/GameButton';
import StarRating from '../components/StarRating';
import TreeDecoration from '../components/decorations/TreeDecoration';
import MountainDecoration from '../components/decorations/MountainDecoration';
import CloudDecoration from '../components/decorations/CloudDecoration';
import RiverDecoration from '../components/decorations/RiverDecoration';
import { getEventById } from '../services/eventService';
import { sound } from '../utils/soundEffects';
import { Play, Trophy, Sparkles, X, Compass, CheckCircle, Award } from 'lucide-react';

export default function WorldMap() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const eventIdParam = searchParams.get('eventId');

  const [activeEvent, setActiveEvent] = useState(null);
  const [levels, setLevels] = useState([]);
  const [stats, setStats] = useState({ totalStars: 0, completedCount: 0 });
  const [selectedLevel, setSelectedLevel] = useState(null);
  const containerRef = useRef(null);
  const activeNodeRef = useRef(null);

  useEffect(() => {
    loadMapData();
  }, [eventIdParam]);

  const loadMapData = async () => {
    // Check if an event was passed via URL or sessionStorage
    const storedEvent = sessionStorage.getItem('activeCompetitionEvent');
    const targetEventId = eventIdParam || (storedEvent ? JSON.parse(storedEvent).id : null);

    if (targetEventId) {
      try {
        const evt = await getEventById(targetEventId);
        if (evt) {
          setActiveEvent(evt);
          // Load progress for this event
          const eventProgressKey = `progress_${evt.id}`;
          const rawProgress = localStorage.getItem(eventProgressKey);
          const progress = rawProgress ? JSON.parse(rawProgress) : {};

          const mappedLevels = (evt.levels || []).map((l, idx) => {
            const userProgress = progress[l.id] || {
              unlocked: idx === 0, // First level always unlocked
              completed: false,
              stars: 0,
              bestScore: 0
            };
            return {
              id: l.id,
              name: l.name,
              theme: l.theme || 'Matematika',
              description: `Soal babak ${l.id} event ${evt.title}`,
              unlocked: userProgress.unlocked,
              completed: userProgress.completed,
              stars: userProgress.stars,
              bestScore: userProgress.bestScore,
              questionCount: l.questions?.length || 0
            };
          });

          setLevels(mappedLevels);

          const totalStars = mappedLevels.reduce((acc, l) => acc + (l.stars || 0), 0);
          const completedCount = mappedLevels.filter((l) => l.completed).length;
          setStats({ totalStars, completedCount });
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }

    // Jika belum ada event yang dipilih, arahkan ke halaman pilih / join event
    navigate('/join');
  };

  const currentActiveLevel =
    levels.find((l) => l.unlocked && !l.completed) ||
    [...levels].reverse().find((l) => l.unlocked) ||
    levels[0];

  useEffect(() => {
    if (activeNodeRef.current) {
      setTimeout(() => {
        activeNodeRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 300);
    }
  }, [levels]);

  const handleSelectLevel = (level) => {
    sound.playPop();
    setSelectedLevel(level);
  };

  const handleStartQuiz = (levelId) => {
    sound.playPop();
    if (activeEvent) {
      navigate(`/level/${levelId}?eventId=${activeEvent.id}`);
    } else {
      navigate(`/level/${levelId}`);
    }
  };

  const horizontalPositions = [
    'justify-center',       // L1
    'justify-end pr-10',    // L2
    'justify-end pr-6',     // L3
    'justify-center pl-16', // L4
    'justify-start pl-10',  // L5
    'justify-start pl-6',   // L6
    'justify-center pr-12', // L7
    'justify-end pr-8',     // L8
    'justify-end pr-14',    // L9
    'justify-center'        // L10 (Summit)
  ];

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-900 overflow-hidden">
      {/* Top Fixed Header */}
      <HeaderBar
        title={activeEvent ? activeEvent.title : "Peta Petualangan"}
        backTo="/home"
        starsCount={stats.totalStars}
        maxStars={levels.length * 3}
      />

      {/* Competition Event Banner if participating in an event */}
      {activeEvent && (
        <div className="w-full bg-slate-950/90 border-b border-amber-400/40 px-4 py-2 flex items-center justify-between text-xs z-30">
          <div className="flex items-center gap-1.5 truncate">
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-game font-bold text-[10px]">
              LOMBA: {activeEvent.code}
            </span>
            <span className="text-slate-300 font-bold font-game truncate">
              {activeEvent.title}
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/leaderboard/${activeEvent.id}`)}
            className="flex-shrink-0 ml-2 px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-game font-bold text-[11px] flex items-center gap-1 shadow-sm cursor-pointer"
          >
            <Trophy className="w-3 h-3 text-yellow-300" /> Peringkat
          </button>
        </div>
      )}

      {/* Scrollable Map Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto no-scrollbar relative w-full pb-28 pt-4"
        style={{
          background: 'linear-gradient(180deg, #0ea5e9 0%, #38bdf8 15%, #4ade80 40%, #16a34a 65%, #ca8a04 85%, #78350f 100%)'
        }}
      >
        {/* Scenery */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <CloudDecoration className="w-24 opacity-80" />
        </div>
        <div className="absolute top-20 right-4 pointer-events-none">
          <CloudDecoration className="w-20 opacity-75" />
        </div>
        <div className="absolute top-72 -left-8 pointer-events-none">
          <MountainDecoration className="w-32 opacity-70" />
        </div>
        <div className="absolute top-[480px] right-2 pointer-events-none">
          <TreeDecoration type="oak" className="w-16 h-20" />
        </div>
        <div className="absolute top-[750px] -left-2 pointer-events-none">
          <RiverDecoration className="w-72" />
        </div>
        <div className="absolute top-[960px] left-3 pointer-events-none">
          <TreeDecoration type="pine" className="w-16 h-20" />
        </div>
        <div className="absolute top-[1200px] right-4 pointer-events-none">
          <TreeDecoration type="pine" className="w-14 h-18" />
        </div>

        {/* Summit Marker */}
        <div className="w-full flex flex-col items-center justify-center my-6 z-10">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400 text-amber-950 font-game font-bold text-xs shadow-lg border-2 border-yellow-200 animate-bounce">
            <Trophy className="w-4 h-4 fill-amber-950" />
            {activeEvent ? "Puncak Menara Juara MTK" : "Puncak Menara Juara MTK"}
          </div>
        </div>

        {/* Level Nodes */}
        <div className="relative flex flex-col gap-14 px-4 max-w-md mx-auto z-10">
          {levels.map((level, index) => {
            const isCurrent = currentActiveLevel && currentActiveLevel.id === level.id;
            const posClass = horizontalPositions[index % horizontalPositions.length] || 'justify-center';

            return (
              <div
                key={level.id}
                ref={isCurrent ? activeNodeRef : null}
                className={`w-full flex ${posClass} transition-all`}
              >
                <LevelNode
                  level={level}
                  isCurrent={isCurrent}
                  onSelectLevel={handleSelectLevel}
                />
              </div>
            );
          })}
        </div>

        {/* Start Marker */}
        <div className="w-full flex flex-col items-center justify-center mt-12 mb-4 z-10">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/90 text-slate-800 font-game font-bold text-xs shadow-md border-2 border-emerald-400">
            <Compass className="w-4 h-4 text-emerald-600 animate-spin" style={{ animationDuration: '6s' }} />
            Titik Awal Babak 1
          </div>
        </div>
      </div>

      {/* Level Preview Modal */}
      {selectedLevel && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in"
          onClick={() => setSelectedLevel(null)}
        >
          <div
            className="w-full max-w-sm bg-gradient-to-b from-white to-amber-50 rounded-3xl p-5 shadow-2xl border-4 border-amber-300 relative text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setSelectedLevel(null);
              }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-600 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center mt-1">
              <span className="px-3 py-1 bg-amber-400 text-amber-950 font-game font-black text-xs rounded-full uppercase tracking-wider mb-2">
                Babak / Level {selectedLevel.id}
              </span>
              <h2 className="text-2xl font-black font-game text-slate-800">
                {selectedLevel.name}
              </h2>
              <span className="text-xs font-bold text-amber-700/80 mt-0.5">
                Materi: {selectedLevel.theme}
              </span>
            </div>

            <p className="mt-3 text-sm text-center text-slate-600 bg-white/80 p-3 rounded-2xl border border-amber-200/60">
              {selectedLevel.description}
            </p>

            <div className="my-4 flex flex-col items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Bintang Diperoleh
              </span>
              <StarRating stars={selectedLevel.stars} maxStars={3} size="lg" />
              {selectedLevel.completed && (
                <span className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Skor Terbaik: {selectedLevel.bestScore}/100
                </span>
              )}
            </div>

            <GameButton
              variant="success"
              size="lg"
              fullWidth
              icon={Play}
              onClick={() => handleStartQuiz(selectedLevel.id)}
              className="mt-2 text-lg shadow-emerald-900/40"
            >
              {selectedLevel.completed ? 'Main Lagi' : 'Mulai Kuis!'}
            </GameButton>
          </div>
        </div>
      )}
    </div>
  );
}
