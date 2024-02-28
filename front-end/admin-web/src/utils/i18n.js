import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
// import { getLocales } from 'react-native-localize';
import en from 'locales/en'
import vi from 'locales/vi'

export const resources = {
  en,
  vi
}
// const lng = getLocales()[0].languageCode;

void i18n.use(initReactI18next).init(
  {
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    supportedLngs: ['en', 'vi'],
    debug: false,
    ns: ['demo'],
    defaultNS: 'demo',
    lng: 'vi',
    resources,
    returnNull: false,
    interpolation: {
      escapeValue: false
    }
  },
  (_error, t) => {
    console.log('i18next: setup language successfully')
  }
)
export default i18n
