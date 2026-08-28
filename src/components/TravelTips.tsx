import React, { useState, useEffect, useRef } from 'react';
import { CHINESE_PHRASES, IMMIGRATION_ENGLISH_LIST, ChinesePhrase, ImmigrationEnglishQA } from '../data/phraseData';
import { TRAVEL_TIPS } from '../data/explorationData';
import { 
  Compass, 
  HelpCircle, 
  ShieldCheck, 
  Sparkles, 
  Phone, 
  AlertTriangle, 
  HeartHandshake,
  MessageCircle,
  Search,
  Copy,
  Check,
  Languages,
  Plane,
  Utensils,
  ShoppingBag,
  Navigation,
  Hotel,
  LifeBuoy,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  X,
  Gauge,
  Repeat,
  Radio,
  CheckCircle2,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export const TravelTips: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'all_chinese' | 'restaurant' | 'shopping' | 'transit' | 'hotel' | 'emergency' | 'basics' | 'immigration_english' | 'essential' | 'safety'
  >('all_chinese');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Audio state
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [autoPlayCategory, setAutoPlayCategory] = useState<boolean>(false);
  const [activeVoiceInfo, setActiveVoiceInfo] = useState<string>('');

  // Big Card Modal state for showing to locals
  const [bigCardPhrase, setBigCardPhrase] = useState<ChinesePhrase | null>(null);

  // Practiced phrases state (saved in memory/localStorage)
  const [practicedMap, setPracticedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('damyang_practiced_phrases_v1');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const togglePracticed = (id: string) => {
    const updated = { ...practicedMap, [id]: !practicedMap[id] };
    setPracticedMap(updated);
    try {
      localStorage.setItem('damyang_practiced_phrases_v1', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // TTS Speech Engine
  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setPlayingId(null);
  };

  const playSpeech = (text: string, lang: 'zh-CN' | 'en-US', id: string, onEndedCallback?: () => void) => {
    if (!('speechSynthesis' in window)) {
      alert('현재 브라우저에서 음성 합성(TTS)을 지원하지 않습니다.');
      return;
    }

    window.speechSynthesis.cancel();

    if (playingId === id) {
      setPlayingId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = playbackSpeed;
    utterance.pitch = 1.0;

    // Pick best available voice for language if available
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const matchedVoice = voices.find((v) => v.lang.replace('_', '-').startsWith(lang.split('-')[0]));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
        setActiveVoiceInfo(matchedVoice.name);
      }
    }

    setPlayingId(id);

    utterance.onend = () => {
      setPlayingId(null);
      if (onEndedCallback) {
        onEndedCallback();
      }
    };

    utterance.onerror = (e) => {
      console.warn('TTS playback error:', e);
      setPlayingId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const emergencyContacts = [
    { title: '주상하이 대한민국 총영사관', number: '+86-21-6295-5000 / 당직: +86-138-1650-8542' },
    { title: '외교부 영사콜센터 (24시간)', number: '+82-2-3210-0404' },
    { title: '중국 범죄 신고 (경찰)', number: '110' },
    { title: '중국 응급 의료 (구급차)', number: '120' },
    { title: '중국 화재 신고 (소방서)', number: '119' },
  ];

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter Chinese phrases
  const filteredChinese = CHINESE_PHRASES.filter((item) => {
    if (activeTab !== 'all_chinese' && activeTab !== item.category) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.korean.toLowerCase().includes(q) ||
      item.hanzi.toLowerCase().includes(q) ||
      item.pinyin.toLowerCase().includes(q) ||
      item.pronunciation.toLowerCase().includes(q) ||
      (item.tip && item.tip.toLowerCase().includes(q))
    );
  });

  // Filter Immigration English
  const filteredEnglish = IMMIGRATION_ENGLISH_LIST.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.category.toLowerCase().includes(q) ||
      item.question.toLowerCase().includes(q) ||
      item.questionKo.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      item.answerKo.toLowerCase().includes(q)
    );
  });

  // Filter General Essential Tips
  const generalEssentialTips = TRAVEL_TIPS.filter((t) => t.category === 'essential');
  const generalSafetyTips = TRAVEL_TIPS.filter((t) => t.category === 'safety');

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto font-sans pb-12">
      {/* Top Banner - Bright Audio Toolkit Header */}
      <div className="bg-gradient-to-r from-sky-500/10 via-amber-500/10 to-emerald-500/10 p-6 sm:p-8 rounded-3xl border border-sky-200/90 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 text-7xl opacity-5 font-black italic select-none pointer-events-none text-sky-700">
          AUDIO
        </div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-600 text-white shadow-xs">
              🔊 생생 듣기 오디오 툴킷 탑재
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
              상황별 중국어 · 공항 입국심사 영어
            </span>
            <span className="text-xs text-slate-500 font-medium">담양여중 실전 탐방 회화</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>상하이 현장 생생 회화 & 오디오 툴킷</span>
            <span className="text-2xl">🗣️🎧</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            식당(고수 빼기)·쇼핑(알리페이)·길찾기·호텔·긴급 상황별 중국어 원어민 표준 발음과 공항 입국심사 영어를 <strong>버튼 하나로 직접 듣고 연습</strong>하세요. 현지 점원이나 기사님께 바로 보여주는 <strong>대형 전광판 모드</strong>도 지원합니다.
          </p>

          {/* Audio Controls Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs text-xs font-bold text-slate-700">
              <Gauge className="w-3.5 h-3.5 text-sky-600" />
              <span>재생 속도:</span>
              <div className="flex items-center gap-1 ml-1">
                {[
                  { rate: 0.8, label: '0.8x (천천히)' },
                  { rate: 1.0, label: '1.0x (보통)' },
                  { rate: 1.2, label: '1.2x (빠르게)' },
                ].map((s) => (
                  <button
                    key={s.rate}
                    onClick={() => setPlaybackSpeed(s.rate)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      playbackSpeed === s.rate
                        ? 'bg-sky-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {s.rate}x
                  </button>
                ))}
              </div>
            </div>

            {playingId && (
              <button
                onClick={stopAudio}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-xs font-bold transition cursor-pointer shadow-2xs"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>재생 멈춤</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Contacts Fast Bar */}
      <div className="p-5 rounded-3xl bg-rose-50/80 border border-rose-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-600 text-white shadow-xs">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                🚨 비상 긴급 연락처 (Emergency Contacts)
              </h3>
              <p className="text-[11px] sm:text-xs text-rose-700">
                위급 상황 발생 시 즉시 인솔 선생님·가이드에게 알리고 영사콜센터로 연락하세요.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
          {emergencyContacts.map((contact, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-white border border-rose-100 shadow-2xs space-y-0.5"
            >
              <div className="text-[11px] text-slate-600 font-semibold">{contact.title}</div>
              <div className="text-xs sm:text-sm font-bold text-rose-600 font-mono">
                {contact.number}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search Bar & Category Filter Tabs */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="회화 표현, 한자, 발음, 질문 검색 (예: 고수, 얼마예요, 알리페이, 화장실, purpose, 호텔)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:bg-white transition"
          />
        </div>

        {/* Category Filter Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          {[
            { id: 'all_chinese' as const, label: '🌟 전체 중국어 회화', icon: Sparkles },
            { id: 'restaurant' as const, label: '🍜 식당 & 주문', icon: Utensils },
            { id: 'shopping' as const, label: '🛍️ 쇼핑 & 결제', icon: ShoppingBag },
            { id: 'transit' as const, label: '🚖 교통 & 길찾기', icon: Navigation },
            { id: 'hotel' as const, label: '🏨 호텔 & 숙소', icon: Hotel },
            { id: 'emergency' as const, label: '🚨 긴급 & 안전', icon: AlertTriangle },
            { id: 'basics' as const, label: '👋 기본 인사', icon: HeartHandshake },
            { id: 'immigration_english' as const, label: '🛂 입국심사 영어', icon: Plane },
            { id: 'essential' as const, label: '🧳 필수 상식(시차/결제)', icon: Compass },
            { id: 'safety' as const, label: '🛡️ 안전 에티켓', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      {/* 1. Chinese Phrases Mode */}
      {activeTab !== 'immigration_english' && activeTab !== 'essential' && activeTab !== 'safety' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800">
                중국어 실전 회화 카드 ({filteredChinese.length}개 표현)
              </span>
              <span className="text-xs text-sky-600 font-medium bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                원어민 발음 듣기 지원
              </span>
            </div>
            <div className="text-xs text-slate-500">
              * 마이크/스피커 아이콘을 누르면 즉시 음성이 재생됩니다.
            </div>
          </div>

          {filteredChinese.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 text-sm">
              검색어와 일치하는 중국어 회화 표현이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredChinese.map((phrase) => {
                const isPlaying = playingId === phrase.id;
                const isPracticed = practicedMap[phrase.id];

                return (
                  <div
                    key={phrase.id}
                    className={`p-5 rounded-2xl bg-white border transition-all duration-200 space-y-3.5 relative overflow-hidden ${
                      isPlaying
                        ? 'border-sky-500 ring-2 ring-sky-200 bg-sky-50/20 shadow-md'
                        : phrase.essential
                        ? 'border-amber-200/90 shadow-xs hover:border-amber-300'
                        : 'border-slate-200 shadow-xs hover:border-slate-300'
                    }`}
                  >
                    {/* Top Tag & Actions */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {phrase.categoryLabel}
                        </span>
                        {phrase.essential && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
                            ★ 초필수
                          </span>
                        )}
                        {isPracticed && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> 연습 완료
                          </span>
                        )}
                      </div>

                      {/* Control Buttons */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {/* Show Big to Local Button */}
                        <button
                          onClick={() => setBigCardPhrase(phrase)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-700 hover:bg-amber-100/80 transition cursor-pointer"
                          title="현지인에게 큰 글씨로 보여주기"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Copy Button */}
                        <button
                          onClick={() => handleCopyText(`${phrase.hanzi} (${phrase.pronunciation}) - ${phrase.korean}`, phrase.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-slate-100 transition cursor-pointer"
                          title="복사하기"
                        >
                          {copiedId === phrase.id ? (
                            <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5">
                              <Check className="w-3.5 h-3.5" />
                            </span>
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Chinese Main Characters & Pinyin Box */}
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-wide font-sans">
                          {phrase.hanzi}
                        </div>

                        {/* Listen Audio Button */}
                        <button
                          onClick={() => playSpeech(phrase.hanzi, 'zh-CN', phrase.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-xs ${
                            isPlaying
                              ? 'bg-rose-600 text-white animate-pulse'
                              : 'bg-sky-600 hover:bg-sky-500 text-white hover:scale-105'
                          }`}
                        >
                          <Volume2 className="w-4 h-4" />
                          <span>{isPlaying ? '듣는 중...' : '듣기'}</span>
                        </button>
                      </div>

                      {/* Pinyin with tone marks */}
                      <div className="text-xs font-semibold text-sky-700 font-mono">
                        {phrase.pinyin}
                      </div>

                      {/* Korean Phonetic Pronunciation */}
                      <div className="text-xs font-bold text-slate-700">
                        발음: <span className="text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-mono">"{phrase.pronunciation}"</span>
                      </div>
                    </div>

                    {/* Korean Meaning & Usage Tip */}
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-slate-900">
                        {phrase.korean}
                      </div>
                      {phrase.tip && (
                        <p className="text-xs text-slate-500 leading-relaxed">
                          💡 {phrase.tip}
                        </p>
                      )}
                    </div>

                    {/* Bottom Practice Checkbox */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <button
                        onClick={() => togglePracticed(phrase.id)}
                        className={`flex items-center gap-1.5 transition cursor-pointer font-medium ${
                          isPracticed ? 'text-emerald-700 font-bold' : 'text-slate-400 hover:text-slate-700'
                        }`}
                      >
                        <CheckCircle2 className={`w-4 h-4 ${isPracticed ? 'text-emerald-600 fill-emerald-100' : ''}`} />
                        <span>{isPracticed ? '발음 연습 완료!' : '듣고 따라하기 완료 체크'}</span>
                      </button>

                      <button
                        onClick={() => setBigCardPhrase(phrase)}
                        className="text-[11px] font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>화면 보여주기</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. Immigration English Mode */}
      {activeTab === 'immigration_english' && (
        <div className="space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 p-5 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-indigo-900 font-black text-base">
              <Plane className="w-5 h-5 text-indigo-600" />
              <span>공항 입국 심사대 (Immigration) 1:1 필수 영어 문답 가이드</span>
            </div>
            <p className="text-xs text-indigo-800 leading-relaxed">
              상하이 푸동/홍차오 공항 심사관의 예상 질문과 학생 모범 답변을 <strong>영어로 직접 듣고 말하는 연습</strong>을 해보세요. 당황하지 않고 미소와 함께 답변하면 원활하게 통과됩니다.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredEnglish.map((qa) => {
              const isQPlaying = playingId === `${qa.id}-q`;
              const isAPlaying = playingId === `${qa.id}-a`;

              return (
                <div
                  key={qa.id}
                  className="bg-white p-5 sm:p-6 rounded-2xl border border-indigo-100 shadow-xs space-y-4 hover:border-indigo-300 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                      {qa.category}
                    </span>
                    <button
                      onClick={() => handleCopyText(`Q: ${qa.question}\nA: ${qa.answer}`, qa.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition cursor-pointer"
                    >
                      {copiedId === qa.id ? (
                        <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> 복사됨
                        </span>
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Question Box */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          심사관 질문 (Immigration Officer)
                        </div>
                        <div className="text-base font-black text-slate-900 font-sans">
                          "{qa.question}"
                        </div>
                        <div className="text-xs text-slate-600 font-medium">
                          ➔ {qa.questionKo}
                        </div>
                      </div>

                      <button
                        onClick={() => playSpeech(qa.question, 'en-US', `${qa.id}-q`)}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                          isQPlaying
                            ? 'bg-rose-600 text-white animate-pulse'
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{isQPlaying ? '재생중' : '질문 듣기'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Answer Box */}
                  <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                          학생 모범 답변 (Student Answer)
                        </div>
                        <div className="text-base font-black text-indigo-950 font-sans">
                          "{qa.answer}"
                        </div>
                        <div className="text-xs text-indigo-800 font-medium">
                          ➔ {qa.answerKo}
                        </div>
                      </div>

                      <button
                        onClick={() => playSpeech(qa.answer, 'en-US', `${qa.id}-a`)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex-shrink-0 shadow-xs ${
                          isAPlaying
                            ? 'bg-rose-600 text-white animate-pulse'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{isAPlaying ? '재생중' : '답변 듣기'}</span>
                      </button>
                    </div>
                  </div>

                  {qa.tip && (
                    <div className="text-xs text-slate-500 font-medium">
                      💡 실전 팁: {qa.tip}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. General Essential Tips & Safety Mode */}
      {(activeTab === 'essential' || activeTab === 'safety') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(activeTab === 'essential' ? generalEssentialTips : generalSafetyTips).map((tip, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-base font-black text-slate-900">
                  {tip.title}
                </h4>
                <button
                  onClick={() => handleCopyText(tip.content, `tip-${idx}`)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-slate-100 transition cursor-pointer flex-shrink-0"
                >
                  {copiedId === `tip-${idx}` ? (
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> 복사됨
                    </span>
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-sans">
                {tip.content}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Big Card Modal for Showing to Local Clerk / Taxi Driver */}
      {bigCardPhrase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn font-sans">
          <div className="bg-white border-2 border-amber-400 w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6 text-center">
            {/* Close Button */}
            <button
              onClick={() => setBigCardPhrase(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Top Badge */}
            <div className="flex items-center justify-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300">
                📱 현지인에게 화면 보여주기 모드 (Show to Local)
              </span>
            </div>

            {/* Giant Chinese Text */}
            <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/70 border-2 border-amber-200 space-y-3">
              <div className="text-4xl sm:text-5xl font-black text-slate-950 tracking-wider font-sans leading-tight">
                {bigCardPhrase.hanzi}
              </div>
              <div className="text-sm sm:text-base font-bold text-amber-800 font-mono">
                {bigCardPhrase.pinyin}
              </div>
            </div>

            {/* Korean Pronunciation & Meaning */}
            <div className="space-y-1.5">
              <div className="text-base font-black text-slate-900">
                발음: <span className="text-emerald-700 font-mono">"{bigCardPhrase.pronunciation}"</span>
              </div>
              <div className="text-sm font-semibold text-slate-600">
                한국어 뜻: {bigCardPhrase.korean}
              </div>
            </div>

            {/* Big Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => playSpeech(bigCardPhrase.hanzi, 'zh-CN', `big-${bigCardPhrase.id}`)}
                className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-md ${
                  playingId === `big-${bigCardPhrase.id}`
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-sky-600 hover:bg-sky-500 text-white hover:scale-105'
                }`}
              >
                <Volume2 className="w-5 h-5" />
                <span>{playingId === `big-${bigCardPhrase.id}` ? '큰 소리로 읽는 중...' : '🔊 큰 소리로 소리내어 말하기'}</span>
              </button>

              <button
                onClick={() => setBigCardPhrase(null)}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
