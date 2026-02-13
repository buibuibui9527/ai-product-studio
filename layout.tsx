import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { ReactNode } from 'react'
import '../globals.css'

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  let messages;
  try {
    messages = await getMessages();
  } catch (error) {
    console.error("Failed to load messages", error);
    // Fallback messages or handle error
  }

  return (
    <html lang={locale}>
      <body>
        {messages ? (
          <NextIntlClientProvider messages={messages} locale={locale}>
            {children}
          </NextIntlClientProvider>
        ) : (
          children
        )}
      </body>
    </html>
  )
}

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'zh-TW' },
    { locale: 'zh-CN' },
    { locale: 'ja' },
    { locale: 'ko' },
    { locale: 'es' },
    { locale: 'pt' },
    { locale: 'de' },
    { locale: 'fr' },
    { locale: 'it' }
  ]
}
