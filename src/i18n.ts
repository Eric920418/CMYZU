import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  const validLocale = locale || routing.defaultLocale;

  if (!routing.locales.includes(validLocale as 'zh' | 'en')) {
    console.error(
      `Invalid locale received: ${locale}, using default: ${routing.defaultLocale}`
    );
    locale = routing.defaultLocale;
  } else {
    locale = validLocale;
  }

  try {
    const messages = (await import(`../messages/${locale}.json`)).default;
    return {
      locale,
      messages,
    };
  } catch (error) {
    console.error(`Failed to load messages for locale ${locale}:`, error);
    // Fallback to default locale messages
    const fallbackMessages = (
      await import(`../messages/${routing.defaultLocale}.json`)
    ).default;
    return {
      locale: routing.defaultLocale,
      messages: fallbackMessages,
    };
  }
});
