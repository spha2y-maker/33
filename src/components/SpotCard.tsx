import React from 'react';
import { SpotDetail } from '../types';
import { 
  Volume2, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  MapPin, 
  Sparkles,
  Award,
  Camera
} from 'lucide-react';

interface SpotCardProps {
  spot: SpotDetail;
  isStamped: boolean;
  onOpenDetail: (spot: SpotDetail) => void;
  onOpenAudio: (spot: SpotDetail) => void;
}

export const SpotCard: React.FC<SpotCardProps> = ({
  spot,
  isStamped,
  onOpenDetail,
  onOpenAudio,
}) => {
  const categoryColors = {
    history: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    tech: 'bg-sky-50 text-sky-800 border-sky-200',
    culture: 'bg-amber-50 text-amber-800 border-amber-200',
    global: 'bg-purple-50 text-purple-800 border-purple-200',
  };

  const categoryLabels = {
    history: '🇰🇷 독립운동·역사',
    tech: '🚀 미래·과학기술',
    culture: '🏯 전통·공간미학',
    global: '🌐 글로벌 콘텐츠',
  };

  return (
    <div className="group bg-white hover:bg-white border border-slate-200 hover:border-sky-300 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col relative font-sans">
      {/* Top Image & Overlay */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={spot.heroImage}
          alt={spot.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/95 text-slate-800 shadow-sm">
            DAY 0{spot.day}
          </span>

          <div className="flex items-center gap-2">
            {isStamped ? (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" /> 인증완료
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/60 text-white/90">
                사진인증 대기
              </span>
            )}
          </div>
        </div>

        {/* Bottom Title on Image */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xl">{spot.emoji}</span>
            <span className="text-xs text-sky-200 font-medium">{spot.chineseName}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
            {spot.name}
          </h3>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Category & Badge */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${categoryColors[spot.category]}`}>
              {categoryLabels[spot.category]}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {spot.badge}
            </span>
          </div>

          {/* Summary Text */}
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {spot.summary}
          </p>

          {/* Key Subject Badges */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
            {spot.curriculum.map((c, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-50 border border-slate-200 text-slate-600 font-medium"
              >
                #{c.subject} · {c.topic.split(',')[0]}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <button
            onClick={() => onOpenAudio(spot)}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition border border-slate-200 cursor-pointer"
            title="1분 오디오 해설 듣기"
          >
            <Volume2 className="w-4 h-4 text-sky-600" />
            <span className="hidden sm:inline">오디오</span>
          </button>

          <button
            onClick={() => onOpenDetail(spot)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shadow-sm"
          >
            <BookOpen className="w-4 h-4" />
            <span>탐구 & 사진 인증</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
