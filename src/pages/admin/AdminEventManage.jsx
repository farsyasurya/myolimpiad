import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import HeaderBar from '../../components/HeaderBar';
import GameButton from '../../components/GameButton';
import { 
  getEventById, 
  addLevelToEvent, 
  addQuestionToLevel, 
  setEventStatus 
} from '../../services/eventService';
import { 
  PlusCircle, 
  HelpCircle, 
  CheckCircle, 
  Unlock, 
  Lock, 
  Layers, 
  Sparkles, 
  ArrowLeft,
  X,
  Check
} from 'lucide-react';
import { sound } from '../../utils/soundEffects';

export default function AdminEventManage() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [selectedLevelId, setSelectedLevelId] = useState(1);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showAddLevelModal, setShowAddLevelModal] = useState(false);
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);

  // New level form state
  const [newLevelName, setNewLevelName] = useState('');
  const [newLevelTheme, setNewLevelTheme] = useState('');

  // New question form state
  const [questionText, setQuestionText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctOption, setCorrectOption] = useState('A');
  const [explanation, setExplanation] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    loadEventData();
  }, [eventId]);

  const loadEventData = async () => {
    setLoading(true);
    try {
      const data = await getEventById(eventId);
      if (!data) {
        alert('Event tidak ditemukan.');
        navigate('/admin/dashboard');
        return;
      }
      setEvent(data);
      if (data.levels && data.levels.length > 0) {
        setSelectedLevelId(data.levels[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async () => {
    sound.playPop();
    const nextStatus = event.status === 'open' ? 'draft' : 'open';
    const updated = await setEventStatus(event.id, nextStatus);
    setEvent({ ...event, status: nextStatus });
    if (nextStatus === 'open') sound.playStar();
  };

  const handleAddLevel = async (e) => {
    e.preventDefault();
    try {
      sound.playPop();
      const nextId = (event.levels?.length || 0) + 1;
      const added = await addLevelToEvent(event.id, {
        name: newLevelName || `Babak ${nextId}`,
        theme: newLevelTheme || 'Matematika'
      });
      setShowAddLevelModal(false);
      setNewLevelName('');
      setNewLevelTheme('');
      sound.playCorrect();
      await loadEventData();
      setSelectedLevelId(added.id);
    } catch (err) {
      sound.playWrong();
      alert(err.message);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!questionText.trim()) {
      setFormError('Pertanyaan tidak boleh kosong.');
      return;
    }
    if (!optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()) {
      setFormError('Semua 4 Opsi (A, B, C, D) harus diisi.');
      return;
    }

    try {
      sound.playPop();
      const options = [optionA.trim(), optionB.trim(), optionC.trim(), optionD.trim()];
      await addQuestionToLevel(event.id, selectedLevelId, {
        question: questionText,
        options,
        correctOption,
        explanation
      });

      setShowAddQuestionModal(false);
      // Reset form
      setQuestionText('');
      setOptionA('');
      setOptionB('');
      setOptionC('');
      setOptionD('');
      setCorrectOption('A');
      setExplanation('');

      sound.playCorrect();
      await loadEventData();
    } catch (err) {
      sound.playWrong();
      setFormError(err.message || 'Gagal menambahkan soal.');
    }
  };

  if (loading || !event) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white font-game">
        Memuat manajemen soal event...
      </div>
    );
  }

  const currentLevel = event.levels?.find((l) => l.id === selectedLevelId) || event.levels?.[0];
  const isOpen = event.status === 'open';

  return (
    <div className="relative w-full h-full flex flex-col justify-between bg-slate-900 text-white select-none overflow-y-auto no-scrollbar">
      <HeaderBar
        title="Kelola Level & Soal"
        backTo="/admin/dashboard"
        showSoundToggle={false}
      />

      <div className="flex-1 p-4 max-w-md w-full mx-auto flex flex-col gap-4">
        {/* Event Header Banner */}
        <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700 shadow-md">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold text-amber-400 font-game uppercase tracking-wider">
                Event: {event.code}
              </span>
              <h2 className="text-lg font-black font-game text-white leading-tight">
                {event.title}
              </h2>
            </div>

            {/* Buka / Tutup Event Status Button */}
            <button
              type="button"
              onClick={handleTogglePublish}
              className={`px-3 py-1.5 rounded-xl font-game text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer active:scale-95 ${
                isOpen
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-amber-950'
              }`}
            >
              {isOpen ? (
                <>
                  <Unlock className="w-3.5 h-3.5" /> Event Terbuka
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" /> Buka Event Sekarang
                </>
              )}
            </button>
          </div>
          {isOpen && (
            <p className="mt-2 text-[11px] text-emerald-300 font-game">
              ✓ Event ini sudah dibuka! Peserta dapat bergabung menggunakan kode: <b>{event.code}</b>
            </p>
          )}
        </div>

        {/* Level Tabs Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 font-game flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Pilih Babak / Level ({event.levels?.length || 0})
            </span>

            <button
              type="button"
              onClick={() => {
                sound.playPop();
                setShowAddLevelModal(true);
              }}
              className="text-xs font-bold text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Tambah Level
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {event.levels?.map((lvl) => {
              const isSelected = lvl.id === selectedLevelId;
              const qCount = lvl.questions?.length || 0;

              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => {
                    sound.playPop();
                    setSelectedLevelId(lvl.id);
                  }}
                  className={`
                    px-3 py-2 rounded-xl text-xs font-game font-bold flex-shrink-0 transition cursor-pointer border
                    ${
                      isSelected
                        ? 'bg-amber-400 text-amber-950 border-amber-300 shadow-md'
                        : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }
                  `}
                >
                  {lvl.name} ({qCount} Soal)
                </button>
              );
            })}
          </div>
        </div>

        {/* Level Details & Questions List */}
        {currentLevel && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold font-game text-white">
                  Daftar Soal - {currentLevel.name}
                </h3>
                <span className="text-xs text-slate-400">
                  Tema: {currentLevel.theme}
                </span>
              </div>

              {/* Buat Soal Button */}
              <GameButton
                variant="warning"
                size="sm"
                icon={PlusCircle}
                onClick={() => {
                  sound.playPop();
                  setShowAddQuestionModal(true);
                }}
              >
                + Buat Soal
              </GameButton>
            </div>

            {/* Questions container */}
            {!currentLevel.questions || currentLevel.questions.length === 0 ? (
              <div className="bg-slate-800/40 border-2 border-dashed border-slate-700 rounded-2xl p-6 text-center text-slate-400 text-xs">
                <HelpCircle className="w-8 h-8 text-slate-500 mx-auto mb-1.5" />
                Belum ada soal pada level ini. Klik <b>"+ Buat Soal"</b> untuk menambahkan soal dan opsi A, B, C, D.
              </div>
            ) : (
              <div className="flex flex-col gap-2.5">
                {currentLevel.questions.map((q, idx) => (
                  <div
                    key={q.id || idx}
                    className="bg-slate-800/80 rounded-2xl p-3.5 border border-slate-700 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 text-xs font-black flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <p className="flex-1 text-xs sm:text-sm font-bold text-white font-game">
                        {q.question}
                      </p>
                    </div>

                    {/* Options list preview */}
                    <div className="grid grid-cols-2 gap-1.5 mt-2.5">
                      {q.options?.map((opt, optIdx) => {
                        const letter = ['A', 'B', 'C', 'D'][optIdx];
                        const isCorrect = q.correctOption === letter || q.answer === opt;

                        return (
                          <div
                            key={optIdx}
                            className={`p-1.5 rounded-lg text-xs font-game flex items-center gap-1.5 border ${
                              isCorrect
                                ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300 font-bold'
                                : 'bg-slate-900/50 border-slate-700 text-slate-300'
                            }`}
                          >
                            <span
                              className={`w-4 h-4 rounded text-[10px] font-black flex items-center justify-center ${
                                isCorrect
                                  ? 'bg-emerald-400 text-emerald-950'
                                  : 'bg-slate-700 text-slate-300'
                              }`}
                            >
                              {letter}
                            </span>
                            <span className="truncate">{opt}</span>
                            {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400 ml-auto" />}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <p className="text-[11px] text-amber-300/80 mt-2 bg-slate-900/40 p-1.5 rounded-lg">
                        💡 {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal: Tambah Level */}
      {showAddLevelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-slate-800 border-2 border-amber-400 rounded-3xl p-5 shadow-2xl relative text-white">
            <button
              type="button"
              onClick={() => setShowAddLevelModal(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-black font-game text-yellow-300 mb-3">
              Tambah Babak / Level Baru
            </h3>

            <form onSubmit={handleAddLevel} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 font-game mb-1">
                  Nama Level
                </label>
                <input
                  type="text"
                  required
                  value={newLevelName}
                  onChange={(e) => setNewLevelName(e.target.value)}
                  placeholder="Contoh: Babak 2: Pengurangan Cepat"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 font-game mb-1">
                  Tema / Materi
                </label>
                <input
                  type="text"
                  value={newLevelTheme}
                  onChange={(e) => setNewLevelTheme(e.target.value)}
                  placeholder="Contoh: Operasi Pengurangan"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 mt-2">
                <GameButton
                  variant="neutral"
                  size="sm"
                  fullWidth
                  onClick={() => setShowAddLevelModal(false)}
                >
                  Batal
                </GameButton>
                <GameButton
                  type="submit"
                  variant="warning"
                  size="sm"
                  fullWidth
                >
                  Tambah Level
                </GameButton>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Buat Soal (Pertanyaan, Opsi A B C D, Select Kunci Jawaban) */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-sm bg-slate-800 border-2 border-amber-400 rounded-3xl p-5 shadow-2xl relative text-white my-auto max-h-[90vh] overflow-y-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setShowAddQuestionModal(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-black font-game text-yellow-300 mb-1">
              Buat Soal Kuis Baru
            </h3>
            <p className="text-[11px] text-slate-400 mb-3">
              Level: {currentLevel?.name}
            </p>

            {formError && (
              <div className="mb-3 p-2 rounded-xl bg-rose-500/20 border border-rose-500 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddQuestion} className="flex flex-col gap-2.5">
              {/* Pertanyaan */}
              <div>
                <label className="block text-xs font-bold text-slate-300 font-game mb-1">
                  Teks Pertanyaan
                </label>
                <textarea
                  rows={2}
                  required
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Contoh: Berapakah hasil dari 25 + 35?"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:border-amber-400 focus:outline-none"
                />
              </div>

              {/* Opsi A, B, C, D */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 font-game mb-1">
                    Opsi A
                  </label>
                  <input
                    type="text"
                    required
                    value={optionA}
                    onChange={(e) => setOptionA(e.target.value)}
                    placeholder="Jawaban A"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 font-game mb-1">
                    Opsi B
                  </label>
                  <input
                    type="text"
                    required
                    value={optionB}
                    onChange={(e) => setOptionB(e.target.value)}
                    placeholder="Jawaban B"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 font-game mb-1">
                    Opsi C
                  </label>
                  <input
                    type="text"
                    required
                    value={optionC}
                    onChange={(e) => setOptionC(e.target.value)}
                    placeholder="Jawaban C"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 font-game mb-1">
                    Opsi D
                  </label>
                  <input
                    type="text"
                    required
                    value={optionD}
                    onChange={(e) => setOptionD(e.target.value)}
                    placeholder="Jawaban D"
                    className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Select Kunci Jawaban Benar (A, B, C, D) */}
              <div>
                <label className="block text-xs font-bold text-amber-300 font-game mb-1">
                  Pilih Kunci Jawaban yang Benar:
                </label>
                <select
                  value={correctOption}
                  onChange={(e) => setCorrectOption(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border-2 border-amber-400 rounded-xl text-amber-300 font-game font-bold text-sm focus:outline-none cursor-pointer"
                >
                  <option value="A">Opsi A ({optionA || 'Jawaban A'})</option>
                  <option value="B">Opsi B ({optionB || 'Jawaban B'})</option>
                  <option value="C">Opsi C ({optionC || 'Jawaban C'})</option>
                  <option value="D">Opsi D ({optionD || 'Jawaban D'})</option>
                </select>
              </div>

              {/* Pembahasan / Penjelasan */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 font-game mb-1">
                  Penjelasan / Cara Hitung (Opsional)
                </label>
                <input
                  type="text"
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  placeholder="Contoh: 25 + 35 = 60"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 mt-2">
                <GameButton
                  variant="neutral"
                  size="sm"
                  fullWidth
                  onClick={() => setShowAddQuestionModal(false)}
                >
                  Batal
                </GameButton>
                <GameButton
                  type="submit"
                  variant="warning"
                  size="sm"
                  fullWidth
                >
                  Simpan Soal
                </GameButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
