'use client';

import { useState } from 'react';
import Sidebar from '@/components/admin/Sidebar/Sidebar';
import Topbar from '@/components/admin/Topbar/Topbar';
import styles from './AdminLayout.module.css';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
