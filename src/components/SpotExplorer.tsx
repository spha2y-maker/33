import React, { useState, useMemo } from 'react';
import { SpotDetail, StudentNote } from '../types';
import { SPOTS_DATA } from '../data/explorationData';
import { SpotCard } from './SpotCard';
import { Search, Filter, Sparkles, BookOpen, Layers, Award } from 'lucide-react';

interface SpotExplorerProps {
  studentNotes: Record<string, StudentNote>;
  onOpenDetail: (spot: SpotDetail) => void;
  onOpenAudio: (spot: SpotDetail) => void;
}

export const SpotExplorer: React.FC<SpotExplorerProps> = ({
  studentNotes,
  onOpenDetail,
  onOpenAudio,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: '전체 보기' },
    { id: 'history', label: '🇰🇷 독립운동과 역사' },
    { id: 'tech', label: '🚀 미래·과학기술' },
    { id: 'culture', label: '🏯 전통·공간미학' },
    { id: 'global', label: '🌐 글로벌 콘텐츠' },
  ];

  const filteredSpots = useMemo(() => {
    return SPOTS_DATA.filter((spot) => {
      // Category filter
      if (selectedCategory !== 'all' && spot.category !== selectedCategory) {
        return false;
      }
      // Day filter
      if (selectedDay !== 'all' && spot.day.toString() !== selectedDay) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = spot.name.toLowerCase().includes(q);
        const matchSummary = spot.summary.toLowerCase().includes(q);
        const matchCurr = spot.curriculum.some(
          (c) => c.subject.toLowerCase().includes(q) || c.topic.toLowerCase().includes(q)
        );
        const matchHist = spot.koreaHistoryRelation.content.some((c) => c.toLowerCase().includes(q));
        return matchName || matchSummary || matchCurr || matchHist;
      }
      return true;
    });
  }, [selectedCategory, selectedDay, searchQuery]);

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* Section Top Header - Bright Theme */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 text-7xl opacity-5 font-black italic select-none pointer-events-none text-sky-600">
          EXPLORE
        </div>
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
              8대 핵심 탐방지 아카이브
            </span>
            <span className="text-xs text-slate-500 font-medium">담양여중 중3 교과·독서 융합 탐구</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            100년 전 독립의 열망 × 『맞바꾼 회중시계』 × 미래 과학기술 혁신
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            영안백화점 옥상정원의 통합임시정부부터 황포탄 의거, 『맞바꾼 회중시계』의 무대 홍커우 공원, 468m 동방명주와 과학기술관, 디즈니랜드까지 중3 교과 융합 탐구 과제를 탐험해보세요.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="방문지명, 역사 인물(김구, 윤봉길, 회중시계), 교과(역사, 독서, 과학) 검색..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-sky-500 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition font-sans"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Day Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <span className="text-slate-500 px-1.5 font-bold text-xs">일차:</span>
            {['all', '1', '2', '3'].map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer text-xs ${
                  selectedDay === d
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {d === 'all' ? '전체' : `Day ${d}`}
              </button>
            ))}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Spots Grid */}
      {filteredSpots.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">일치하는 탐방지가 없습니다.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedDay('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-500 transition"
          >
            필터 초기화
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSpots.map((spot) => (
            <SpotCard
              key={spot.id}
              spot={spot}
              isStamped={studentNotes[spot.id]?.stamped || false}
              onOpenDetail={onOpenDetail}
              onOpenAudio={onOpenAudio}
            />
          ))}
        </div>
      )}
    </div>
  );
};
