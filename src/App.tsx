import React, { useState, useEffect } from 'react';
import { ActiveTab, SpotDetail, StudentNote, StampPhoto, DailyClimateLog } from './types';
import { SPOTS_DATA, DEFAULT_CLIMATE_LOGS } from './data/explorationData';
import { Header } from './components/Header';
import { ItineraryView } from './components/ItineraryView';
import { SpotExplorer } from './components/SpotExplorer';
import { BookReadingActivity } from './components/BookReadingActivity';
import { ClimateEnvironmentLog } from './components/ClimateEnvironmentLog';
import { QuizZone } from './components/QuizZone';
import { StampPassport } from './components/StampPassport';
import { StudentWorkbook } from './components/StudentWorkbook';
import { TravelTips } from './components/TravelTips';
import { SpotDetailModal } from './components/SpotDetailModal';
import { AudioPlayerModal } from './components/AudioPlayerModal';
import { Compass, BookOpen, Heart, Sparkles } from 'lucide-react';

const STORAGE_KEY_NOTES = 'damyang_shanghai_2026_student_notes';
const STORAGE_KEY_CLIMATE = 'damyang_shanghai_2026_climate_logs';
const STORAGE_KEY_PHOTOS = 'damyang_shanghai_2026_stamp_photos';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('itinerary');
  const [selectedSpot, setSelectedSpot] = useState<SpotDetail | null>(null);
  const [audioSpot, setAudioSpot] = useState<SpotDetail | null>(null);

  // Student notes state
  const [studentNotes, setStudentNotes] = useState<Record<string, StudentNote>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load notes', e);
    }
    // Initialize default note map
    const initial: Record<string, StudentNote> = {};
    SPOTS_DATA.forEach((s) => {
      initial[s.id] = {
        spotId: s.id,
        noteText: '',
        answeredQuiz: false,
        stamped: false,
        updatedAt: new Date().toISOString(),
      };
    });
    return initial;
  });

  // Stamp photos state
  const [stampPhotos, setStampPhotos] = useState<Record<string, StampPhoto>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PHOTOS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load stamp photos', e);
    }
    return {};
  });

  // Climate & Environment Logs state
  const [climateLogs, setClimateLogs] = useState<DailyClimateLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CLIMATE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load climate logs', e);
    }
    return DEFAULT_CLIMATE_LOGS;
  });

  // Save notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(studentNotes));
    } catch (e) {
      console.error('Failed to save notes', e);
    }
  }, [studentNotes]);

  // Save stamp photos to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PHOTOS, JSON.stringify(stampPhotos));
    } catch (e) {
      console.error('Failed to save stamp photos', e);
    }
  }, [stampPhotos]);

  // Save climate logs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CLIMATE, JSON.stringify(climateLogs));
    } catch (e) {
      console.error('Failed to save climate logs', e);
    }
  }, [climateLogs]);

  // Handle Save Note
  const handleSaveNote = (spotId: string, noteText: string) => {
    setStudentNotes((prev) => ({
      ...prev,
      [spotId]: {
        ...(prev[spotId] || {
          spotId,
          answeredQuiz: false,
          stamped: false,
        }),
        noteText,
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  // Handle Save Photo Stamp
  const handleSaveStampPhoto = (spotId: string, photoUrl: string, caption?: string) => {
    const now = new Date();
    const formattedTime = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    // Update stamp photo
    setStampPhotos((prev) => ({
      ...prev,
      [spotId]: {
        spotId,
        photoUrl,
        caption: caption || '현장 방문 실시간 인증',
        stampedAt: formattedTime,
        verified: true,
      },
    }));

    // Mark as stamped in studentNotes
    setStudentNotes((prev) => ({
      ...prev,
      [spotId]: {
        ...(prev[spotId] || {
          spotId,
          noteText: '',
          answeredQuiz: false,
        }),
        stamped: true,
        photoUrl,
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  // Handle Remove Photo Stamp
  const handleRemoveStampPhoto = (spotId: string) => {
    setStampPhotos((prev) => {
      const copy = { ...prev };
      delete copy[spotId];
      return copy;
    });

    setStudentNotes((prev) => ({
      ...prev,
      [spotId]: {
        ...(prev[spotId] || {
          spotId,
          noteText: '',
          answeredQuiz: false,
        }),
        stamped: false,
        photoUrl: undefined,
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  // Handle direct Toggle Stamp
  const handleToggleStamp = (spotId: string) => {
    const current = studentNotes[spotId]?.stamped || false;
    const nextVal = !current;

    if (!nextVal) {
      handleRemoveStampPhoto(spotId);
    } else {
      // Find spot and use default photo
      const spot = SPOTS_DATA.find((s) => s.id === spotId);
      handleSaveStampPhoto(spotId, spot?.heroImage || '', '현장 방문 인증 완료');
    }
  };

  const handleSaveClimateLog = (updatedLogs: DailyClimateLog[]) => {
    setClimateLogs(updatedLogs);
  };

  const handleResetClimateLogs = () => {
    setClimateLogs(DEFAULT_CLIMATE_LOGS);
  };

  // Calculate stamped spots map
  const stampedSpotsMap: Record<string, boolean> = {};
  SPOTS_DATA.forEach((s) => {
    stampedSpotsMap[s.id] = studentNotes[s.id]?.stamped || !!stampPhotos[s.id] || false;
  });

  const stampedCount = Object.values(stampedSpotsMap).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-sans selection:bg-sky-100 selection:text-sky-900">
      {/* Top Header & Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stampedCount={stampedCount}
        totalSpots={SPOTS_DATA.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'itinerary' && (
          <ItineraryView
            onOpenDetail={(spot) => setSelectedSpot(spot)}
            onOpenAudio={(spot) => setAudioSpot(spot)}
            stampedSpots={stampedSpotsMap}
          />
        )}

        {activeTab === 'spots' && (
          <SpotExplorer
            studentNotes={studentNotes}
            onOpenDetail={(spot) => setSelectedSpot(spot)}
            onOpenAudio={(spot) => setAudioSpot(spot)}
          />
        )}

        {activeTab === 'reading' && (
          <BookReadingActivity
            onOpenSpotDetail={(spotId) => {
              const spot = SPOTS_DATA.find((s) => s.id === spotId);
              if (spot) setSelectedSpot(spot);
            }}
          />
        )}

        {activeTab === 'climate' && (
          <ClimateEnvironmentLog
            climateLogs={climateLogs}
            onSaveClimateLog={handleSaveClimateLog}
            onResetClimateLogs={handleResetClimateLogs}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizZone
            onToggleStamp={handleToggleStamp}
            stampedSpots={stampedSpotsMap}
          />
        )}

        {activeTab === 'passport' && (
          <StampPassport
            stampedSpots={stampedSpotsMap}
            stampPhotos={stampPhotos}
            onSaveStampPhoto={handleSaveStampPhoto}
            onRemoveStampPhoto={handleRemoveStampPhoto}
            onToggleStamp={handleToggleStamp}
            onOpenDetail={(spot) => setSelectedSpot(spot)}
          />
        )}

        {activeTab === 'workbook' && (
          <StudentWorkbook
            studentNotes={studentNotes}
            stampPhotos={stampPhotos}
            climateLogs={climateLogs}
            onSaveNote={handleSaveNote}
            onOpenDetail={(spot) => setSelectedSpot(spot)}
            onNavigateToReading={() => setActiveTab('reading')}
          />
        )}

        {activeTab === 'tips' && <TravelTips />}
      </main>

      {/* Detail Modal */}
      <SpotDetailModal
        spot={selectedSpot}
        onClose={() => setSelectedSpot(null)}
        onOpenAudio={(spot) => setAudioSpot(spot)}
        note={selectedSpot ? studentNotes[selectedSpot.id] : undefined}
        stampPhoto={selectedSpot ? stampPhotos[selectedSpot.id] : undefined}
        onSaveNote={handleSaveNote}
        onSaveStampPhoto={handleSaveStampPhoto}
        onToggleStamp={handleToggleStamp}
      />

      {/* Audio Player Modal */}
      <AudioPlayerModal
        spot={audioSpot}
        onClose={() => setAudioSpot(null)}
      />

      {/* Footer - Bright Theme */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 text-center text-xs text-slate-500 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-bold text-slate-800">
              2026 담양여중 글로컬 죽향 역사·독서·문화 탐방단
            </span>
            <span className="text-slate-300">|</span>
            <span>담양교육지원청 · 담양여자중학교 3학년 융합 탐구</span>
          </div>

          <div className="text-slate-400">
            담양의 역사적 긍지(대나무·가사문학)와 도서 『맞바꾼 회중시계』 성찰 및 상하이 100년 독립운동·첨단 미래과학 융합
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
