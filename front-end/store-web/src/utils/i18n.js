import i18n from "i18next";
import languageDetector from "i18next-browser-languagedetector";

const languageCode = {
  en: "en",
  vi: "vi",
  ko: "ko",
  ja: "ja",
  zh: "zh",
  th: "th",
  ms: "ms",
  id: "id",
};

i18n.use(languageDetector).init({
  lng: localStorage.getItem("i18nextLng") ?? `${languageCode.vi}`,
  debug: false,
  fallbackLng: `${languageCode.vi}`,
  ns: ["translations"],
  defaultNS: "translations",
  preload: [`${languageCode.en}`, `${languageCode.vi}`],
  keySeparator: ".",
  detection: {
    order: ["localStorage", "cookie"],
    lookupCookie: "i18nextLng",
    lookupLocalStorage: "i18nextLng",
    caches: ["localStorage"],
  },
  resources: {
    en: {
      translations: require("../theme/locales/en.json"),
    },
    vi: {
      translations: require("../theme/locales/vi.json"),
    },
  },
  react: {
    useSuspense: false,
  },
});

i18n.languages = [languageCode.en, languageCode.vi];

export default i18n;
