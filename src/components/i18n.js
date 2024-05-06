// i18n.js
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import enTranslation from "src/libs/translation/hero/en.json"
import jaTranslation from "src/libs/translation/hero/ja.json"

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      ja: {
        translation: jaTranslation,
      },
    },
    lng: "en", // default language
    fallbackLng: "en", // fallback language if translation file doesn't exist
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
