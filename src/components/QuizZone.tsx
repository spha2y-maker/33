import React, { useState } from 'react';
import { SPOTS_DATA } from '../data/explorationData';
import { SpotDetail } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  RotateCcw, 
  Award, 
  ArrowRight,
  Lightbulb,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizZoneProps {
  onToggleStamp: (spotId: string) => void;
  stampedSpots: Record<string, boolean>;
}

export const QuizZone: React.FC<QuizZoneProps> = ({ onToggleStamp, stampedSpots }) => {
  const [currentQuizIdx, setCurrentQuizIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  const currentSpot = SPOTS_DATA[currentQuizIdx];

  const handleSelectAnswer = (optionIdx: number) => {
    const spotId = currentSpot.id;
    if (userAnswers[spotId] !== undefined) return; // already answered

    setUserAnswers((prev) => ({ ...prev, [spotId]: optionIdx }));
    setShowExplanation((prev) => ({ ...prev, [spotId]: true }));

    const isCorrect = optionIdx === currentSpot.quiz.answerIndex;
    if (isCorrect) {
      confetti({
        particleCount: 60,
        spread: 55,
        origin: { y: 0.6 },
      });
      if (!stampedSpots[spotId]) {
        onToggleStamp(spotId);
      }
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setShowExplanation({});
    setCurrentQuizIdx(0);
  };

  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = SPOTS_DATA.filter(
    (s) => userAnswers[s.id] === s.quiz.answerIndex
  ).length;

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto font-sans">
      {/* Quiz Header Banner - Bright Theme */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 text-7xl opacity-5 font-black italic select-none pointer-events-none text-sky-600">
          QUIZ
        </div>
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
              역사·독서·과학 융합 퀴즈 배틀
            </span>
            <span className="text-xs text-slate-500 font-medium">담양여중 중3 역사·독서·과학 핵심 개념</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            탐방지별 핵심 역사·과학 퀴즈
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            각 탐방지의 역사적 의의와 과학 원리를 퀴즈로 풀고, 정답을 맞추면 모바일 스탬프를 자동으로 획득합니다.
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-3 text-xs">
            <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 font-medium text-slate-700">
              진행도: <span className="text-sky-700 font-bold">{answeredCount}/{SPOTS_DATA.length} 완료</span>
            </div>
            <div className="bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 font-medium text-slate-700">
              정답률: <span className="text-emerald-700 font-bold">{correctCount}개 정답 ({SPOTS_DATA.length > 0 ? Math.round((correctCount / SPOTS_DATA.length) * 100) : 0}%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Spot Switcher Dots */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto p-2 bg-white rounded-2xl border border-slate-200 shadow-xs scrollbar-none">
        {SPOTS_DATA.map((spot, idx) => {
          const isAnswered = userAnswers[spot.id] !== undefined;
          const isCorrect = userAnswers[spot.id] === spot.quiz.answerIndex;
          const isCurrent = idx === currentQuizIdx;

          return (
            <button
              key={spot.id}
              onClick={() => setCurrentQuizIdx(idx)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                isCurrent
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <span>{spot.emoji}</span>
              <span className="hidden sm:inline">Q{idx + 1}</span>
              {isAnswered && (
                <span className="ml-1">
                  {isCorrect ? (
                    <CheckCircle2 className={`w-3.5 h-3.5 inline ${isCurrent ? 'text-white' : 'text-emerald-600'}`} />
                  ) : (
                    <XCircle className={`w-3.5 h-3.5 inline ${isCurrent ? 'text-white' : 'text-rose-600'}`} />
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Question Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Question Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentSpot.emoji}</span>
            <div>
              <span className="text-xs font-bold text-sky-700">
                QUESTION 0{currentQuizIdx + 1} / 0{SPOTS_DATA.length} · DAY 0{currentSpot.day}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">{currentSpot.name} 퀴즈</h3>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {currentSpot.badge}
          </span>
        </div>

        {/* Question Text */}
        <div className="space-y-4">
          <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
            {currentSpot.quiz.question}
          </p>

          {/* Options */}
          <div className="space-y-3 pt-2">
            {currentSpot.quiz.options.map((option, optIdx) => {
              const hasAnswered = userAnswers[currentSpot.id] !== undefined;
              const isSelected = userAnswers[currentSpot.id] === optIdx;
              const isCorrectAnswer = optIdx === currentSpot.quiz.answerIndex;

              let optionStyle = 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800';

              if (hasAnswered) {
                if (isCorrectAnswer) {
                  optionStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold';
                } else if (isSelected) {
                  optionStyle = 'bg-rose-50 border-rose-300 text-rose-900 font-bold';
                } else {
                  optionStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={optIdx}
                  disabled={hasAnswered}
                  onClick={() => handleSelectAnswer(optIdx)}
                  className={`w-full text-left p-4 rounded-2xl border transition duration-150 flex items-center justify-between gap-3 cursor-pointer ${optionStyle}`}
                >
                  <div className="flex items-center gap-3 text-xs sm:text-sm">
                    <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 flex-shrink-0 shadow-xs">
                      {optIdx + 1}
                    </span>
                    <span>{option}</span>
                  </div>

                  {hasAnswered && (
                    <div>
                      {isCorrectAnswer && (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          정답
                        </span>
                      )}
                      {isSelected && !isCorrectAnswer && (
                        <span className="flex items-center gap-1 text-xs font-bold text-rose-700">
                          <XCircle className="w-4 h-4 text-rose-600" />
                          오답
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation Card */}
        {showExplanation[currentSpot.id] && (
          <div className="p-5 rounded-2xl bg-sky-50/80 border border-sky-100 space-y-2 animate-fadeIn">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-900">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>정답 및 심층 해설</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
              {currentSpot.quiz.explanation}
            </p>
          </div>
        )}

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={() => setCurrentQuizIdx((prev) => Math.max(0, prev - 1))}
            disabled={currentQuizIdx === 0}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            ◀ 이전 퀴즈
          </button>

          {currentQuizIdx < SPOTS_DATA.length - 1 ? (
            <button
              onClick={() => setCurrentQuizIdx((prev) => Math.min(SPOTS_DATA.length - 1, prev + 1))}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition cursor-pointer shadow-xs"
            >
              <span>다음 퀴즈</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleResetQuiz}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>처음부터 다시 풀기</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
