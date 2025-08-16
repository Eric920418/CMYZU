'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('Footer');

  const footerLinks = {
    about: {
      title: t('about'),
      links: [
        { name: t('schoolIntro'), href: '/about' },
        { name: t('presidentMessage'), href: '/about/president' },
        { name: t('history'), href: '/about/history' },
        { name: t('organization'), href: '/about/organization' },
      ],
    },
    academics: {
      title: t('academics'),
      links: [
        { name: t('departmentIntro'), href: '/departments' },
        { name: t('courses'), href: '/courses' },
        { name: t('faculty'), href: '/faculty' },
        { name: t('research'), href: '/research' },
      ],
    },
    students: {
      title: t('students'),
      links: [
        { name: t('admissionsInfo'), href: '/admissions' },
        { name: t('studentAffairs'), href: '/student-affairs' },
        { name: t('scholarships'), href: '/scholarships' },
        { name: t('campusLife'), href: '/campus-life' },
      ],
    },
    resources: {
      title: t('resources'),
      links: [
        { name: t('library'), href: '/library' },
        { name: t('itCenter'), href: '/it-center' },
        { name: t('career'), href: '/career' },
        { name: t('international'), href: '/international' },
      ],
    },
  };
  return (
    <footer className="bg-gray-500 text-white flex flex-col items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="text-xl font-bold">CMYZU</span>
              </div>
              <p className="text-gray-400 mb-6">{t('description')}</p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zM7.5 2h5c2.485 0 4.5 2.015 4.5 4.5v7c0 2.485-2.015 4.5-4.5 4.5h-5C5.015 18 3 15.985 3 13.5v-7C3 4.015 5.015 2 7.5 2zm6.5 3a1 1 0 11-2 0 1 1 0 012 0zm-4 8.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7zm0-1.5a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">YouTube</span>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm8.448 10c0-1.902-.282-3.654-.855-4.448C16.872 4.653 15.582 4.5 10 4.5s-6.872.153-7.593 1.052C1.834 6.346 1.552 8.098 1.552 10s.282 3.654.855 4.448c.721.899 2.011 1.052 7.593 1.052s6.872-.153 7.593-1.052C18.166 13.654 18.448 11.902 18.448 10zM8 7.5l4.5 2.5L8 12.5V7.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {Object.entries(footerLinks).map(([key, section]) => (
              <div key={key}>
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">{t('copyright')}</p>
              <div className="flex space-x-6">
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  {t('privacy')}
                </Link>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  {t('terms')}
                </Link>
                <Link
                  href="/sitemap"
                  className="text-gray-400 hover:text-white text-sm"
                >
                  {t('sitemap')}
                </Link>
              </div>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-400 text-sm">{t('address')}</p>
              <p className="text-gray-400 text-sm">{t('phone')}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
