const NextI18Next = require('next-i18next').default;
const NextI18NextInstance = new NextI18Next({
  defaultLanguage: 'en',
  otherLanguages: ['th'],
  localePath: typeof window === 'undefined' ? 'public/static/locales' : 'static/locales',
  strictMode: false,
});

module.exports = NextI18NextInstance;
