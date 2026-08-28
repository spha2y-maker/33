export interface ScheduleItem {
  time: string;
  activity: string;
  location: string;
  category?: 'transport' | 'history' | 'culture' | 'tech' | 'leisure' | 'meal' | 'hotel' | 'global';
  spotId?: string;
  description?: string;
  icon?: string;
}

export interface DaySchedule {
  day: number;
  date: string;
  dayOfWeek: string;
  theme: string;
  subtitle: string;
  transport: string;
  targetSteps?: number;
  estimatedDistance?: string;
  estimatedCalories?: number;
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  hotel: string;
  items: ScheduleItem[];
}

export interface CurriculumConnection {
  subject: string;
  topic: string;
  description: string;
}

export interface SpotDetail {
  id: string;
  name: string;
  chineseName?: string;
  category: 'history' | 'tech' | 'culture' | 'global';
  day: number;
  badge: string;
  emoji: string;
  heroImage: string;
  summary: string;
  locationDesc: string;
  specialFeature: string;
  koreaHistoryRelation: {
    title: string;
    content: string[];
    keyEvents?: {
      year?: string;
      title: string;
      details: string[];
    }[];
  };
  thematicSignificance?: string;
  curriculum: CurriculumConnection[];
  projectExamples?: {
    step: string;
    subject: string;
    title: string;
    description: string;
  }[];
  audioGuideScript: string;
  quiz: {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  };
  missionPrompt: {
    title: string;
    instruction: string;
    placeholder: string;
    type: 'text' | 'choice' | 'photo_note';
  };
}

export interface StampPhoto {
  spotId: string;
  photoUrl: string;
  caption?: string;
  stampedAt: string;
  locationName?: string;
  verified: boolean;
}

export interface DailyClimateLog {
  day: number;
  date: string;
  dayOfWeek: string;
  location: string;
  timeObserved: string;
  weatherCondition: 'sunny' | 'partly_cloudy' | 'cloudy' | 'rain' | 'fog';
  temperature: number;
  feelsLikeTemp: number;
  humidity: number;
  pressure: number;
  aqi: number;
  pm25: number;
  windSpeed: string;
  cloudType: string;
  sensoryNote: string;
  physicalActivity?: {
    stepCount: number;
    targetSteps: number;
    distanceKm: number;
    caloriesBurned: number;
    activeMinutes: number;
    peCurriculumUnit: string;
    physicalEffect: string;
    studentReflection?: string;
  };
  scienceInquiry: {
    topic: string;
    curriculumUnit: string;
    observation: string;
    scientificReasoning: string;
  };
  damyangComparison: {
    damyangTemp: number;
    damyangHumidity: number;
    differenceAnalysis: string;
  };
  updatedAt?: string;
}

export interface StudentNote {
  spotId: string;
  noteText: string;
  answeredQuiz: boolean;
  stamped: boolean;
  photoUrl?: string;
  reflection?: string;
  updatedAt: string;
}

export interface ReadingReflectionData {
  bookTitle: string;
  author: string;
  studentSchool: string;
  studentName: string;
  activity1_empathy: string;
  activity2_value: string;
  activity3_quote: string;
  activity3_review: string;
  activity3_rating: number;
  activity4_letter: string;
  updatedAt: string;
}

export type ActiveTab = 'itinerary' | 'spots' | 'reading' | 'climate' | 'quiz' | 'passport' | 'workbook' | 'tips';
