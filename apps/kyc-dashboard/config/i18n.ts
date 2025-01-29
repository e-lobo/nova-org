export const locales = ['en', 'ar'] as const;
export const defaultLocale = 'en' as const;

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
} as const;

export const rtlLocales = ['ar'];

export function isRTL(locale: Locale) {
  return rtlLocales.includes(locale);
}