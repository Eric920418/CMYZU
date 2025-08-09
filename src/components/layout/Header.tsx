'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Canvas } from '@react-three/fiber';
import EarthLogo from '@/components/3d/EarthLogo';
import { useScrollDirection } from '@/hooks/useScrollDirection';
import FullScreenNav from './FullScreenNav';
import clsx from 'clsx';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navMenuButtonRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  // 滾動方向檢測 - 門檻調整為 6px
  const { isVisible } = useScrollDirection({
    threshold: 6,
  });

  // 檢查是否在客戶端，避免 SSR 問題
  useEffect(() => {
    setIsClient(true);
  }, []);

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
    <>
      {/* 固定 Header - 只處理滾動隱藏動畫 */}
      <header
        className={clsx(
          'sticky top-0 h-16 z-50 w-full border-b border-white/40 shadow-2xl bg-white/5 backdrop-blur-md',
          'transform-gpu transition-transform duration-300 ease-out',
          isVisible ? 'translate-y-0' : '-translate-y-full'
        )}
      >
        <div
          className="w-full flex justify-center relative"
          style={{ zIndex: 10 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex items-center justify-between h-16">
              <div className="flex-shrink-0">
                <Link href="/" className="flex items-center space-x-3">
                  {/* 3D地球LOGO */}
                  {isClient && (
                    <div
                      className="relative flex items-center justify-center"
                      style={{
                        width: '48px',
                        height: '48px',
                      }}
                    >
                      <Canvas
                        camera={{
                          position: [0, 0, 3.5],
                          fov: 60,
                          near: 0.1,
                          far: 100,
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                          background: 'transparent',
                        }}
                        gl={{
                          antialias: true,
                          alpha: true,
                          preserveDrawingBuffer: true,
                        }}
                        dpr={[1, 2]}
                      >
                        <Suspense fallback={null}>
                          {/* 主光源 - 模擬太陽光，來自右上方，強度提升 */}
                          <directionalLight
                            position={[4, 3, 2]}
                            intensity={2.0}
                            color="#FFF8DC"
                            castShadow
                          />

                          {/* 環境光 - 提供基礎亮度，增強整體亮度 */}
                          <ambientLight intensity={0.8} color="#f0f8ff" />

                          {/* 補光 - 從左側提供強烈補光，增強立體感 */}
                          <pointLight
                            position={[-3, 2, 3]}
                            intensity={1.0}
                            color="#87CEEB"
                            distance={20}
                          />

                          {/* 背光 - 從背後提供輪廓光，增強邊緣效果 */}
                          <pointLight
                            position={[0, 0, -4]}
                            intensity={0.6}
                            color="#ffffff"
                            distance={15}
                          />

                          {/* 頂光 - 從上方照射，模擬自然光 */}
                          <directionalLight
                            position={[0, 5, 0]}
                            intensity={0.8}
                            color="#ffffff"
                          />

                          <EarthLogo />
                        </Suspense>
                      </Canvas>
                    </div>
                  )}
                  <span className="text-xl font-bold text-gray-900">CMYZU</span>
                </Link>
              </div>

              <nav className="hidden md:flex space-x-8 bg-white/5! backdrop-blur-md!">
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
                      <div className="absolute right-0 mt-2 w-48 bg-white/80 rounded-md shadow-lg py-1 z-50 border border-gray-200">
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
          </div>
        </div>
      </header>

      {/* 獨立的全螢幕導覽層 */}
      <FullScreenNav
        isOpen={isNavMenuOpen}
        onClose={() => setIsNavMenuOpen(false)}
        navigation={navigation}
      />
    </>
  );
}
