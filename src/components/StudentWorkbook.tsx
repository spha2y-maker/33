import React, { useState, useEffect } from 'react';
import { SPOTS_DATA } from '../data/explorationData';
import { StudentNote, SpotDetail, StampPhoto, DailyClimateLog, ReadingReflectionData } from '../types';
import { 
  CheckCircle2, 
  FileText, 
  Download, 
  Share2, 
  Sparkles, 
  BookOpen, 
  Award, 
  Trash2, 
  Edit3,
  Camera,
  Printer,
  CloudSun,
  Bookmark,
  Clock,
  ArrowRight
} from 'lucide-react';

interface StudentWorkbookProps {
  studentNotes: Record<string, StudentNote>;
  stampPhotos: Record<string, StampPhoto>;
  climateLogs: DailyClimateLog[];
  onSaveNote: (spotId: string, text: string) => void;
  onOpenDetail: (spot: SpotDetail) => void;
  onNavigateToReading?: () => void;
}

export const StudentWorkbook: React.FC<StudentWorkbookProps> = ({
  studentNotes,
  stampPhotos,
  climateLogs,
  onSaveNote,
  onOpenDetail,
  onNavigateToReading,
}) => {
  const [editingSpotId, setEditingSpotId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [readingReflection, setReadingReflection] = useState<ReadingReflectionData | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('damyang_reading_reflection_v1');
      if (saved) {
        setReadingReflection(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleStartEdit = (spotId: string, currentText: string) => {
    setEditingSpotId(spotId);
    setEditText(currentText || '');
  };

  const handleSave = (spotId: string) => {
    onSaveNote(spotId, editText);
    setEditingSpotId(null);
  };

  const filledNotesCount = (Object.values(studentNotes) as StudentNote[]).filter(
    (n) => n && n.noteText && n.noteText.trim().length > 0
  ).length;

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto font-sans">
      {/* Workbook Top Banner - Bright Theme */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 text-7xl opacity-5 font-black italic select-none pointer-events-none text-sky-600">
          WORKBOOK
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
                개인별 융합 탐구 포트폴리오
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                담양여자중학교 3학년
              </span>
              <span className="text-xs text-slate-500 font-medium">실시간 로컬 자동 저장</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              담양여중 상하이 역사·독서·과학 탐구 워크북
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              각 탐방지에서 관찰하고 사유한 생각, 도서 『맞바꾼 회중시계』 독서 성찰, 현장 사진 인증 내역, 4일간의 기후 관측 결과를 한 권의 종합 포트폴리오로 정리하여 인쇄하거나 보고서로 제출할 수 있습니다.
            </p>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-3 self-start md:self-auto flex-shrink-0">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>워크북 전체 인쇄 / PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Snapshots Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 flex-shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">탐구 노트 작성</div>
            <div className="text-lg font-black text-slate-900">
              {filledNotesCount} / {SPOTS_DATA.length}곳 작성
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">현장 사진 인증</div>
            <div className="text-lg font-black text-slate-900">
              {Object.keys(stampPhotos).length} / {SPOTS_DATA.length}곳 인증
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0">
            <Bookmark className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">『맞바꾼 회중시계』</div>
            <div className="text-sm font-black text-slate-900">
              {readingReflection?.activity4_letter ? '성찰 작성 완료' : '독서 성찰 진행중'}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 flex-shrink-0">
            <CloudSun className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">기후·환경 일지</div>
            <div className="text-lg font-black text-slate-900">
              4일간 과학 관측
            </div>
          </div>
        </div>
      </div>

      {/* Featured Book Activity Highlight Card */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-100/30 to-sky-50 rounded-3xl border border-amber-200/90 p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-sm flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                국어·도덕·역사 융합
              </span>
              <span className="text-xs font-bold text-slate-700">도서 『맞바꾼 회중시계』 성찰 워크북</span>
            </div>
            <h4 className="text-base font-black text-slate-900">
              윤봉길 의사의 마지막 1시간과 내가 지킬 소중한 가치
            </h4>
            <p className="text-xs text-slate-600 max-w-xl">
              1932년 홍커우 공원 거사 전 김구 선생과 맞바꾼 회중시계의 숭고한 약속을 4단계 성찰 활동으로 작성하세요.
            </p>
          </div>
        </div>

        {onNavigateToReading && (
          <button
            onClick={onNavigateToReading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer flex-shrink-0"
          >
            <span>독서 워크북 열기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Spots Notes List */}
      <div className="space-y-4">
        {SPOTS_DATA.map((spot, idx) => {
          const note = studentNotes[spot.id];
          const hasNote = note && note.noteText && note.noteText.trim().length > 0;
          const photo = stampPhotos[spot.id];
          const isEditing = editingSpotId === spot.id;

          return (
            <div
              key={spot.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{spot.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        DAY 0{spot.day} · NO.0{idx + 1}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base">{spot.name}</h3>
                    </div>
                    <span className="text-xs text-slate-500">{spot.locationDesc}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {photo && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5" /> 사진 인증완료
                    </span>
                  )}
                  <button
                    onClick={() => onOpenDetail(spot)}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                  >
                    상세 탐구
                  </button>
                </div>
              </div>

              {/* Spot Mission Instruction */}
              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <strong>💡 탐구 미션:</strong> {spot.missionPrompt.instruction}
              </div>

              {/* Photo Preview if uploaded */}
              {photo && (
                <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <img
                    src={photo.photoUrl}
                    alt={spot.name}
                    className="w-20 h-14 object-cover rounded-lg border border-slate-200 flex-shrink-0"
                  />
                  <div className="text-xs space-y-0.5">
                    <div className="font-bold text-slate-800">{photo.caption || '현장 인증 사진'}</div>
                    <div className="text-[11px] text-slate-500">인증시각: {photo.stampedAt}</div>
                  </div>
                </div>
              )}

              {/* Note Content / Editor */}
              <div>
                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                      className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-sky-500 leading-relaxed font-sans"
                      placeholder={spot.missionPrompt.placeholder}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingSpotId(null)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                      >
                        취소
                      </button>
                      <button
                        onClick={() => handleSave(spot.id)}
                        className="px-4 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold cursor-pointer"
                      >
                        저장
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="group/note flex items-start justify-between gap-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm">
                    <div className="flex-1">
                      {hasNote ? (
                        <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">
                          {note.noteText}
                        </p>
                      ) : (
                        <p className="text-slate-400 italic">
                          아직 작성된 탐구 노트가 없습니다. 클릭하여 소감을 기록해보세요.
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleStartEdit(spot.id, note?.noteText || '')}
                      className="p-1.5 text-slate-400 hover:text-sky-600 rounded-lg hover:bg-white transition cursor-pointer"
                      title="노트 수정"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
