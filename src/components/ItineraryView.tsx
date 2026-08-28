import React, { useState } from 'react';
import { ITINERARY_DATA, SPOTS_DATA } from '../data/explorationData';
import { DaySchedule, ScheduleItem, SpotDetail } from '../types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Bus, 
  Utensils, 
  Hotel, 
  BookOpen, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight,
  Plane,
  Camera,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ItineraryViewProps {
  onOpenDetail: (spot: SpotDetail) => void;
  onOpenAudio: (spot: SpotDetail) => void;
  stampedSpots: Record<string, boolean>;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  onOpenDetail,
  onOpenAudio,
  stampedSpots,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(1);

  const currentDayData = ITINERARY_DATA.find((d) => d.day === selectedDay) || ITINERARY_DATA[0];

  const getCategoryBadge = (cat?: string) => {
    switch (cat) {
      case 'history':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">역사·독립</span>;
      case 'tech':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-200">과학·미래</span>;
      case 'culture':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">전통·문화</span>;
      case 'global':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">글로벌IP</span>;
      case 'transport':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">교통·이동</span>;
      case 'meal':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-orange-50 text-orange-800 border border-orange-200">식사</span>;
      case 'hotel':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">숙소</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto font-sans">
      {/* Top Banner - Bright Theme */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 text-7xl opacity-5 font-black italic select-none pointer-events-none text-sky-600">
          SCHEDULE
        </div>
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
              3박 4일 종합 탐방 로드맵
            </span>
            <span className="text-xs text-slate-500 font-medium">담양여자중학교 (담양여중) 중3 융합 탐방</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            시간대별 상세 일정 및 필수 미션
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            일자별 탭을 클릭하여 주요 방문지, 식사 계획, 이동 수단 및 연계 교과 미션을 확인하세요. 방문지 카드의 [탐구 & 사진 인증] 버튼을 누르면 상세 설명과 사진 인증을 진행할 수 있습니다.
          </p>
        </div>
      </div>

      {/* 4-Day Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ITINERARY_DATA.map((day) => {
          const isSelected = day.day === selectedDay;
          return (
            <button
              key={day.day}
              onClick={() => setSelectedDay(day.day)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-white border-sky-500 shadow-md ring-2 ring-sky-500/20'
                  : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  DAY 0{day.day}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {day.date.split('.')[1]}.{day.date.split('.')[2].trim()} ({day.dayOfWeek[0]})
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate mt-1">
                {day.theme}
              </h4>
              <p className="text-[11px] text-slate-500 truncate mt-0.5">
                {day.subtitle}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Day Overview Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Day Header Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-700">
              <Calendar className="w-4 h-4" />
              <span>{currentDayData.date} {currentDayData.dayOfWeek}</span>
              <span className="text-slate-300">|</span>
              <span>DAY 0{currentDayData.day}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              {currentDayData.theme}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              {currentDayData.subtitle}
            </p>
          </div>

          {/* Transportation Info */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl text-xs text-slate-700 font-medium self-start md:self-auto">
            <Bus className="w-4 h-4 text-sky-600 flex-shrink-0" />
            <span>이동: {currentDayData.transport}</span>
          </div>
        </div>

        {/* Meals & Hotel Info Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
              <Utensils className="w-3.5 h-3.5 text-amber-500" />
              <span>조식 (Breakfast)</span>
            </div>
            <div className="font-bold text-slate-800">{currentDayData.meals.breakfast}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
              <Utensils className="w-3.5 h-3.5 text-orange-500" />
              <span>중식 (Lunch)</span>
            </div>
            <div className="font-bold text-slate-800">{currentDayData.meals.lunch}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
              <Utensils className="w-3.5 h-3.5 text-red-500" />
              <span>석식 (Dinner)</span>
            </div>
            <div className="font-bold text-slate-800">{currentDayData.meals.dinner}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
              <Hotel className="w-3.5 h-3.5 text-indigo-500" />
              <span>숙소 (Hotel)</span>
            </div>
            <div className="font-bold text-slate-800 truncate">{currentDayData.hotel}</div>
          </div>
        </div>

        {/* Timeline Items List */}
        <div className="space-y-4 pt-2">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-600" />
            <span>시간대별 세부 일정 및 방문지</span>
          </h4>

          <div className="space-y-3 relative before:absolute before:inset-0 before:left-6 before:w-0.5 before:bg-slate-200 before:pointer-events-none">
            {currentDayData.items.map((item, idx) => {
              const spot = item.spotId ? SPOTS_DATA.find((s) => s.id === item.spotId) : null;
              const isStamped = spot ? (stampedSpots[spot.id] || false) : false;

              return (
                <div
                  key={idx}
                  className="relative flex items-start gap-4 p-4 rounded-2xl bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 transition-colors"
                >
                  {/* Timeline Dot */}
                  <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center text-xs font-mono font-bold text-slate-800 flex-shrink-0 shadow-xs z-10">
                    <span className="text-[10px] text-slate-400">TIME</span>
                    <span className="text-[11px] text-sky-700">{item.time}</span>
                  </div>

                  {/* Content Area */}
                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {getCategoryBadge(item.category)}
                      <h5 className="font-bold text-slate-900 text-sm sm:text-base">
                        {item.activity}
                      </h5>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.location}</span>
                    </div>

                    {item.description && (
                      <p className="text-xs text-slate-600 leading-relaxed pt-1">
                        {item.description}
                      </p>
                    )}

                    {/* If this item is one of our 8 Core Spots */}
                    {spot && (
                      <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{spot.emoji}</span>
                          <div>
                            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{spot.name}</span>
                              {isStamped && (
                                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                                  인증완료 ✓
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500">{spot.badge}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onOpenAudio(spot)}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                            title="오디오 가이드 듣기"
                          >
                            <Volume2 className="w-4 h-4 text-sky-600" />
                          </button>
                          <button
                            onClick={() => onOpenDetail(spot)}
                            className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <span>탐구 & 사진 인증</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
