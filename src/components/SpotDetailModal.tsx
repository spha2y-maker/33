import React, { useState } from 'react';
import { SpotDetail, StudentNote, StampPhoto } from '../types';
import { 
  X, 
  Volume2, 
  CheckCircle2, 
  Sparkles, 
  BookOpen, 
  MapPin, 
  Calendar, 
  Award, 
  HelpCircle, 
  Share2, 
  Layers,
  GraduationCap,
  MessageSquare,
  History,
  Camera,
  Upload,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SpotDetailModalProps {
  spot: SpotDetail | null;
  onClose: () => void;
  onOpenAudio: (spot: SpotDetail) => void;
  note: StudentNote | undefined;
  stampPhoto: StampPhoto | undefined;
  onSaveNote: (spotId: string, noteText: string) => void;
  onSaveStampPhoto: (spotId: string, photoUrl: string, caption?: string) => void;
  onToggleStamp: (spotId: string) => void;
}

export const SpotDetailModal: React.FC<SpotDetailModalProps> = ({
  spot,
  onClose,
  onOpenAudio,
  note,
  stampPhoto,
  onSaveNote,
  onSaveStampPhoto,
  onToggleStamp,
}) => {
  if (!spot) return null;

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'history' | 'curriculum' | 'mission'>('overview');
  const [inputText, setInputText] = useState<string>(note?.noteText || '');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<boolean>(false);

  const isStamped = note?.stamped || false;

  const handleSave = () => {
    onSaveNote(spot.id, inputText);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleQuizSubmit = (optIdx: number) => {
    setSelectedOption(optIdx);
    setShowQuizResult(true);
    if (optIdx === spot.quiz.answerIndex) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  const handleUseSamplePhoto = () => {
    onSaveStampPhoto(spot.id, spot.heroImage, `${spot.name} 현장 인증 완료`);
    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn overflow-y-auto font-sans">
      <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col my-auto">
        {/* Modal Top Header Image Banner */}
        <div className="relative h-48 sm:h-64 w-full bg-slate-900 flex-shrink-0">
          <img
            src={spot.heroImage}
            alt={spot.name}
            className="w-full h-full object-cover opacity-90"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition backdrop-blur-md cursor-pointer z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Top Info Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-slate-900 shadow">
              DAY 0{spot.day} 탐방 코스
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-600/90 text-white backdrop-blur-md">
              {spot.badge}
            </span>
          </div>

          {/* Bottom Title on Image */}
          <div className="absolute bottom-4 left-5 right-5 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1 text-sm text-sky-200">
                <span className="text-2xl">{spot.emoji}</span>
                <span>{spot.chineseName}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {spot.name}
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-200 mt-1">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>{spot.locationDesc}</span>
              </div>
            </div>

            {/* Quick Action Buttons on Hero */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => onOpenAudio(spot)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold transition cursor-pointer border border-white/30"
              >
                <Volume2 className="w-4 h-4 text-sky-300" />
                <span>오디오 가이드</span>
              </button>

              {isStamped ? (
                <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold shadow">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>인증완료</span>
                </div>
              ) : (
                <button
                  onClick={handleUseSamplePhoto}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>사진 인증하기</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modal Navigation Sub-tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 bg-slate-50 border-b border-slate-200 overflow-x-auto scrollbar-none flex-shrink-0">
          {[
            { id: 'overview' as const, label: '개요 및 특성', icon: BookOpen },
            { id: 'history' as const, label: '🇰🇷 한국사 연계 탐구', icon: History },
            { id: 'curriculum' as const, label: '융합 교과 연계', icon: GraduationCap },
            { id: 'mission' as const, label: '사진 인증 & 탐구 노트', icon: Camera },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-800 text-sm leading-relaxed">
          {/* TAB 1: OVERVIEW */}
          {activeSubTab === 'overview' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Highlight summary */}
              <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  탐방지 핵심 요약 (Executive Summary)
                </h4>
                <p className="text-slate-700 leading-relaxed font-sans text-sm">
                  {spot.summary}
                </p>
              </div>

              {/* Special Feature */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-600" />
                  <span>주요 볼거리 및 현장 특징</span>
                </h4>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm leading-relaxed">
                  {spot.specialFeature}
                </div>
              </div>

              {/* Thematic Significance */}
              {spot.thematicSignificance && (
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>글로컬 관점에서의 의의</span>
                  </h4>
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-slate-700 text-xs sm:text-sm leading-relaxed">
                    {spot.thematicSignificance}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: HISTORY */}
          {activeSubTab === 'history' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                  KOREAN INDEPENDENCE & GLOCAL HISTORY
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {spot.koreaHistoryRelation.title}
                </h3>
              </div>

              <div className="space-y-3">
                {spot.koreaHistoryRelation.content.map((p, idx) => (
                  <p key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>

              {spot.koreaHistoryRelation.keyEvents && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    역사적 주요 사건 타임라인
                  </h4>
                  <div className="space-y-2.5">
                    {spot.koreaHistoryRelation.keyEvents.map((evt, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 flex gap-3 shadow-xs">
                        <span className="px-2.5 py-1 rounded bg-sky-100 text-sky-800 text-xs font-mono font-bold self-start">
                          {evt.year || '기록'}
                        </span>
                        <div className="space-y-1">
                          <h5 className="font-bold text-slate-900 text-xs sm:text-sm">{evt.title}</h5>
                          <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5">
                            {evt.details.map((d, dIdx) => (
                              <li key={dIdx}>{d}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CURRICULUM */}
          {activeSubTab === 'curriculum' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 text-xs text-sky-900 leading-relaxed font-sans">
                <span className="font-bold">📚 2022 개정 교육과정 기반 중학교 3학년 융합 교과 연계 탐구:</span>
                {' '}역사, 사회, 기술·가정, 수학, 음악, 국어, 체육, 미술 교과를 아우르는 다학제적 학습 질문과 탐구 미션을 제공합니다.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {spot.curriculum.map((c, idx) => {
                  let badgeColor = 'bg-sky-100 text-sky-800 border-sky-200';
                  if (c.subject.includes('기술') || c.subject.includes('가정')) {
                    badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
                  } else if (c.subject.includes('수학')) {
                    badgeColor = 'bg-indigo-100 text-indigo-900 border-indigo-300';
                  } else if (c.subject.includes('음악')) {
                    badgeColor = 'bg-fuchsia-100 text-fuchsia-900 border-fuchsia-300';
                  } else if (c.subject.includes('역사')) {
                    badgeColor = 'bg-rose-100 text-rose-900 border-rose-300';
                  } else if (c.subject.includes('사회')) {
                    badgeColor = 'bg-blue-100 text-blue-900 border-blue-300';
                  } else if (c.subject.includes('체육')) {
                    badgeColor = 'bg-teal-100 text-teal-900 border-teal-300';
                  } else if (c.subject.includes('국어') || c.subject.includes('한문')) {
                    badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-300';
                  }

                  return (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2 flex flex-col justify-between">
                      <div className="space-y-1.5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${badgeColor}`}>
                          {c.subject}
                        </span>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">{c.topic}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed font-sans">{c.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {spot.projectExamples && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-900">
                    💡 추천 프로젝트 및 탐구 과제 가이드
                  </h4>
                  <div className="space-y-2.5">
                    {spot.projectExamples.map((pe, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-white border border-slate-200 flex gap-3 shadow-xs">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-xs self-start">
                          {pe.step}
                        </span>
                        <div className="space-y-1">
                          <div className="text-xs font-bold text-slate-800">
                            [{pe.subject}] {pe.title}
                          </div>
                          <p className="text-xs text-slate-600">{pe.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MISSION & PHOTO */}
          {activeSubTab === 'mission' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Photo Verification Status Card */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>현장 사진 촬영 및 인증 상태</span>
                  </h4>
                  {isStamped ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> 스탬프 날인 완료
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      사진 미인증
                    </span>
                  )}
                </div>

                {stampPhoto ? (
                  <div className="flex flex-col sm:flex-row gap-4 items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <img
                      src={stampPhoto.photoUrl}
                      alt={spot.name}
                      className="w-36 h-24 object-cover rounded-lg border border-slate-200"
                    />
                    <div className="space-y-1 text-xs text-slate-600 flex-1">
                      <div className="font-bold text-slate-900">{stampPhoto.caption || '현장 인증 사진'}</div>
                      <div>인증 일시: {stampPhoto.stampedAt}</div>
                      <div className="text-emerald-700 font-semibold">✓ 위치 확인 및 인증 마스터 도장 획득</div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-3">
                    <p className="text-xs text-slate-600">
                      현장에서 직접 촬영한 사진을 등록하면 모바일 여권에 디지털 스탬프가 기록됩니다.
                    </p>
                    <button
                      onClick={handleUseSamplePhoto}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>샘플 현장 사진으로 즉시 인증</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Mission Prompt */}
              <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-3">
                <span className="text-xs font-bold text-sky-800 uppercase tracking-wider block">
                  EXPLORATION MISSION
                </span>
                <h4 className="text-base font-black text-slate-900">
                  {spot.missionPrompt.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {spot.missionPrompt.instruction}
                </p>

                <div className="pt-2">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={spot.missionPrompt.placeholder}
                    rows={4}
                    className="w-full p-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-sky-500 leading-relaxed font-sans"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-400">
                      * 입력한 탐구 노트는 브라우저에 자동 저장되어 워크북에서 확인 가능합니다.
                    </span>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition cursor-pointer shadow-xs"
                    >
                      {saveToast ? '저장 완료!' : '노트 저장'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Spot Quiz */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-sky-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    현장 확인 퀴즈
                  </h4>
                </div>
                <p className="font-bold text-slate-900 text-sm">
                  {spot.quiz.question}
                </p>

                <div className="space-y-2 pt-1">
                  {spot.quiz.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuizSubmit(idx)}
                      className={`w-full text-left p-3 rounded-xl text-xs sm:text-sm font-semibold transition border cursor-pointer ${
                        selectedOption === idx
                          ? idx === spot.quiz.answerIndex
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {idx + 1}. {opt}
                    </button>
                  ))}
                </div>

                {showQuizResult && (
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    💡 <strong>해설:</strong> {spot.quiz.explanation}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <span className="text-xs text-slate-500">
            2026 글로컬 죽향 역사·문화 탐방단 · 담양교육지원청
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
