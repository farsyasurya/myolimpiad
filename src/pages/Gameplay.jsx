import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import HeaderBar from '../components/HeaderBar';
import { getEventById, recordUserEventScore } from '../services/eventService';
import { useAuth } from '../context/AuthContext';
import { sound } from '../utils/soundEffects';
import { CheckCircle, XCircle, Calculator, Lightbulb } from 'lucide-react';

export default function Gameplay() {
  const { levelId } = useParams();
  const [searchParams] = useSearchParams();
  const eventIdParam = searchParams.get('eventId');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [level, setLevel] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Timer counter for duration
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const storedEvent = sessionStorage.getItem('activeCompetitionEvent');
  const targetEventId = eventIdParam || (storedEvent ? JSON.parse(storedEvent).id : null);

  useEffect(() => {
    loadQuizData();
  }, [levelId, targetEventId]);

  const loadQuizData = async () => {
    const id = Number(levelId);

    if (!targetEventId) {
      navigate('/join');
      return;
    }

    try {
      const evt = await getEventById(targetEventId);
      if (evt) {
        const evtLevel = evt.levels?.find((l) => l.id === id);
        if (evtLevel) {
          setLevel({
            id: evtLevel.id,
            name: evtLevel.name,
            theme: evtLevel.theme || 'Kompetisi Matematika'
          });

          if (evtLevel.questions && evtLevel.questions.length > 0) {
            setQuestions(evtLevel.questions);
            return;
          } else {
            alert(`Penyelenggara belum menambahkan soal pada ${evtLevel.name}.`);
            navigate(`/map?eventId=${targetEventId}`);
            return;
          }
        }
      }
    } catch (err) {
      console.error(err);
    }

    navigate('/join');
  };

  if (!level || questions.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white">
        <p className="font-game text-sm animate-pulse">Menyiapkan soal matematika...</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const totalQ = questions.length;
  const progressPercent = ((currentIndex + 1) / totalQ) * 100;
  const optionLetters = ['A', 'B', 'C', 'D'];

  const handleSelectOption = (option) => {
    if (isAnswered) return;

    setIsAnswered(true);
    setSelectedOption(option);

    const isCorrect = option === currentQ.answer;
    let newCorrect = correctAnswers;
    let newWrong = wrongAnswers;

    if (isCorrect) {
      newCorrect += 1;
      setCorrectAnswers(newCorrect);
      sound.playCorrect();
    } else {
      newWrong += 1;
      setWrongAnswers(newWrong);
      sound.playWrong();
    }

    setShowExplanation(true);

    setTimeout(async () => {
      if (currentIndex + 1 < totalQ) {
        setCurrentIndex((prev) => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
        setShowExplanation(false);
      } else {
        // Calculate score & stars
        const finalScore = Math.round((newCorrect / totalQ) * 100);
        let finalStars = 0;
        if (finalScore >= 90) {
          finalStars = 3;
        } else if (finalScore >= 70) {
          finalStars = 2;
        } else if (finalScore >= 50) {
          finalStars = 1;
        } else {
          finalStars = 0;
        }

        // Save to event progress and update leaderboard
        const isPassed = finalStars >= 1 || finalScore >= 50;
        const progressKey = `progress_${targetEventId}`;
        const raw = localStorage.getItem(progressKey);
        const progress = raw ? JSON.parse(raw) : {};

        const prevLevel = progress[level.id] || { unlocked: true, completed: false, stars: 0, bestScore: 0 };
        progress[level.id] = {
          unlocked: true,
          completed: prevLevel.completed || isPassed,
          stars: Math.max(prevLevel.stars, finalStars),
          bestScore: Math.max(prevLevel.bestScore, finalScore)
        };

        // Unlock next level in this event
        const nextLevelId = Number(level.id) + 1;
        if (isPassed) {
          if (!progress[nextLevelId]) {
            progress[nextLevelId] = { unlocked: true, completed: false, stars: 0, bestScore: 0 };
          } else {
            progress[nextLevelId].unlocked = true;
          }
        }
        localStorage.setItem(progressKey, JSON.stringify(progress));

        // Save to leaderboard with durationSeconds
        await recordUserEventScore({
          eventId: targetEventId,
          userId: currentUser?.uid || 'guest_' + Date.now(),
          userName: currentUser?.displayName || 'Peserta',
          levelId: level.id,
          score: finalScore,
          stars: finalStars,
          durationSeconds: elapsedSeconds
        });

        navigate(`/result/${level.id}?eventId=${targetEventId}`, {
          state: {
            score: finalScore,
            stars: finalStars,
            correctAnswers: newCorrect,
            wrongAnswers: newWrong,
            totalQuestions: totalQ,
            durationSeconds: elapsedSeconds,
            eventId: targetEventId
          }
        });
      }
    }, 1300);
  };

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between bg-gradient-to-b from-sky-500 via-indigo-600 to-purple-800 text-white select-none overflow-hidden">
      {/* 1. Header Navigation */}
      <HeaderBar
        title={`Babak ${level.id}: ${level.name}`}
        backTo={targetEventId ? `/map?eventId=${targetEventId}` : '/map'}
        showSoundToggle={true}
        className="py-2.5"
      />

      {/* 2. Top Progress & Status Bar with Live Timer */}
      <div className="w-full px-4 pt-2 pb-1 flex flex-col gap-1.5 z-10">
        <div className="flex items-center justify-between text-xs font-game font-bold">
          <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-amber-200 border border-white/20">
            Soal {currentIndex + 1} dari {totalQ}
          </span>
          <span className="px-2.5 py-0.5 bg-amber-400/20 backdrop-blur-md rounded-full text-amber-300 border border-amber-400/30">
            ⏱️ {formatTimer(elapsedSeconds)}
          </span>
          <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md rounded-full text-emerald-300 border border-white/20">
            Benar: {correctAnswers}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900/40 rounded-full h-2.5 p-0.5 border border-white/20 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 3. Question Card */}
      <div className="flex-1 flex flex-col justify-center px-4 py-2 z-10 min-h-0">
        <div className="w-full bg-white/95 text-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl border-4 border-amber-300 relative">
          <div className="inline-flex items-center gap-1 bg-amber-400 text-amber-950 font-game font-black text-[11px] px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 shadow-xs border border-yellow-200">
            <Calculator className="w-3 h-3" />
            {level.theme}
          </div>

          <h2 className="text-base sm:text-lg font-bold font-game text-slate-800 leading-snug">
            {currentQ.question}
          </h2>

          {showExplanation && currentQ.explanation && (
            <div className="mt-2.5 p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium flex items-start gap-1.5 animate-fade-in">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
              <span className="leading-tight">{currentQ.explanation}</span>
            </div>
          )}
        </div>
      </div>

      {/* 4. Options A, B, C, D in 2x2 Grid (All 4 Options Always Visible) */}
      <div className="w-full px-4 pb-4 pt-1 z-10">
        <div className="grid grid-cols-2 gap-2.5">
          {currentQ.options.map((option, idx) => {
            const letter = optionLetters[idx];
            const isSelected = selectedOption === option;
            const isCorrect = option === currentQ.answer;

            let buttonStyle = 'bg-white text-slate-800 border-b-4 border-slate-300 hover:bg-slate-50';
            let iconElement = null;

            if (isAnswered) {
              if (isCorrect) {
                buttonStyle = 'bg-emerald-500 text-white border-b-4 border-emerald-700 animate-pulse';
                iconElement = <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />;
              } else if (isSelected && !isCorrect) {
                buttonStyle = 'bg-rose-500 text-white border-b-4 border-rose-700 animate-shake';
                iconElement = <XCircle className="w-4 h-4 text-white flex-shrink-0" />;
              } else {
                buttonStyle = 'bg-white/50 text-slate-400 border-b-4 border-slate-200 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(option)}
                disabled={isAnswered}
                className={`
                  w-full min-h-[58px] p-2.5 rounded-2xl font-game font-bold text-left
                  flex items-center justify-between gap-2 text-sm
                  transition-all duration-150 shadow-md cursor-pointer select-none
                  active:translate-y-1 active:border-b-2
                  ${buttonStyle}
                `}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`
                      w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 shadow-inner
                      ${
                        isAnswered && isCorrect
                          ? 'bg-white text-emerald-600'
                          : isAnswered && isSelected && !isCorrect
                          ? 'bg-white text-rose-600'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }
                    `}
                  >
                    {letter}
                  </span>
                  <span className="truncate leading-tight">{option}</span>
                </div>
                {iconElement}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
