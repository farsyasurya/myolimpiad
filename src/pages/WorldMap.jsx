import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderBar from '../components/HeaderBar';
import LevelNode from '../components/LevelNode';
import GameButton from '../components/GameButton';
import StarRating from '../components/StarRating';
import TreeDecoration from '../components/decorations/TreeDecoration';
import MountainDecoration from '../components/decorations/MountainDecoration';
import CloudDecoration from '../components/decorations/CloudDecoration';
import RiverDecoration from '../components/decorations/RiverDecoration';
import { getAllLevels, getGameStats } from '../services/gameProgressService';
import { sound } from '../utils/soundEffects';
import { Play, Trophy, Sparkles, X, Compass, CheckCircle } from 'lucide-react';

export default function WorldMap() {
  const navigate = useNavigate();
  const [levels, setLevels] = useState([]);
  const [stats, setStats] = useState({ totalStars: 0, completedCount: 0 });
  const [selectedLevel, setSelectedLevel] = useState(null);
  const containerRef = useRef(null);
  const activeNodeRef = useRef(null);

  useEffect(() => {
    const loadedLevels = getAllLevels();
    setLevels(loadedLevels);
    setStats(getGameStats());
  }, []);

  // Determine current active level for the player avatar:
  // The first unlocked level that is NOT completed, or the latest unlocked level.
  const currentActiveLevel =
    levels.find((l) => l.unlocked && !l.completed) ||
    [...levels].reverse().find((l) => l.unlocked) ||
    levels[0];

  // Auto-scroll towards active level on mount
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
    navigate(`/level/${levelId}`);
  };

  // Horizontal offset positions for 10 levels to create a serpentine adventure curve
  // percentages relative to container width:
  // Level 1: 50% (center)
  // Level 2: 70% (right)
  // Level 3: 80% (far right)
  // Level 4: 55% (center-right)
  // Level 5: 30% (center-left)
  // Level 6: 20% (far left)
  // Level 7: 40% (center-left)
  // Level 8: 65% (center-right)
  // Level 9: 75% (right)
  // Level 10: 50% (center summit)
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
        title="Peta Petualangan"
        backTo="/home"
        starsCount={stats.totalStars}
        maxStars={30}
      />

      {/* Scrollable Map Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto no-scrollbar relative w-full pb-28 pt-4"
        style={{
          background: 'linear-gradient(180deg, #0ea5e9 0%, #38bdf8 15%, #4ade80 40%, #16a34a 65%, #ca8a04 85%, #78350f 100%)'
        }}
      >
        {/* Decorative Scenery Elements placed throughout the map */}
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
        <div className="absolute top-[1450px] left-6 pointer-events-none">
          <MountainDecoration className="w-32 opacity-60" />
        </div>

        {/* Grand Summit Trophy at the Top / Level 10 End Marker */}
        <div className="w-full flex flex-col items-center justify-center my-6 z-10">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400 text-amber-950 font-game font-bold text-xs shadow-lg border-2 border-yellow-200 animate-bounce">
            <Trophy className="w-4 h-4 fill-amber-950" />
            Puncak Menara Juara
          </div>
        </div>

        {/* 10 Level Nodes Rendered Vertically */}
        <div className="relative flex flex-col gap-14 px-4 max-w-md mx-auto z-10">
          {levels.map((level, index) => {
            const isCurrent = currentActiveLevel && currentActiveLevel.id === level.id;
            const posClass = horizontalPositions[index] || 'justify-center';

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

        {/* Start of Journey Marker at the Bottom */}
        <div className="w-full flex flex-col items-center justify-center mt-12 mb-4 z-10">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/90 text-slate-800 font-game font-bold text-xs shadow-md border-2 border-emerald-400">
            <Compass className="w-4 h-4 text-emerald-600 animate-spin" style={{ animationDuration: '6s' }} />
            Titik Awal Petualangan
          </div>
        </div>
      </div>

      {/* Level Preview / Info Bottom Sheet Modal */}
      {selectedLevel && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in"
          onClick={() => setSelectedLevel(null)}
        >
          <div
            className="w-full max-w-sm bg-gradient-to-b from-white to-amber-50 rounded-3xl p-5 shadow-2xl border-4 border-amber-300 relative text-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
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

            {/* Level Badge Header */}
            <div className="flex flex-col items-center text-center mt-1">
              <span className="px-3 py-1 bg-amber-400 text-amber-950 font-game font-black text-xs rounded-full uppercase tracking-wider mb-2">
                Level {selectedLevel.id}
              </span>
              <h2 className="text-2xl font-black font-game text-slate-800">
                {selectedLevel.name}
              </h2>
              <span className="text-xs font-bold text-amber-700/80 mt-0.5">
                Tema: {selectedLevel.theme}
              </span>
            </div>

            {/* Level Description */}
            <p className="mt-3 text-sm text-center text-slate-600 bg-white/80 p-3 rounded-2xl border border-amber-200/60">
              {selectedLevel.description}
            </p>

            {/* Stars Earned */}
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

            {/* Action Button */}
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
