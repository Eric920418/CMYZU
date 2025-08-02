'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navMenuButtonRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  // 點擊外部關閉菜單
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
      if (
        navMenuButtonRef.current &&
        !navMenuButtonRef.current.contains(event.target as Node)
      ) {
        setIsNavMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 語言切換功能
  const handleLanguageSwitch = () => {
    const newLocale = locale === 'zh' ? 'en' : 'zh';
    // 移除當前語言前綴，添加新語言前綴
    const currentPath = pathname.replace(`/${locale}`, '') || '/';
    router.push(`/${newLocale}${currentPath}`);
  };

  // 處理登出
  const handleLogout = () => {
    if (
      confirm(
        locale === 'zh' ? '確定要登出嗎？' : 'Are you sure you want to logout?'
      )
    ) {
      logout();
      router.push('/');
      setIsUserMenuOpen(false);
      setIsMenuOpen(false);
    }
  };

  const navigation = [
    { name: t('home'), href: '/' },
    { name: t('about'), href: '/about' },
    { name: t('news'), href: '/news' },
    { name: t('departments'), href: '/departments' },
    { name: t('admissions'), href: '/admissions' },
    { name: t('contact'), href: '/contact' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 shadow-sm border-b border-white/20 overflow-hidden ${
        isNavMenuOpen ? 'backdrop-blur-xl shadow-2xl' : ''
      }`}
      style={{
        maxHeight: isNavMenuOpen ? '100vh' : '4rem',
        minHeight: '4rem',
        background: isNavMenuOpen
          ? 'rgba(255, 255, 255, 0.2)'
          : 'rgba(255, 255, 255, 0.01)',
        backdropFilter: isNavMenuOpen ? 'blur(4px)' : 'blur(1px)',
        WebkitBackdropFilter: 'blur(4px)',
        transition:
          'max-height 0.8s ease-in-out, box-shadow 0.5s ease-out, backdrop-filter 0.5s ease-out, background 0.3s ease-out',
      }}
    >
      <div
        className="w-full flex justify-center relative"
        style={{ zIndex: 10 }}
      >
        <div className="container">
          {/* 固定的 Header 導航欄 - 始終保持在頂部 */}
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <span className="text-xl font-bold text-gray-900">CMYZU</span>
              </Link>
            </div>

            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              {/* 導航選單按鈕 */}
              <div className="relative" ref={navMenuButtonRef}>
                <button
                  onClick={() => setIsNavMenuOpen(!isNavMenuOpen)}
                  className="text-gray-600 hover:text-primary-600 flex items-center space-x-1 transition-colors duration-300"
                  title={locale === 'zh' ? '網站導航' : 'Site Navigation'}
                >
                  <div className="relative w-5 h-5">
                    <svg
                      className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                        isNavMenuOpen
                          ? 'opacity-0 rotate-90 scale-75'
                          : 'opacity-100 rotate-0 scale-100'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h7"
                      />
                    </svg>

                    <svg
                      className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                        isNavMenuOpen
                          ? 'opacity-100 rotate-0 scale-100'
                          : 'opacity-0 -rotate-90 scale-75'
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </div>
                </button>
              </div>

              <button
                onClick={handleLanguageSwitch}
                className="text-gray-600 hover:text-primary-600 flex items-center space-x-1"
                title={t('language')}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
                <span className="text-sm font-medium">
                  {locale === 'zh' ? 'EN' : '中文'}
                </span>
              </button>
              {isAuthenticated && user ? (
                // 已登錄用戶菜單
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium text-sm">
                        {user.name?.charAt(0) ||
                          user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                        <div className="font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="truncate">{user.email}</div>
                        <div className="text-xs">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              user.role === 'ADMIN'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {user.role === 'ADMIN'
                              ? locale === 'zh'
                                ? '管理員'
                                : 'Admin'
                              : locale === 'zh'
                                ? '教師'
                                : 'Teacher'}
                          </span>
                        </div>
                      </div>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        {locale === 'zh' ? '儀表板' : 'Dashboard'}
                      </Link>
                      <Link
                        href="/dashboard/change-password"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        {locale === 'zh' ? '變更密碼' : 'Change Password'}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {locale === 'zh' ? '登出' : 'Logout'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // 未登錄顯示登入按鈕
                <Link
                  href="/login"
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  {t('login')}
                </Link>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                <span className="sr-only">Menu</span>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-100">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-600 hover:text-primary-600 block px-3 py-2 text-base font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="px-3 py-2 border-t border-gray-100 mt-3 space-y-2">
                  {/* 手機版導航下拉選單 */}
                  <div className="border-b border-gray-100 pb-2 mb-2">
                    <div className="text-xs text-gray-500 px-3 py-1 font-medium">
                      {locale === 'zh' ? '快速導航' : 'Quick Navigation'}
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="text-gray-600 hover:text-primary-600 block px-3 py-2 text-sm rounded-md hover:bg-gray-50"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleLanguageSwitch();
                      setIsMenuOpen(false);
                    }}
                    className="text-gray-600 hover:text-primary-600 flex items-center space-x-2 w-full text-left"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                      />
                    </svg>
                    <span>{locale === 'zh' ? 'English' : '中文'}</span>
                  </button>
                  {isAuthenticated && user ? (
                    // 已登錄用戶菜單 (手機版)
                    <div className="border-t border-gray-200 pt-2">
                      <div className="px-3 py-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-medium text-sm">
                              {user.name?.charAt(0) ||
                                user.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">
                              {user.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {user.email}
                            </div>
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                                user.role === 'ADMIN'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {user.role === 'ADMIN'
                                ? locale === 'zh'
                                  ? '管理員'
                                  : 'Admin'
                                : locale === 'zh'
                                  ? '教師'
                                  : 'Teacher'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Link
                        href="/dashboard"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {locale === 'zh' ? '儀表板' : 'Dashboard'}
                      </Link>
                      <Link
                        href="/dashboard/change-password"
                        className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {locale === 'zh' ? '變更密碼' : 'Change Password'}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {locale === 'zh' ? '登出' : 'Logout'}
                      </button>
                    </div>
                  ) : (
                    // 未登錄顯示登入按鈕 (手機版)
                    <Link
                      href="/login"
                      className="text-primary-600 hover:text-primary-700 font-medium block"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('login')}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 展開的導航內容區域 - 在原 Header 下方延伸 */}
          <div
            className="w-full overflow-hidden relative"
            style={{
              height: isNavMenuOpen ? 'calc(100vh - 4rem)' : '0',
              opacity: isNavMenuOpen ? 1 : 0,
              transform: isNavMenuOpen ? 'translateY(0)' : 'translateY(-2rem)',
              transition:
                'height 0.8s ease-in-out, opacity 0.6s ease-out, transform 0.6s ease-out',
              transitionDelay: isNavMenuOpen ? '0.2s' : '0s',
            }}
          >
            {/* 動態背景漸變覆蓋層 */}
            <div
              className={`absolute inset-0 transition-all duration-1000 ease-out ${
                isNavMenuOpen ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                background: isNavMenuOpen
                  ? 'linear-gradient(to bottom, rgba(151, 151, 149, 0.15) 0%, transparent 50%, rgba(151, 151, 149, 0.20) 100%)'
                  : 'transparent',
                transition: 'background 1s ease-out, opacity 1s ease-out',
              }}
            />

            {/* 動態光暈效果 */}
            <div
              className={`absolute top-10 left-1/2 transform -translate-x-1/2 w-96 h-96 transition-all duration-1200 ease-out blur-3xl ${
                isNavMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
              }`}
              style={{
                background: isNavMenuOpen
                  ? 'radial-gradient(circle, rgba(151, 151, 149, 0.25) 0%, rgba(151, 151, 149, 0.15) 30%, rgba(151, 151, 149, 0.05) 60%, transparent 100%)'
                  : 'transparent',
                transition: 'all 1.2s ease-out, background 1s ease-out',
                transitionDelay: '200ms',
              }}
            />
            <div
              className={`flex items-center justify-center w-full h-full relative z-10 ${
                isNavMenuOpen
                  ? 'transform translate-y-0 opacity-100 scale-100'
                  : 'transform translate-y-16 opacity-0 scale-95'
              }`}
              style={{
                transition:
                  'transform 0.8s ease-out, opacity 0.8s ease-out, scale 0.8s ease-out',
                transitionDelay: isNavMenuOpen ? '150ms' : '0ms',
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl px-8">
                {navigation.map((item, index) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group block p-6 rounded-xl transition-all duration-500 ease-out transform border hover:scale-105 hover:shadow-xl ${
                      isNavMenuOpen
                        ? 'translate-y-0 opacity-100 scale-100 rotate-0 backdrop-blur-sm border-white/40'
                        : 'translate-y-20 opacity-0 scale-90 rotate-1 border-white/10'
                    }`}
                    style={{
                      transitionDelay: isNavMenuOpen
                        ? `${300 + index * 150}ms`
                        : '0ms',
                      background: isNavMenuOpen
                        ? 'rgba(255, 255, 255, 0.75)'
                        : 'rgba(255, 255, 255, 0.15)',
                      boxShadow: isNavMenuOpen
                        ? '0 10px 25px rgba(151, 151, 149, 0.15), 0 4px 10px rgba(151, 151, 149, 0.1)'
                        : 'none',
                      transition:
                        'transform 0.5s ease-out, opacity 0.5s ease-out, scale 0.5s ease-out, rotate 0.5s ease-out, background-color 0.6s ease-out, border-color 0.5s ease-out, box-shadow 0.5s ease-out',
                    }}
                    onClick={() => setIsNavMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div
                          className={`w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:bg-primary-200 transition-all duration-400 ease-out group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-md ${
                            isNavMenuOpen
                              ? 'scale-100 rotate-0'
                              : 'scale-75 rotate-12'
                          }`}
                          style={{
                            transitionDelay: isNavMenuOpen
                              ? `${450 + index * 150}ms`
                              : '0ms',
                            transition:
                              'transform 0.4s ease-out, scale 0.4s ease-out, rotate 0.4s ease-out, background-color 0.3s ease-out, box-shadow 0.3s ease-out',
                          }}
                        >
                          <svg
                            className={`w-6 h-6 text-primary-600 transition-all duration-400 ease-out group-hover:translate-x-1 group-hover:scale-110 ${
                              isNavMenuOpen
                                ? 'translate-x-0 scale-100'
                                : 'translate-x-2 scale-75'
                            }`}
                            style={{
                              transitionDelay: isNavMenuOpen
                                ? `${600 + index * 150}ms`
                                : '0ms',
                              transition:
                                'transform 0.4s ease-out, scale 0.4s ease-out, color 0.3s ease-out',
                            }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-all duration-400 ease-out ${
                            isNavMenuOpen
                              ? 'translate-x-0 opacity-100'
                              : 'translate-x-4 opacity-0'
                          }`}
                          style={{
                            transitionDelay: isNavMenuOpen
                              ? `${500 + index * 150}ms`
                              : '0ms',
                            transition:
                              'transform 0.4s ease-out, opacity 0.4s ease-out, color 0.3s ease-out',
                          }}
                        >
                          {item.name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
