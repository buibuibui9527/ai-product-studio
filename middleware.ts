import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // 設定支援的語系，必須與你 messages 資料夾內的檔案對應
  locales: ['en', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-CN', 'zh-TW'],
  
  // 如果使用者沒指定語系，預設使用的語系
  defaultLocale: 'zh-TW'
});

export const config = {
  // 匹配所有路徑，除了 api、_next、以及含有句點的靜態檔案（如 .png）
  matcher: ['/((?!api|_next|.*\\..*).*)']
};