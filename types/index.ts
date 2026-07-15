export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface VocabularyItem {
  word: string;
  meaning: string;
  partOfSpeech: string;
}

export interface TutorBreakdown {
  translation: string;
  grammarExplanation: string;
  vocabulary: VocabularyItem[];
  pronunciationGuide: string;
  exampleSentence: string;
  exampleSentenceTranslation: string;
  commonMistakes: string[];
  learningTips: string[];
  detectedSourceLanguage?: string;
}

export interface TranslationRecord {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: number;
  tutor?: TutorBreakdown;
}

export interface FavoriteWord {
  id: string;
  word: string;
  translation: string;
  sourceLang: string;
  targetLang: string;
  meaning?: string;
  timestamp: number;
  srsBox?: number;
  srsDueAt?: number;
}

export interface Stats {
  totalTranslations: number;
  totalConversationMessages: number;
  languagesPracticed: string[];
  longestStreak: number;
}

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  correction?: {
    corrected: string;
    explanation: string;
  } | null;
  timestamp: number;
}

export type RequestState = "idle" | "loading" | "success" | "error";

export interface UserPreferences {
  defaultSourceLang: string;
  defaultTargetLang: string;
  autoSpeak: boolean;
  voiceRate: number;
}
