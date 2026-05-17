'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/sections/Header/Header';
import Footer from '@/components/sections/Footer/Footer';
import AccountSidebar from '@/components/account/AccountSidebar/AccountSidebar';
import { useAuth } from '@/store/AuthContext';
import styles from './AccountLayout.module.css';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header />
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.layoutWrapper}>
            <div className={styles.sidebarColumn}>
              <AccountSidebar />
            </div>
            <div className={styles.contentColumn}>
              {children}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
