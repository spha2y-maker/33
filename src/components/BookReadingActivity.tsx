import React, { useState, useEffect } from 'react';
import { ReadingReflectionData, SpotDetail } from '../types';
import { 
  BookOpen, 
  Clock, 
  Heart, 
  Sparkles, 
  Save, 
  Printer, 
  Share2, 
  CheckCircle2, 
  Quote, 
  Star, 
  Send, 
  MapPin, 
  Award,
  HelpCircle,
  Flame,
  Bookmark
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookReadingActivityProps {
  onOpenSpotDetail?: (spotId: string) => void;
}

const DEFAULT_REFLECTION: ReadingReflectionData = {
  bookTitle: '맞바꾼 회중시계',
  author: '역사 교과 융합 추천도서',
  studentSchool: '담양여자중학교 3학년',
  studentName: '',
  activity1_empathy: '',
  activity2_value: '',
  activity3_quote: '“선생님, 제 시계는 6원짜리이고 선생님 시계는 2원짜리입니다. 제 시계는 이제 1시간밖에 쓸모가 없으니 바꾸어 주십시오. 훗날 지하에서 다시 만납시다.”',
  activity3_review: '',
  activity3_rating: 5,
  activity4_letter: '',
  updatedAt: new Date().toISOString(),
};

const STORAGE_KEY = 'damyang_reading_reflection_v1';

export const BookReadingActivity: React.FC<BookReadingActivityProps> = ({
  onOpenSpotDetail,
}) => {
  const [reflection, setReflection] = useState<ReadingReflectionData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load reading reflection', e);
      }
    }
    return DEFAULT_REFLECTION;
  });

  const [saveStatus, setSaveStatus] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'guide' | 'write' | 'preview'>('write');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reflection));
  }, [reflection]);

  const handleChange = (field: keyof ReadingReflectionData, value: any) => {
    setReflection((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString(),
    }));
    setSaveStatus('자동 저장됨');
    setTimeout(() => setSaveStatus(''), 2500);
  };

  const handleManualSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reflection));
    setSaveStatus('성공적으로 저장되었습니다!');
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
    });
    setTimeout(() => setSaveStatus(''), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Completion calculation
  const isAct1Done = reflection.activity1_empathy.trim().length >= 20;
  const isAct2Done = reflection.activity2_value.trim().length >= 20;
  const isAct3Done = reflection.activity3_review.trim().length >= 20;
  const isAct4Done = reflection.activity4_letter.trim().length >= 30;
  const completedCount = [isAct1Done, isAct2Done, isAct3Done, isAct4Done].filter(Boolean).length;
  const progressPercent = Math.round((completedCount / 4) * 100);

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-amber-500/10 via-amber-100/30 to-sky-50 p-6 sm:p-8 rounded-3xl border border-amber-200/80 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 text-7xl opacity-5 font-black italic select-none pointer-events-none text-amber-900">
          READING
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
                📖 국어·도덕·역사 융합 독서 프로젝트
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                담양여자중학교 3학년
              </span>
              <span className="text-xs text-slate-500 font-medium">루쉰공원(매헌기념관) 연계</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>도서 『맞바꾼 회중시계』 독서 성찰 워크북</span>
              <span className="text-amber-600">🕰️</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              1932년 4월 29일 새벽, 백범 김구 선생과 25세 청년 윤봉길 의사가 마지막으로 맞바꾼 회중시계의 숭고한 약속을 읽고, 내가 살아갈 삶의 소중한 가치와 자유의 의미를 4단계 성찰 활동으로 기록합니다.
            </p>
          </div>

          {/* Action Button Group */}
          <div className="flex items-center gap-2 self-start md:self-auto flex-shrink-0">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-xs transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>독서 활동지 인쇄</span>
            </button>
            <button
              onClick={handleManualSave}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-sm transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>저장하기</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-4 border-t border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <span className="font-bold text-amber-900">성찰 활동 완성도:</span>
            <div className="w-36 h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-mono font-bold text-amber-700">{progressPercent}%</span>
            <span className="text-slate-400">({completedCount}/4 완료)</span>
          </div>

          {saveStatus && (
            <div className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{saveStatus}</span>
            </div>
          )}
        </div>
      </div>

      {/* Historical Storytelling Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Watch Visual / Cultural Asset Badge */}
          <div className="w-full lg:w-72 bg-gradient-to-b from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-5 flex flex-col items-center text-center flex-shrink-0">
            <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-400/40 flex items-center justify-center text-amber-700 mb-3 shadow-inner">
              <Clock className="w-10 h-10 animate-spin-slow" />
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-200 text-amber-900 mb-1.5">
              국가등록문화재 제441-1호, 2호
            </span>
            <h4 className="text-base font-black text-slate-900 mb-1">
              김구·윤봉길의 맞바꾼 회중시계
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              1932년 4월 29일, 상하이 훙커우 거사 직전 교환된 불멸의 애국혼과 약속의 상징
            </p>

            <div className="mt-4 pt-3 border-t border-amber-200/70 w-full text-left space-y-1.5 text-[11px] text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500">윤봉길의 새 시계:</span>
                <span className="font-bold text-amber-800">6원 (스위스제)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">김구의 헌 시계:</span>
                <span className="font-bold text-slate-700">2원 (낡은 시계)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">남은 시간의 가치:</span>
                <span className="font-bold text-red-600">마지막 1시간</span>
              </div>
            </div>
          </div>

          {/* Historical Narrative & Quote */}
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2">
              <Quote className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-black text-slate-900">
                『백범일지』에 기록된 그날 새벽의 가슴 벅찬 약속
              </h3>
            </div>

            <div className="bg-amber-50/70 border-l-4 border-amber-500 p-4 rounded-r-2xl text-xs sm:text-sm text-slate-800 leading-relaxed italic">
              "선생님, 제 시계는 어제 6원을 주고 산 새 시계이고, 선생님 시계는 2원짜리 낡은 시계입니다. 
              <strong> 제 시계는 이제 앞으로 1시간밖에 쓸모가 없습니다.</strong> 
              선생님께서는 이 시계를 차시고 조국의 독립을 끝까지 이끌어 주십시오. 
              훗날 지하에서 다시 만납시다."
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              도서 『맞바꾼 회중시계』는 스물다섯 살 청년 윤봉길 의사가 백범 김구 선생과 나눈 이 숭고한 약속을 통해, 한 인간이 조국과 인류의 자유를 위해 자신의 가장 젊은 시절과 마지막 1시간을 어떻게 바쳤는지를 생생하게 전해줍니다. 이번 상하이 탐방에서 루쉰공원(매헌기념관)을 방문하기 전, 이 책을 통해 마음에 깊은 울림을 남겨보세요.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => onOpenSpotDetail && onOpenSpotDetail('luxun_park')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200 transition cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>루쉰공원 (매헌 윤봉길 기념관) 정보 바로보기</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Student Identity Form */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
            소속
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">학교 및 학년</div>
            <input
              type="text"
              value={reflection.studentSchool}
              onChange={(e) => handleChange('studentSchool', e.target.value)}
              className="font-bold text-slate-900 text-sm bg-transparent border-b border-dashed border-slate-300 focus:border-sky-500 focus:outline-none"
              placeholder="예: 담양여자중학교 3학년"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs flex-shrink-0">
            성명
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">작성자 학생 성명</div>
            <input
              type="text"
              value={reflection.studentName}
              onChange={(e) => handleChange('studentName', e.target.value)}
              className="font-bold text-slate-900 text-sm bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 focus:border-emerald-500 focus:outline-none min-w-[140px]"
              placeholder="이름 입력 (예: 김담양)"
            />
          </div>
        </div>
      </div>

      {/* 4 Interactive Activities Grid */}
      <div className="space-y-6">
        {/* Activity 1: Empathy & Time Value */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-amber-500 text-white font-black text-xs flex items-center justify-center">
                1
              </span>
              <div>
                <h4 className="text-base sm:text-lg font-black text-slate-900">
                  [역사적 공감과 시간의 가치] 나의 1시간과 윤봉길 의사의 1시간
                </h4>
                <p className="text-xs text-slate-500">
                  국어·역사 교과 융합 | 역사적 인물의 심경 상상 및 시간의 소중함 탐색
                </p>
              </div>
            </div>
            {isAct1Done ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 완료
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                작성 중
              </span>
            )}
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
            💡 <strong>탐구 질문:</strong> 윤봉길 의사는 자신의 남은 1시간을 6원짜리 시계와 함께 김구 선생께 맡겼습니다. 여러분에게 주어진 일상 속 '1시간'은 어떤 의미인가요? 25세 청년 윤봉길이 목숨과 바꾼 그 1시간의 결단에 대해 느낀 점을 자유롭게 적어보세요.
          </div>

          <textarea
            rows={4}
            value={reflection.activity1_empathy}
            onChange={(e) => handleChange('activity1_empathy', e.target.value)}
            placeholder="예: 평소 무심코 흘려보내던 1시간이 누군가에게는 조국의 100년 미래를 바꾼 마지막 1시간이었다는 사실에 큰 전율을 느꼈습니다. 윤봉길 의사님의 1시간은..."
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-amber-500 focus:outline-none transition leading-relaxed"
          />
          <div className="text-right text-[11px] text-slate-400">
            {reflection.activity1_empathy.length}자 작성 (권장 50자 이상)
          </div>
        </div>

        {/* Activity 2: Core Value Exploration */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-sky-600 text-white font-black text-xs flex items-center justify-center">
                2
              </span>
              <div>
                <h4 className="text-base sm:text-lg font-black text-slate-900">
                  [가치 탐구와 신념] 내가 세상과 맞바꾸고 싶은 소중한 가치
                </h4>
                <p className="text-xs text-slate-500">
                  도덕·사회 교과 융합 | 공동체적 가치와 개인의 인생 신념 정립
                </p>
              </div>
            </div>
            {isAct2Done ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 완료
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                작성 중
              </span>
            )}
          </div>

          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
            💡 <strong>탐구 질문:</strong> 윤봉길 의사에게 회중시계는 단순한 시계가 아닌 '조국의 독립과 평화'라는 절대적 신념이었습니다. 담양여중 학생으로서 여러분이 살아가면서 개인의 편안함보다 더 소중하게 지키고 싶은 가치(예: 정의, 배려, 이웃 사랑, 진실, 평화)는 무엇인가요?
          </div>

          <textarea
            rows={4}
            value={reflection.activity2_value}
            onChange={(e) => handleChange('activity2_value', e.target.value)}
            placeholder="예: 제가 세상과 맞바꾸어 지키고 싶은 가치는 '이웃에 대한 따뜻한 정의와 배려'입니다. 윤봉길 의사께서 자신의 안락한 삶을 포기하고..."
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-sky-500 focus:outline-none transition leading-relaxed"
          />
          <div className="text-right text-[11px] text-slate-400">
            {reflection.activity2_value.length}자 작성 (권장 50자 이상)
          </div>
        </div>

        {/* Activity 3: Book Review & Golden Quote */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-purple-600 text-white font-black text-xs flex items-center justify-center">
                3
              </span>
              <div>
                <h4 className="text-base sm:text-lg font-black text-slate-900">
                  [독서 서평과 명문장] 마음에 새긴 한 구절 & 나만의 한 줄 서평
                </h4>
                <p className="text-xs text-slate-500">
                  국어 교과 연계 | 핵심 구절 발췌 및 비판적·감상적 서평 작성
                </p>
              </div>
            </div>
            {isAct3Done ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 완료
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                작성 중
              </span>
            )}
          </div>

          {/* Rating Selection */}
          <div className="flex items-center gap-3 bg-purple-50/60 p-3 rounded-xl border border-purple-100">
            <span className="text-xs font-bold text-purple-900">담양여중 추천 별점:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleChange('activity3_rating', star)}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= reflection.activity3_rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-amber-800 font-mono">
              {reflection.activity3_rating}.0 / 5.0
            </span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Quote className="w-3.5 h-3.5 text-purple-600" />
              <span>가장 인상 깊었던 책 속 명구절</span>
            </label>
            <input
              type="text"
              value={reflection.activity3_quote}
              onChange={(e) => handleChange('activity3_quote', e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-purple-500 focus:outline-none"
              placeholder="인상 깊은 대사 또는 문장"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-purple-600" />
              <span>담양여중 친구들에게 전하는 한 줄 서평 & 감상평</span>
            </label>
            <textarea
              rows={3}
              value={reflection.activity3_review}
              onChange={(e) => handleChange('activity3_review', e.target.value)}
              placeholder="예: 상하이 홍커우 공원에 가기 전 반드시 읽어야 할 책! 6원짜리 시계에 담긴 청년의 눈물과 용기가 오늘을 살아가는 우리에게 큰 용기를 줍니다."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-purple-500 focus:outline-none transition leading-relaxed"
            />
          </div>
        </div>

        {/* Activity 4: Letter to Martyr Yoon Bong-gil */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                4
              </span>
              <div>
                <h4 className="text-base sm:text-lg font-black text-slate-900">
                  [감사와 다짐의 편지] 2026년 담양여중 학생이 1932년 윤봉길 의사께 보내는 글
                </h4>
                <p className="text-xs text-slate-500">
                  국어·역사·인성 융합 | 미래 세대로서의 역사 계승 의지 및 감사의 표현
                </p>
              </div>
            </div>
            {isAct4Done ? (
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 완료
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                작성 중
              </span>
            )}
          </div>

          <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200/80 text-xs text-slate-700 leading-relaxed">
            💌 <strong>편지 쓰기 가이드:</strong> 1932년 상하이에서 불꽃처럼 살다 간 25세 청년 윤봉길 의사님께, 2026년 오늘 자유로운 대한민국에서 꿈을 키우고 있는 담양여자중학교 후배로서 감사한 마음과 앞으로 어떤 인재로 성장하겠다는 다짐을 정성껏 편지로 남겨보세요.
          </div>

          <div className="relative">
            <textarea
              rows={6}
              value={reflection.activity4_letter}
              onChange={(e) => handleChange('activity4_letter', e.target.value)}
              placeholder={`윤봉길 의사님께,\n\n안녕하세요. 저는 2026년 전남 담양여자중학교 3학년에 재학 중인 학생입니다.\n이번 상하이 탐방을 준비하며 도서 『맞바꾼 회중시계』를 읽고 의사님의 숭고한 결의를 마주했습니다.\n\n의사님께서 마지막 1시간을 바쳐 지켜주신 이 자유로운 조국에서 저희는 소중한 꿈을 키워가고 있습니다...\n\n- 2026년 담양여자중학교 후배 올림`}
              className="w-full p-5 bg-emerald-50/20 border border-emerald-200/80 rounded-2xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:border-emerald-500 focus:outline-none transition leading-relaxed font-sans"
            />
          </div>
          <div className="text-right text-[11px] text-slate-400">
            {reflection.activity4_letter.length}자 작성 (권장 100자 이상)
          </div>
        </div>
      </div>

      {/* Printable Report Summary Section (Visible & Print-Ready) */}
      <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-black text-slate-900">
              담양여자중학교 독서 융합 탐구 포트폴리오 요약
            </h3>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>보고서 출력 / PDF 저장</span>
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 text-xs sm:text-sm text-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-100 font-medium">
            <div><strong>도서명:</strong> 『맞바꾼 회중시계』</div>
            <div><strong>연계 장소:</strong> 상하이 루쉰공원(매헌 윤봉길 기념관)</div>
            <div><strong>학교:</strong> {reflection.studentSchool || '담양여자중학교 3학년'}</div>
            <div><strong>학생명:</strong> {reflection.studentName || '(이름 미입력)'}</div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="font-bold text-slate-900 text-xs uppercase text-amber-800 mb-1">
                1. 역사적 공감과 시간의 가치
              </div>
              <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs leading-relaxed text-slate-800 whitespace-pre-wrap">
                {reflection.activity1_empathy || '아직 작성되지 않았습니다.'}
              </p>
            </div>

            <div>
              <div className="font-bold text-slate-900 text-xs uppercase text-sky-800 mb-1">
                2. 지키고 싶은 삶의 소중한 가치
              </div>
              <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs leading-relaxed text-slate-800 whitespace-pre-wrap">
                {reflection.activity2_value || '아직 작성되지 않았습니다.'}
              </p>
            </div>

            <div>
              <div className="font-bold text-slate-900 text-xs uppercase text-purple-800 mb-1">
                3. 한 줄 서평 ({reflection.activity3_rating}점)
              </div>
              <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs leading-relaxed text-slate-800">
                "{reflection.activity3_quote}"<br />
                <span className="text-slate-600 font-normal mt-1 block">
                  {reflection.activity3_review || '아직 작성되지 않았습니다.'}
                </span>
              </p>
            </div>

            <div>
              <div className="font-bold text-slate-900 text-xs uppercase text-emerald-800 mb-1">
                4. 윤봉길 의사께 보내는 감사 편지
              </div>
              <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs leading-relaxed text-slate-800 whitespace-pre-wrap font-sans">
                {reflection.activity4_letter || '아직 작성되지 않았습니다.'}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400">
            <span>2026 담양교육지원청 · 담양여자중학교 글로컬 인재 육성 프로젝트</span>
            <span>최종 갱신: {new Date(reflection.updatedAt).toLocaleDateString('ko-KR')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
