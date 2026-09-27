import en from "./en/common.json";
import fa from "./fa/common.json";
import { getLanguage, type Language } from "./language";

const translations = {
  en,
  fa,
};

export function t(key: string): string {
  const language: Language = getLanguage();

  const keys = key.split(".");
  let value: unknown = translations[language];

  for (const part of keys) {
    if (typeof value !== "object" || value === null) {
      return key;
    }

    value = (value as Record<string, unknown>)[part];
  }

  return typeof value === "string" ? value : key;
}
