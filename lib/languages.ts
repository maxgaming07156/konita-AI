import type { Language } from "@/types";

export const LANGUAGES: Language[] = [
  { code: "auto", name: "Detect Language", nativeName: "Auto", flag: "\u2728" },
  { code: "en", name: "English", nativeName: "English", flag: "\uD83C\uDDFA\uD83C\uDDF8" },
  { code: "es", name: "Spanish", nativeName: "Espa\u00f1ol", flag: "\uD83C\uDDEA\uD83C\uDDF8" },
  { code: "fr", name: "French", nativeName: "Fran\u00e7ais", flag: "\uD83C\uDDEB\uD83C\uDDF7" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "\uD83C\uDDE9\uD83C\uDDEA" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "\uD83C\uDDEE\uD83C\uDDF9" },
  { code: "pt", name: "Portuguese", nativeName: "Portugu\u00eas", flag: "\uD83C\uDDF5\uD83C\uDDF9" },
  { code: "ur", name: "Urdu", nativeName: "\u0627\u0631\u062f\u0648", flag: "\uD83C\uDDF5\uD83C\uDDF0" },
  { code: "hi", name: "Hindi", nativeName: "\u0939\u093f\u0928\u094d\u0926\u0940", flag: "\uD83C\uDDEE\uD83C\uDDF3" },
  { code: "ar", name: "Arabic", nativeName: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629", flag: "\uD83C\uDDF8\uD83C\uDDE6" },
  { code: "zh", name: "Chinese", nativeName: "\u4e2d\u6587", flag: "\uD83C\uDDE8\uD83C\uDDF3" },
  { code: "ja", name: "Japanese", nativeName: "\u65e5\u672c\u8a9e", flag: "\uD83C\uDDEF\uD83C\uDDF5" },
  { code: "ko", name: "Korean", nativeName: "\ud55c\uad6d\uc5b4", flag: "\uD83C\uDDF0\uD83C\uDDF7" },
  { code: "ru", name: "Russian", nativeName: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439", flag: "\uD83C\uDDF7\uD83C\uDDFA" },
  { code: "tr", name: "Turkish", nativeName: "T\u00fcrk\u00e7e", flag: "\uD83C\uDDF9\uD83C\uDDF7" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "\uD83C\uDDF3\uD83C\uDDF1" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "\uD83C\uDDF5\uD83C\uDDF1" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "\uD83C\uDDF8\uD83C\uDDEA" },
  { code: "bn", name: "Bengali", nativeName: "\u09ac\u09be\u0982\u09b2\u09be", flag: "\uD83C\uDDE7\uD83C\uDDE9" },
  { code: "id", name: "Indonesian", nativeName: "Indonesia", flag: "\uD83C\uDDEE\uD83C\uDDE9" },
  { code: "vi", name: "Vietnamese", nativeName: "Ti\u1ebfng Vi\u1ec7t", flag: "\uD83C\uDDFB\uD83C\uDDF3" },
  { code: "th", name: "Thai", nativeName: "\u0e44\u0e17\u0e22", flag: "\uD83C\uDDF9\uD83C\uDDED" },
  { code: "fa", name: "Persian", nativeName: "\u0641\u0627\u0631\u0633\u06cc", flag: "\uD83C\uDDEE\uD83C\uDDF7" },
  { code: "pa", name: "Punjabi", nativeName: "\u0a2a\u0a70\u0a1c\u0a3e\u0a2c\u0a40", flag: "\uD83C\uDDF5\uD83C\uDDF0" },
];

export function getLanguageByCode(code: string): Language {
  return (
    LANGUAGES.find((l) => l.code === code) ?? {
      code,
      name: code.toUpperCase(),
      nativeName: code.toUpperCase(),
      flag: "\uD83C\uDF10",
    }
  );
}

// Best-effort mapping from our language codes to BCP-47 tags used by
// the Web Speech API (SpeechRecognition / SpeechSynthesis).
export const SPEECH_LOCALE_MAP: Record<string, string> = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
  pt: "pt-PT",
  ur: "ur-PK",
  hi: "hi-IN",
  ar: "ar-SA",
  zh: "zh-CN",
  ja: "ja-JP",
  ko: "ko-KR",
  ru: "ru-RU",
  tr: "tr-TR",
  nl: "nl-NL",
  pl: "pl-PL",
  sv: "sv-SE",
  bn: "bn-BD",
  id: "id-ID",
  vi: "vi-VN",
  th: "th-TH",
  fa: "fa-IR",
  pa: "pa-IN",
};

export function toSpeechLocale(code: string): string {
  return SPEECH_LOCALE_MAP[code] ?? "en-US";
}
