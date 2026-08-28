import React, { useState, useEffect } from 'react';
import { SpotDetail } from '../types';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  CheckCircle2,
  Headphones
} from 'lucide-react';

interface AudioPlayerModalProps {
  spot: SpotDetail | null;
  onClose: () => void;
}

export const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({ spot, onClose }) => {
  if (!spot) return null;

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1.0);

  // Web Speech API for TTS
  useEffect(() => {
    let utterance: SpeechSynthesisUtterance | null = null;

    if (isPlaying && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      utterance = new SpeechSynthesisUtterance(spot.audioGuideScript);
      utterance.lang = 'ko-KR';
      utterance.rate = speed;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setIsPlaying(false);
        setProgress(100);
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying, speed, spot]);

  // Simulate progress bar timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 1.2 * speed;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const togglePlay = () => {
    if (progress >= 100) {
      setProgress(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn font-sans">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 text-2xl shadow-xs">
            {spot.emoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                1분 스마트 오디오 가이드
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">
              {spot.name}
            </h3>
          </div>
        </div>

        {/* Audio Script Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm leading-relaxed max-h-48 overflow-y-auto">
          <p className="whitespace-pre-line font-sans">
            "{spot.audioGuideScript}"
          </p>
        </div>

        {/* Player Controls */}
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div
                className="bg-sky-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>{Math.floor((progress / 100) * 45)}s</span>
              <span>00:45</span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSpeed((s) => (s === 1.0 ? 1.25 : s === 1.25 ? 1.5 : 1.0))}
                className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition cursor-pointer"
              >
                {speed}x
              </button>
              <button
                onClick={handleReset}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
                title="처음으로"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-sky-600 hover:bg-sky-500 text-white flex items-center justify-center shadow-md hover:scale-105 transition cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current" />
              ) : (
                <Play className="w-6 h-6 fill-current ml-1" />
              )}
            </button>

            <div className="w-16 text-right text-xs text-slate-500 font-medium">
              {isPlaying ? '재생 중...' : '일시 정지'}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-[11px] text-slate-400">
          * 브라우저 음성 합성(TTS) 엔진을 통해 생생한 현장 해설을 청취할 수 있습니다.
        </div>
      </div>
    </div>
  );
};
