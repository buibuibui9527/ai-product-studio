import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-CN', 'zh-TW'],
  defaultLocale: 'zh-TW'
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};