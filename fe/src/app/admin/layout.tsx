'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/admin/Sidebar/Sidebar';
import Topbar from '@/components/admin/Topbar/Topbar';
import { useAuth } from '@/store/AuthContext';
import styles from './AdminLayout.module.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/login');
      } else if (!isAdmin) {
        router.push('/');
      }
    }
  }, [user, isAdmin, isLoading, router]);

  if (isLoading || !isAdmin) {
    return null; // Return nothing while loading or redirecting
  }

  return (
    <div className={styles.wrapper}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={styles.main}>
        <Topbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}
