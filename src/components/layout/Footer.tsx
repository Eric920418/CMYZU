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
      <div className="container">
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="text-xl font-bold">CMYZU</span>
              </div>
              <p className="text-gray-400 mb-6">
                提供完整的校務資訊、教育資源與學生服務，打造優質的學習環境。
              </p>
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
                      d="M4.478 2.404C5.117 2.077 5.897 2 7.5 2h5c1.603 0 2.383.077 3.022.404.64.327 1.097.784 1.424 1.424.327.639.404 1.419.404 3.022v5c0 1.603-.077 2.383-.404 3.022-.327.64-.784 1.097-1.424 1.424-.639.327-1.419.404-3.022.404h-5c-1.603 0-2.383-.077-3.022-.404-.64-.327-1.097-.784-1.424-1.424C2.077 14.883 2 14.103 2 12.5v-5c0-1.603.077-2.383.404-3.022.327-.64.784-1.097 1.424-1.424z"
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
                    <path d="M2.838 4.272c.238-.832.974-1.488 1.833-1.633C6.042 2.5 10 2.5 10 2.5s3.958 0 5.329.139c.859.145 1.595.801 1.833 1.633.238.832.238 2.567.238 2.567V10c0 .832 0 1.735-.238 2.567-.238.832-.974 1.488-1.833 1.633C13.958 14.5 10 14.5 10 14.5s-3.958 0-5.329-.139c-.859-.145-1.595-.801-1.833-1.633C2.6 11.896 2.6 10.832 2.6 10V6.839c0 0 0-1.735.238-2.567z" />
                    <path d="M8.5 12.5l5.5-3.5-5.5-3.5v7z" />
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
