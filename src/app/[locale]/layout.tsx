import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Noto_Sans, Noto_Serif } from 'next/font/google';
import '../globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import ClientLayoutWrapper from '@/components/ClientLayoutWrapper';
import ChatSupport from '@/components/chat/ChatSupport';

const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-noto-sans',
  display: 'swap',
});

const notoSerif = Noto_Serif({
  subsets: ['latin'],
  variable: '--font-noto-serif',
  display: 'swap',
});

const locales = ['zh', 'en'];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const seo = (messages as Record<string, unknown>).SEO as
    | Record<string, string>
    | undefined;

  return {
    title: {
      default: seo?.defaultTitle || 'CMYZU - 學校官方網站',
      template: `%s | ${seo?.defaultTitle || 'CMYZU'}`,
    },
    description:
      seo?.defaultDescription || '提供完整的校務資訊、教育資源與學生服務',
    keywords: seo?.keywords || ['教育', '學校', '校務資訊', '學生服務'],
    authors: [{ name: 'CMYZU' }],
    creator: 'CMYZU',
    publisher: 'CMYZU',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    ),
    alternates: {
      canonical: `/${locale}`,
      languages: {
        zh: '/zh',
        en: '/en',
      },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'zh' ? 'zh_TW' : 'en_US',
      url: `/${locale}`,
      siteName: 'CMYZU',
      title: seo?.defaultTitle || 'CMYZU - 學校官方網站',
      description:
        seo?.defaultDescription || '提供完整的校務資訊、教育資源與學生服務',
    },
    twitter: {
      card: 'summary_large_image',
      title: seo?.defaultTitle || 'CMYZU - 學校官方網站',
      description:
        seo?.defaultDescription || '提供完整的校務資訊、教育資源與學生服務',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();

  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      className={`${notoSans.variable} ${notoSerif.variable}`}
    >
      <body className="min-h-screen overflow-x-hidden">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            <ClientLayoutWrapper
              header={<Header />}
              footer={
                <div className="relative z-30">
                  <Footer />
                </div>
              }
            >
              {children}
              {/* AI聊天客服 */}
              <ChatSupport />
            </ClientLayoutWrapper>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
