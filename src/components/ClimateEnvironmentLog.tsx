import React, { useState } from 'react';
import { DailyClimateLog } from '../types';
import { 
  CloudSun, 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudFog, 
  Thermometer, 
  Droplets, 
  Wind, 
  Gauge, 
  Sparkles, 
  Activity, 
  CheckCircle2, 
  BookOpen, 
  RotateCcw, 
  Save, 
  Printer, 
  Layers, 
  Compass,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  Clock,
  Footprints,
  Flame,
  Timer,
  HeartPulse,
  Award
} from 'lucide-react';

interface ClimateEnvironmentLogProps {
  climateLogs: DailyClimateLog[];
  onSaveClimateLog: (updatedLogs: DailyClimateLog[]) => void;
  onResetClimateLogs: () => void;
}

export const ClimateEnvironmentLog: React.FC<ClimateEnvironmentLogProps> = ({
  climateLogs,
  onSaveClimateLog,
  onResetClimateLogs,
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [editingLogs, setEditingLogs] = useState<DailyClimateLog[]>(climateLogs);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [activeChartMetric, setActiveChartMetric] = useState<'temp' | 'humidity' | 'aqi' | 'steps'>('temp');

  const currentLog = editingLogs[selectedDayIndex] || editingLogs[0];

  const handleFieldChange = (field: keyof DailyClimateLog, value: any) => {
    const updated = [...editingLogs];
    updated[selectedDayIndex] = {
      ...updated[selectedDayIndex],
      [field]: value,
      updatedAt: new Date().toISOString(),
    };
    setEditingLogs(updated);
  };

  const handleInquiryChange = (field: string, value: string) => {
    const updated = [...editingLogs];
    updated[selectedDayIndex] = {
      ...updated[selectedDayIndex],
      scienceInquiry: {
        ...updated[selectedDayIndex].scienceInquiry,
        [field]: value,
      },
      updatedAt: new Date().toISOString(),
    };
    setEditingLogs(updated);
  };

  const handlePhysicalActivityChange = (field: string, value: any) => {
    const updated = [...editingLogs];
    const prevActivity = updated[selectedDayIndex].physicalActivity || {
      stepCount: 12000,
      targetSteps: 12000,
      distanceKm: 8.0,
      caloriesBurned: 350,
      activeMinutes: 100,
      peCurriculumUnit: '중3 체육 [건강과 체력 관리]',
      physicalEffect: '도보 탐방을 통한 심폐 순환 촉진',
      studentReflection: '활동 후 다리 스트레칭 완료',
    };

    updated[selectedDayIndex] = {
      ...updated[selectedDayIndex],
      physicalActivity: {
        ...prevActivity,
        [field]: value,
      },
      updatedAt: new Date().toISOString(),
    };
    setEditingLogs(updated);
  };

  const handleDamyangChange = (field: string, value: any) => {
    const updated = [...editingLogs];
    updated[selectedDayIndex] = {
      ...updated[selectedDayIndex],
      damyangComparison: {
        ...updated[selectedDayIndex].damyangComparison,
        [field]: value,
      },
      updatedAt: new Date().toISOString(),
    };
    setEditingLogs(updated);
  };

  const handleSaveAll = () => {
    onSaveClimateLog(editingLogs);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const getWeatherIcon = (condition: string, className: string = 'w-5 h-5') => {
    switch (condition) {
      case 'sunny':
        return <Sun className={`${className} text-amber-500`} />;
      case 'partly_cloudy':
        return <CloudSun className={`${className} text-sky-500`} />;
      case 'cloudy':
        return <Cloud className={`${className} text-slate-500`} />;
      case 'rain':
        return <CloudRain className={`${className} text-blue-500`} />;
      case 'fog':
        return <CloudFog className={`${className} text-teal-500`} />;
      default:
        return <Sun className={`${className} text-amber-500`} />;
    }
  };

  const getWeatherLabel = (condition: string) => {
    switch (condition) {
      case 'sunny': return '맑음 (Sunny)';
      case 'partly_cloudy': return '구름조금 (Partly Cloudy)';
      case 'cloudy': return '흐림 (Cloudy)';
      case 'rain': return '비 (Rain)';
      case 'fog': return '안개/박무 (Fog)';
      default: return '맑음';
    }
  };

  const getAqiBadge = (aqi: number) => {
    if (aqi <= 50) {
      return { label: '좋음 (Good)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    }
    if (aqi <= 100) {
      return { label: '보통 (Moderate)', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
    return { label: '주의 (Unhealthy)', color: 'bg-rose-50 text-rose-700 border-rose-200' };
  };

  const physical = currentLog.physicalActivity || {
    stepCount: 12000,
    targetSteps: 12000,
    distanceKm: 8.0,
    caloriesBurned: 350,
    activeMinutes: 100,
    peCurriculumUnit: '중3 체육 [건강과 체력 관리]',
    physicalEffect: '도보 탐방을 통한 심폐 순환 촉진',
    studentReflection: '활동 후 다리 스트레칭 완료',
  };

  const stepProgress = Math.min(150, Math.round((physical.stepCount / (physical.targetSteps || 10000)) * 100));

  return (
    <div className="space-y-6 animate-fadeIn max-w-6xl mx-auto font-sans">
      {/* Top Banner - Bright & Clean Theme */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-6 text-7xl opacity-5 font-black italic select-none pointer-events-none text-sky-600">
          CLIMATE & HEALTH
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
                중3 과학 × 체육 융합 탐구
              </span>
              <span className="text-xs text-slate-500 font-medium">기권과 날씨 · 건강과 신체 활동량(걸음 수) 기록</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>상하이 일별 기후·환경 & 신체활동 일지</span>
              <span className="text-sky-600">🌤️</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              3박 4일 탐방 기간 동안 날짜별 기온, 습도, 기압, 미세먼지(AQI) 및 체육 교과 연계 당일 실측 걸음 수(만보기)와 소모 칼로리를 과학적으로 기록·분석합니다.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 self-start md:self-auto flex-shrink-0">
            <button
              onClick={handleSaveAll}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saveSuccess ? '저장 완료!' : '기록 저장'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition border border-slate-200 cursor-pointer"
              title="보고서 인쇄"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">인쇄/PDF</span>
            </button>
            <button
              onClick={() => {
                if (confirm('기후 및 체육 활동 데이터를 표준 데이터로 초기화하시겠습니까?')) {
                  onResetClimateLogs();
                  setEditingLogs(climateLogs);
                }
              }}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition border border-slate-200 cursor-pointer"
              title="데이터 초기화"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4-Day Date Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {editingLogs.map((log, idx) => {
          const isSelected = selectedDayIndex === idx;
          const logSteps = log.physicalActivity?.stepCount || 10000;
          return (
            <button
              key={log.day}
              onClick={() => setSelectedDayIndex(idx)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative ${
                isSelected
                  ? 'bg-white border-sky-500 shadow-md ring-2 ring-sky-500/20'
                  : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                  isSelected ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  DAY 0{log.day}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {log.date.split('.')[1]}.{log.date.split('.')[2].trim()} ({log.dayOfWeek[0]})
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getWeatherIcon(log.weatherCondition, 'w-5 h-5')}
                  <div>
                    <div className="text-sm font-black text-slate-900">
                      {log.temperature}°C
                    </div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[100px]">
                      {log.location.split('➔')[0].trim()}
                    </div>
                  </div>
                </div>

                {/* Mini step badge on tab */}
                <div className="text-right">
                  <div className="text-xs font-black text-teal-700 font-mono">
                    {logSteps.toLocaleString()}보
                  </div>
                  <div className="text-[10px] text-slate-400">당일 도보</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Active Day Weather & Science & PE Investigation Card */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">
        {/* Day Header Info */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-700">
              <Calendar className="w-4 h-4" />
              <span>{currentLog.date} {currentLog.dayOfWeek} (DAY 0{currentLog.day})</span>
              <span className="text-slate-300">|</span>
              <Clock className="w-4 h-4 text-slate-400" />
              <span>관측 시각: {currentLog.timeObserved}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-sky-600" />
              <span>{currentLog.location}</span>
            </h3>
          </div>

          {/* Weather condition selector pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-1.5 rounded-2xl border border-slate-200 text-xs">
            {(['sunny', 'partly_cloudy', 'cloudy', 'rain', 'fog'] as const).map((cond) => (
              <button
                key={cond}
                onClick={() => handleFieldChange('weatherCondition', cond)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  currentLog.weatherCondition === cond
                    ? 'bg-white text-sky-700 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {getWeatherIcon(cond, 'w-4 h-4')}
                <span className="text-xs">{getWeatherLabel(cond).split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 6 Key Weather Metrics Dashboard Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {/* Temperature */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span className="flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                기온
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-mono">°C</span>
            </div>
            <div className="flex items-baseline gap-1">
              <input
                type="number"
                step="0.1"
                value={currentLog.temperature}
                onChange={(e) => handleFieldChange('temperature', parseFloat(e.target.value) || 0)}
                className="text-2xl font-black text-slate-900 w-16 bg-transparent focus:outline-none border-b border-dashed border-slate-300 focus:border-sky-500"
              />
              <span className="text-xs text-slate-500 font-medium">°C</span>
            </div>
            <div className="text-[11px] text-slate-500">
              체감 {currentLog.feelsLikeTemp}°C
            </div>
          </div>

          {/* Humidity */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span className="flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-sky-500" />
                상대습도
              </span>
              <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.2 rounded font-mono">%</span>
            </div>
            <div className="flex items-baseline gap-1">
              <input
                type="number"
                value={currentLog.humidity}
                onChange={(e) => handleFieldChange('humidity', parseInt(e.target.value) || 0)}
                className="text-2xl font-black text-slate-900 w-14 bg-transparent focus:outline-none border-b border-dashed border-slate-300 focus:border-sky-500"
              />
              <span className="text-xs text-slate-500 font-medium">%</span>
            </div>
            <div className="text-[11px] text-slate-500">
              {currentLog.humidity > 60 ? '습윤 (쾌적)' : '적정 습도'}
            </div>
          </div>

          {/* Atmospheric Pressure */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span className="flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-indigo-500" />
                대기압
              </span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-mono">hPa</span>
            </div>
            <div className="flex items-baseline gap-1">
              <input
                type="number"
                value={currentLog.pressure}
                onChange={(e) => handleFieldChange('pressure', parseInt(e.target.value) || 0)}
                className="text-xl font-black text-slate-900 w-16 bg-transparent focus:outline-none border-b border-dashed border-slate-300 focus:border-sky-500"
              />
              <span className="text-[11px] text-slate-500">hPa</span>
            </div>
            <div className="text-[11px] text-slate-500">
              {currentLog.pressure >= 1013 ? '고기압 영향' : '저기압 영향'}
            </div>
          </div>

          {/* AQI Air Quality */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span className="flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                대기질 (AQI)
              </span>
              <span className="text-[10px] font-mono font-bold">지수</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <input
                type="number"
                value={currentLog.aqi}
                onChange={(e) => handleFieldChange('aqi', parseInt(e.target.value) || 0)}
                className="text-2xl font-black text-slate-900 w-14 bg-transparent focus:outline-none border-b border-dashed border-slate-300 focus:border-sky-500"
              />
            </div>
            <div className={`text-[10px] font-bold px-2 py-0.5 rounded border inline-block ${getAqiBadge(currentLog.aqi).color}`}>
              {getAqiBadge(currentLog.aqi).label.split(' ')[0]}
            </div>
          </div>

          {/* PM2.5 Micro Dust */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span>초미세먼지</span>
              <span className="text-[10px] font-mono">µg/m³</span>
            </div>
            <div className="flex items-baseline gap-1">
              <input
                type="number"
                value={currentLog.pm25}
                onChange={(e) => handleFieldChange('pm25', parseInt(e.target.value) || 0)}
                className="text-2xl font-black text-slate-900 w-14 bg-transparent focus:outline-none border-b border-dashed border-slate-300 focus:border-sky-500"
              />
              <span className="text-[11px] text-slate-500">µg</span>
            </div>
            <div className="text-[11px] text-slate-500">
              WHO 권고기준 충족
            </div>
          </div>

          {/* Wind & Clouds */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
              <span className="flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-teal-500" />
                풍속 & 구름
              </span>
            </div>
            <div className="text-xs font-bold text-slate-900 truncate">
              {currentLog.windSpeed.split('(')[0]}
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              {currentLog.cloudType.split('-')[0]}
            </div>
          </div>
        </div>

        {/* Section: Physical Activity & Step Count (체육 교과 연계 당일 걸음 수 및 체력 관리) */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-teal-50/90 via-emerald-50/50 to-sky-50/80 border border-teal-200/90 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-teal-200/60">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-teal-100 text-teal-800 border border-teal-200 flex items-center gap-1">
                  <Footprints className="w-3.5 h-3.5" />
                  {physical.peCurriculumUnit || '중3 체육 [건강과 체력 관리]'}
                </span>
                <span className="text-xs font-bold text-teal-900">🏃‍♂️ 탐방 당일 신체 활동량 분석</span>
              </div>
              <h4 className="text-base font-black text-slate-900">
                당일 걸음 수 (만보기 측정) & 유산소 운동량 기록
              </h4>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800 bg-white/90 px-3 py-1.5 rounded-xl border border-teal-200 shadow-2xs">
              <Award className="w-4 h-4 text-amber-500" />
              <span>목표 달성률: {stepProgress}%</span>
            </div>
          </div>

          {/* 4 Physical Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {/* Step Count */}
            <div className="p-4 rounded-2xl bg-white border border-teal-100 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-slate-500 font-semibold">
                <span className="flex items-center gap-1">
                  <Footprints className="w-4 h-4 text-teal-600" />
                  실측 걸음 수
                </span>
                <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-1.5 py-0.5 rounded">
                  목표 {physical.targetSteps.toLocaleString()}보
                </span>
              </div>
              <div className="flex items-baseline gap-1">
                <input
                  type="number"
                  value={physical.stepCount}
                  onChange={(e) => handlePhysicalActivityChange('stepCount', parseInt(e.target.value) || 0)}
                  className="text-2xl font-black text-teal-800 w-24 bg-transparent focus:outline-none border-b border-dashed border-teal-300 focus:border-teal-600 font-mono"
                />
                <span className="text-xs font-bold text-slate-600">보</span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                <div 
                  className="bg-teal-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, stepProgress)}%` }}
                />
              </div>
            </div>

            {/* Distance (km) */}
            <div className="p-4 rounded-2xl bg-white border border-teal-100 shadow-2xs space-y-1">
              <div className="text-slate-500 font-semibold flex items-center gap-1">
                <MapPin className="w-4 h-4 text-sky-600" />
                이동 도보 거리
              </div>
              <div className="flex items-baseline gap-1">
                <input
                  type="number"
                  step="0.1"
                  value={physical.distanceKm}
                  onChange={(e) => handlePhysicalActivityChange('distanceKm', parseFloat(e.target.value) || 0)}
                  className="text-2xl font-black text-slate-900 w-16 bg-transparent focus:outline-none border-b border-dashed border-slate-300 focus:border-teal-600 font-mono"
                />
                <span className="text-xs font-bold text-slate-600">km</span>
              </div>
              <div className="text-[11px] text-slate-500">
                보폭 약 70cm 환산
              </div>
            </div>

            {/* Calories Burned */}
            <div className="p-4 rounded-2xl bg-white border border-teal-100 shadow-2xs space-y-1">
              <div className="text-slate-500 font-semibold flex items-center gap-1">
                <Flame className="w-4 h-4 text-rose-500" />
                소모 열량 (칼로리)
              </div>
              <div className="flex items-baseline gap-1">
                <input
                  type="number"
                  value={physical.caloriesBurned}
                  onChange={(e) => handlePhysicalActivityChange('caloriesBurned', parseInt(e.target.value) || 0)}
                  className="text-2xl font-black text-rose-600 w-18 bg-transparent focus:outline-none border-b border-dashed border-rose-300 focus:border-rose-600 font-mono"
                />
                <span className="text-xs font-bold text-slate-600">kcal</span>
              </div>
              <div className="text-[11px] text-slate-500">
                공깃밥 약 {(physical.caloriesBurned / 300).toFixed(1)}공기 분량
              </div>
            </div>

            {/* Active Walking Time */}
            <div className="p-4 rounded-2xl bg-white border border-teal-100 shadow-2xs space-y-1">
              <div className="text-slate-500 font-semibold flex items-center gap-1">
                <Timer className="w-4 h-4 text-indigo-600" />
                순수 보행 시간
              </div>
              <div className="flex items-baseline gap-1">
                <input
                  type="number"
                  value={physical.activeMinutes}
                  onChange={(e) => handlePhysicalActivityChange('activeMinutes', parseInt(e.target.value) || 0)}
                  className="text-2xl font-black text-indigo-700 w-16 bg-transparent focus:outline-none border-b border-dashed border-indigo-300 focus:border-indigo-600 font-mono"
                />
                <span className="text-xs font-bold text-slate-600">분</span>
              </div>
              <div className="text-[11px] text-slate-500">
                유산소 심폐 운동 지속
              </div>
            </div>
          </div>

          {/* Physical Effect & Student Reflection Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white/80 border border-teal-100 space-y-1.5">
              <label className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-teal-600" />
                신체 생리적 효과 및 운동 원리
              </label>
              <textarea
                value={physical.physicalEffect}
                onChange={(e) => handlePhysicalActivityChange('physicalEffect', e.target.value)}
                rows={2}
                className="w-full p-2.5 rounded-xl bg-white border border-teal-200 text-slate-800 text-xs focus:outline-none focus:border-teal-500 leading-relaxed resize-none"
              />
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-teal-100 space-y-1.5">
              <label className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                <Footprints className="w-4 h-4 text-teal-600" />
                학생 자율 체력 성찰 & 스트레칭 기록
              </label>
              <textarea
                value={physical.studentReflection}
                onChange={(e) => handlePhysicalActivityChange('studentReflection', e.target.value)}
                rows={2}
                placeholder="오늘 하루 걸음 수 달성 소감과 운동 후 다리/허리 피로 회복을 위해 실천한 스트레칭을 적어보세요."
                className="w-full p-2.5 rounded-xl bg-white border border-teal-200 text-slate-800 text-xs focus:outline-none focus:border-teal-500 leading-relaxed resize-none"
              />
            </div>
          </div>
        </div>

        {/* Sensory Observation Field */}
        <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-100 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-sky-600" />
              현장 감각 관측 노트 (Sensory Observation)
            </h4>
            <span className="text-[11px] text-sky-700">체감 바람, 냄새, 가시거리, 습윤도</span>
          </div>
          <textarea
            value={currentLog.sensoryNote}
            onChange={(e) => handleFieldChange('sensoryNote', e.target.value)}
            rows={2}
            className="w-full p-3 rounded-xl bg-white border border-sky-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-sky-500 leading-relaxed resize-none"
            placeholder="상하이 현장에서 직접 느낀 바람의 방향, 강바람과 빌딩풍의 차이, 공기의 맑기를 기록해보세요."
          />
        </div>

        {/* Section: Middle School Science Inquiry & Mechanism Analysis */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                  {currentLog.scienceInquiry.curriculumUnit}
                </span>
              </div>
              <h4 className="text-base font-black text-slate-900">
                🔬 {currentLog.scienceInquiry.topic}
              </h4>
            </div>
            <span className="text-xs text-slate-500">과학적 원리 및 인과관계 도출</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field Observation Analysis */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                현장 관측 사실 (Observation Data)
              </label>
              <textarea
                value={currentLog.scienceInquiry.observation}
                onChange={(e) => handleInquiryChange('observation', e.target.value)}
                rows={4}
                className="w-full p-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-sky-500 leading-relaxed font-sans"
              />
            </div>

            {/* Scientific Reasoning */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                과학적 원리 및 메커니즘 (Scientific Reasoning)
              </label>
              <textarea
                value={currentLog.scienceInquiry.scientificReasoning}
                onChange={(e) => handleInquiryChange('scientificReasoning', e.target.value)}
                rows={4}
                className="w-full p-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs sm:text-sm focus:outline-none focus:border-sky-500 leading-relaxed font-sans"
              />
            </div>
          </div>
        </div>

        {/* Section: Damyang vs Shanghai Comparative Climate Analysis */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-sky-50/80 border border-emerald-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span>🌿 전남 담양 vs 중국 상하이 기후 환경 비교</span>
            </h4>
            <span className="text-xs text-emerald-800 font-bold bg-emerald-100 px-2.5 py-0.5 rounded-full">
              내륙 분지 숲 vs 해안 메가시티
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="text-slate-500 font-semibold mb-1">전남 담양 (동일 날짜 평균)</div>
              <div className="text-lg font-black text-emerald-700">
                {currentLog.damyangComparison.damyangTemp}°C · 습도 {currentLog.damyangComparison.damyangHumidity}%
              </div>
              <div className="text-[11px] text-slate-500 mt-1">대나무 숲 자연 에코시스템</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="text-slate-500 font-semibold mb-1">중국 상하이 (현장 측정)</div>
              <div className="text-lg font-black text-sky-700">
                {currentLog.temperature}°C · 습도 {currentLog.humidity}%
              </div>
              <div className="text-[11px] text-slate-500 mt-1">장강 하구 해양성 몬순 삼각주</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
              <div className="text-slate-500 font-semibold mb-1">기온 & 습도 편차</div>
              <div className="text-lg font-black text-slate-800">
                +{(currentLog.temperature - currentLog.damyangComparison.damyangTemp).toFixed(1)}°C / +{(currentLog.humidity - currentLog.damyangComparison.damyangHumidity)}%
              </div>
              <div className="text-[11px] text-slate-500 mt-1">상하이가 더 따뜻하고 습윤</div>
            </div>
          </div>

          <div className="pt-2">
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              비교 고찰 (지형·위도·수계의 영향 분석):
            </label>
            <textarea
              value={currentLog.damyangComparison.differenceAnalysis}
              onChange={(e) => handleDamyangChange('differenceAnalysis', e.target.value)}
              rows={2}
              className="w-full p-3 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs leading-relaxed focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* 4-Day Trend Comparison Visual Chart (Now with Steps!) */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-sky-600" />
                <span>3박 4일 탐방 기간 기후 & 걸음 수 추이 그래프</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                날짜별 기온, 습도, 대기질 및 당일 걸음 수 변화 곡선
              </p>
            </div>

            {/* Metric Switcher */}
            <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveChartMetric('temp')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  activeChartMetric === 'temp'
                    ? 'bg-white text-amber-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                기온 (°C)
              </button>
              <button
                onClick={() => setActiveChartMetric('humidity')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  activeChartMetric === 'humidity'
                    ? 'bg-white text-sky-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                습도 (%)
              </button>
              <button
                onClick={() => setActiveChartMetric('aqi')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  activeChartMetric === 'aqi'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                대기질 (AQI)
              </button>
              <button
                onClick={() => setActiveChartMetric('steps')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                  activeChartMetric === 'steps'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-teal-700 hover:text-teal-900'
                }`}
              >
                <Footprints className="w-3 h-3" />
                걸음 수 (보)
              </button>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="grid grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            {editingLogs.map((item) => {
              let val = item.temperature;
              let maxVal = 30;
              let color = 'bg-amber-500';
              let unit = '°C';

              if (activeChartMetric === 'humidity') {
                val = item.humidity;
                maxVal = 100;
                color = 'bg-sky-500';
                unit = '%';
              } else if (activeChartMetric === 'aqi') {
                val = item.aqi;
                maxVal = 100;
                color = 'bg-emerald-500';
                unit = '';
              } else if (activeChartMetric === 'steps') {
                val = item.physicalActivity?.stepCount || 10000;
                maxVal = 25000;
                color = 'bg-teal-500';
                unit = '보';
              }

              const heightPct = Math.min(100, Math.max(15, (val / maxVal) * 100));

              return (
                <div key={item.day} className="flex flex-col items-center gap-2">
                  <div className="text-xs font-black text-slate-800 font-mono">
                    {activeChartMetric === 'steps' ? val.toLocaleString() : val}{unit}
                  </div>
                  <div className="w-full bg-slate-100 h-32 rounded-xl flex items-end p-1.5 overflow-hidden">
                    <div
                      className={`w-full ${color} rounded-lg transition-all duration-500`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-slate-900">Day 0{item.day}</div>
                    <div className="text-[11px] text-slate-500">10/{12 + item.day}</div>
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

