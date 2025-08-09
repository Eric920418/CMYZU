'use client';

import { usePathname } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

interface ClientLayoutWrapperProps {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
}

export default function ClientLayoutWrapper({
  children,
  header,
  footer,
}: ClientLayoutWrapperProps) {
  const [isClient, setIsClient] = useState(false);
  const [pathname, setPathname] = useState('');

  // 確保只在客戶端執行 hooks
  useEffect(() => {
    setIsClient(true);
    setPathname(window.location.pathname);
  }, []);

  const actualPathname = usePathname();

  // 只有在客戶端才更新 pathname
  useEffect(() => {
    if (isClient) {
      setPathname(actualPathname);
    }
  }, [actualPathname, isClient]);

  // 檢查是否為管理員頁面或登入頁面
  const isAdminPage =
    pathname.includes('/dashboard') || pathname.includes('/login');

  // 服務端渲染時使用默認布局
  if (!isClient) {
    return (
      <>
        {header}
        <main className="min-h-screen">{children}</main>
        {footer}
      </>
    );
  }

  if (isAdminPage) {
    // 管理員頁面：不顯示 Header 和 Footer
    return <main className="min-h-screen">{children}</main>;
  }

  // 一般頁面：顯示完整的 Header 和 Footer
  return (
    <>
      {header}
      <main className="min-h-screen">{children}</main>
      {footer}
    </>
  );
}
