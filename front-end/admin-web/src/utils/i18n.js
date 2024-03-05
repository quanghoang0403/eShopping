import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
// import { getLocales } from 'react-native-localize';
import en from 'locales/en'
import vi from 'locales/vi'

export const resources = {
  en,
  vi
}

const languageCode = {
  en: 'en',
  vi: 'vi'
}

void i18n.use(initReactI18next).init(
  {
    lng: localStorage.getItem('i18nextLng') ?? languageCode.vi,
    debug: false,
    fallbackLng: languageCode.vi,
    ns: ['translations'],
    defaultNS: 'translations',
    preload: [languageCode.en, languageCode.vi],
    keySeparator: '.',
    detection: {
      order: ['localStorage', 'cookie'],
      lookupCookie: 'i18nextLng',
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage']
    },
    resources: {
      en: {
        translations: require('locales/en.json')
      },
      vi: {
        translations: require('locales/vi.json')
      }
    },
    react: {
      useSuspense: false
    }
  },
  (_error, t) => {
    console.log('i18next: setup language successfully')
  }
)
export default i18n
