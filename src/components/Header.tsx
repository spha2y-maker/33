import React, { useState, useEffect } from 'react';
import { ActiveTab } from '../types';
import { 
  Compass, 
  MapPin, 
  BookOpen, 
  CheckCircle2, 
  Award, 
  Lightbulb, 
  Plane, 
  Clock, 
  Calendar,
  Sparkles,
  CloudSun,
  Camera,
  Bookmark
} from 'lucide-react';
import { TRIP_INFO } from '../data/explorationData';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  stampedCount: number;
  totalSpots: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  stampedCount,
  totalSpots,
}) => {
  const [currentTimeKR, setCurrentTimeKR] = useState<string>('');
  const [currentTimeSH, setCurrentTimeSH] = useState<string>('');

  useEffect(() => {
    const updateTimes = () => {
      const now = new Date();
      
      // Korea time (UTC+9)
      const krString = now.toLocaleTimeString('ko-KR', {
        timeZone: 'Asia/Seoul',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentTimeKR(krString);

      // Shanghai time (UTC+8)
      const shString = now.toLocaleTimeString('zh-CN', {
        timeZone: 'Asia/Shanghai',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentTimeSH(shString);
    };

    updateTimes();
    const interval = setInterval(updateTimes, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'itinerary' as ActiveTab, label: '3박 4일 일정표', icon: Calendar, badge: 'Day 1~4' },
    { id: 'spots' as ActiveTab, label: '8대 방문지 심층 탐구', icon: BookOpen, badge: '교과연계' },
    { id: 'reading' as ActiveTab, label: '『맞바꾼 회중시계』 독서 융합', icon: Bookmark, badge: '독서성찰' },
    { id: 'climate' as ActiveTab, label: '기후·환경 과학 탐구', icon: CloudSun, badge: 'NEW 과학' },
    { id: 'quiz' as ActiveTab, label: '역사·과학 퀴즈 배틀', icon: Lightbulb, badge: 'Quiz' },
    { id: 'passport' as ActiveTab, label: '사진 인증 스탬프 투어', icon: Camera, badge: `${stampedCount}/${totalSpots}` },
    { id: 'workbook' as ActiveTab, label: '나만의 탐구 워크북', icon: CheckCircle2, badge: '저장가능' },
    { id: 'tips' as ActiveTab, label: '생생 회화 & 오디오 툴킷', icon: Compass, badge: '🔊듣기지원' },
  ];

  return (
    <header className="relative bg-white text-slate-800 border-b border-slate-200/90 shadow-sm overflow-hidden font-sans">
      {/* Soft Background Tint */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl" />
        <div className="absolute -top-24 right-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-3 relative z-10">
        {/* Top Info Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sky-700 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200/70">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
              <span>2026 담양여중 글로컬 죽향 역사·문화 탐방</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-600 font-medium">담양여중 ➔ 상하이</span>
            </span>
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600 border border-slate-200">
              <span>LAT 31.23° N</span>
              <span>·</span>
              <span>LON 121.47° E</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Target Group */}
            <div className="hidden md:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs text-emerald-800 font-semibold">
              <span>담양여자중학교(담양여중) 3학년 융합 탐구</span>
            </div>

            {/* Time Zones Widget */}
            <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl shadow-xs font-mono">
              <div className="flex items-center gap-1 text-slate-700">
                <span className="text-slate-400 text-[11px]">한국:</span>
                <span className="font-bold text-slate-900">{currentTimeKR || '12:00:00'}</span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="flex items-center gap-1 text-slate-700">
                <span className="text-slate-400 text-[11px]">상하이:</span>
                <span className="font-bold text-sky-600">{currentTimeSH || '11:00:00'}</span>
                <span className="text-[10px] text-sky-700 bg-sky-100 px-1 py-0.2 rounded">
                  -1h
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Hero Header */}
        <div className="pt-4 pb-2">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
                  3박 4일 글로컬 융합 역사·문화·독서·과학 탐방 가이드
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  📖 『맞바꾼 회중시계』 독서 융합
                </span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>담양여중에서 상하이로 떠나는 역사·독서·과학 탐구</span>
                <span className="text-sky-600">🚀</span>
              </h1>
              
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                임시정부 107주년의 독립 숨결과 『맞바꾼 회중시계』 성찰, 468m 동방명주 스마트 테크, 도시 기후 환경 관측까지 실시간 인터랙티브 워크북
              </p>
            </div>

            {/* Trip Stats Quick Card - Bright Theme */}
            <div className="flex items-center gap-4 bg-slate-50 border border-slate-200/90 rounded-2xl p-4 shadow-sm self-start lg:self-auto min-w-[290px]">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-sm flex-shrink-0">
                <Plane className="w-5 h-5 transform -rotate-45" />
              </div>
              <div className="text-xs space-y-1.5 flex-1">
                <div className="flex justify-between items-center text-slate-800">
                  <span className="font-bold text-slate-900">2026. 10. 13 ~ 10. 16</span>
                  <span className="text-xs font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">3박 4일</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-600">사진 인증 스탬프</span>
                    <span className="text-emerald-700 font-bold">
                      {stampedCount}/{totalSpots} ({Math.round((stampedCount / totalSpots) * 100)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${(stampedCount / totalSpots) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Clean Light Style */}
        <nav className="mt-4 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-150 border cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-sky-600'}`} />
                <span>{item.label}</span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-semibold transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                  }`}
                >
                  {item.badge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
