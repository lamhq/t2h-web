import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(initReactI18next)
    .use(Backend)
    .use(LanguageDetector)
    .init({
        whitelist: ['en', 'th'],
        lng: 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        debug: true,
        backend: {
            loadPath: '/static/locales/{{lng}}/{{ns}}.json'
        },
        react: {
            useSuspense: false
        }
    });

export default i18n;