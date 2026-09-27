export type Language = "fa" | "en";

const LANGUAGE_KEY = "teachhub-language";

export function getLanguage(): Language {
  const savedLanguage = localStorage.getItem(LANGUAGE_KEY);

  if (savedLanguage === "fa" || savedLanguage === "en") {
    return savedLanguage;
  }

  return "en";
}

export function setLanguage(language: Language) {
  localStorage.setItem(LANGUAGE_KEY, language);
}
