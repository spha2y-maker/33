import React, { useState, useRef } from 'react';
import { SPOTS_DATA } from '../data/explorationData';
import { SpotDetail, StampPhoto } from '../types';
import { 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Download, 
  Camera, 
  Upload, 
  RotateCcw, 
  MapPin, 
  Calendar,
  User,
  GraduationCap,
  Image as ImageIcon,
  Check,
  Trash2,
  Maximize2,
  X,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StampPassportProps {
  stampedSpots: Record<string, boolean>;
  stampPhotos: Record<string, StampPhoto>;
  onSaveStampPhoto: (spotId: string, photoUrl: string, caption?: string) => void;
  onRemoveStampPhoto: (spotId: string) => void;
  onToggleStamp: (spotId: string) => void;
  onOpenDetail: (spot: SpotDetail) => void;
}

export const StampPassport: React.FC<StampPassportProps> = ({
  stampedSpots,
  stampPhotos,
  onSaveStampPhoto,
  onRemoveStampPhoto,
  onToggleStamp,
  onOpenDetail,
}) => {
  const [studentName, setStudentName] = useState<string>('담양여중 탐방대원');
  const [studentSchool, setStudentSchool] = useState<string>('담양여자중학교 3학년');
  const [showCertificate, setShowCertificate] = useState<boolean>(false);
  const [selectedPhotoSpot, setSelectedPhotoSpot] = useState<SpotDetail | null>(null);
  const [previewPhotoModal, setPreviewPhotoModal] = useState<StampPhoto | null>(null);
  const [customCaption, setCustomCaption] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingSpotId, setUploadingSpotId] = useState<string | null>(null);

  const stampedCount = Object.values(stampedSpots).filter(Boolean).length;
  const isAllCompleted = stampedCount === SPOTS_DATA.length;

  const handleCelebrateAll = () => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
    });
    setShowCertificate(true);
  };

  // Handle Photo File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !uploadingSpotId) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      onSaveStampPhoto(uploadingSpotId, dataUrl, customCaption || '현장 방문 실시간 인증');
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
      setUploadingSpotId(null);
      setSelectedPhotoSpot(null);
      setCustomCaption('');
    };
    reader.readAsDataURL(file);
  };

  // Quick Sample Photo Loader for testing in preview
  const handleUseSamplePhoto = (spot: SpotDetail) => {
    onSaveStampPhoto(
      spot.id,
      spot.heroImage,
      `${spot.name} 현장 탐방 인증 완료`
    );
    confetti({
      particleCount: 60,
      spread: 55,
      origin: { y: 0.6 },
    });
    setSelectedPhotoSpot(null);
    setCustomCaption('');
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto font-sans">
      {/* Hidden File Input for Camera / File Upload */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Passport Header Banner - Bright Atmosphere */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 text-7xl opacity-5 font-black italic select-none pointer-events-none text-emerald-600">
          PASSPORT
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                📸 현장 사진 인증 스탬프 투어
              </span>
              <span className="text-xs text-slate-500 font-medium">8대 탐방지 실시간 인증</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>2026 죽향 글로벌 탐방단 모바일 여권</span>
              <span className="text-emerald-600">🛂</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              각 탐방지에 도착하여 직접 촬영한 <strong>현장 인증 사진을 업로드</strong>하면 실시간 GPS 기반 디지털 스탬프가 날인됩니다. 8곳의 사진을 모두 모아 <strong>[글로컬 역사문화 마스터 수료증]</strong>을 발급받으세요!
            </p>
          </div>

          {/* Progress Box */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-4 self-start md:self-auto shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-black text-emerald-600">
                {stampedCount} / {SPOTS_DATA.length}
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">인증 완료</span>
            </div>

            {isAllCompleted ? (
              <button
                onClick={handleCelebrateAll}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Award className="w-4 h-4" />
                <span>수료증 발급</span>
              </button>
            ) : (
              <span className="text-xs text-slate-600 bg-white px-3 py-2 rounded-xl border border-slate-200 font-medium">
                {SPOTS_DATA.length - stampedCount}곳 남음
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Student Profile Card (Editable) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 text-xl shadow-sm flex-shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div className="flex-1 sm:flex-initial space-y-1">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="학생 성명"
                className="font-bold text-sm text-slate-900 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 w-36"
              />
              <span className="text-xs text-slate-500 font-semibold">탐방대원</span>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <input
                type="text"
                value={studentSchool}
                onChange={(e) => setStudentSchool(e.target.value)}
                placeholder="소속 학교 및 학년"
                className="text-xs text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 focus:outline-none focus:border-emerald-500 w-44"
              />
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-600 flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 font-medium">
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span>탐방 기간: 2026.10.13 ~ 10.16 (3박 4일)</span>
        </div>
      </div>

      {/* 8 Passport Spots Grid with Photo Capture Verification */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SPOTS_DATA.map((spot, idx) => {
          const isStamped = stampedSpots[spot.id] || false;
          const photo = stampPhotos[spot.id];

          return (
            <div
              key={spot.id}
              className={`p-4 rounded-2xl border transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
                isStamped
                  ? 'bg-white border-emerald-300 shadow-md ring-1 ring-emerald-400/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              {/* Day Badge & Stamp Status Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  DAY 0{spot.day} · NO.0{idx + 1}
                </span>

                {isStamped ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    인증완료
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    미인증
                  </span>
                )}
              </div>

              {/* Photo Display / Upload Frame */}
              <div className="my-2">
                {isStamped && photo ? (
                  <div className="relative rounded-xl overflow-hidden aspect-video border border-emerald-200 bg-slate-100 group">
                    <img
                      src={photo.photoUrl}
                      alt={spot.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Stamp Watermark Overlay */}
                    <div className="absolute inset-0 bg-emerald-950/20 flex flex-col items-center justify-center p-2 text-center pointer-events-none">
                      <div className="bg-emerald-600/90 text-white rounded-full p-1.5 shadow-md mb-1 transform -rotate-12 border border-white/60">
                        <Award className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black text-white bg-black/60 px-2 py-0.5 rounded shadow">
                        SHANGHAI VERIFIED
                      </span>
                    </div>

                    {/* Action buttons on hover */}
                    <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-90 group-hover:opacity-100 transition">
                      <button
                        onClick={() => setPreviewPhotoModal(photo)}
                        className="p-1 rounded-md bg-black/70 text-white hover:bg-black transition cursor-pointer"
                        title="크게 보기"
                      >
                        <Maximize2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onRemoveStampPhoto(spot.id)}
                        className="p-1 rounded-md bg-rose-600/80 text-white hover:bg-rose-700 transition cursor-pointer"
                        title="사진 삭제"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="absolute bottom-1 left-1.5 right-1.5 text-[9px] text-white bg-black/60 px-1.5 py-0.5 rounded truncate">
                      {photo.stampedAt || '현장 인증'}
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setSelectedPhotoSpot(spot)}
                    className="rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50 hover:bg-emerald-50/50 aspect-video flex flex-col items-center justify-center gap-1 p-3 cursor-pointer transition text-center group"
                  >
                    <div className="w-9 h-9 rounded-full bg-white shadow-sm border border-slate-200 group-hover:border-emerald-300 flex items-center justify-center text-slate-500 group-hover:text-emerald-600 transition">
                      <Camera className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-700">
                      현장 사진 찍기 / 업로드
                    </span>
                    <span className="text-[10px] text-slate-500">
                      클릭하여 사진 인증
                    </span>
                  </div>
                )}
              </div>

              {/* Spot Name & Badge */}
              <div className="my-2">
                <div className="flex items-center gap-1.5">
                  <span>{spot.emoji}</span>
                  <h4 className="font-bold text-slate-900 text-sm">{spot.name}</h4>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {spot.badge}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                <button
                  onClick={() => onOpenDetail(spot)}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer text-center"
                >
                  탐방 정보 ➔
                </button>

                {!isStamped ? (
                  <button
                    onClick={() => setSelectedPhotoSpot(spot)}
                    className="py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1"
                  >
                    <Upload className="w-3 h-3" />
                    <span>인증</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onToggleStamp(spot.id)}
                    className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-[11px] transition cursor-pointer"
                    title="스탬프 취소"
                  >
                    취소
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Photo Upload & Verification Modal */}
      {selectedPhotoSpot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl p-6 shadow-2xl relative space-y-5">
            <button
              onClick={() => {
                setSelectedPhotoSpot(null);
                setCustomCaption('');
              }}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-2xl shadow-sm">
                {selectedPhotoSpot.emoji}
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  DAY 0{selectedPhotoSpot.day} 현장 사진 인증
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">
                  {selectedPhotoSpot.name}
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              📍 <strong>인증 장소:</strong> {selectedPhotoSpot.locationDesc}<br />
              💡 현장에서 본인의 얼굴이나 탐방지 배경이 잘 나오도록 사진을 찍어 업로드해주세요.
            </p>

            {/* Photo Caption Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                인증 소감 및 한 줄 코멘트 (선택):
              </label>
              <input
                type="text"
                value={customCaption}
                onChange={(e) => setCustomCaption(e.target.value)}
                placeholder="예: 468m 동방명주 전망대 도착! 야경이 웅장합니다."
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Upload Options */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => {
                  setUploadingSpotId(selectedPhotoSpot.id);
                  fileInputRef.current?.click();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition shadow-sm cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>카메라로 촬영 / 사진 파일 업로드</span>
              </button>

              <button
                onClick={() => handleUseSamplePhoto(selectedPhotoSpot)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition border border-slate-200 cursor-pointer"
                title="체험 및 테스트용 샘플 현장 사진 사용"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>현장 인증 샘플 사진으로 즉시 인증 (테스트용)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo Large Preview Modal */}
      {previewPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-white border border-slate-200 w-full max-w-xl rounded-3xl p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setPreviewPhotoModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-slate-900">
              📸 현장 인증 사진 원본 보기
            </h3>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 aspect-video relative">
              <img
                src={previewPhotoModal.photoUrl}
                alt="현장 인증"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                인증 확인 완료 ✓
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="text-slate-700 font-bold">
                {previewPhotoModal.caption || '현장 탐방 인증'}
              </div>
              <div className="text-slate-500 text-[11px]">
                인증 일시: {previewPhotoModal.stampedAt}
              </div>
            </div>

            <button
              onClick={() => setPreviewPhotoModal(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* Completion Certificate Modal - Graduation Style with Photo Collage */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn overflow-y-auto">
          <div className="bg-white border-4 border-emerald-500/80 w-full max-w-3xl rounded-3xl p-6 sm:p-10 shadow-2xl relative text-center space-y-6 my-8">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex p-3.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 mb-1">
              <Award className="w-12 h-12" />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs uppercase tracking-widest text-emerald-800 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                GLOCAL EXPLORATION MASTER CERTIFICATE
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                글로컬 죽향 역사·문화 탐방 수료증
              </h3>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-5 text-sm text-slate-800 leading-relaxed text-left font-sans">
              <p className="text-base font-bold text-emerald-800">
                {studentSchool} <span className="text-slate-900 font-black text-lg">[{studentName}]</span> 대원
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                위 학생은 2026년 담양여자중학교에서 출발한 상하이 글로컬 융합 역사·독서·문화 탐방에서 100년 전 대한민국 임시정부의 자주독립 정신과 『맞바꾼 회중시계』의 숭고한 약속을 성찰하고, 첨단 미래 과학기술과 문화 융합의 가치를 성실히 탐구하여 8대 전 장소의 현장 사진 인증 및 교과 과제를 훌륭히 완수하였기에 이 증서를 수여합니다.
              </p>

              {/* 8 Photo Mini Gallery Collage */}
              <div className="pt-2">
                <h5 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span>8대 탐방지 현장 인증 포토 갤러리</span>
                </h5>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                  {SPOTS_DATA.map((spot) => {
                    const p = stampPhotos[spot.id];
                    return (
                      <div
                        key={spot.id}
                        className="rounded-lg overflow-hidden border border-slate-200 aspect-square bg-slate-200 relative group"
                        title={spot.name}
                      >
                        <img
                          src={p ? p.photoUrl : spot.heroImage}
                          alt={spot.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition text-white text-[9px] text-center p-0.5">
                          {spot.name.slice(0, 4)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
                <div className="font-mono text-slate-400">
                  <span>발급번호: DYMS-SH-2026-MASTER</span> | <span>2026. 10. 16</span>
                </div>
                <div className="font-bold text-slate-800 text-center sm:text-right">
                  담양교육지원청 · 담양여자중학교
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>수료증 인쇄 / PDF 저장</span>
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer border border-slate-200"
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
